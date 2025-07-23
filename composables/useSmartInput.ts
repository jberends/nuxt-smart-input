import type { 
  SmartInputProps, 
  UseSmartInputReturn, 
  LoadingState, 
  SummaryResponse 
} from '~/types'

/**
 * Smart Input composable
 * Handles textarea monitoring, suggestion generation, and state management
 */
export function useSmartInput(
  props: SmartInputProps,
  emit: (event: string, ...args: any[]) => void
): UseSmartInputReturn {
  const genAI = useGenAIAgent()
  
  // Reactive state
  const inputValue = ref(props.modelValue || '')
  const suggestion = ref('')
  const loadingState = ref<LoadingState>('idle')
  const showSuggestion = ref(false)
  const currentRequest = ref<AbortController | null>(null)
  
  // Configuration with defaults
  const minChars = props.minChars || 20
  const debounceMs = props.debounceMs || 500
  
  // Watch for prop changes
  watch(() => props.modelValue, (newValue) => {
    if (newValue !== inputValue.value) {
      inputValue.value = newValue || ''
    }
  })
  
  // Watch for input changes and emit updates
  watch(inputValue, (newValue) => {
    emit('update:modelValue', newValue)
    
    // Clear suggestions when input changes
    if (suggestion.value && loadingState.value !== 'loading') {
      clearSuggestion()
    }
  })
  
  /**
   * Clear current suggestion and reset state
   */
  const clearSuggestion = () => {
    suggestion.value = ''
    showSuggestion.value = false
    loadingState.value = 'idle'
    
    // Cancel any ongoing request
    if (currentRequest.value) {
      currentRequest.value.abort()
      currentRequest.value = null
    }
  }
  
  /**
   * Apply the current suggestion to the input
   */
  const applySuggestion = () => {
    if (suggestion.value && !props.disabled) {
      inputValue.value = suggestion.value
      emit('suggestion-applied', suggestion.value)
      clearSuggestion()
    }
  }
  
  /**
   * Generate suggestion from text
   */
  const generateSuggestion = async (text: string) => {
    if (!text || text.trim().length < minChars) {
      return
    }
    
    // Cancel any existing request
    clearSuggestion()
    
    try {
      loadingState.value = 'loading'
      showSuggestion.value = true
      emit('api-call-started')
      
      const summaryResponse = await genAI.getSummary(text)
      
      if (summaryResponse.summary) {
        suggestion.value = summaryResponse.summary
        loadingState.value = 'success'
        emit('suggestion-received', summaryResponse)
      } else {
        throw new Error('No summary received')
      }
      
      emit('api-call-completed')
      
    } catch (error) {
      loadingState.value = 'error'
      showSuggestion.value = false
      
      // Emit error but don't throw - fail silently for UX
      emit('api-call-failed', error instanceof Error ? error : new Error('Unknown error'))
      
      // Log in development
      if (process.dev) {
        console.warn('Failed to generate suggestion:', error)
      }
    }
  }
  
  /**
   * Debounced suggestion generation
   */
  const debouncedGenerateSuggestion = useDebounce(generateSuggestion, debounceMs)
  
  /**
   * Handle focus loss from textarea
   */
  const handleFocusLoss = (text: string) => {
    if (!props.disabled && text && text.trim().length >= minChars) {
      debouncedGenerateSuggestion(text)
    }
  }
  
  /**
   * Setup textarea monitoring if connected
   */
  const setupTextareaMonitoring = () => {
    if (!props.connectedTextarea || typeof window === 'undefined') {
      return
    }
    
    const findTextarea = () => {
      const textarea = document.getElementById(props.connectedTextarea!) || 
                     document.querySelector(`[data-smart-input="${props.connectedTextarea}"]`) ||
                     document.querySelector(props.connectedTextarea!)
      
      return textarea as HTMLTextAreaElement
    }
    
    const setupListeners = () => {
      const textarea = findTextarea()
      if (!textarea) {
        // Try again after a short delay (element might not be mounted yet)
        setTimeout(setupListeners, 100)
        return
      }
      
      // Handle focus loss
      const handleBlur = () => {
        const text = textarea.value
        handleFocusLoss(text)
      }
      
      // Handle input changes (for real-time monitoring)
      const handleInput = () => {
        // Cancel pending suggestions if text is too short
        if (textarea.value.trim().length < minChars) {
          debouncedGenerateSuggestion.cancel()
          clearSuggestion()
        }
      }
      
      textarea.addEventListener('blur', handleBlur)
      textarea.addEventListener('input', handleInput)
      
      // Cleanup function
      return () => {
        textarea.removeEventListener('blur', handleBlur)
        textarea.removeEventListener('input', handleInput)
      }
    }
    
    // Setup listeners when component mounts
    onMounted(() => {
      const cleanup = setupListeners()
      
      // Cleanup on unmount
      onUnmounted(() => {
        if (cleanup) cleanup()
        debouncedGenerateSuggestion.cancel()
        clearSuggestion()
      })
    })
  }
  
  // Initialize textarea monitoring
  setupTextareaMonitoring()
  
  // Cleanup on unmount
  onUnmounted(() => {
    debouncedGenerateSuggestion.cancel()
    clearSuggestion()
  })
  
  return {
    inputValue,
    suggestion: readonly(suggestion),
    loadingState: readonly(loadingState),
    showSuggestion: readonly(showSuggestion),
    applySuggestion,
    clearSuggestion,
    handleFocusLoss
  }
} 
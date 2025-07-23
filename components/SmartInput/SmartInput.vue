<template>
  <div class="smart-input-wrapper">
    <!-- Main Input Field -->
    <UInput
      v-model="inputValue"
      :placeholder="placeholder"
      :disabled="disabled"
      class="smart-input-field"
      size="xl"
      :ui="{
        base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0',
        form: 'form-input',
        rounded: 'rounded-xl',
        placeholder: 'placeholder-gray-400 dark:placeholder-gray-500',
        size: {
          xl: 'text-lg px-6 py-4'
        }
      }"
    >
      <template #leading>
        <Icon
          name="lucide:sparkles"
          class="w-5 h-5 text-gray-400"
        />
      </template>
    </UInput>

    <!-- Suggestion Chip -->
    <SuggestionChip
      :visible="showSuggestion"
      :suggestion="suggestion"
      :loading="loadingState === 'loading'"
      :disabled="disabled"
      @apply="applySuggestion"
      @click="handleSuggestionClick"
    />

    <!-- Debug Info (Development Only) -->
    <div
      v-if="showDebugInfo && process.dev"
      class="mt-2 text-xs text-white/60 space-y-1"
    >
      <div>State: {{ loadingState }}</div>
      <div>Connected: {{ connectedTextarea || 'None' }}</div>
      <div>Min chars: {{ minChars }}</div>
      <div v-if="error">Error: {{ error.message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SmartInputProps, SmartInputEvents } from '~/types'
import SuggestionChip from './SuggestionChip.vue'

interface Props extends SmartInputProps {
  showDebugInfo?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Enter text for AI-powered suggestions...',
  modelValue: '',
  disabled: false,
  minChars: 20,
  debounceMs: 500,
  maxRetries: 3,
  retryDelayMs: 1000,
  showDebugInfo: false
})

const emit = defineEmits<SmartInputEvents>()

// Use the smart input composable
const {
  inputValue,
  suggestion,
  loadingState,
  showSuggestion,
  applySuggestion: applyFromComposable,
  clearSuggestion,
  handleFocusLoss
} = useSmartInput(props, emit)

// Get API state for debugging
const genAI = useGenAIAgent()
const error = genAI.error

/**
 * Apply suggestion with animation
 */
const applySuggestion = () => {
  applyFromComposable()
}

/**
 * Handle suggestion chip click
 */
const handleSuggestionClick = () => {
  // Could add additional logic here
  // For now, clicking the chip doesn't do anything
  // The commit button handles the apply action
}

/**
 * Expose methods for parent components
 */
defineExpose({
  clearSuggestion,
  handleFocusLoss,
  applySuggestion
})
</script>

<style scoped>
/* Component-specific styles are in main.css */
.smart-input-wrapper {
  position: relative;
  width: 100%;
}
</style> 
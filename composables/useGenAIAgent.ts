import type { 
  GenAIRequest, 
  GenAIResponse, 
  SummaryResponse, 
  ApiError, 
  UseGenAIAgentReturn 
} from '~/types'

/**
 * DigitalOcean GenAI Chat Agent integration composable
 * Handles API calls with exponential backoff retry logic
 */
export function useGenAIAgent(): UseGenAIAgentReturn {
  const config = useRuntimeConfig()
  const loading = ref(false)
  const error = ref<ApiError | null>(null)
  const retryCount = ref(0)

  /**
   * Create exponential backoff delay
   */
  const getRetryDelay = (attempt: number): number => {
    const baseDelay = 1000 // 1 second
    const maxDelay = 30000 // 30 seconds
    const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay)
    return delay
  }

  /**
   * Parse the API response content as JSON
   */
  const parseSummaryResponse = (content: string): SummaryResponse => {
    console.log('🔍 Parsing content:', content)
    try {
      const parsed = JSON.parse(content)
      console.log('✅ JSON parsed successfully:', parsed)
      
      // Ensure we have at least a summary field
      if (!parsed.summary) {
        console.warn('⚠️ No summary field found, using content as fallback')
        return {
          summary: content.trim() || 'Unable to generate summary'
        }
      }
      
      return {
        summary: parsed.summary,
        alt_summary1: parsed.alt_summary1,
        alt_summary2: parsed.alt_summary2,
        lang: parsed.lang,
        corrected_text: parsed.corrected_text
      }
    } catch (parseError) {
      console.warn('❌ Failed to parse GenAI response as JSON:', parseError)
      
      // Fallback: use the raw content as summary
      return {
        summary: content.trim() || 'Unable to generate summary'
      }
    }
  }

  /**
   * Make API call to DigitalOcean GenAI Chat Agent
   */
  const makeApiCall = async (text: string): Promise<GenAIResponse> => {
    const requestData: GenAIRequest = {
      messages: [
        {
          role: 'user',
          content: text
        }
      ],
      stream: false,
      include_functions_info: false,
      include_retrieval_info: false,
      include_guardrails_info: false
    }

    console.log('🚀 Making API call with:', { requestData, endpoint: `${config.public.agentEndpoint}/api/v1/chat/completions` })

    const response = await $fetch<GenAIResponse>(
      `${config.public.agentEndpoint}/api/v1/chat/completions`,
      {
        method: 'POST',
        body: requestData,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.public.agentAccessKey}`
        },
        timeout: 30000 // 30 second timeout
      }
    )

    console.log('✅ API Response received:', response)
    return response
  }

  /**
   * Get summary with retry logic
   */
  const getSummary = async (text: string): Promise<SummaryResponse> => {
    if (!text || text.trim().length < 20) {
      throw new Error('Text must be at least 20 characters long')
    }

    loading.value = true
    error.value = null
    retryCount.value = 0

    const maxRetries = 3
    let lastError: ApiError | null = null

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          // Wait before retry
          const delay = getRetryDelay(attempt - 1)
          await new Promise(resolve => setTimeout(resolve, delay))
        }

        retryCount.value = attempt
        const response = await makeApiCall(text)

        if (!response.choices || response.choices.length === 0) {
          throw new Error('No response choices received from API')
        }

        const content = response.choices[0].message.content
        console.log('📝 Raw content from API:', content)
        
        if (!content) {
          throw new Error('Empty response content from API')
        }

        const summaryResponse = parseSummaryResponse(content)
        console.log('🎯 Parsed summary response:', summaryResponse)
        
        loading.value = false
        return summaryResponse

      } catch (err) {
        console.error('❌ API call failed:', err)
        const apiError: ApiError = err instanceof Error ? err : new Error('Unknown error')
        
        // Handle $fetch errors (similar to axios but different structure)
        if (err && typeof err === 'object' && 'status' in err) {
          const fetchError = err as any
          apiError.status = fetchError.status || fetchError.statusCode
          console.log('📊 Error status:', apiError.status)
          
          // Check for rate limiting
          if (fetchError.status === 429 || fetchError.statusCode === 429) {
            apiError.retryAfter = getRetryDelay(attempt)
          }
          
          // Don't retry on certain errors
          if (fetchError.status === 401 || fetchError.status === 403 || 
              fetchError.statusCode === 401 || fetchError.statusCode === 403) {
            lastError = apiError
            break
          }
        }

        lastError = apiError
        
        // Log the error for debugging
        if (process.dev) {
          console.warn(`GenAI API call failed (attempt ${attempt + 1}/${maxRetries + 1}):`, apiError)
        }
        
        // If this is the last attempt, break
        if (attempt === maxRetries) {
          break
        }
      }
    }

    loading.value = false
    error.value = lastError
    
    throw lastError || new Error('Failed to get summary after multiple attempts')
  }

  return {
    getSummary,
    loading: readonly(loading),
    error: readonly(error),
    retryCount: readonly(retryCount)
  }
} 
import axios, { type AxiosError } from 'axios'
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
    try {
      const parsed = JSON.parse(content)
      
      // Ensure we have at least a summary field
      if (!parsed.summary) {
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
      console.warn('Failed to parse GenAI response as JSON:', parseError)
      
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

    const response = await axios.post<GenAIResponse>(
      `${config.public.agentEndpoint}/api/v1/chat/completions`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.agentAccessKey}`
        },
        timeout: 30000 // 30 second timeout
      }
    )

    return response.data
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
        if (!content) {
          throw new Error('Empty response content from API')
        }

        const summaryResponse = parseSummaryResponse(content)
        
        loading.value = false
        return summaryResponse

      } catch (err) {
        const apiError: ApiError = err instanceof Error ? err : new Error('Unknown error')
        
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError
          apiError.status = axiosError.response?.status
          apiError.code = axiosError.code
          
          // Check for rate limiting
          if (axiosError.response?.status === 429) {
            const retryAfter = axiosError.response.headers['retry-after']
            apiError.retryAfter = retryAfter ? parseInt(retryAfter) * 1000 : getRetryDelay(attempt)
          }
          
          // Don't retry on certain errors
          if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
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
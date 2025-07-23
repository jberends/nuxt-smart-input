/**
 * Type definitions for Smart Input Box project
 */

// API Types
export interface GenAIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface GenAIRequest {
  messages: GenAIMessage[]
  stream: boolean
  include_functions_info: boolean
  include_retrieval_info: boolean
  include_guardrails_info: boolean
}

export interface GenAIChoice {
  message: {
    content: string
    role: string
  }
  index: number
  finish_reason: string
}

export interface GenAIResponse {
  choices: GenAIChoice[]
  id: string
  object: string
  created: number
  model: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// Summary Response Types
export interface SummaryResponse {
  summary: string
  alt_summary1?: string
  alt_summary2?: string
  lang?: string
  corrected_text?: string
}

// Component Props
export interface SmartInputProps {
  connectedTextarea?: string
  placeholder?: string
  modelValue?: string
  disabled?: boolean
  minChars?: number
  debounceMs?: number
  maxRetries?: number
  retryDelayMs?: number
}

// Component Events
export interface SmartInputEvents {
  'update:modelValue': [value: string]
  'suggestion-received': [response: SummaryResponse]
  'suggestion-applied': [value: string]
  'api-call-started': []
  'api-call-failed': [error: Error]
  'api-call-completed': []
}

// Loading States
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// Suggestion Chip Props
export interface SuggestionChipProps {
  suggestion: string
  loading?: boolean
  disabled?: boolean
}

// API Configuration
export interface ApiConfig {
  endpoint: string
  accessKey: string
  timeout?: number
  retries?: number
}

// Error Types
export interface ApiError extends Error {
  status?: number
  code?: string
  retryAfter?: number
}

// Composables Return Types
export interface UseGenAIAgentReturn {
  getSummary: (text: string) => Promise<SummaryResponse>
  loading: Ref<boolean>
  error: Ref<ApiError | null>
  retryCount: Ref<number>
}

export interface UseSmartInputReturn {
  inputValue: Ref<string>
  suggestion: Ref<string>
  loadingState: Ref<LoadingState>
  showSuggestion: Ref<boolean>
  applySuggestion: () => void
  clearSuggestion: () => void
  handleFocusLoss: (text: string) => void
}

// Utility Types
export type Debounced<T extends (...args: any[]) => any> = T & {
  cancel: () => void
  flush: () => void
} 
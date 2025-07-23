import type { Debounced } from '~/types'

/**
 * Debounce utility composable
 * Delays function execution until after a specified delay has elapsed since the last call
 */
export function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): Debounced<T> {
  let timeoutId: NodeJS.Timeout | null = null

  const debouncedFunction = ((...args: Parameters<T>) => {
    // Clear the previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Set a new timeout
    timeoutId = setTimeout(() => {
      func.apply(null, args)
      timeoutId = null
    }, delay)
  }) as Debounced<T>

  // Cancel the debounced function
  debouncedFunction.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  // Execute the function immediately
  debouncedFunction.flush = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      func.apply(null, [])
      timeoutId = null
    }
  }

  return debouncedFunction
}

/**
 * Debounced ref composable
 * Creates a debounced reactive reference
 */
export function useDebouncedRef<T>(value: T, delay: number) {
  const debouncedValue = ref<T>(value)
  const originalValue = ref<T>(value)

  const updateDebounced = useDebounce((newValue: T) => {
    debouncedValue.value = newValue
  }, delay)

  watch(originalValue, (newValue) => {
    updateDebounced(newValue)
  })

  return {
    value: originalValue,
    debouncedValue: readonly(debouncedValue),
    cancel: updateDebounced.cancel,
    flush: updateDebounced.flush
  }
} 
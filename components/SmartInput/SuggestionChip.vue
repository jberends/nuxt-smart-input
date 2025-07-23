<template>
  <Transition name="slide-down" appear>
    <div
      v-if="visible"
      class="suggestion-chip"
      :class="{
        'interactive': !loading && !disabled,
        'loading': loading
      }"
      @click="handleClick"
    >
      <!-- AI Icon -->
      <Icon
        :name="loading ? 'lucide:loader-2' : 'lucide:brain-circuit'"
        class="suggestion-chip-icon"
        :class="{ 'smart-input-spinner': loading }"
      />
      
      <!-- Suggestion Text -->
      <span class="suggestion-chip-text">
        {{ displayText }}
      </span>
      
      <!-- Commit Action Icon -->
      <button
        v-if="!loading && suggestion"
        type="button"
        class="suggestion-chip-action"
        :disabled="disabled"
        @click.stop="$emit('apply')"
        :title="commitTooltip"
      >
        <Icon name="lucide:check" class="w-4 h-4" />
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { SuggestionChipProps } from '~/types'

interface Props extends SuggestionChipProps {
  visible?: boolean
}

interface Emits {
  apply: []
  click: []
}

const props = withDefaults(defineProps<Props>(), {
  suggestion: '',
  loading: false,
  disabled: false,
  visible: true
})

const emit = defineEmits<Emits>()

/**
 * Display text based on loading state
 */
const displayText = computed(() => {
  if (props.loading) {
    return 'Generating smart suggestion...'
  }
  return props.suggestion || 'No suggestion available'
})

/**
 * Tooltip for commit button
 */
const commitTooltip = computed(() => {
  return 'Apply this suggestion'
})

/**
 * Handle chip click
 */
const handleClick = () => {
  if (!props.loading && !props.disabled) {
    emit('click')
  }
}
</script>

<style scoped>
/* Component-specific styles are in main.css */
</style> 
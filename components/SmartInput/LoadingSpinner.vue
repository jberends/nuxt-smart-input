<template>
  <div
    class="loading-spinner"
    :class="[
      `size-${size}`,
      colorClass,
      { 'animate-spin': spinning }
    ]"
  >
    <Icon
      :name="icon"
      :class="iconClass"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'white' | 'gray'
  icon?: string
  spinning?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
  icon: 'lucide:loader-2',
  spinning: true
})

/**
 * Size classes
 */
const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8'
}

/**
 * Color classes
 */
const colorClasses = {
  primary: 'text-blue-500',
  secondary: 'text-purple-500',
  white: 'text-white',
  gray: 'text-gray-500'
}

/**
 * Computed classes
 */
const iconClass = computed(() => sizeClasses[props.size])
const colorClass = computed(() => colorClasses[props.color])
</script>

<style scoped>
.loading-spinner {
  @apply inline-flex items-center justify-center;
}
</style> 
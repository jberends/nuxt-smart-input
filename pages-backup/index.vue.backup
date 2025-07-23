<template>
  <div class="demo-container">
    <div class="demo-content">
      <!-- Header -->
      <div class="text-center">
        <h1 class="demo-title">
          Smart Input Box
        </h1>
        <p class="demo-subtitle">
          AI-powered text summarization with DigitalOcean GenAI
        </p>
      </div>

      <!-- Demo Section -->
      <div class="demo-section">
        <div class="demo-section-title">
          Interactive Demo
        </div>
        
        <!-- Smart Input Box -->
        <div class="mb-6">
          <SmartInput
            v-model="summaryInput"
            connected-textarea="demo-textarea" 
            placeholder="AI suggestions will appear here when you finish typing in the textarea below..."
            :show-debug-info="showDebugInfo"
            @suggestion-received="onSuggestionReceived"
            @suggestion-applied="onSuggestionApplied"
            @api-call-started="onApiCallStarted"
            @api-call-failed="onApiCallFailed"
          />
        </div>

        <!-- Instructions -->
        <div class="mb-4 text-white/80 text-sm">
          <strong>How it works:</strong> Type at least 20 characters in the textarea below, then click outside or press Tab. 
          The Smart Input will automatically generate an AI-powered summary suggestion.
        </div>

        <!-- Connected Textarea -->
        <textarea
          id="demo-textarea"
          v-model="textareaContent"
          class="demo-textarea"
          placeholder="Start typing your content here... (minimum 20 characters)

Try something like:
- A detailed project description
- Meeting notes or summary
- Product requirements
- Any text you'd like summarized

The Smart Input above will automatically generate suggestions when you click outside this textarea!"
          @input="onTextareaInput"
        />

        <!-- Character Counter -->
        <div class="mt-2 text-right text-white/60 text-xs">
          {{ characterCount }} characters
          <span v-if="characterCount < 20" class="text-yellow-300">
            ({{ 20 - characterCount }} more needed for AI suggestions)
          </span>
        </div>
      </div>

      <!-- Event Log (Development) -->
      <div v-if="showEventLog && eventLog.length > 0" class="demo-section">
        <div class="demo-section-title">
          Event Log (Development)
          <button
            @click="clearEventLog"
            class="ml-2 text-xs bg-white/20 px-2 py-1 rounded"
          >
            Clear
          </button>
        </div>
        <div class="space-y-1 text-xs text-white/80 max-h-32 overflow-y-auto">
          <div
            v-for="(event, index) in eventLog"
            :key="index"
            class="flex items-start gap-2"
          >
            <span class="text-white/40 text-xs">{{ event.timestamp }}</span>
            <span class="text-yellow-300">{{ event.type }}:</span>
            <span class="flex-1">{{ event.message }}</span>
          </div>
        </div>
      </div>

      <!-- Configuration Panel -->
      <div class="demo-section">
        <div class="demo-section-title">
          Configuration
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <label class="flex items-center gap-2 text-white">
            <input
              v-model="showDebugInfo"
              type="checkbox"
              class="rounded"
            >
            Show Debug Info
          </label>
          <label class="flex items-center gap-2 text-white">
            <input
              v-model="showEventLog"
              type="checkbox"
              class="rounded"
            >
            Show Event Log
          </label>
        </div>
      </div>

      <!-- Marketing Section -->
      <div class="marketing-section">
        <h2 class="marketing-title">
          Intelligent Text Processing
        </h2>
        <p class="marketing-text">
          The Smart Input Box automatically monitors your text input and provides intelligent, 
          AI-powered suggestions using advanced language models. Perfect for creating summaries, 
          improving content, and enhancing productivity.
        </p>

        <!-- Feature Grid -->
        <div class="feature-grid">
          <div class="feature-card">
            <Icon name="lucide:zap" class="feature-icon" />
            <h3 class="feature-title">Real-time Processing</h3>
            <p class="feature-description">
              Automatically triggers when you finish typing, providing instant AI-powered suggestions.
            </p>
          </div>

          <div class="feature-card">
            <Icon name="lucide:brain-circuit" class="feature-icon" />
            <h3 class="feature-title">Smart Suggestions</h3>
            <p class="feature-description">
              Leverages DigitalOcean GenAI for intelligent text summarization and content enhancement.
            </p>
          </div>

          <div class="feature-card">
            <Icon name="lucide:settings" class="feature-icon" />
            <h3 class="feature-title">Configurable</h3>
            <p class="feature-description">
              Customizable minimum character count, debounce timing, and retry logic.
            </p>
          </div>

          <div class="feature-card">
            <Icon name="lucide:layers" class="feature-icon" />
            <h3 class="feature-title">Multiple Instances</h3>
            <p class="feature-description">
              Support for multiple smart inputs on the same page, each operating independently.
            </p>
          </div>
        </div>

        <!-- Technical Details -->
        <div class="mt-8 text-center">
          <h3 class="text-lg font-semibold text-white mb-4">
            Technical Features
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/80">
            <div>
              <strong>Vue 3 + Nuxt 3</strong><br>
              Modern framework with Composition API
            </div>
            <div>
              <strong>TypeScript</strong><br>
              Full type safety and developer experience
            </div>
            <div>
              <strong>Nuxt UI</strong><br>
              Beautiful, accessible components
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SummaryResponse } from '~/types'
import SmartInput from '~/components/SmartInput/SmartInput.vue'

// SEO and meta
useHead({
  title: 'Smart Input Box - AI-Powered Text Summarization Demo',
  meta: [
    {
      name: 'description',
      content: 'Interactive demo of the Smart Input Box component with AI-powered text summarization using DigitalOcean GenAI Chat Agent.'
    }
  ]
})

// Reactive state
const summaryInput = ref('')
const textareaContent = ref('')
const showDebugInfo = ref(false)
const showEventLog = ref(false)
const eventLog = ref<Array<{ timestamp: string; type: string; message: string }>>([])

// Computed properties
const characterCount = computed(() => textareaContent.value.length)

// Event handlers
const onSuggestionReceived = (response: SummaryResponse) => {
  addToEventLog('suggestion-received', `Summary: "${response.summary.substring(0, 50)}..."`)
}

const onSuggestionApplied = (value: string) => {
  addToEventLog('suggestion-applied', `Applied: "${value.substring(0, 50)}..."`)
}

const onApiCallStarted = () => {
  addToEventLog('api-call-started', 'Making API request to DigitalOcean GenAI')
}

const onApiCallFailed = (error: Error) => {
  addToEventLog('api-call-failed', `Error: ${error.message}`)
}

const onTextareaInput = () => {
  // Optional: could add real-time feedback here
}

// Utility functions
const addToEventLog = (type: string, message: string) => {
  if (!showEventLog.value) return
  
  const timestamp = new Date().toLocaleTimeString()
  eventLog.value.unshift({ timestamp, type, message })
  
  // Keep only last 50 events
  if (eventLog.value.length > 50) {
    eventLog.value = eventLog.value.slice(0, 50)
  }
}

const clearEventLog = () => {
  eventLog.value = []
}

// Initialize with some sample content
onMounted(() => {
  textareaContent.value = `Welcome to the Smart Input Box demo! This component provides AI-powered text summarization using DigitalOcean's GenAI Chat Agent.

Key features include:
- Automatic text monitoring with configurable minimum character count
- Intelligent debouncing to prevent excessive API calls  
- Beautiful loading states with smooth animations
- Error handling with exponential backoff retry logic
- Support for multiple instances on the same page
- Full TypeScript support and Vue 3 composition API

Try editing this text or adding your own content. When you click outside this textarea (or press Tab), the Smart Input above will automatically generate an AI-powered summary suggestion that you can accept with a single click.`
})
</script>

<style scoped>
/* Component-specific styles are already in main.css */
</style> 
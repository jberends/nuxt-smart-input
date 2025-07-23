<template>
  <div class="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
    <!-- Header -->
    <header class="relative z-10">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav class="flex items-center justify-between">
          <NuxtLink 
            to="/" 
            class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <Icon name="lucide:arrow-left" class="w-5 h-5" />
            <span>Back to Home</span>
          </NuxtLink>
          <div class="flex items-center space-x-2">
            <Icon name="lucide:sparkles" class="w-6 h-6 text-purple-600" />
            <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Demo</h1>
          </div>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="relative">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- Introduction Section -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Smart Input Box 
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Demo
            </span>
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Experience AI-powered text suggestions in real-time. Type at least 20 characters in the textarea below, 
            then click outside to trigger intelligent suggestions.
          </p>
          
          <!-- How it Works -->
          <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              How it Works
            </h3>
            <div class="grid md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div class="flex items-center space-x-2">
                <div class="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <span class="text-xs font-semibold text-purple-600 dark:text-purple-400">1</span>
                </div>
                <span>Type 20+ characters</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <span class="text-xs font-semibold text-purple-600 dark:text-purple-400">2</span>
                </div>
                <span>Click outside textarea</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <span class="text-xs font-semibold text-purple-600 dark:text-purple-400">3</span>
                </div>
                <span>Get AI suggestions</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Demo Interface -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/30 mb-12">
          
          <!-- Smart Input Box (Top) -->
          <div class="mb-8">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Smart Input Box
              <span class="text-gray-500 dark:text-gray-400 text-xs ml-2">
                (AI suggestions will appear here)
              </span>
            </label>
            <SmartInput
              v-model="smartInputValue"
              :connected-textarea="textareaId"
              placeholder="AI-powered suggestions will appear here after you type in the textarea below..."
              :show-debug-info="showDebugInfo"
              @suggestion-received="onSuggestionReceived"
              @suggestion-applied="onSuggestionApplied"
              @api-call-started="onApiCallStarted"
              @api-call-failed="onApiCallFailed"
              @api-call-completed="onApiCallCompleted"
            />
          </div>

          <!-- Spacing Area for Suggestions -->
          <div class="h-8 mb-8"></div>

          <!-- Connected Textarea (Below) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Connected Textarea
              <span class="text-gray-500 dark:text-gray-400 text-xs ml-2">
                (Type here, then click outside to trigger AI suggestions)
              </span>
            </label>
            <UTextarea
              :id="textareaId"
              v-model="textareaValue"
              placeholder="Start typing your content here (minimum 20 characters)..."
              :rows="6"
              class="w-full"
              :ui="{
                base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0',
                form: 'form-textarea',
                rounded: 'rounded-xl',
                placeholder: 'placeholder-gray-400 dark:placeholder-gray-500',
                size: {
                  sm: 'text-sm p-3',
                  md: 'text-sm p-4',
                  lg: 'text-base p-4'
                }
              }"
              size="lg"
            />
          </div>

          <!-- Event Log -->
          <div v-if="eventLog.length > 0" class="mt-8">
            <div class="flex items-center justify-between mb-3">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Event Log
              </label>
              <UButton
                @click="clearEventLog"
                color="gray"
                variant="ghost"
                size="xs"
                icon="lucide:x"
              >
                Clear
              </UButton>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-32 overflow-y-auto">
              <div
                v-for="(event, index) in eventLog"
                :key="index"
                class="text-xs text-gray-600 dark:text-gray-400 mb-1"
              >
                <span class="text-gray-400 dark:text-gray-500">{{ event.timestamp }}</span>
                <span class="ml-2 font-mono">{{ event.type }}</span>
                <span v-if="event.data" class="ml-2 text-gray-500">{{ event.data }}</span>
              </div>
            </div>
          </div>

          <!-- Debug Toggle -->
          <div class="mt-6 flex items-center space-x-3">
            <UToggle v-model="showDebugInfo" />
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Show debug information
            </span>
          </div>
        </div>

        <!-- Marketing/Explanation Section -->
        <div class="space-y-12">
          <!-- Features Showcase -->
          <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              What Makes It Smart?
            </h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Icon name="lucide:brain" class="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">AI-Powered</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Uses DigitalOcean GenAI for intelligent text processing
                </p>
              </div>
              <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Icon name="lucide:clock" class="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Real-time</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Instant suggestions as you interact with the interface
                </p>
              </div>
              <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Icon name="lucide:shield-check" class="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Reliable</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Built-in error handling and retry logic
                </p>
              </div>
              <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Icon name="lucide:puzzle" class="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Reusable</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Easy to integrate into any Vue.js application
                </p>
              </div>
            </div>
          </div>

          <!-- Usage Instructions -->
          <div class="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Ready to Use in Your Project?
            </h2>
            <div class="grid md:grid-cols-2 gap-8">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Installation
                </h3>
                <div class="bg-black/10 dark:bg-black/30 rounded-lg p-4 font-mono text-sm">
                  <code class="text-gray-800 dark:text-gray-200">
                    npm install nuxt-smart-input
                  </code>
                </div>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Basic Usage
                </h3>
                <div class="bg-black/10 dark:bg-black/30 rounded-lg p-4 font-mono text-sm">
                  <code class="text-gray-800 dark:text-gray-200">
                    &lt;SmartInput connected-textarea="myTextarea" /&gt;
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-8 text-center text-gray-600 dark:text-gray-400">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <p>Built with Nuxt 3, Vue 3, and DigitalOcean GenAI • 
          <NuxtLink to="/" class="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Back to Home
          </NuxtLink>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { SummaryResponse } from '~/types'

// Set page meta
useHead({
  title: 'Smart Input Box Demo - See AI-Powered Suggestions in Action',
  meta: [
    {
      name: 'description',
      content: 'Interactive demo of Smart Input Box featuring real-time AI-powered text suggestions and intelligent summaries.'
    }
  ]
})

// Component state
const textareaId = 'demo-textarea'
const smartInputValue = ref('')
const textareaValue = ref('')
const showDebugInfo = ref(false)

// Event tracking
interface EventLogEntry {
  timestamp: string
  type: string
  data?: string
}

const eventLog = ref<EventLogEntry[]>([])

const addToEventLog = (type: string, data?: any) => {
  const timestamp = new Date().toLocaleTimeString()
  eventLog.value.push({
    timestamp,
    type,
    data: data ? (typeof data === 'string' ? data : JSON.stringify(data, null, 2)) : undefined
  })
  
  // Keep only last 10 events
  if (eventLog.value.length > 10) {
    eventLog.value = eventLog.value.slice(-10)
  }
}

const clearEventLog = () => {
  eventLog.value = []
}

// Event handlers
const onSuggestionReceived = (response: SummaryResponse) => {
  addToEventLog('suggestion-received', `"${response.summary.slice(0, 50)}..."`)
}

const onSuggestionApplied = (value: string) => {
  addToEventLog('suggestion-applied', `"${value.slice(0, 50)}..."`)
}

const onApiCallStarted = () => {
  addToEventLog('api-call-started')
}

const onApiCallFailed = (error: Error) => {
  addToEventLog('api-call-failed', error.message)
}

const onApiCallCompleted = () => {
  addToEventLog('api-call-completed')
}

// Initialize with some sample content
onMounted(() => {
  textareaValue.value = 'Welcome to the Smart Input Box demo! This component provides AI-powered suggestions for your text content. Try typing some content here, then click outside to see the magic happen. The AI will analyze your text and provide intelligent summaries and suggestions that you can easily apply to your input field above.'
})
</script> 
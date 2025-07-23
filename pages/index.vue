<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
    <!-- Header -->
    <header class="relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <Icon name="lucide:sparkles" class="w-8 h-8 text-indigo-600" />
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">Smart Input Box</h1>
          </div>
          <UButton
            to="/demo"
            color="indigo"
            variant="solid"
            size="lg"
            icon="lucide:play"
          >
            Try Demo
          </UButton>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <main class="relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div class="text-center">
          <!-- Hero Title -->
          <h1 class="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            AI-Powered
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Smart Input
            </span>
          </h1>
          
          <!-- Hero Description -->
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
            Enhance your text input experience with intelligent AI-powered suggestions. 
            Smart Input Box automatically generates summaries and suggestions as you type, 
            powered by DigitalOcean's GenAI technology.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <UButton
              to="/demo"
              color="indigo"
              variant="solid"
              size="xl"
              icon="lucide:play"
              class="w-full sm:w-auto"
            >
              Interactive Demo
            </UButton>
            <UButton
              href="https://github.com/your-repo/nuxt-smart-input"
              target="_blank"
              color="gray"
              variant="outline"
              size="xl"
              icon="lucide:github"
              class="w-full sm:w-auto"
            >
              View on GitHub
            </UButton>
          </div>

          <!-- Preview Card -->
          <div class="max-w-4xl mx-auto">
            <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  See Smart Input in Action
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                  Type in a textarea, lose focus, and watch AI-powered suggestions appear
                </p>
              </div>
              
              <!-- Mock Interface -->
              <div class="space-y-4">
                <div class="relative">
                  <div class="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 flex items-center">
                    <Icon name="lucide:sparkles" class="w-5 h-5 mr-3" />
                    AI-powered suggestions appear here...
                  </div>
                </div>
                <div class="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 resize-none">
                  Your connected textarea content...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Features Section -->
    <section class="py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300">
            Everything you need for intelligent text input assistance
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="text-center">
            <div class="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="lucide:zap" class="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Real-time AI Suggestions
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Get intelligent suggestions as you type, powered by advanced AI models
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="lucide:link" class="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Textarea Integration
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Seamlessly connects to any textarea for enhanced input experience
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="text-center">
            <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="lucide:settings" class="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Highly Customizable
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Configure triggers, styling, and behavior to match your needs
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-8 text-center text-gray-600 dark:text-gray-400">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p>&copy; 2024 Smart Input Box. Built with Nuxt 3 and DigitalOcean GenAI.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Set page meta
useHead({
  title: 'Smart Input Box - AI-Powered Text Input Enhancement',
  meta: [
    {
      name: 'description',
      content: 'Enhance your text input experience with AI-powered suggestions. Smart Input Box provides intelligent summaries and text completion using DigitalOcean GenAI technology.'
    },
    {
      property: 'og:title',
      content: 'Smart Input Box - AI-Powered Text Input Enhancement'
    },
    {
      property: 'og:description',
      content: 'Enhance your text input experience with AI-powered suggestions and summaries.'
    }
  ]
})
</script>

 
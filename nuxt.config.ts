// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Modules
  modules: [
    '@nuxt/ui'
  ],
  
  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: true
  },
  
  // Runtime configuration for environment variables
  runtimeConfig: {
    // Private keys (only available on server-side)
    agentAccessKey: process.env.NUXT_AGENT_ACCESS_KEY,
    
    // Public keys (exposed to client-side)
    public: {
      agentEndpoint: process.env.NUXT_AGENT_ENDPOINT || 'https://rm3atnymbbmeazfftkvdcxxu.agents.do-ai.run/'
    }
  },
  
  // CSS framework
  css: ['../assets/css/main.css'],
  
  // App configuration
  app: {
    head: {
      title: 'Smart Input Box - AI-Powered Text Summarization',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'AI-powered smart input box component with automatic text summarization using DigitalOcean GenAI Chat Agent' }
      ]
    }
  },
  
  // UI configuration
  ui: {
    global: true
  },
  
  // Build configuration
  build: {
    transpile: ['axios']
  },
  
  // Development server configuration
  devServer: {
    port: 3000,
    host: 'localhost'
  },
  
  // Enable SSR and pages
  ssr: true,
  pages: true,
  
  // Experimental features
  experimental: {
    payloadExtraction: false
  }
})

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
    
    // Public keys (exposed to client-side)
    public: {
      agentEndpoint: process.env.NUXT_AGENT_ENDPOINT || 'https://rm3atnymbbmeazfftkvdcxxu.agents.do-ai.run',
      agentAccessKey: process.env.NUXT_AGENT_ACCESS_KEY
    }
  },
  
  // CSS framework - temporarily disabled to fix routing
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

  // Vite configuration for better module resolution
  vite: {
    define: {
      global: 'globalThis',
    },
    server: {
      fs: {
        allow: ['..']
      }
    }
  },
  
  // Development server configuration
  devServer: {
    port: 3000,
    host: 'localhost'
  },
  
  // Pages and SSR are enabled by default in Nuxt 4
  
  // Experimental features
  experimental: {
    payloadExtraction: false
  }
})

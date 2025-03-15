import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  build: {
    minify: false, // Keep JavaScript readable
    sourcemap: true, // Enable debugging
    terserOptions: {
      mangle: false, // Keep variable & function names
      compress: false // Prevent minification
    }
  },
  css: {
    minify: false // Keep CSS readable
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

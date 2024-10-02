import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@heroicons/react': '@heroicons/react/solid',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://optiwork.onrender.com',
        changeOrigin: true,
        secure: false // Allow self-signed certificates in development
      }
    }
  }
})

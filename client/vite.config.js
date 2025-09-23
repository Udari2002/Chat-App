import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Make sure process.env is available for compatibility
    'process.env': {}
  },
  server: {
    port: 5174, // Use different port to avoid conflicts
    strictPort: false, // Allow fallback to other ports if busy
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 24678 // Use different port for HMR
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})

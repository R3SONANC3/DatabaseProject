import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',  // Backend server running on port 3000
        changeOrigin: true,
        secure: true,
      },
    },
  },
})

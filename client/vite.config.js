import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Keep browser requests same-origin in development; Vite forwards them to Express.
    proxy: { '/api': 'http://localhost:3001' },
  },
})

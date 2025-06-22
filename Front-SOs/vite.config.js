import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // permite acesso externo (por exemplo, via Docker)
    proxy: {
      '/api': 'http://backend:3000',
    }
  }
})

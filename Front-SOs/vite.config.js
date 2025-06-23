import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': 'http://backend:3000',
    },
    changeOrigin: true,
    secure: false,
    allowedHosts: ['andromeda.lasdpc.icmc.usp.br'],
  }
})

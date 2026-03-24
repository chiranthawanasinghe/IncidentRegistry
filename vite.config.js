import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/wiki': {
        target: 'https://centricaenergy.atlassian.net',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})

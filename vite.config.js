import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'global': 'window', // Behebt das Buffer-Problem im Browser
  },
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'https://gigsda.com',
        changeOrigin: true,
        cookieDomainRewrite: ''
      }
    }
  }
})

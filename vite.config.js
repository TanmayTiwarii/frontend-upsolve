import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/leetcode-graphql': {
        target: 'https://leetcode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/leetcode-graphql/, '/graphql'),
        headers: {
          Referer: 'https://leetcode.com',
          Origin: 'https://leetcode.com'
        }
      }
    }
  }
})

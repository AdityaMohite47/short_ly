import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backend = env.VITE_BACKEND_URL || 'http://localhost:8000'

  return {
    plugins: [react()],
    server: {
      // Proxy API calls to the Go backend so the browser doesn't hit CORS
      proxy: {
        '/shorten': backend,
      },
    },
  }
})

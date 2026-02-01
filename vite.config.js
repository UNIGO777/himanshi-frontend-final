import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const host = env.VITE_DEV_HOST || '0.0.0.0'
  const port = Number(env.VITE_DEV_PORT || 5173)
  const apiTarget = String(env.VITE_API_BASE_URL || '').replace(/\/+$/, '')

  return {
    plugins: [react()],
    assetsInclude: ['**/*.jfif'],
    server: {
      host,
      port,
      proxy: apiTarget
        ? {
            '/api': { target: apiTarget, changeOrigin: true, secure: false },
            '/uploads': { target: apiTarget, changeOrigin: true, secure: false },
          }
        : undefined,
    },
  }
})

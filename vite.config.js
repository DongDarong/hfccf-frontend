import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import {
  createSecurityHeaders,
  getApiBaseOrigin,
  getImagePublicOrigin,
} from './src/utils/securityHeaders.js'

function securityHeadersPlugin() {
  return {
    name: 'security-headers',
    transformIndexHtml() {
      return [
        {
          tag: 'meta',
          attrs: {
            name: 'referrer',
            content: 'strict-origin-when-cross-origin',
          },
          injectTo: 'head',
        },
      ]
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isDev = command === 'serve'
  const projectRoot = fileURLToPath(new URL('.', import.meta.url))
  const env = loadEnv(command === 'serve' ? 'development' : 'production', projectRoot, '')
  const apiBaseOrigin = getApiBaseOrigin(env)
  const imagePublicOrigin = getImagePublicOrigin(env)
  const securityHeaders = createSecurityHeaders({ isDev, apiBaseOrigin, imagePublicOrigin })

  return {
    plugins: [vue(), tailwindcss(), securityHeadersPlugin()],
    server: {
      headers: securityHeaders,
      proxy: {
        // Keep local API requests same-origin in the browser; Vite forwards them to the Laravel backend.
        '/api': {
          target: 'http://hfccf-backend.test',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      headers: createSecurityHeaders({
        isDev: false,
        apiBaseOrigin,
        imagePublicOrigin,
      }),
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})

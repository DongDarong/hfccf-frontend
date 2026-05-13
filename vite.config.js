import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

function getApiBaseOrigin(env) {
  const rawBaseUrl = String(env.VITE_API_BASE_URL || '').trim()

  if (!rawBaseUrl) return ''

  try {
    return new URL(rawBaseUrl, 'http://localhost').origin
  } catch {
    return ''
  }
}

function createContentSecurityPolicy({ isDev, apiBaseOrigin }) {
  const connectSources = ["'self'"]
  const imgSources = ["'self'", 'data:', 'blob:']

  if (isDev) {
    connectSources.push('ws:', 'wss:', 'http:', 'https:')
    imgSources.push(
      'http://hfccf-backend.test',
      'http://localhost',
      'http://127.0.0.1',
    )
  } else {
    connectSources.push('https:')
  }

  if (
    apiBaseOrigin &&
    (isDev || apiBaseOrigin.startsWith('https://')) &&
    !imgSources.includes(apiBaseOrigin)
  ) {
    imgSources.push(apiBaseOrigin)
  }

  const scriptSources = ["'self'"]

  if (isDev) {
    scriptSources.push("'unsafe-eval'")
  }

  const directives = [
    `default-src 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `frame-ancestors 'none'`,
    `form-action 'self'`,
    `img-src ${imgSources.join(' ')}`,
    `font-src 'self' data: https://fonts.gstatic.com`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `script-src ${scriptSources.join(' ')}`,
    `connect-src ${connectSources.join(' ')}`,
  ]

  if (!isDev) {
    directives.push('upgrade-insecure-requests')
  }

  return directives.join('; ')
}

function createSecurityHeaders({ isDev, apiBaseOrigin }) {
  return {
    'Content-Security-Policy': createContentSecurityPolicy({ isDev, apiBaseOrigin }),
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Content-Type-Options': 'nosniff',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-site',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  }
}

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
  const securityHeaders = createSecurityHeaders({ isDev, apiBaseOrigin })

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
      headers: createSecurityHeaders({ isDev: false, apiBaseOrigin }),
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})

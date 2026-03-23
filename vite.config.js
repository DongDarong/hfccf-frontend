import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

function createContentSecurityPolicy({ isDev }) {
  const connectSources = ["'self'"]

  if (isDev) {
    connectSources.push('ws:', 'wss:', 'http:', 'https:')
  } else {
    connectSources.push('https:')
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
    `img-src 'self' data: blob: https:`,
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

function createSecurityHeaders({ isDev }) {
  return {
    'Content-Security-Policy': createContentSecurityPolicy({ isDev }),
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
  const securityHeaders = createSecurityHeaders({ isDev })

  return {
    plugins: [vue(), tailwindcss(), securityHeadersPlugin()],
    server: {
      headers: securityHeaders,
    },
    preview: {
      headers: createSecurityHeaders({ isDev: false }),
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})

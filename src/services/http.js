import axios from 'axios'
import { ensureSessionIsValid, getAuthToken, logout } from '@/services/auth'

function isLocalHostname(hostname) {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname.endsWith('.local')
  )
}

function assertSafeHttpUrl(rawUrl, fallbackOrigin = window.location.origin) {
  const parsedUrl = new URL(String(rawUrl || '').trim(), fallbackOrigin)
  const isHttpProtocol = parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:'

  if (!isHttpProtocol) {
    throw new Error('Only HTTP and HTTPS URLs are allowed.')
  }

  return parsedUrl
}

function getValidatedApiBaseUrl() {
  const rawBaseUrl = String(import.meta.env.VITE_API_BASE_URL || '').trim()
  if (!rawBaseUrl) return ''

  const parsedUrl = assertSafeHttpUrl(rawBaseUrl)
  const isSecureOrigin = parsedUrl.protocol === 'https:' || isLocalHostname(parsedUrl.hostname)

  if (!isSecureOrigin && !import.meta.env.DEV) {
    throw new Error('VITE_API_BASE_URL must use HTTPS outside local development.')
  }

  return parsedUrl.toString().replace(/\/$/, '')
}

const apiBaseUrl = getValidatedApiBaseUrl()
const apiOrigin = apiBaseUrl ? new URL(apiBaseUrl).origin : ''

function resolveRequestUrl(config) {
  const target = config.url || ''
  const base = config.baseURL || apiBaseUrl || window.location.origin
  return assertSafeHttpUrl(target, base)
}

const http = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: false,
})

http.interceptors.request.use((config) => {
  const requestUrl = resolveRequestUrl(config)
  const isSameOrigin = requestUrl.origin === window.location.origin
  const isTrustedApiOrigin = apiOrigin ? requestUrl.origin === apiOrigin : isSameOrigin

  if (!isSameOrigin && !isTrustedApiOrigin) {
    return config
  }

  config.headers = config.headers || {}
  config.headers['X-Requested-With'] = 'XMLHttpRequest'

  if (!ensureSessionIsValid()) {
    return config
  }

  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      logout()
    }

    return Promise.reject(error)
  },
)

export default http



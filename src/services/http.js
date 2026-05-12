import axios from 'axios'

const AUTH_TOKEN_STORAGE_KEY = 'hfccf-auth-token'
const AUTH_USER_STORAGE_KEY = 'hfccf-auth-user'
const LAST_ACTIVITY_STORAGE_KEY = 'hfccf-last-activity-at'

function isBrowser() {
  return typeof window !== 'undefined'
}

function isLocalHostname(hostname) {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.test')
  )
}

function assertSafeHttpUrl(rawUrl, fallbackOrigin = isBrowser() ? window.location.origin : 'http://localhost') {
  const parsedUrl = new URL(String(rawUrl || '').trim(), fallbackOrigin)

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
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

function getAuthToken() {
  if (!isBrowser()) return ''

  return (
    window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ||
    window.sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ||
    ''
  )
}

function clearAuthStorage() {
  if (!isBrowser()) return

  for (const storage of [window.localStorage, window.sessionStorage]) {
    storage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    storage.removeItem(AUTH_USER_STORAGE_KEY)
    storage.removeItem(LAST_ACTIVITY_STORAGE_KEY)
  }
}

const apiBaseUrl = getValidatedApiBaseUrl()
const apiOrigin = apiBaseUrl ? new URL(apiBaseUrl).origin : ''

const http = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: false,
})

http.interceptors.request.use((config) => {
  const fallbackOrigin = config.baseURL || apiBaseUrl || (isBrowser() ? window.location.origin : 'http://localhost')
  const requestUrl = assertSafeHttpUrl(config.url || '', fallbackOrigin)
  const currentOrigin = isBrowser() ? window.location.origin : ''
  const isSameOrigin = currentOrigin ? requestUrl.origin === currentOrigin : false
  const isTrustedApiOrigin = apiOrigin ? requestUrl.origin === apiOrigin : isSameOrigin

  config.headers = config.headers || {}
  config.headers['X-Requested-With'] = 'XMLHttpRequest'

  if (isSameOrigin || isTrustedApiOrigin) {
    const token = getAuthToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuthStorage()
    }

    return Promise.reject(error)
  },
)

export default http

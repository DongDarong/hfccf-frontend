import http from '@/services/http'
import { mapUser } from '@/services/mappers/userMapper'

const AUTH_USER_STORAGE_KEY = 'hfccf-auth-user'
const AUTH_TOKEN_STORAGE_KEY = 'hfccf-auth-token'
const LAST_ACTIVITY_STORAGE_KEY = 'hfccf-last-activity-at'
const INACTIVITY_TIMEOUT_MS = 12 * 60 * 60 * 1000

function getStorage(remember = false) {
  return remember ? window.localStorage : window.sessionStorage
}

function getFallbackStorage(remember = false) {
  return remember ? window.sessionStorage : window.localStorage
}

function clearSessionStorage(storage) {
  storage?.removeItem(AUTH_USER_STORAGE_KEY)
  storage?.removeItem(AUTH_TOKEN_STORAGE_KEY)
  storage?.removeItem(LAST_ACTIVITY_STORAGE_KEY)
}

function sanitizeUser(user) {
  const safeUser = mapUser(user)
  delete safeUser.password
  return safeUser
}

function getApiErrorMessage(error, fallbackMessage) {
  if (error?.code === 'ERR_NETWORK') {
    return 'Unable to reach the backend API. Check that the backend is running and the API URL is correct.'
  }

  const apiMessage = error?.response?.data?.message || error?.response?.data?.error
  return apiMessage || fallbackMessage
}

function getApiPayload(response) {
  return response?.data?.data || response?.data || {}
}

function isHttpClientError(error) {
  return Boolean(error?.response || error?.request)
}

function hasToken(storage) {
  return Boolean(storage?.getItem(AUTH_TOKEN_STORAGE_KEY))
}

function getSessionStorage() {
  if (typeof window === 'undefined') return null

  if (hasToken(window.localStorage)) return window.localStorage
  if (hasToken(window.sessionStorage)) return window.sessionStorage

  return null
}

function getLastActivityRaw() {
  if (typeof window === 'undefined') return ''

  return (
    window.localStorage.getItem(LAST_ACTIVITY_STORAGE_KEY) ||
    window.sessionStorage.getItem(LAST_ACTIVITY_STORAGE_KEY) ||
    ''
  )
}

export async function login({ email, password, remember = false }) {
  const normalizedEmail = String(email || '')
    .trim()
    .toLowerCase()

  if (!normalizedEmail || !password) {
    throw new Error('Please enter both email and password.')
  }

  try {
    const response = await http.post('/auth/login', {
      email: normalizedEmail,
      password,
    })
    const payload = getApiPayload(response)
    const token = payload.token
    const user = payload.user

    if (!token || !user) {
      throw new Error('Login response is missing session data.')
    }

    const storage = getStorage(remember)
    const fallbackStorage = getFallbackStorage(remember)
    const safeUser = sanitizeUser(user)

    // Store the API token in the selected browser storage so the shared HTTP client can attach it to protected requests.
    clearSessionStorage(fallbackStorage)
    storage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(safeUser))
    storage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
    storage.setItem(LAST_ACTIVITY_STORAGE_KEY, String(Date.now()))

    return safeUser
  } catch (error) {
    if (!isHttpClientError(error)) throw error
    throw new Error(getApiErrorMessage(error, 'Invalid email or password.'), { cause: error })
  }
}

export async function requestPasswordReset(email) {
  const normalizedEmail = String(email || '')
    .trim()
    .toLowerCase()

  if (!normalizedEmail) {
    throw new Error('Please enter your email address.')
  }

  try {
    const response = await http.post('/auth/forgot-password', {
      email: normalizedEmail,
    })

    return getApiPayload(response)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to send reset code right now.'), { cause: error })
  }
}

export async function verifyPasswordResetOtp({ email, code }) {
  const normalizedEmail = String(email || '')
    .trim()
    .toLowerCase()
  const normalizedCode = String(code || '').replace(/\D/g, '').slice(0, 6)

  if (!normalizedEmail || normalizedCode.length !== 6) {
    throw new Error('Please enter a valid verification code.')
  }

  try {
    const response = await http.post('/auth/verify-otp', {
      email: normalizedEmail,
      code: normalizedCode,
    })

    return getApiPayload(response)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Invalid or expired verification code.'), { cause: error })
  }
}

export async function resetPassword({ email, code, password, password_confirmation }) {
  const normalizedEmail = String(email || '')
    .trim()
    .toLowerCase()
  const normalizedCode = String(code || '').replace(/\D/g, '').slice(0, 6)

  if (!normalizedEmail || normalizedCode.length !== 6 || !password) {
    throw new Error('Please complete the password reset form.')
  }

  try {
    const response = await http.post('/auth/reset-password', {
      email: normalizedEmail,
      code: normalizedCode,
      password,
      password_confirmation: password_confirmation || password,
    })

    return getApiPayload(response)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to reset password right now.'), { cause: error })
  }
}

export async function getAuthenticatedUser() {
  try {
    const response = await http.get('/auth/me')
    const payload = getApiPayload(response)
    const user = payload.user || payload
    const safeUser = sanitizeUser(user)
    const storage = getSessionStorage()

    // Keep stored profile data aligned with the backend after page refreshes or profile updates.
    storage?.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(safeUser))
    touchActivity()

    return safeUser
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to load authenticated user.'), { cause: error })
  }
}

export function logout() {
  if (typeof window === 'undefined') return

  clearSessionStorage(window.localStorage)
  clearSessionStorage(window.sessionStorage)
}

export async function logoutFromApi() {
  try {
    if (getAuthToken()) {
      await http.post('/auth/logout')
    }
  } finally {
    // Local cleanup must always run even if the API token was already expired or revoked.
    logout()
  }
}

function getStoredUser() {
  const storage = getSessionStorage()
  const raw = storage?.getItem(AUTH_USER_STORAGE_KEY)

  if (!raw) return null

  try {
    const user = JSON.parse(raw)
    return user && typeof user === 'object' ? user : null
  } catch {
    clearSessionStorage(storage)
    return null
  }
}

export function getCurrentUser() {
  if (typeof window === 'undefined') return null

  return getStoredUser()
}

export function getAuthToken() {
  if (typeof window === 'undefined') return ''

  return (
    window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ||
    window.sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ||
    ''
  )
}

export function isAuthenticated() {
  return Boolean(getAuthToken())
}

export function getCurrentPermissions(user = getCurrentUser()) {
  if (!user || typeof user !== 'object') return []
  if (Array.isArray(user.role_permission)) return user.role_permission
  return Array.isArray(user.permissions) ? user.permissions : []
}

export function hasPermission(permission, user = getCurrentUser()) {
  const permissions = getCurrentPermissions(user)
  return permissions.includes('all:*') || permissions.includes(permission)
}

export function isSuperAdmin(user = getCurrentUser()) {
  return hasPermission('all:*', user)
}

export function touchActivity(timestamp = Date.now()) {
  const storage = getSessionStorage()
  if (!storage) return

  storage.setItem(LAST_ACTIVITY_STORAGE_KEY, String(timestamp))
}

export function hasSessionExpired(now = Date.now()) {
  if (!isAuthenticated()) return false

  const lastActivity = Number(getLastActivityRaw())
  if (!lastActivity) {
    touchActivity(now)
    return false
  }

  return now - lastActivity >= INACTIVITY_TIMEOUT_MS
}

export function ensureSessionIsValid() {
  if (!isAuthenticated()) return false

  if (!getCurrentUser()) {
    logout()
    return false
  }

  if (hasSessionExpired()) {
    logout()
    return false
  }

  return true
}

export function startAutoLogoutWatcher({ onExpire, checkEveryMs = 60000 } = {}) {
  if (typeof window === 'undefined') return () => {}

  const activityEvents = ['click', 'keydown', 'mousedown', 'touchstart', 'scroll']
  const sessionKeys = [AUTH_USER_STORAGE_KEY, AUTH_TOKEN_STORAGE_KEY]
  let lastTrackedAt = 0

  function trackActivity() {
    if (!isAuthenticated()) return

    const now = Date.now()
    if (now - lastTrackedAt < 15000) return

    lastTrackedAt = now
    touchActivity(now)
  }

  function checkExpiry() {
    if (!isAuthenticated()) return

    if (hasSessionExpired()) {
      logout()
      if (typeof onExpire === 'function') onExpire()
    }
  }

  function handleStorageChange(event) {
    const sessionWasCleared = event.key === null
    const authValueWasRemoved =
      sessionKeys.includes(event.key) && event.oldValue !== null && event.newValue === null

    if (!authValueWasRemoved && !(sessionWasCleared && isAuthenticated())) return

    logout()
    if (typeof onExpire === 'function') onExpire()
  }

  activityEvents.forEach((eventName) => {
    window.addEventListener(eventName, trackActivity, { passive: true })
  })
  window.addEventListener('storage', handleStorageChange)

  const timer = window.setInterval(checkExpiry, checkEveryMs)
  checkExpiry()

  return () => {
    activityEvents.forEach((eventName) => {
      window.removeEventListener(eventName, trackActivity)
    })

    window.clearInterval(timer)
    window.removeEventListener('storage', handleStorageChange)
  }
}

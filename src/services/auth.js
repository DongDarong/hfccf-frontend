import users from '@/mocks/users.json'

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

function sanitizeUser(user) {
  const safeUser = { ...user }
  delete safeUser.password
  return safeUser
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

  await new Promise((resolve) => setTimeout(resolve, 450))

  const matchedUser = users.find(
    (user) => user.email.toLowerCase() === normalizedEmail && user.password === password,
  )

  if (!matchedUser) {
    throw new Error('Invalid email or password.')
  }

  const storage = getStorage(remember)
  const fallbackStorage = getFallbackStorage(remember)

  fallbackStorage.removeItem(AUTH_USER_STORAGE_KEY)
  fallbackStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
  fallbackStorage.removeItem(LAST_ACTIVITY_STORAGE_KEY)

  storage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(sanitizeUser(matchedUser)))
  storage.setItem(AUTH_TOKEN_STORAGE_KEY, `mock-token-${matchedUser.id}`)
  storage.setItem(LAST_ACTIVITY_STORAGE_KEY, String(Date.now()))

  return sanitizeUser(matchedUser)
}

export function logout() {
  if (typeof window === 'undefined') return

  window.localStorage.removeItem(AUTH_USER_STORAGE_KEY)
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
  window.localStorage.removeItem(LAST_ACTIVITY_STORAGE_KEY)

  window.sessionStorage.removeItem(AUTH_USER_STORAGE_KEY)
  window.sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
  window.sessionStorage.removeItem(LAST_ACTIVITY_STORAGE_KEY)
}

export function getCurrentUser() {
  if (typeof window === 'undefined') return null

  const raw =
    window.localStorage.getItem(AUTH_USER_STORAGE_KEY) ||
    window.sessionStorage.getItem(AUTH_USER_STORAGE_KEY)

  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
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
  return Array.isArray(user.role_permission) ? user.role_permission : []
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

  if (hasSessionExpired()) {
    logout()
    return false
  }

  return true
}

export function startAutoLogoutWatcher({ onExpire, checkEveryMs = 60000 } = {}) {
  if (typeof window === 'undefined') return () => {}

  const activityEvents = ['click', 'keydown', 'mousedown', 'touchstart', 'scroll']
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

  activityEvents.forEach((eventName) => {
    window.addEventListener(eventName, trackActivity, { passive: true })
  })

  const timer = window.setInterval(checkExpiry, checkEveryMs)
  checkExpiry()

  return () => {
    activityEvents.forEach((eventName) => {
      window.removeEventListener(eventName, trackActivity)
    })

    window.clearInterval(timer)
  }
}

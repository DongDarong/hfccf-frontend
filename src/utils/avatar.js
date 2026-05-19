import defaultAvatar from '@/assets/avatars/default-user.svg'

const DEV_ALLOWED_AVATAR_ORIGINS = new Set([
  'http://hfccf-backend.test',
  'http://localhost',
  'http://127.0.0.1',
])

function getApiOrigin() {
  const rawBaseUrl = String(import.meta.env.VITE_API_BASE_URL || '').trim()

  if (!rawBaseUrl) return ''

  try {
    return new URL(rawBaseUrl, 'http://localhost').origin
  } catch {
    return ''
  }
}

const apiOrigin = getApiOrigin()

/**
 * Keep avatar URLs on the local app origin or trusted backend origin.
 * External demo providers are rejected so the UI does not trip CSP.
 */
export function isSafeAvatarSource(value) {
  const source = String(value || '').trim()

  if (!source) return false
  if (source.startsWith('data:') || source.startsWith('blob:')) return true
  if (source.startsWith('/')) return true

  try {
    const url = new URL(source, typeof window !== 'undefined' ? window.location.origin : 'http://localhost')

    if (!['http:', 'https:'].includes(url.protocol)) return false
    if (typeof window !== 'undefined' && url.origin === window.location.origin) return true
    if (apiOrigin && url.origin === apiOrigin) return true
    if (import.meta.env.DEV && DEV_ALLOWED_AVATAR_ORIGINS.has(url.origin)) return true

    return false
  } catch {
    return false
  }
}

/**
 * Resolve a displayable avatar source.
 * When `fallbackToAsset` is true, a local bundled avatar is used instead of an empty string.
 */
export function resolveAvatarSource(value, { fallbackToAsset = false } = {}) {
  const source = String(value || '').trim()

  if (isSafeAvatarSource(source)) return source

  return fallbackToAsset ? defaultAvatar : ''
}

/**
 * Build initials from a display name when no image can be shown.
 */
export function getAvatarInitials(name, fallback = '?') {
  const source = String(name || '').trim()

  if (!source) return fallback

  return (
    source
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || fallback
  )
}

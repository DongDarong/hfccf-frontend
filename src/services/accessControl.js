import {
  ACCESS_SCOPES,
  DOMAINS,
  DOMAIN_SIDEBAR_TONE_CLASS,
  getRoleAccess,
} from '@/constants/access'
import { getCurrentUser, hasPermission } from '@/services/auth'
import { normalizeRole } from '@/constants/roles'

function normalizeStringList(values = []) {
  if (!Array.isArray(values)) return []

  return values
    .map((value) => String(value || '').trim().toLowerCase())
    .filter(Boolean)
}

export function getAccessProfile(user = getCurrentUser()) {
  const role = normalizeRole(user?.role)
  const roleAccess = getRoleAccess(role)

  return {
    role,
    domain: roleAccess?.domain || null,
    scope: roleAccess?.scope || null,
    isAuthenticated: Boolean(user),
    isSuperAdmin: roleAccess?.scope === ACCESS_SCOPES.SUPER_ADMIN,
  }
}

export function normalizeAccessRule(rule = {}) {
  const source = rule && typeof rule === 'object' ? rule : {}

  return {
    requiresAuth: source.requiresAuth !== false,
    allowSuperAdmin: source.allowSuperAdmin !== false,
    domains: normalizeStringList(source.domains),
    scopes: normalizeStringList(source.scopes),
    roles: normalizeStringList(source.roles),
    permissions: normalizeStringList(source.permissions),
  }
}

export function canAccess(user, rule = {}) {
  const accessRule = normalizeAccessRule(rule)

  if (!accessRule.requiresAuth) return true
  if (!user) return false

  const profile = getAccessProfile(user)
  if (!profile.scope) return false

  if (profile.isSuperAdmin) {
    return accessRule.allowSuperAdmin && accessRule.permissions.every((permission) => hasPermission(permission, user))
  }

  if (accessRule.scopes.length && !accessRule.scopes.includes(profile.scope)) {
    return false
  }

  if (accessRule.domains.length && !accessRule.domains.includes(profile.domain)) {
    return false
  }

  if (accessRule.roles.length && !accessRule.roles.includes(profile.role)) {
    return false
  }

  return accessRule.permissions.every((permission) => hasPermission(permission, user))
}

export function canAccessRoute(user, route) {
  const matchedRecords = Array.isArray(route?.matched) ? route.matched : []
  return matchedRecords.every((record) => {
    if (!Object.prototype.hasOwnProperty.call(record.meta || {}, 'access')) {
      return record.meta?.requiresAuth !== true
    }

    return canAccess(user, record.meta?.access)
  })
}

export function getSidebarToneClass(user) {
  const profile = getAccessProfile(user)
  return DOMAIN_SIDEBAR_TONE_CLASS[profile.domain || DOMAINS.ENGLISH] || 'sidebar-shell--english'
}

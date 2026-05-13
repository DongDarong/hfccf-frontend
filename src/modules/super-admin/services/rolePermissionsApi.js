import http from '@/services/http'
import { ROLES, normalizeRole } from '@/constants/roles'

const ROLE_PERMISSION_MAP = {
  [ROLES.SUPER_ADMIN]: ['all:*'],
  [ROLES.ADMIN_ENGLISH]: ['dashboard:read', 'users:read', 'reports:read', 'programs:write'],
  [ROLES.ADMIN_PRESCHOOL]: [
    'dashboard:read',
    'users:read',
    'users:write',
    'reports:read',
    'classes:write',
    'students:read',
    'students:write',
    'attendance:write',
    'settings:read',
  ],
  [ROLES.ADMIN_SCHOLARSHIP]: [
    'dashboard:read',
    'users:read',
    'users:write',
    'reports:read',
    'settings:read',
  ],
  [ROLES.ADMIN_SPORT]: ['dashboard:read', 'users:read', 'reports:read', 'programs:write'],
  [ROLES.COACH]: ['dashboard:read', 'athletes:read', 'training:write'],
  [ROLES.TEACHER_ENGLISH]: ['dashboard:read', 'tasks:read', 'tasks:write'],
  [ROLES.TEACHER_PRESCHOOL]: [
    'dashboard:read',
    'classes:write',
    'students:read',
    'attendance:write',
    'tasks:read',
    'tasks:write',
  ],
  [ROLES.TEACHER_SCHOLARSHIP]: ['dashboard:read', 'tasks:read', 'tasks:write'],
}

function humanizePermissionCode(code) {
  const normalized = String(code || '').trim()

  if (!normalized) return ''
  if (normalized === 'all:*') return 'All permissions'

  return normalized
    .replace(/[:_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function normalizePermissionItem(permission) {
  if (typeof permission === 'string') {
    const code = permission.trim()
    return {
      code,
      name: humanizePermissionCode(code),
    }
  }

  const code = String(permission?.code || permission?.permission_code || '').trim()

  return {
    code,
    name: String(permission?.name || permission?.label || humanizePermissionCode(code)).trim(),
  }
}

function unwrapResponseData(response) {
  return response?.data?.data ?? response?.data ?? null
}

export function getLocalRolePermissions(role) {
  const codes = ROLE_PERMISSION_MAP[normalizeRole(role)] || []

  return codes.map((code) => normalizePermissionItem(code))
}

export async function fetchRolePermissions(role) {
  const normalizedRole = normalizeRole(role)

  if (!normalizedRole) {
    return []
  }

  try {
    const response = await http.get(`/roles/${encodeURIComponent(normalizedRole)}/permissions`)
    const payload = unwrapResponseData(response)
    const permissions = Array.isArray(payload?.permissions)
      ? payload.permissions
      : Array.isArray(payload?.items)
        ? payload.items
        : Array.isArray(payload)
          ? payload
          : []

    return permissions.map((permission) => normalizePermissionItem(permission))
  } catch (error) {
    const status = error?.response?.status

    if (!error?.response || status === 404 || status === 405) {
      return getLocalRolePermissions(normalizedRole)
    }

    throw error
  }
}

export function normalizePermissionLabel(code) {
  return humanizePermissionCode(code)
}

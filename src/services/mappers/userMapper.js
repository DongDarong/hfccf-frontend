export function mapUser(raw = {}) {
  const firstName = raw.firstName || ''
  const lastName = raw.lastName || ''
  const fallbackName = `${firstName} ${lastName}`.trim()
  const permissions = Array.isArray(raw.permissions)
    ? [...raw.permissions]
    : Array.isArray(raw.role_permission)
      ? [...raw.role_permission]
      : []

  return {
    id: raw.id,
    firstName,
    lastName,
    name: raw.name || fallbackName || raw.username || raw.id,
    username: raw.username || raw.id,
    email: raw.email,
    avatar: raw.avatar,
    role: raw.role,
    permissions,
    role_permission: permissions,
    status: raw.status,
    phone: raw.phone,
    department: raw.department,
    createdAt: raw.createdAt,
    lastLoginAt: raw.lastLoginAt,
  }
}

export function mapUsers(items = []) {
  return Array.isArray(items) ? items.map((item) => mapUser(item)) : []
}

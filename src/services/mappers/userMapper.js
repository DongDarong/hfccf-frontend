export function mapUser(raw = {}) {
  const firstName = String(raw.firstName || raw.first_name || '').trim()
  const lastName = String(raw.lastName || raw.last_name || '').trim()
  const fallbackName = `${firstName} ${lastName}`.trim()

  const permissions = Array.isArray(raw.permissions)
    ? [...raw.permissions]
    : Array.isArray(raw.role_permission)
      ? [...raw.role_permission]
      : Array.isArray(raw.role_permissions)
        ? [...raw.role_permissions]
        : []

  return {
    id: raw.id ?? '',
    firstName,
    lastName,
    name: String(raw.name || fallbackName || raw.username || raw.id || ''),
    username: String(raw.username || raw.id || ''),
    email: String(raw.email || ''),
    avatar: raw.avatar || '',
    role: String(raw.role || ''),
    scope: String(raw.scope || ''),
    domain: String(raw.domain || ''),
    permissions,
    role_permission: permissions,
    status: String(raw.status || ''),
    phone: String(raw.phone || ''),
    bio: raw.bio || '',
    department: raw.department || '',
    departmentCode: raw.departmentCode || raw.department_code || '',
    createdAt: raw.createdAt || raw.created_at || '',
    lastLoginAt: raw.lastLoginAt || raw.last_login_at || '',
  }
}

export function mapUsers(items = []) {
  return Array.isArray(items) ? items.map((item) => mapUser(item)) : []
}

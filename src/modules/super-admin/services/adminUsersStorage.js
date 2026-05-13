import { PROGRAM_ADMIN_ROLES, ROLES, isProgramAdminRole, isSuperAdminRole } from '@/constants/roles'
import { mapUser, mapUsers } from '@/services/mappers/userMapper'
import { getLocalRolePermissions } from '@/modules/super-admin/services/rolePermissionsApi'
import usersMock from '@/mocks/users.json'

const ADMIN_USERS_STORAGE_KEY = 'hfccf-super-admin-users'
const MANAGED_ADMIN_ROLES = [ROLES.SUPER_ADMIN, ...PROGRAM_ADMIN_ROLES]

function isManagedAdminUser(user) {
  return isSuperAdminRole(user?.role) || isProgramAdminRole(user?.role)
}

function canUseBrowserStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

function readStoredUsers() {
  if (!canUseBrowserStorage()) return null

  try {
    const parsed = JSON.parse(window.localStorage.getItem(ADMIN_USERS_STORAGE_KEY) || 'null')
    return Array.isArray(parsed) ? parsed : null
  } catch {
    window.localStorage.removeItem(ADMIN_USERS_STORAGE_KEY)
    return null
  }
}

function writeStoredUsers(users) {
  if (!canUseBrowserStorage()) return
  window.localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(users))
}

function seedAdminUsers() {
  return mapUsers(usersMock)
    .filter(isManagedAdminUser)
    .map((user) => ({
      ...user,
      permissions: Array.isArray(user.permissions) ? user.permissions : [],
      role_permission: Array.isArray(user.role_permission) ? user.role_permission : [],
    }))
}

function normalizeNameParts(name) {
  const [firstName = '', ...rest] = String(name || '').trim().split(/\s+/).filter(Boolean)
  return {
    firstName,
    lastName: rest.join(' '),
  }
}

function buildUsername(email, name) {
  const emailName = String(email || '').split('@')[0]
  return String(emailName || name || 'admin').trim()
}

function normalizeAdminPayload(payload, existingUser = null) {
  const name = String(payload?.name || existingUser?.name || '').trim()
  const email = String(payload?.email || existingUser?.email || '').trim().toLowerCase()
  const role = MANAGED_ADMIN_ROLES.includes(payload?.role) ? payload.role : ROLES.ADMIN_ENGLISH
  const permissions = getLocalRolePermissions(role).map((permission) => permission.code)
  const nameParts = normalizeNameParts(name)

  // Keep this frontend contract close to the backend user resource shape until the real users API is connected.
  return mapUser({
    ...existingUser,
    id: existingUser?.id || `usr_local_${Date.now()}`,
    firstName: nameParts.firstName,
    lastName: nameParts.lastName,
    name,
    username: existingUser?.username || buildUsername(email, name),
    email,
    phone: String(payload?.phone || '').trim(),
    role,
    department: role === ROLES.ADMIN_SPORT ? 'Sports' : role === ROLES.SUPER_ADMIN ? 'Operations' : 'Education',
    departmentCode: role === ROLES.ADMIN_SPORT ? 'sports' : role === ROLES.SUPER_ADMIN ? 'operations' : 'education',
    status: payload?.status || 'active',
    avatar: payload?.avatar || existingUser?.avatar || existingUser?.profileImage || '',
    permissions,
    role_permission: permissions,
    createdAt: existingUser?.createdAt || new Date().toISOString(),
    lastLoginAt: existingUser?.lastLoginAt || null,
  })
}

export function getAdminUsers() {
  const storedUsers = readStoredUsers()
  if (storedUsers) return mapUsers(storedUsers).filter(isManagedAdminUser)

  const seededUsers = seedAdminUsers()
  writeStoredUsers(seededUsers)
  return seededUsers
}

export function findAdminUserById(id) {
  const targetId = String(id || '').trim()
  if (!targetId) return null
  return getAdminUsers().find((user) => String(user.id) === targetId) || null
}

export function createAdminUser(payload) {
  const users = getAdminUsers()
  const nextUser = normalizeAdminPayload(payload)

  writeStoredUsers([nextUser, ...users])
  return nextUser
}

export function updateAdminUser(id, payload) {
  const targetId = String(id || '').trim()
  const users = getAdminUsers()
  const existingUser = users.find((user) => String(user.id) === targetId)

  if (!existingUser) {
    throw new Error('Admin user not found.')
  }

  const updatedUser = normalizeAdminPayload(payload, existingUser)
  writeStoredUsers(users.map((user) => (String(user.id) === targetId ? updatedUser : user)))
  return updatedUser
}

export function deleteAdminUser(id) {
  const targetId = String(id || '').trim()
  if (!targetId) return false

  const users = getAdminUsers()
  const nextUsers = users.filter((user) => String(user.id) !== targetId)
  writeStoredUsers(nextUsers)
  return nextUsers.length !== users.length
}

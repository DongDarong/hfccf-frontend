import http from '@/services/http'
import { mapUser, mapUsers } from '@/services/mappers/userMapper'
import {
  createAdminUser as createLocalAdminUser,
  deleteAdminUser as deleteLocalAdminUser,
  findAdminUserById as findLocalAdminUserById,
  getAdminUsers as getLocalAdminUsers,
  updateAdminUser as updateLocalAdminUser,
} from '@/modules/super-admin/services/adminUsersStorage'
import { PROGRAM_ADMIN_ROLES, ROLES } from '@/constants/roles'

const ADMIN_ROUTES = '/users'
const MANAGED_ADMIN_ROLES = [ROLES.SUPER_ADMIN, ...PROGRAM_ADMIN_ROLES]

function isFallbackWorthyError(error) {
  const status = error?.response?.status
  return !error?.response || status === 404 || status === 405
}

function toAdminUsers(items = []) {
  return mapUsers(items).filter((user) => MANAGED_ADMIN_ROLES.includes(String(user?.role || '').trim()))
}

function splitName(fullName) {
  const tokens = String(fullName || '').trim().split(/\s+/).filter(Boolean)
  const [firstName = '', ...rest] = tokens
  return {
    firstName,
    lastName: rest.join(' '),
  }
}

function toApiPayload(formPayload = {}, { includePassword = false } = {}) {
  // The Add Admin UI uses a single `name` field; the backend schema is normalized.
  const { firstName, lastName } = splitName(formPayload?.name)

  const payload = {
    firstName,
    lastName,
    username: String(formPayload?.username || formPayload?.name || '').trim(),
    email: String(formPayload?.email || '').trim().toLowerCase(),
    phone: String(formPayload?.phone || '').trim() || null,
    role: String(formPayload?.role || '').trim(),
    status: String(formPayload?.status || '').trim() || 'active',
    avatar: formPayload?.avatar || null,
    permissions: Array.isArray(formPayload?.permissions) ? formPayload.permissions : [],
  }

  if (includePassword) {
    payload.password = String(formPayload?.password || '')
    payload.password_confirmation = String(formPayload?.confirmPassword || formPayload?.password || '')
  }

  return payload
}

function extractUserCollection(response) {
  const payload = response?.data?.data ?? response?.data ?? {}
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.users)) return payload.users
  if (Array.isArray(payload?.items)) return payload.items
  return []
}

function extractUserItem(response) {
  const payload = response?.data?.data ?? response?.data ?? {}
  return payload?.user || payload?.data || payload
}

async function requestWithFallback(requestHandler, fallbackHandler) {
  try {
    return await requestHandler()
  } catch (error) {
    if (!isFallbackWorthyError(error)) throw error
    return fallbackHandler()
  }
}

export async function listAdminUsers() {
  return requestWithFallback(async () => {
    const response = await http.get(ADMIN_ROUTES, { params: { per_page: 100 } })
    return toAdminUsers(extractUserCollection(response))
  }, () => getLocalAdminUsers())
}

export async function findAdminUserById(id) {
  const targetId = String(id || '').trim()
  if (!targetId) return null

  return requestWithFallback(async () => {
    const response = await http.get(`${ADMIN_ROUTES}/${encodeURIComponent(targetId)}`)
    return mapUser(extractUserItem(response))
  }, () => findLocalAdminUserById(targetId))
}

export async function createAdminUser(payload) {
  return requestWithFallback(async () => {
    const response = await http.post(ADMIN_ROUTES, toApiPayload(payload, { includePassword: true }))
    return mapUser(extractUserItem(response))
  }, () => createLocalAdminUser(payload))
}

export async function updateAdminUser(id, payload) {
  const targetId = String(id || '').trim()
  if (!targetId) {
    throw new Error('Admin user id is required.')
  }

  return requestWithFallback(async () => {
    const includePassword = Boolean(payload?.password)
    const response = await http.put(
      `${ADMIN_ROUTES}/${encodeURIComponent(targetId)}`,
      toApiPayload(payload, { includePassword }),
    )
    return mapUser(extractUserItem(response))
  }, () => updateLocalAdminUser(targetId, payload))
}

export async function deleteAdminUser(id) {
  const targetId = String(id || '').trim()
  if (!targetId) return false

  return requestWithFallback(async () => {
    await http.delete(`${ADMIN_ROUTES}/${encodeURIComponent(targetId)}`)
    return true
  }, () => deleteLocalAdminUser(targetId))
}

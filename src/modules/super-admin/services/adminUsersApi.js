import http from '@/services/http'
import { mapUser, mapUsers } from '@/services/mappers/userMapper'
import {
  createAdminUser as createLocalAdminUser,
  deleteAdminUser as deleteLocalAdminUser,
  findAdminUserById as findLocalAdminUserById,
  updateAdminUser as updateLocalAdminUser,
} from '@/modules/super-admin/services/adminUsersStorage'

const ADMIN_ROUTES = '/users'

function isFallbackWorthyError(error) {
  const status = error?.response?.status
  return !error?.response || status === 404 || status === 405
}

function toAdminUsers(items = []) {
  return mapUsers(items)
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

function extractUserItem(response) {
  const payload = response?.data?.data ?? response?.data ?? {}
  return payload?.user || payload?.data || payload
}

function extractAdminUsersPayload(response) {
  const payload = response?.data?.data ?? response?.data ?? {}

  const rawItems = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.items)
      ? payload.items
      : Array.isArray(payload?.users)
        ? payload.users
        : []

  const pagination = payload?.pagination && typeof payload.pagination === 'object'
    ? payload.pagination
    : {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: rawItems.length,
        from: rawItems.length ? 1 : null,
        to: rawItems.length || null,
      }

  const summary = payload?.summary && typeof payload.summary === 'object' ? payload.summary : {}

  return {
    items: rawItems,
    pagination,
    summary,
  }
}

async function requestWithFallback(requestHandler, fallbackHandler) {
  try {
    return await requestHandler()
  } catch (error) {
    if (!isFallbackWorthyError(error)) throw error
    return fallbackHandler()
  }
}

export async function listAdminUsers(
  {
    page = 1,
    perPage = 10,
    search = '',
    role = '',
    status = '',
    sortBy = 'created_at',
    sortDirection = 'desc',
  } = {},
  options = {},
) {
  const response = await http.get(ADMIN_ROUTES, {
    params: {
      page,
      per_page: perPage,
      search,
      role,
      status,
      sort_by: sortBy,
      sort_direction: sortDirection,
    },
    signal: options.signal,
  })

  const payload = extractAdminUsersPayload(response)

  return {
    items: toAdminUsers(payload.items),
    pagination: payload.pagination,
    summary: payload.summary,
  }
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

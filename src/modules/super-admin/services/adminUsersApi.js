import http from '@/services/http'
import { mapUser, mapUsers } from '@/services/mappers/userMapper'

const ADMIN_ROUTES = '/users'

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

function buildAvatarFormData(formPayload = {}, { includePassword = false, method = 'POST' } = {}) {
  const payload = new FormData()
  const { firstName, lastName } = splitName(formPayload?.name)
  const avatarFile = formPayload?.avatar instanceof File ? formPayload.avatar : null
  const shouldRemoveAvatar = Boolean(formPayload?.removeAvatar)

  payload.append('first_name', firstName)
  payload.append('last_name', lastName)
  payload.append('username', String(formPayload?.username || formPayload?.name || '').trim())
  payload.append('email', String(formPayload?.email || '').trim().toLowerCase())
  payload.append('phone', String(formPayload?.phone || '').trim())
  payload.append('bio', String(formPayload?.bio || '').trim())
  payload.append('role', String(formPayload?.role || '').trim())
  payload.append('status', String(formPayload?.status || '').trim() || 'active')

  if (includePassword && String(formPayload?.password || '').trim()) {
    payload.append('password', String(formPayload?.password || ''))
    payload.append(
      'password_confirmation',
      String(formPayload?.confirmPassword || formPayload?.password || ''),
    )
  }

  if (avatarFile) {
    payload.append('avatar', avatarFile)
  } else if (shouldRemoveAvatar) {
    payload.append('remove_avatar', '1')
  }

  if (method === 'PUT') {
    payload.append('_method', 'PUT')
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
        : []

  const pagination = payload?.pagination && typeof payload.pagination === 'object'
    ? payload.pagination
    : {
        page: Number(payload?.page) || 1,
        perPage: Number(payload?.perPage) || Number(payload?.per_page) || 10,
        total: Number(payload?.total) || rawItems.length,
        totalPages: Number(payload?.totalPages) || Number(payload?.last_page) || 1,
        current_page: Number(payload?.page) || Number(payload?.current_page) || 1,
        last_page: Number(payload?.totalPages) || Number(payload?.last_page) || 1,
        per_page: Number(payload?.perPage) || Number(payload?.per_page) || 10,
      }

  const summary = payload?.summary && typeof payload.summary === 'object' ? payload.summary : {}

  return {
    items: rawItems,
    pagination,
    summary,
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
  const pagination = payload.pagination || {}

  return {
    items: toAdminUsers(payload.items),
    pagination: {
      page: Number(pagination.page || pagination.current_page || page) || page,
      perPage: Number(pagination.perPage || pagination.per_page || perPage) || perPage,
      total: Number(pagination.total) || 0,
      totalPages: Number(pagination.totalPages || pagination.last_page || 1) || 1,
      current_page: Number(pagination.current_page || pagination.page || page) || page,
      last_page: Number(pagination.last_page || pagination.totalPages || 1) || 1,
      per_page: Number(pagination.per_page || pagination.perPage || perPage) || perPage,
      from: pagination.from ?? null,
      to: pagination.to ?? null,
    },
    summary: payload.summary,
  }
}

export async function findAdminUserById(id) {
  const targetId = String(id || '').trim()
  if (!targetId) return null

  const response = await http.get(`/super-admin/users/${encodeURIComponent(targetId)}`)
  return mapUser(extractUserItem(response))
}

export async function getAdminUser(id) {
  const targetId = String(id || '').trim()
  if (!targetId) return null

  const response = await http.get(`/super-admin/users/${encodeURIComponent(targetId)}`)
  return mapUser(extractUserItem(response))
}

export async function createAdminUser(payload) {
  const response = await http.post(
    ADMIN_ROUTES,
    buildAvatarFormData(payload, { includePassword: true }),
  )
  return mapUser(extractUserItem(response))
}

export async function updateAdminUser(id, payload) {
  const targetId = String(id || '').trim()
  if (!targetId) {
    throw new Error('Admin user id is required.')
  }

  const includePassword = Boolean(payload?.password)
  const response = await http.post(
    `${ADMIN_ROUTES}/${encodeURIComponent(targetId)}`,
    buildAvatarFormData(payload, { includePassword, method: 'PUT' }),
  )
  return mapUser(extractUserItem(response))
}

export async function deleteAdminUser(id) {
  const targetId = String(id || '').trim()
  if (!targetId) return false

  await http.delete(`${ADMIN_ROUTES}/${encodeURIComponent(targetId)}`)
  return true
}

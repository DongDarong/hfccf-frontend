import http from '@/services/http'

function unwrapResponseData(response) {
  return response?.data?.data ?? response?.data ?? null
}

function toPositiveInteger(value, fallback) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback
}

function normalizeListParams(params = {}) {
  const page = toPositiveInteger(params.page, 1)
  const perPage = toPositiveInteger(params.perPage ?? params.per_page, 10)

  const payload = {
    page,
    per_page: perPage,
  }

  const status = String(params.status || '').trim()
  const type = String(params.type || '').trim()
  const module = String(params.module || '').trim()
  const search = String(params.search || '').trim()

  if (status) payload.status = status
  if (type) payload.type = type
  if (module) payload.module = module
  if (search) payload.search = search

  return payload
}

function normalizeCreatePayload(payload = {}) {
  const metadata = payload.metadata

  return {
    type: String(payload.type || '').trim().toLowerCase(),
    title: String(payload.title || '').trim(),
    message: String(payload.message || '').trim(),
    module: String(payload.module || '').trim().toLowerCase(),
    action_url: String(payload.actionUrl || payload.action_url || '').trim() || null,
    metadata: metadata && typeof metadata === 'object' ? metadata : null,
    target_type: String(payload.targetType || payload.target_type || '').trim().toLowerCase(),
    target_value: String(payload.targetValue || payload.target_value || '').trim() || null,
  }
}

/**
 * Shared notification API client.
 *
 * The app already owns the Axios instance and auth token flow, so this service
 * only maps domain-specific requests to the backend endpoints.
 */
export async function fetchNotifications(params = {}, options = {}) {
  const response = await http.get('/notifications', {
    params: normalizeListParams(params),
    signal: options.signal,
  })

  return unwrapResponseData(response)
}

/**
 * Load the current unread count for the navbar badge.
 */
export async function fetchUnreadCount() {
  const response = await http.get('/notifications/unread-count')

  return unwrapResponseData(response)
}

/**
 * Create a new notification.
 */
export async function createNotification(payload = {}) {
  const response = await http.post('/notifications', normalizeCreatePayload(payload))

  return unwrapResponseData(response)
}

/**
 * Mark a single notification as read.
 */
export async function markNotificationAsRead(id) {
  const response = await http.patch(`/notifications/${id}/read`)

  return unwrapResponseData(response)
}

/**
 * Mark every notification as read.
 */
export async function markAllNotificationsAsRead() {
  const response = await http.patch('/notifications/read-all')

  return unwrapResponseData(response)
}

/**
 * Dismiss a notification from the user's list.
 */
export async function dismissNotification(id) {
  const response = await http.delete(`/notifications/${id}/dismiss`)

  return unwrapResponseData(response)
}

/**
 * Restore a previously dismissed notification.
 */
export async function undismissNotification(id) {
  const response = await http.patch(`/notifications/${id}/undismiss`)

  return unwrapResponseData(response)
}

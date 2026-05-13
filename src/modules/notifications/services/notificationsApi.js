import http from '@/services/http'

function unwrapResponseData(response) {
  return response?.data?.data ?? response?.data ?? null
}

/**
 * Shared notification API client.
 *
 * The app already owns the Axios instance and auth token flow, so this service
 * only maps domain-specific requests to the backend endpoints.
 */
export async function fetchNotifications(params = {}) {
  const response = await http.get('/notifications', {
    params,
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
  const response = await http.post('/notifications', payload)

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

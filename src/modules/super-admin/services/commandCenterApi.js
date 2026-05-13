import http from '@/services/http'
import commandCenterMock from '@/mocks/super-admin/commandCenterData'

const COMMAND_CENTER_ROUTE = '/super-admin/command-center'

function isFallbackWorthyError(error) {
  const status = error?.response?.status
  return !error?.response || status === 404 || status === 405
}

function unwrapCommandCenterPayload(response) {
  const payload = response?.data?.data ?? response?.data ?? {}

  if (payload?.commandCenter) return payload.commandCenter
  if (payload?.command_center) return payload.command_center
  if (payload?.data?.page && payload?.data?.sections) return payload.data

  return payload
}

async function requestWithFallback(requestHandler, fallbackHandler) {
  try {
    return await requestHandler()
  } catch (error) {
    if (!isFallbackWorthyError(error)) throw error
    return fallbackHandler()
  }
}

/**
 * Load the command center data from the backend when available.
 * Falls back to the local mock so the dashboard remains functional in dev and offline scenarios.
 */
export async function fetchCommandCenterData() {
  return requestWithFallback(async () => {
    const response = await http.get(COMMAND_CENTER_ROUTE)
    return unwrapCommandCenterPayload(response)
  }, () => commandCenterMock)
}

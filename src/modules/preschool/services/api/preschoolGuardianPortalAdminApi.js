import http from '@/services/http'
import { buildQueryParams, unwrapApiData, unwrapApiItems, unwrapApiPagination } from '@/services/api'
import { mapGuardianPortalAccount } from '@/modules/guardian-portal/services/api/guardianPortalMappers'

/**
 * Preschool admin portal management stays in a dedicated API module so the
 * guardian portal account flow remains isolated from student relationship data.
 */
export async function fetchGuardianPortalAccounts(params = {}, options = {}) {
  const response = await http.get('/preschool/guardian-portal/accounts', {
    params: buildQueryParams({
      page: params.page || 1,
      per_page: params.perPage || 10,
      search: params.search || '',
      status: params.status || '',
    }),
    signal: options.signal,
  })

  const items = unwrapApiItems(response).map(mapGuardianPortalAccount)

  return {
    items,
    pagination: unwrapApiPagination(response, params.page || 1, params.perPage || 10, items.length),
  }
}

export async function inviteGuardianPortal(guardianId, payload = {}) {
  const response = await http.post(`/preschool/guardians/${encodeURIComponent(String(guardianId || '').trim())}/portal/invite`, payload)
  const data = unwrapApiData(response) || {}

  return {
    account: mapGuardianPortalAccount(data.account || {}),
    activationToken: String(data.activationToken || ''),
    activationUrl: String(data.activationUrl || ''),
  }
}

export async function revokeGuardianPortal(accountId) {
  const response = await http.post(`/preschool/guardian-portal/${encodeURIComponent(String(accountId || '').trim())}/revoke`)
  const data = unwrapApiData(response) || {}

  return mapGuardianPortalAccount(data.account || {})
}

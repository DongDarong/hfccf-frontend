// Keep remediation requests in their own module so the read-only integrity
// API stays separate from the write paths that carry audit side-effects.
import http from '@/services/http'
import { unwrapApiData } from '@/services/api'
import {
  normalizeRemediationLog,
  normalizeRemediationLogList,
} from './preschoolGuardianRemediationMappers'

export async function fetchRemediationLogs(params = {}, options = {}) {
  const response = await http.get('/preschool/guardians/remediation/logs', {
    params,
    signal: options.signal,
  })
  const payload = unwrapApiData(response) || {}
  return {
    items: normalizeRemediationLogList(payload.data || payload),
    meta: response.data?.meta || {},
  }
}

export async function markIssueReviewed(payload) {
  const response = await http.post('/preschool/guardians/remediation/mark-reviewed', payload)
  return normalizeRemediationLog(unwrapApiData(response) || {})
}

export async function setPrimaryGuardian(payload) {
  const response = await http.post('/preschool/guardians/remediation/set-primary', payload)
  return unwrapApiData(response)
}

export async function clearInvalidPrimary(payload) {
  const response = await http.post(
    '/preschool/guardians/remediation/clear-invalid-primary',
    payload,
  )
  return unwrapApiData(response)
}

export async function clearInvalidEmergencyContact(payload) {
  const response = await http.post(
    '/preschool/guardians/remediation/clear-invalid-emergency-contact',
    payload,
  )
  return unwrapApiData(response)
}

export async function reconcileLegacyFields(payload) {
  const response = await http.post(
    '/preschool/guardians/remediation/reconcile-legacy-fields',
    payload,
  )
  return unwrapApiData(response)
}

export async function archiveDuplicateCandidate(payload) {
  const response = await http.post(
    '/preschool/guardians/remediation/archive-duplicate-candidate',
    payload,
  )
  return unwrapApiData(response)
}

export async function archiveOrphanGuardian(payload) {
  const response = await http.post(
    '/preschool/guardians/remediation/archive-orphan-guardian',
    payload,
  )
  return unwrapApiData(response)
}

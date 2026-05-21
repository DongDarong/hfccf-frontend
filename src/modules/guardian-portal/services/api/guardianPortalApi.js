import http from '@/services/http'
import { unwrapApiData, unwrapApiItems, unwrapApiPagination } from '@/services/api'
import {
  mapGuardianPortalAccount,
  mapGuardianPortalStudent,
  mapGuardianPortalSummary,
} from './guardianPortalMappers'

function normalizeListResponse(response, mapper, fallbackPage = 1, fallbackPerPage = 10) {
  const items = unwrapApiItems(response).map(mapper)

  return {
    items,
    pagination: unwrapApiPagination(response, fallbackPage, fallbackPerPage, items.length),
  }
}

export async function activateGuardianPortalInvitation(payload = {}) {
  const response = await http.post('/guardian-portal/activate', payload)
  const data = unwrapApiData(response) || {}

  return {
    token: String(data.token || ''),
    user: data.user || null,
    account: mapGuardianPortalAccount(data.account || {}),
  }
}

export async function fetchGuardianPortalMe(options = {}) {
  const response = await http.get('/guardian-portal/me', {
    signal: options.signal,
  })

  return unwrapApiData(response) || {}
}

export async function fetchGuardianPortalStudents(options = {}) {
  const response = await http.get('/guardian-portal/students', {
    signal: options.signal,
  })

  return normalizeListResponse(response, mapGuardianPortalStudent, 1, 10)
}

export async function fetchGuardianPortalStudent(studentId, options = {}) {
  const id = String(studentId || '').trim()
  if (!id) return null

  const response = await http.get(`/guardian-portal/students/${encodeURIComponent(id)}`, {
    signal: options.signal,
  })

  return mapGuardianPortalSummary(unwrapApiData(response) || {})
}

export async function fetchGuardianAttendanceSummary(studentId, options = {}) {
  const id = String(studentId || '').trim()
  if (!id) return null

  const response = await http.get(`/guardian-portal/students/${encodeURIComponent(id)}/attendance-summary`, {
    signal: options.signal,
  })

  return mapGuardianPortalSummary(unwrapApiData(response) || {})
}

export async function fetchGuardianScheduleSummary(studentId, options = {}) {
  const id = String(studentId || '').trim()
  if (!id) return null

  const response = await http.get(`/guardian-portal/students/${encodeURIComponent(id)}/schedule-summary`, {
    signal: options.signal,
  })

  return mapGuardianPortalSummary(unwrapApiData(response) || {})
}

export async function fetchGuardianProgressSummary(studentId, options = {}) {
  const id = String(studentId || '').trim()
  if (!id) return null

  const response = await http.get(`/guardian-portal/students/${encodeURIComponent(id)}/progress-summary`, {
    signal: options.signal,
  })

  return mapGuardianPortalSummary(unwrapApiData(response) || {})
}

export async function fetchGuardianReports(studentId, options = {}) {
  const id = String(studentId || '').trim()
  if (!id) return null

  const response = await http.get(`/guardian-portal/students/${encodeURIComponent(id)}/reports`, {
    signal: options.signal,
  })

  return mapGuardianPortalSummary(unwrapApiData(response) || {})
}

export async function fetchGuardianPortalStudentSummary(studentId, options = {}) {
  return fetchGuardianPortalStudent(studentId, options)
}

export async function fetchGuardianPortalStudentBundle(studentId, options = {}) {
  return fetchGuardianPortalStudent(studentId, options)
}

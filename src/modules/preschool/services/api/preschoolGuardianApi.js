// Keep guardian HTTP traffic in one place so the Preschool pages can focus on
// role-aware state and the normalized guardian relationship contract.
import http from '@/services/http'
import { buildQueryParams, unwrapApiData, unwrapApiItems, unwrapApiPagination } from '@/services/api'
import {
  normalizeEmergencyContactRows,
  normalizeGuardianRow,
  normalizeGuardianRows,
  normalizeStudentGuardianRow,
  normalizeStudentGuardianRows,
} from './preschoolGuardianMappers'

function normalizePerPage(value, fallback = 10, max = 100) {
  const number = Number(value)
  if (!Number.isFinite(number) || number < 1) return fallback
  return Math.min(Math.floor(number), max)
}

function normalizeListResponse(response, fallbackPage = 1, fallbackPerPage = 10) {
  const payload = unwrapApiData(response) || {}
  const items = Array.isArray(payload.items) ? payload.items : unwrapApiItems(response)

  return {
    items: normalizeGuardianRows(items),
    pagination: unwrapApiPagination(payload, fallbackPage, fallbackPerPage, items.length),
  }
}

function normalizeRelationshipResponse(response, fallbackPage = 1, fallbackPerPage = 10) {
  const payload = unwrapApiData(response) || {}
  const items = Array.isArray(payload.items) ? payload.items : unwrapApiItems(response)

  return {
    items: normalizeStudentGuardianRows(items),
    pagination: unwrapApiPagination(payload, fallbackPage, fallbackPerPage, items.length),
  }
}

function normalizeSingleRelationship(response) {
  const payload = unwrapApiData(response) || {}
  return normalizeStudentGuardianRow(payload.relationship || payload)
}

function normalizeSingleGuardian(response) {
  const payload = unwrapApiData(response) || {}
  return normalizeGuardianRow(payload.guardian || payload)
}

export async function fetchGuardians(
  { page = 1, perPage = 10, search = '', status = '', sortBy = 'full_name', sortDirection = 'asc' } = {},
  options = {},
) {
  const response = await http.get('/preschool/guardians', {
    params: buildQueryParams({
      page,
      per_page: normalizePerPage(perPage),
      search,
      status,
      sort_by: sortBy,
      sort_direction: sortDirection,
    }),
    signal: options.signal,
  })

  return normalizeListResponse(response, page, normalizePerPage(perPage))
}

export async function createGuardian(payload = {}) {
  const response = await http.post('/preschool/guardians', payload)
  return normalizeSingleGuardian(response)
}

export async function fetchGuardian(guardianId, options = {}) {
  const id = String(guardianId || '').trim()
  if (!id) return null

  const response = await http.get(`/preschool/guardians/${encodeURIComponent(id)}`, {
    signal: options.signal,
  })

  return normalizeSingleGuardian(response)
}

export async function updateGuardian(guardianId, payload = {}) {
  const id = String(guardianId || '').trim()
  if (!id) throw new Error('Guardian id is required.')

  const response = await http.patch(`/preschool/guardians/${encodeURIComponent(id)}`, payload)
  return normalizeSingleGuardian(response)
}

export async function archiveGuardian(guardianId) {
  const id = String(guardianId || '').trim()
  if (!id) return false

  await http.delete(`/preschool/guardians/${encodeURIComponent(id)}`)
  return true
}

export async function fetchStudentGuardians(studentId, options = {}) {
  const id = String(studentId || '').trim()
  if (!id) return { items: [] }

  const response = await http.get(`/preschool/students/${encodeURIComponent(id)}/guardians`, {
    signal: options.signal,
  })

  return normalizeRelationshipResponse(response)
}

export async function linkStudentGuardian(studentId, payload = {}) {
  const id = String(studentId || '').trim()
  if (!id) throw new Error('Student id is required.')

  const response = await http.post(`/preschool/students/${encodeURIComponent(id)}/guardians`, payload)
  return normalizeSingleRelationship(response)
}

export async function updateStudentGuardian(relationshipId, payload = {}) {
  const id = String(relationshipId || '').trim()
  if (!id) throw new Error('Relationship id is required.')

  const response = await http.patch(`/preschool/student-guardians/${encodeURIComponent(id)}`, payload)
  return normalizeSingleRelationship(response)
}

export async function archiveStudentGuardian(relationshipId) {
  const id = String(relationshipId || '').trim()
  if (!id) return false

  await http.delete(`/preschool/student-guardians/${encodeURIComponent(id)}`)
  return true
}

export async function fetchEmergencyContacts(studentId, options = {}) {
  const id = String(studentId || '').trim()
  if (!id) return { items: [] }

  const response = await http.get(`/preschool/students/${encodeURIComponent(id)}/emergency-contacts`, {
    signal: options.signal,
  })

  const payload = unwrapApiData(response) || {}
  return {
    items: normalizeEmergencyContactRows(Array.isArray(payload.items) ? payload.items : unwrapApiItems(response)),
  }
}

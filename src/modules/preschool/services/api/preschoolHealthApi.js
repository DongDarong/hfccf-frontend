import http from '@/services/http'
import { buildQueryParams, unwrapApiData } from '@/services/api'

function resolveId(input) {
  if (input === null || input === undefined || input === '') {
    return ''
  }

  if (typeof input === 'object') {
    return String(
      input.id ??
      input.studentId ??
      input.recordId ??
      input.allergyId ??
      input.vaccinationId ??
      input.medicationId ??
      input.incidentId ??
      input.contactId ??
      input.checkId ??
      '',
    )
  }

  return String(input)
}

function normalizeHealthRecord(record = {}) {
  return {
    ...record,
    id: record.id ?? '',
    studentId: record.studentId ?? record.student_id ?? '',
    status: String(record.status ?? '').trim(),
    raw: record,
  }
}

function normalizeSummary(summary = {}) {
  return {
    student: summary.student || null,
    medicalProfile: summary.medicalProfile || null,
    legacyProfile: summary.legacyProfile || null,
    counts: {
      allergies: Number(summary.counts?.allergies ?? 0),
      vaccinations: Number(summary.counts?.vaccinations ?? 0),
      medications: Number(summary.counts?.medications ?? 0),
      incidents: Number(summary.counts?.incidents ?? 0),
      highSeverityIncidents: Number(summary.counts?.highSeverityIncidents ?? 0),
      emergencyContacts: Number(summary.counts?.emergencyContacts ?? 0),
      healthChecks: Number(summary.counts?.healthChecks ?? 0),
    },
    primaryEmergencyContact: summary.primaryEmergencyContact || null,
    allergies: Array.isArray(summary.allergies) ? summary.allergies.map(normalizeHealthRecord) : [],
    vaccinations: Array.isArray(summary.vaccinations) ? summary.vaccinations.map(normalizeHealthRecord) : [],
    medications: Array.isArray(summary.medications) ? summary.medications.map(normalizeHealthRecord) : [],
    incidents: Array.isArray(summary.incidents) ? summary.incidents.map(normalizeHealthRecord) : [],
    emergencyContacts: Array.isArray(summary.emergencyContacts) ? summary.emergencyContacts.map(normalizeHealthRecord) : [],
    healthChecks: Array.isArray(summary.healthChecks) ? summary.healthChecks.map(normalizeHealthRecord) : [],
    raw: summary,
  }
}

function normalizeListResponse(response) {
  const payload = unwrapApiData(response) || {}
  return Array.isArray(payload.items) ? payload.items.map(normalizeHealthRecord) : []
}

async function createRecord(studentId, segment, payload = {}) {
  const id = resolveId(studentId)
  if (!id) {
    throw new Error('Student id is required.')
  }

  const response = await http.post(`/preschool/students/${encodeURIComponent(id)}/health/${segment}`, payload)
  return unwrapApiData(response) || {}
}

async function updateRecord(studentId, segment, recordId, payload = {}) {
  const id = resolveId(studentId)
  const rowId = resolveId(recordId)
  if (!id || !rowId) {
    throw new Error('Student id and record id are required.')
  }

  const response = await http.put(`/preschool/students/${encodeURIComponent(id)}/health/${segment}/${encodeURIComponent(rowId)}`, payload)
  return unwrapApiData(response) || {}
}

async function deleteRecord(studentId, segment, recordId) {
  const id = resolveId(studentId)
  const rowId = resolveId(recordId)
  if (!id || !rowId) {
    return false
  }

  await http.delete(`/preschool/students/${encodeURIComponent(id)}/health/${segment}/${encodeURIComponent(rowId)}`)
  return true
}

export async function fetchStudentHealthSummary(studentId) {
  const id = resolveId(studentId)
  if (!id) return null

  const response = await http.get(`/preschool/students/${encodeURIComponent(id)}/health/summary`)
  return normalizeSummary(unwrapApiData(response) || {})
}

export async function fetchStudentMedicalProfile(studentId) {
  const id = resolveId(studentId)
  if (!id) return null

  const response = await http.get(`/preschool/students/${encodeURIComponent(id)}/health/medical-profile`)
  const payload = unwrapApiData(response) || {}

  return {
    medicalProfile: payload.medicalProfile || null,
    legacyProfile: payload.legacyProfile || null,
  }
}

export async function saveStudentMedicalProfile(studentId, payload = {}) {
  const id = resolveId(studentId)
  if (!id) {
    throw new Error('Student id is required.')
  }

  const response = await http.put(`/preschool/students/${encodeURIComponent(id)}/health/medical-profile`, payload)
  const data = unwrapApiData(response) || {}
  return data.medicalProfile || null
}

export async function fetchStudentHealthAllergies(studentId, filters = {}) {
  const id = resolveId(studentId)
  if (!id) return []

  const response = await http.get(`/preschool/students/${encodeURIComponent(id)}/health/allergies`, {
    params: buildQueryParams(filters),
  })

  return normalizeListResponse(response)
}

export async function saveStudentHealthAllergy(studentId, payload = {}) {
  const allergyId = resolveId(payload)
  return allergyId
    ? updateRecord(studentId, 'allergies', allergyId, payload)
    : createRecord(studentId, 'allergies', payload)
}

export async function deleteStudentHealthAllergy(studentId, allergyId) {
  return deleteRecord(studentId, 'allergies', allergyId)
}

export async function fetchStudentHealthVaccinations(studentId, filters = {}) {
  const id = resolveId(studentId)
  if (!id) return []

  const response = await http.get(`/preschool/students/${encodeURIComponent(id)}/health/vaccinations`, {
    params: buildQueryParams(filters),
  })

  return normalizeListResponse(response)
}

export async function saveStudentHealthVaccination(studentId, payload = {}) {
  const vaccinationId = resolveId(payload)
  return vaccinationId
    ? updateRecord(studentId, 'vaccinations', vaccinationId, payload)
    : createRecord(studentId, 'vaccinations', payload)
}

export async function deleteStudentHealthVaccination(studentId, vaccinationId) {
  return deleteRecord(studentId, 'vaccinations', vaccinationId)
}

export async function fetchStudentHealthMedications(studentId, filters = {}) {
  const id = resolveId(studentId)
  if (!id) return []

  const response = await http.get(`/preschool/students/${encodeURIComponent(id)}/health/medications`, {
    params: buildQueryParams(filters),
  })

  return normalizeListResponse(response)
}

export async function saveStudentHealthMedication(studentId, payload = {}) {
  const medicationId = resolveId(payload)
  return medicationId
    ? updateRecord(studentId, 'medications', medicationId, payload)
    : createRecord(studentId, 'medications', payload)
}

export async function deleteStudentHealthMedication(studentId, medicationId) {
  return deleteRecord(studentId, 'medications', medicationId)
}

export async function fetchStudentHealthIncidents(studentId, filters = {}) {
  const id = resolveId(studentId)
  if (!id) return []

  const response = await http.get(`/preschool/students/${encodeURIComponent(id)}/health/incidents`, {
    params: buildQueryParams(filters),
  })

  return normalizeListResponse(response)
}

export async function saveStudentHealthIncident(studentId, payload = {}) {
  const incidentId = resolveId(payload)
  return incidentId
    ? updateRecord(studentId, 'incidents', incidentId, payload)
    : createRecord(studentId, 'incidents', payload)
}

export async function deleteStudentHealthIncident(studentId, incidentId) {
  return deleteRecord(studentId, 'incidents', incidentId)
}

export async function fetchStudentHealthContacts(studentId, filters = {}) {
  const id = resolveId(studentId)
  if (!id) return []

  const response = await http.get(`/preschool/students/${encodeURIComponent(id)}/health/emergency-contacts`, {
    params: buildQueryParams(filters),
  })

  return normalizeListResponse(response)
}

export async function saveStudentHealthContact(studentId, payload = {}) {
  const contactId = resolveId(payload)
  return contactId
    ? updateRecord(studentId, 'emergency-contacts', contactId, payload)
    : createRecord(studentId, 'emergency-contacts', payload)
}

export async function deleteStudentHealthContact(studentId, contactId) {
  return deleteRecord(studentId, 'emergency-contacts', contactId)
}

export async function fetchStudentHealthChecks(studentId, filters = {}) {
  const id = resolveId(studentId)
  if (!id) return []

  const response = await http.get(`/preschool/students/${encodeURIComponent(id)}/health/check-logs`, {
    params: buildQueryParams(filters),
  })

  return normalizeListResponse(response)
}

export async function saveStudentHealthCheck(studentId, payload = {}) {
  const checkId = resolveId(payload)
  return checkId
    ? updateRecord(studentId, 'check-logs', checkId, payload)
    : createRecord(studentId, 'check-logs', payload)
}

export async function deleteStudentHealthCheck(studentId, checkId) {
  return deleteRecord(studentId, 'check-logs', checkId)
}

export { normalizeHealthRecord, normalizeSummary }

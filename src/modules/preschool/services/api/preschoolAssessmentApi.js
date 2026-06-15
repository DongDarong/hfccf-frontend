// Canonical Preschool assessment API.
//
// This module owns the real HTTP contract for Preschool assessments and
// progress summaries. Legacy student-assessment imports stay available through
// a compatibility wrapper so older call sites can migrate without changing the
// visible workflow.
import http from '@/services/http'
import { buildQueryParams, unwrapApiData, unwrapApiItems, unwrapApiPagination } from '@/services/api'
import { normalizePerPage } from '@/modules/sport/services/api/sportApiUtils'
import {
  normalizeAssessment,
  normalizeAssessmentCategory,
  normalizeProgressSummary,
} from './preschoolAssessmentMappers'

export {
  normalizeAssessment,
  normalizeAssessmentCategory,
  normalizeProgressSummary,
}

function normalizeAssessmentListResponse(response, fallbackPage = 1, fallbackPerPage = 10) {
  const items = unwrapApiItems(response)

  return {
    items: items.map(normalizeAssessment),
    pagination: unwrapApiPagination(response, fallbackPage, fallbackPerPage, items.length),
  }
}

function normalizeCategoryListResponse(response) {
  const items = unwrapApiItems(response)

  return items.map(normalizeAssessmentCategory)
}

export async function fetchAssessmentCategories(options = {}) {
  const response = await http.get('/preschool/assessment-categories', {
    signal: options.signal,
  })

  return normalizeCategoryListResponse(response)
}

export async function fetchStudentAssessments(studentId, params = {}, options = {}) {
  // Clamp page size here so Preschool list views never exceed the backend
  // limit and start returning validation errors on larger teacher/admin queries.
  const perPage = normalizePerPage(params.perPage ?? params.per_page, 10, 100)

  const response = await http.get(`/preschool/students/${encodeURIComponent(studentId)}/assessments`, {
    params: buildQueryParams({
      page: params.page ?? 1,
      per_page: perPage,
      status: params.status || '',
      category_id: params.categoryId || '',
      period_label: params.periodLabel || '',
      search: params.search || '',
      sort_by: params.sortBy || 'assessment_date',
      sort_direction: params.sortDirection || 'desc',
      class_id: params.classId || '',
    }),
    signal: options.signal,
  })

  return normalizeAssessmentListResponse(response, params.page ?? 1, perPage)
}

export async function createStudentAssessment(studentId, payload = {}) {
  const response = await http.post(`/preschool/students/${encodeURIComponent(studentId)}/assessments`, payload)
  const data = unwrapApiData(response) || {}

  return normalizeAssessment(data.assessment || data)
}

export async function fetchAssessment(assessmentId, options = {}) {
  const response = await http.get(`/preschool/assessments/${encodeURIComponent(assessmentId)}`, {
    signal: options.signal,
  })
  const data = unwrapApiData(response) || {}

  return normalizeAssessment(data.assessment || data)
}

export async function updateStudentAssessment(assessmentId, payload = {}) {
  const response = await http.put(`/preschool/assessments/${encodeURIComponent(assessmentId)}`, payload)
  const data = unwrapApiData(response) || {}

  return normalizeAssessment(data.assessment || data)
}

export async function finalizeStudentAssessment(assessmentId) {
  const response = await http.post(`/preschool/assessments/${encodeURIComponent(assessmentId)}/finalize`)
  const data = unwrapApiData(response) || {}

  return normalizeAssessment(data.assessment || data)
}

export async function archiveStudentAssessment(assessmentId) {
  const response = await http.post(`/preschool/assessments/${encodeURIComponent(assessmentId)}/archive`)
  const data = unwrapApiData(response) || {}

  return normalizeAssessment(data.assessment || data)
}

export function prepareAssessmentData(data) {
  return {
    class_id: data.classId,
    category_id: data.categoryId,
    period_label: data.periodLabel,
    assessment_date: data.assessmentDate,
    score: data.score,
    rating: data.rating,
    observation: data.observation,
    teacher_comment: data.teacherComment,
  }
}

export async function fetchProgressSummary(studentId, options = {}) {
  const response = await http.get(`/preschool/students/${encodeURIComponent(studentId)}/progress-summary`, {
    signal: options.signal,
  })

  return normalizeProgressSummary(unwrapApiData(response) || {})
}

// ---------------------------------------------------------------------------
// Compatibility aliases
// ---------------------------------------------------------------------------
//
// The older assessment store/composable stack expects the shorter legacy
// helper names. Keep them here so the canonical module can satisfy both the
// new code path and compatibility imports during the cleanup phase.
export const normalizeCategory = normalizeAssessmentCategory
export const updateAssessment = updateStudentAssessment
export const finalizeAssessment = finalizeStudentAssessment
export const archiveAssessment = archiveStudentAssessment

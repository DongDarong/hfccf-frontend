import http from '@/services/http'

const BASE = '/preschool'

/**
 * Preschool Student Assessment API Service
 *
 * Handles all API calls for student assessments including:
 * - Listing, creating, updating assessments
 * - Finalizing (locking) assessments
 * - Archiving assessments
 * - Fetching assessment categories
 */

/**
 * List assessments for a student
 * @param {number|string} studentId - The student ID
 * @param {Object} params - Query parameters (page, perPage, class_id, category_id, status, etc.)
 * @returns {Promise} Response with paginated assessments
 */
export async function fetchStudentAssessments(studentId, params = {}) {
  const response = await http.get(`${BASE}/students/${studentId}/assessments`, { params })
  return response.data.data
}

/**
 * Get a single assessment
 * @param {number|string} assessmentId - The assessment ID
 * @returns {Promise} Assessment detail
 */
export async function fetchAssessment(assessmentId) {
  const response = await http.get(`${BASE}/assessments/${assessmentId}`)
  return response.data.data
}

/**
 * Create a new assessment
 * @param {number|string} studentId - The student ID
 * @param {Object} data - Assessment data (class_id, category_id, period_label, assessment_date, score, rating, observation, teacher_comment)
 * @returns {Promise} Created assessment
 */
export async function createStudentAssessment(studentId, data) {
  const response = await http.post(`${BASE}/students/${studentId}/assessments`, data)
  return response.data.data
}

/**
 * Update an existing assessment
 * @param {number|string} assessmentId - The assessment ID
 * @param {Object} data - Updated assessment data
 * @returns {Promise} Updated assessment
 */
export async function updateStudentAssessment(assessmentId, data) {
  const response = await http.put(`${BASE}/assessments/${assessmentId}`, data)
  return response.data.data
}

/**
 * Finalize (lock) an assessment - makes it immutable
 * @param {number|string} assessmentId - The assessment ID
 * @returns {Promise} Finalized assessment
 */
export async function finalizeStudentAssessment(assessmentId) {
  const response = await http.post(`${BASE}/assessments/${assessmentId}/finalize`)
  return response.data.data
}

/**
 * Archive an assessment (soft delete)
 * @param {number|string} assessmentId - The assessment ID
 * @returns {Promise} Archived assessment
 */
export async function archiveStudentAssessment(assessmentId) {
  const response = await http.post(`${BASE}/assessments/${assessmentId}/archive`)
  return response.data.data
}

/**
 * Fetch assessment categories
 * @returns {Promise} Array of assessment categories
 */
export async function fetchAssessmentCategories() {
  const response = await http.get(`${BASE}/assessment-categories`)
  return response.data.data || []
}

/**
 * Helper function to normalize assessment response from API
 * Converts snake_case to camelCase for frontend consistency
 * @param {Object} assessment - Raw assessment from API
 * @returns {Object} Normalized assessment
 */
export function normalizeAssessment(assessment) {
  if (!assessment) return null

  return {
    id: assessment.id,
    studentId: assessment.student_id,
    classId: assessment.class_id,
    categoryId: assessment.category_id,
    assessedByUserId: assessment.assessed_by_user_id,
    periodLabel: assessment.period_label,
    academicYearId: assessment.academic_year_id,
    termId: assessment.term_id,
    assessmentDate: assessment.assessment_date,
    score: assessment.score,
    rating: assessment.rating,
    observation: assessment.observation,
    teacherComment: assessment.teacher_comment,
    status: assessment.status,
    finalizedAt: assessment.finalized_at,
    finalizedByUserId: assessment.finalized_by_user_id,
    createdAt: assessment.created_at,
    updatedAt: assessment.updated_at,

    // Related data
    student: assessment.student ? {
      id: assessment.student.id,
      fullName: assessment.student.full_name,
      studentCode: assessment.student.student_code,
      publicId: assessment.student.public_id,
    } : null,

    class: assessment.class ? {
      id: assessment.class.id,
      code: assessment.class.code,
      name: assessment.class.name,
    } : null,

    category: assessment.category ? {
      id: assessment.category.id,
      name: assessment.category.name,
      code: assessment.category.code,
    } : null,

    assessedBy: assessment.assessed_by ? {
      id: assessment.assessed_by.id,
      name: assessment.assessed_by.name,
    } : null,

    finalizedBy: assessment.finalized_by ? {
      id: assessment.finalized_by.id,
      name: assessment.finalized_by.name,
    } : null,
  }
}

/**
 * Helper function to normalize category response
 * @param {Object} category - Raw category from API
 * @returns {Object} Normalized category
 */
export function normalizeCategory(category) {
  if (!category) return null

  return {
    id: category.id,
    preschoolId: category.preschool_id,
    name: category.name,
    code: category.code,
    description: category.description,
    isActive: category.is_active,
    colorCode: category.color_code,
    weight: category.weight,
  }
}

/**
 * Helper to prepare data for API submission (camelCase to snake_case)
 * @param {Object} data - Form data with camelCase keys
 * @returns {Object} API-ready data with snake_case keys
 */
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

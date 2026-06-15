// Legacy compatibility wrapper.
//
// The canonical Preschool assessment API now lives in
// `preschoolAssessmentApi.js`. Keep this module as a shim so older imports do
// not break while the Preschool assessment stack finishes consolidating.
export {
  archiveAssessment,
  createStudentAssessment,
  finalizeAssessment,
  fetchAssessment,
  fetchAssessmentCategories,
  fetchProgressSummary,
  fetchStudentAssessments,
  normalizeAssessment,
  normalizeCategory,
  prepareAssessmentData,
  updateAssessment,
  updateStudentAssessment,
} from './preschoolAssessmentApi'

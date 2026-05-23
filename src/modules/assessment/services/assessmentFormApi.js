import api from '@/services/api'

const BASE = '/assessment/forms'

export const assessmentFormApi = {
  list: (params) => api.get(BASE, { params }),
  get: (id) => api.get(`${BASE}/${id}`),
  create: (data) => api.post(BASE, data),
  update: (id, data) => api.put(`${BASE}/${id}`, data),
  delete: (id) => api.delete(`${BASE}/${id}`),
  publish: (id) => api.post(`${BASE}/${id}/publish`),
  duplicate: (id) => api.post(`${BASE}/${id}/duplicate`),
  archive: (id) => api.post(`${BASE}/${id}/archive`),

  // Sections
  listSections: (formId) => api.get(`${BASE}/${formId}/sections`),
  createSection: (formId, data) => api.post(`${BASE}/${formId}/sections`, data),
  updateSection: (formId, sectionId, data) => api.put(`${BASE}/${formId}/sections/${sectionId}`, data),
  deleteSection: (formId, sectionId) => api.delete(`${BASE}/${formId}/sections/${sectionId}`),
  reorderSections: (formId, data) => api.post(`${BASE}/${formId}/sections/reorder`, data),

  // Questions
  listQuestions: (formId) => api.get(`${BASE}/${formId}/questions`),
  createQuestion: (formId, data) => api.post(`${BASE}/${formId}/questions`, data),
  getQuestion: (formId, questionId) => api.get(`${BASE}/${formId}/questions/${questionId}`),
  updateQuestion: (formId, questionId, data) => api.put(`${BASE}/${formId}/questions/${questionId}`, data),
  deleteQuestion: (formId, questionId) => api.delete(`${BASE}/${formId}/questions/${questionId}`),
  duplicateQuestion: (formId, questionId) => api.post(`${BASE}/${formId}/questions/${questionId}/duplicate`),
  reorderQuestions: (formId, data) => api.post(`${BASE}/${formId}/questions/reorder`, data),

  // Scoring
  getScoring: (formId) => api.get(`${BASE}/${formId}/scoring`),
  updateScoring: (formId, data) => api.put(`${BASE}/${formId}/scoring`, data),
}

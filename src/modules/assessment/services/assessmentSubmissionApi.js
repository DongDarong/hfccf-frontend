import api from '@/services/api'

const BASE = '/assessment/submissions'

export const assessmentSubmissionApi = {
  list: (params) => api.get(BASE, { params }),
  get: (id) => api.get(`${BASE}/${id}`),
  create: (data) => api.post(BASE, data),
  update: (id, data) => api.put(`${BASE}/${id}`, data),
  submit: (id) => api.post(`${BASE}/${id}/submit`),
  review: (id, data) => api.post(`${BASE}/${id}/review`, data),
  delete: (id) => api.delete(`${BASE}/${id}`),
}

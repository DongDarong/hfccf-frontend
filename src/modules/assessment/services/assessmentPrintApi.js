import api from '@/services/api'

const BASE = '/assessment/print-templates'

export const assessmentPrintApi = {
  list: (params) => api.get(BASE, { params }),
  get: (id) => api.get(`${BASE}/${id}`),
  create: (data) => api.post(BASE, data),
  update: (id, data) => api.put(`${BASE}/${id}`, data),
  delete: (id) => api.delete(`${BASE}/${id}`),
  print: (submissionId, templateId) =>
    api.post(`/assessment/submissions/${submissionId}/print`, { template_id: templateId }),
}

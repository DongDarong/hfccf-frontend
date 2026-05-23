import api from '@/services/api'

const BASE = '/assessment/reports'

export const assessmentReportApi = {
  dashboard: (params) => api.get(`${BASE}/dashboard`, { params }),
  riskDistribution: (params) => api.get(`${BASE}/risk-distribution`, { params }),
  submissionTrend: (params) => api.get(`${BASE}/submission-trend`, { params }),
  auditLogs: (params) => api.get('/assessment/audit-logs', { params }),
  export: (params) => api.get(`${BASE}/export`, { params, responseType: 'blob' }),
}

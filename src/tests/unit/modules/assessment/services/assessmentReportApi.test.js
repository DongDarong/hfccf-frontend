import { beforeEach, describe, expect, it, vi } from 'vitest'
import http from '@/services/http'
import { assessmentReportApi } from '@/modules/assessment/services/assessmentReportApi'

vi.mock('@/services/http', () => ({
  default: {
    get: vi.fn(),
  },
}))

function ok(data) {
  return { data: { success: true, data } }
}

beforeEach(() => vi.clearAllMocks())

describe('assessmentReportApi', () => {
  it('dashboard passes params to GET /assessment/reports/dashboard', async () => {
    http.get.mockResolvedValueOnce(ok({ kpi: {} }))
    await assessmentReportApi.dashboard({ module: 'preschool' })
    expect(http.get).toHaveBeenCalledWith('/assessment/reports/dashboard', {
      params: { module: 'preschool' },
    })
  })

  it('riskDistribution passes params to correct endpoint', async () => {
    http.get.mockResolvedValueOnce(ok([]))
    await assessmentReportApi.riskDistribution({ academic_year_id: 2 })
    expect(http.get).toHaveBeenCalledWith('/assessment/reports/risk-distribution', {
      params: { academic_year_id: 2 },
    })
  })

  it('submissionTrend passes params to correct endpoint', async () => {
    http.get.mockResolvedValueOnce(ok([]))
    await assessmentReportApi.submissionTrend({ months: 6 })
    expect(http.get).toHaveBeenCalledWith('/assessment/reports/submission-trend', {
      params: { months: 6 },
    })
  })

  it('auditLogs passes params to /assessment/audit-logs', async () => {
    http.get.mockResolvedValueOnce(ok([]))
    await assessmentReportApi.auditLogs({ user_id: 3 })
    expect(http.get).toHaveBeenCalledWith('/assessment/audit-logs', {
      params: { user_id: 3 },
    })
  })

  it('export requests blob response type', async () => {
    http.get.mockResolvedValueOnce(new Blob())
    await assessmentReportApi.export({ format: 'csv' })
    expect(http.get).toHaveBeenCalledWith('/assessment/reports/export', {
      params: { format: 'csv' },
      responseType: 'blob',
    })
  })
})

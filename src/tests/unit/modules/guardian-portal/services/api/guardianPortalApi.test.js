import { beforeEach, describe, expect, it, vi } from 'vitest'
import http from '@/services/http'
import {
  activateGuardianPortalInvitation,
  fetchGuardianAttendanceSummary,
  fetchGuardianPortalMe,
  fetchGuardianPortalStudent,
  fetchGuardianPortalStudents,
  fetchGuardianProgressSummary,
  fetchGuardianReports,
  fetchGuardianScheduleSummary,
} from '@/modules/guardian-portal/services/api/guardianPortalApi'

// Keep the guardian portal API contract tested so the portal never drifts to
// wrong endpoints or unbounded child-summary requests.
vi.mock('@/services/http', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

function stubResponse(data) {
  return { data: { success: true, message: 'ok', data } }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('guardian portal api', () => {
  it('calls the activation and profile endpoints', async () => {
    http.post.mockResolvedValueOnce(
      stubResponse({
        token: 'token-123',
        user: { id: 'usr_guardian_1', role: 'guardian' },
        account: { id: 1, guardian_id: 11, status: 'active', email: 'guardian@hfccf.org' },
      }),
    )

    await expect(activateGuardianPortalInvitation({ token: 'token-123', password: 'Secret123!' })).resolves.toMatchObject({
      token: 'token-123',
    })
    expect(http.post).toHaveBeenCalledWith('/guardian-portal/activate', {
      token: 'token-123',
      password: 'Secret123!',
    })

    http.get.mockResolvedValueOnce(stubResponse({ guardian: { id: 11 }, account: { id: 1 } }))
    await fetchGuardianPortalMe()
    expect(http.get).toHaveBeenCalledWith('/guardian-portal/me', { signal: undefined })
  })

  it('covers read-only child summary endpoints', async () => {
    http.get.mockResolvedValueOnce(stubResponse({ items: [] }))
    await fetchGuardianPortalStudents()
    expect(http.get).toHaveBeenCalledWith('/guardian-portal/students', { signal: undefined })

    http.get.mockResolvedValueOnce(stubResponse({ summary: { attendanceCount: 2 } }))
    await fetchGuardianPortalStudent(10)
    expect(http.get).toHaveBeenCalledWith('/guardian-portal/students/10', { signal: undefined })

    http.get.mockResolvedValueOnce(stubResponse({ summary: { attendanceCount: 2 } }))
    await fetchGuardianAttendanceSummary(10)
    expect(http.get).toHaveBeenCalledWith('/guardian-portal/students/10/attendance-summary', { signal: undefined })

    http.get.mockResolvedValueOnce(stubResponse({ summary: { scheduleCount: 2 } }))
    await fetchGuardianScheduleSummary(10)
    expect(http.get).toHaveBeenCalledWith('/guardian-portal/students/10/schedule-summary', { signal: undefined })

    http.get.mockResolvedValueOnce(stubResponse({ summary: { progressCount: 2 } }))
    await fetchGuardianProgressSummary(10)
    expect(http.get).toHaveBeenCalledWith('/guardian-portal/students/10/progress-summary', { signal: undefined })

    http.get.mockResolvedValueOnce(stubResponse({ summary: { reportCount: 2 } }))
    await fetchGuardianReports(10)
    expect(http.get).toHaveBeenCalledWith('/guardian-portal/students/10/reports', { signal: undefined })
  })
})

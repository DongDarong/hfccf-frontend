import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { usePreschoolGuardianIntegrity } from '@/modules/preschool/composables/usePreschoolGuardianIntegrity'
import {
  fetchGuardianConsistencyReport,
  fetchGuardianDuplicates,
} from '@/modules/preschool/services/api/preschoolGuardianIntegrityApi'

// Keep the integrity composable tested so the page can refresh report data
// without coupling view logic to the raw API contract.
// Mock the language helper here because the composable only needs the
// translation fallback path and the test should not depend on a mounted I18n
// provider to verify the data-loading contract.
vi.mock('@/composables/useLanguage', () => ({
  useLanguage: () => ({
    t: (key) => key,
  }),
}))

vi.mock('@/modules/preschool/services/api/preschoolGuardianIntegrityApi', () => ({
  fetchGuardianConsistencyReport: vi.fn(),
  fetchGuardianDuplicates: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('usePreschoolGuardianIntegrity', () => {
  it('loads and normalizes report data', async () => {
    fetchGuardianConsistencyReport.mockResolvedValueOnce({
      summary: { issueCount: 1, criticalCount: 1, warningCount: 0, infoCount: 0 },
      items: [{ id: 'issue-1', type: 'student_no_active_guardian', severity: 'critical', title: 'x', message: 'y' }],
    })
    fetchGuardianDuplicates.mockResolvedValueOnce({
      summary: { candidateGroups: 1, matchedGuardians: 2, strongSignalGroups: 1, reviewRecommended: true },
      items: [{ guardianIds: [1, 2], signals: ['same_phone'], severity: 'warning' }],
    })

    const { duplicates, loadIntegrityData, loading, report } = usePreschoolGuardianIntegrity()

    const promise = loadIntegrityData()
    expect(loading.value).toBe(true)
    await promise
    await nextTick()

    expect(loading.value).toBe(false)
    expect(report.value.summary.issueCount).toBe(1)
    expect(duplicates.value.summary.candidateGroups).toBe(1)
    expect(fetchGuardianConsistencyReport).toHaveBeenCalledOnce()
    expect(fetchGuardianDuplicates).toHaveBeenCalledOnce()
  })
})

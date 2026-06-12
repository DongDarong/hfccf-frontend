import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePreschoolProgressSummary } from '@/modules/preschool/composables/usePreschoolProgressSummary'

const mockFetchProgressSummary = vi.fn()

vi.mock('@/composables/useLanguage', () => ({
  useLanguage: () => ({
    t: (key) => key,
    te: () => true,
    tm: () => ({}),
    language: { value: 'en' },
    setLanguage: () => {},
  }),
}))

vi.mock('@/modules/preschool/services/api/preschoolAssessmentApi', () => ({
  fetchProgressSummary: (...args) => mockFetchProgressSummary(...args),
}))

// Keep the progress summary composable covered so finalized assessment trends
// stay readable and the summary page does not regress into an uncaught fetch
// error when the backend contract changes.
beforeEach(() => {
  vi.clearAllMocks()
})

describe('usePreschoolProgressSummary', () => {
  it('loads and normalizes the progress summary payload', async () => {
    mockFetchProgressSummary.mockResolvedValueOnce({
      summary: { totalAssessments: 3, finalizedAssessments: 2, draftAssessments: 1, averageScore: 88 },
      categories: [{ category: { id: 1, code: 'learning_progress', name: 'Learning Progress' }, count: 2 }],
      recentAssessments: [{ id: 7, studentId: 5, status: 'finalized' }],
    })

    const summary = usePreschoolProgressSummary()
    await summary.loadProgressSummary(5)

    expect(mockFetchProgressSummary).toHaveBeenCalledWith('5')
    expect(summary.loading.value).toBe(false)
    expect(summary.summary.value).toMatchObject({ totalAssessments: 3, finalizedAssessments: 2 })
    expect(summary.categories.value).toHaveLength(1)
    expect(summary.recentAssessments.value).toHaveLength(1)
    expect(summary.errorMessage.value).toBe('')
  })

  it('stays safe when the student id is missing', async () => {
    const summary = usePreschoolProgressSummary()
    await summary.loadProgressSummary('')

    expect(mockFetchProgressSummary).not.toHaveBeenCalled()
    expect(summary.summary.value).toEqual({})
    expect(summary.categories.value).toEqual([])
    expect(summary.recentAssessments.value).toEqual([])
  })
})

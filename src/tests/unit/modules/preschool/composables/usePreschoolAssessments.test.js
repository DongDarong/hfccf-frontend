// Keep the Preschool assessment composable covered so draft/finalize flows and
// teacher-scoped lookup loading cannot drift away from the backend contract.
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { usePreschoolAssessments } from '@/modules/preschool/composables/usePreschoolAssessments'

const mockGetCurrentUser = vi.fn()
const mockFetchAssessmentCategories = vi.fn()
const mockFetchStudentAssessments = vi.fn()
const mockCreateStudentAssessment = vi.fn()
const mockUpdateAssessment = vi.fn()
const mockFinalizeAssessment = vi.fn()
const mockArchiveAssessment = vi.fn()
const mockFetchMyPreschoolStudents = vi.fn()
const mockFetchMyPreschoolClasses = vi.fn()
const mockFetchPreschoolStudents = vi.fn()
const mockFetchPreschoolClasses = vi.fn()

vi.mock('@/services/auth', () => ({
  getCurrentUser: () => mockGetCurrentUser(),
}))

vi.mock('@/modules/preschool/services/api/preschoolAssessmentApi', () => ({
  fetchAssessmentCategories: (...args) => mockFetchAssessmentCategories(...args),
  fetchStudentAssessments: (...args) => mockFetchStudentAssessments(...args),
  createStudentAssessment: (...args) => mockCreateStudentAssessment(...args),
  updateAssessment: (...args) => mockUpdateAssessment(...args),
  finalizeAssessment: (...args) => mockFinalizeAssessment(...args),
  archiveAssessment: (...args) => mockArchiveAssessment(...args),
}))

vi.mock('@/modules/preschool/services/preschoolApi', () => ({
  fetchMyPreschoolStudents: (...args) => mockFetchMyPreschoolStudents(...args),
  fetchMyPreschoolClasses: (...args) => mockFetchMyPreschoolClasses(...args),
  fetchPreschoolStudents: (...args) => mockFetchPreschoolStudents(...args),
  fetchPreschoolClasses: (...args) => mockFetchPreschoolClasses(...args),
}))

function resetMocks() {
  vi.clearAllMocks()

  mockFetchAssessmentCategories.mockResolvedValue([{ id: 1, name: 'Learning Progress' }])
  mockFetchStudentAssessments.mockResolvedValue({
    items: [{ id: 11, periodLabel: 'Term 1', status: 'draft' }],
    pagination: { page: 1, perPage: 10, total: 1, totalPages: 1 },
  })
  mockCreateStudentAssessment.mockResolvedValue({ id: 21 })
  mockUpdateAssessment.mockResolvedValue({ id: 21 })
  mockFinalizeAssessment.mockResolvedValue({ id: 21 })
  mockArchiveAssessment.mockResolvedValue({ id: 21 })
  mockFetchMyPreschoolStudents.mockResolvedValue({
    items: [{ id: 7, fullName: 'Teacher Student', studentCode: 'S-007' }],
    pagination: { page: 1, perPage: 100, total: 1, totalPages: 1 },
  })
  mockFetchMyPreschoolClasses.mockResolvedValue({
    items: [{ id: 3, code: 'PS-3', name: 'Morning Class' }],
    pagination: { page: 1, perPage: 100, total: 1, totalPages: 1 },
  })
  mockFetchPreschoolStudents.mockResolvedValue({
    items: [{ id: 8, fullName: 'Admin Student', studentCode: 'S-008' }],
    pagination: { page: 1, perPage: 100, total: 1, totalPages: 1 },
  })
  mockFetchPreschoolClasses.mockResolvedValue({
    items: [{ id: 4, code: 'PS-4', name: 'Afternoon Class' }],
    pagination: { page: 1, perPage: 100, total: 1, totalPages: 1 },
  })
}

beforeEach(() => {
  resetMocks()
})

describe('usePreschoolAssessments', () => {
  it('loads teacher-scoped lookup data and preserves the first student selection', async () => {
    mockGetCurrentUser.mockReturnValue({ role: 'teacher-preschool' })

    const assessment = usePreschoolAssessments()
    await assessment.loadLookupData()
    await nextTick()

    expect(assessment.isTeacher.value).toBe(true)
    expect(mockFetchAssessmentCategories).toHaveBeenCalled()
    expect(mockFetchMyPreschoolStudents).toHaveBeenCalledWith({ page: 1, perPage: 100 })
    expect(mockFetchMyPreschoolClasses).toHaveBeenCalledWith({ page: 1, perPage: 100 })
    expect(assessment.selectedStudentId.value).toBe('7')
    expect(assessment.studentOptions.value[0]).toMatchObject({ label: 'Teacher Student (S-007)', value: 7 })
  })

  it('loads assessments and runs lifecycle mutations with the shared backend contract', async () => {
    mockGetCurrentUser.mockReturnValue({ role: 'adminpreschool' })

    const assessment = usePreschoolAssessments()
    await assessment.loadLookupData()
    await assessment.loadAssessments(8, {
      page: 2,
      perPage: 20,
      status: 'draft',
      categoryId: 1,
      periodLabel: 'Term 2',
      search: 'growth',
      classId: 4,
    })

    expect(mockFetchPreschoolStudents).toHaveBeenCalledWith({ page: 1, perPage: 100 })
    expect(mockFetchPreschoolClasses).toHaveBeenCalledWith({ page: 1, perPage: 100 })
    expect(mockFetchStudentAssessments).toHaveBeenCalledWith('8', {
      page: 2,
      perPage: 20,
      status: 'draft',
      categoryId: 1,
      periodLabel: 'Term 2',
      search: 'growth',
      classId: 4,
      sortBy: 'assessment_date',
      sortDirection: 'desc',
    })

    await assessment.saveAssessment(8, { category_id: 1, period_label: 'Term 2' })
    await assessment.finalizeAssessmentById(21)
    await assessment.archiveAssessmentById(21)

    expect(mockCreateStudentAssessment).toHaveBeenCalledWith('8', { category_id: 1, period_label: 'Term 2' })
    expect(mockFinalizeAssessment).toHaveBeenCalledWith(21)
    expect(mockArchiveAssessment).toHaveBeenCalledWith(21)
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enCommon from '@/i18n/en/common'
import enPreschool from '@/i18n/en/preschool'
import khPreschool from '@/i18n/kh/preschool'
import StudentAssessments from '@/modules/preschool/admin/pages/StudentAssessments.vue'
import AddAssessment from '@/modules/preschool/admin/pages/AddAssessment.vue'
import ProgressSummary from '@/modules/preschool/admin/pages/ProgressSummary.vue'

// Keep the assessment pages mount-tested so the new draft/finalize workflow
// stays aligned with the backend contract and cannot regress into hidden runtime
// errors when the page structure changes later.
const mockLoadLookupData = vi.fn(() => Promise.resolve())
const mockLoadAssessments = vi.fn(() => Promise.resolve())
const mockSaveAssessment = vi.fn(() => Promise.resolve({ id: 21 }))
const mockFinalizeAssessmentById = vi.fn(() => Promise.resolve({ id: 21 }))
const mockArchiveAssessmentById = vi.fn(() => Promise.resolve({ id: 21 }))
const mockLoadProgressSummary = vi.fn(() => Promise.resolve())

vi.mock('@/modules/preschool/composables/usePreschoolAssessments', () => ({
  usePreschoolAssessments: () => ({
    assessmentItems: { value: [{ id: 11, periodLabel: 'Term 1', studentName: 'Alice Student', status: 'draft' }] },
    archiveAssessmentById: mockArchiveAssessmentById,
    categoryOptions: { value: [{ id: 1, name: 'Learning Progress' }] },
    classOptions: { value: [{ id: 3, label: 'PS-3 - Morning Class', value: 3 }] },
    errorMessage: { value: '' },
    finalizeAssessmentById: mockFinalizeAssessmentById,
    isTeacher: { value: false },
    loadAssessments: mockLoadAssessments,
    loadCategories: vi.fn(),
    loadClasses: vi.fn(),
    loadLookupData: mockLoadLookupData,
    loadStudents: vi.fn(),
    loading: { value: false },
    pagination: { value: { page: 1, perPage: 10, total: 1, totalPages: 1 } },
    saveAssessment: mockSaveAssessment,
    searchQuery: { value: '' },
    selectedCategoryId: { value: '' },
    selectedClassId: { value: '' },
    selectedPeriodLabel: { value: '' },
    selectedStatus: { value: '' },
    selectedStudentId: { value: '7' },
    setSelectedClassId: vi.fn(),
    setSelectedCategoryId: vi.fn(),
    setSelectedPeriodLabel: vi.fn(),
    setSelectedStatus: vi.fn(),
    setSelectedStudentId: vi.fn(),
    setSearchQuery: vi.fn(),
    saving: { value: false },
    studentOptions: { value: [{ id: 7, label: 'Teacher Student (S-007)', value: 7 }] },
  }),
}))

vi.mock('@/modules/preschool/composables/usePreschoolProgressSummary', () => ({
  usePreschoolProgressSummary: () => ({
    categories: { value: [{ category: { id: 1, code: 'learning_progress', name: 'Learning Progress' }, count: 2, averageScore: 90 }] },
    errorMessage: { value: '' },
    loadProgressSummary: mockLoadProgressSummary,
    loading: { value: false },
    recentAssessments: { value: [{ id: 31, periodLabel: 'Term 1', categoryName: 'Learning Progress', assessmentDate: '2026-05-19', score: 90 }] },
    summary: { value: { totalAssessments: 4, finalizedAssessments: 2, draftAssessments: 1, averageScore: 86.5 } },
  }),
}))

function stubs() {
  return {
    MainLayout: { template: '<div><slot /></div>' },
    HeaderSection: { props: ['title', 'subtitle'], template: '<header><h1>{{ title }}</h1><p>{{ subtitle }}</p></header>' },
    Button: { template: '<button><slot /></button>' },
    Dropdown: { template: '<div class="dropdown-stub" />' },
    InputText: { template: '<div class="input-stub" />' },
    Dialog: { template: '<div class="dialog-stub"><slot /></div>' },
    AssessmentList: { template: '<div class="assessment-list-stub" />' },
    AssessmentForm: { props: ['submitLabel'], template: '<form class="assessment-form-stub">{{ submitLabel }}<slot /></form>' },
    ProgressSummaryCard: { props: ['title'], template: '<div class="summary-card-stub">{{ title }}</div>' },
    ProgressTrendList: { template: '<div class="trend-list-stub" />' },
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Preschool assessment pages', () => {
  it('mounts the assessment list page and keeps the workflow stable', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const wrapper = mountWithPlugins(StudentAssessments, {
      messages: {
        en: { common: enCommon, ...enPreschool },
        kh: { common: enCommon, ...khPreschool },
      },
      global: {
        stubs: stubs(),
      },
    })

    await flushPromises()

    expect(mockLoadLookupData).toHaveBeenCalled()
    expect(mockLoadAssessments).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Assessment Tracker')
    expect(wrapper.text()).toContain('Add Assessment')
    expect(wrapper.text()).toContain('Progress Summary')
    expect(warnSpy).not.toHaveBeenCalled()
    expect(errorSpy).not.toHaveBeenCalled()
  })

  it('mounts the add assessment page and wires the draft form flow', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const wrapper = mountWithPlugins(AddAssessment, {
      messages: {
        en: { common: enCommon, ...enPreschool },
        kh: { common: enCommon, ...khPreschool },
      },
      global: {
        stubs: stubs(),
      },
    })

    await flushPromises()

    expect(mockLoadLookupData).toHaveBeenCalled()
    expect(mockLoadAssessments).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Add Assessment')
    expect(wrapper.text()).toContain('Save Draft')
    expect(wrapper.text()).toContain('Back')
    expect(warnSpy).not.toHaveBeenCalled()
    expect(errorSpy).not.toHaveBeenCalled()
  })

  it('mounts the progress summary page with localized summary data', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const wrapper = mountWithPlugins(ProgressSummary, {
      messages: {
        en: { common: enCommon, ...enPreschool },
        kh: { common: enCommon, ...khPreschool },
      },
      global: {
        stubs: stubs(),
      },
    })

    await flushPromises()

    expect(mockLoadLookupData).toHaveBeenCalled()
    expect(mockLoadProgressSummary).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Progress Summary')
    expect(wrapper.text()).toContain('Recent finalized assessments')
    expect(warnSpy).not.toHaveBeenCalled()
    expect(errorSpy).not.toHaveBeenCalled()
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enCommon from '@/i18n/en/common'
import enPreschool from '@/i18n/en/preschool'
import AssessmentFormBuilderPage from '@/modules/preschool/admin/pages/assessments/AssessmentFormBuilderPage.vue'
import { PRESCHOOL_ASSESSMENT_FORM_BUILDER_SECTION_QUESTION_SEEDS } from '@/modules/preschool/admin/pages/assessments/constants/preschoolAssessmentFormBuilder'

const mockFetchAssessmentForm = vi.fn(() => Promise.resolve(null))
const mockFetchAssessmentFormVersions = vi.fn(() => Promise.resolve([]))
const mockFetchAssessmentQuestionTypes = vi.fn(() => Promise.resolve([]))
const mockCreateAssessmentForm = vi.fn(() => Promise.resolve({ id: 1 }))
const mockUpdateAssessmentForm = vi.fn(() => Promise.resolve({ id: 1 }))
const mockToastAdd = vi.fn()

vi.mock('@/modules/preschool/services/api/preschoolAssessmentApi', () => ({
  archiveAssessmentForm: vi.fn(() => Promise.resolve({})),
  buildFormTemplatePayload: vi.fn(() => ({})),
  createAssessmentForm: (...args) => mockCreateAssessmentForm(...args),
  duplicateAssessmentForm: vi.fn(() => Promise.resolve({ id: 1 })),
  fetchAssessmentForm: (...args) => mockFetchAssessmentForm(...args),
  fetchAssessmentFormVersions: (...args) => mockFetchAssessmentFormVersions(...args),
  fetchAssessmentQuestionTypes: (...args) => mockFetchAssessmentQuestionTypes(...args),
  publishAssessmentForm: vi.fn(() => Promise.resolve({})),
  restoreAssessmentForm: vi.fn(() => Promise.resolve({})),
  updateAssessmentForm: (...args) => mockUpdateAssessmentForm(...args),
}))

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({
    add: mockToastAdd,
  }),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

function stubs() {
  return {
    MainLayout: { template: '<div><slot /></div>' },
    HeaderSection: { props: ['title', 'subtitle'], template: '<header><h1>{{ title }}</h1><p>{{ subtitle }}</p></header>' },
    Button: { props: ['label'], emits: ['click'], template: '<button @click="$emit(\'click\')">{{ label }}</button>' },
    FormBuilderQuestionPalette: { template: '<div class="palette-stub" />' },
    FormBuilderCanvas: {
      props: ['sections', 'sectionQuestions', 'selectedSectionKey'],
      template:
        '<div class="canvas-stub">{{ Object.values(sectionQuestions || {}).reduce((total, items) => total + items.length, 0) }}</div>',
    },
    FormBuilderQuestionSettings: { template: '<div class="settings-stub" />' },
    AssessmentFormVersionReview: { template: '<div class="version-review-stub" />' },
    AssessmentPageHeader: { template: '<div class="page-header-stub" />' },
  }
}

describe('AssessmentFormBuilderPage', () => {
  it('mounts without TDZ errors and seeds the initial question map', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const expectedQuestionCount = Object.values(PRESCHOOL_ASSESSMENT_FORM_BUILDER_SECTION_QUESTION_SEEDS)
      .reduce((total, seeds) => total + seeds.length, 0)

    const wrapper = mountWithPlugins(AssessmentFormBuilderPage, {
      messages: {
        en: { common: enCommon, ...enPreschool },
      },
      global: {
        stubs: stubs(),
      },
    })

    await flushPromises()

    expect(mockFetchAssessmentQuestionTypes).toHaveBeenCalled()
    expect(mockFetchAssessmentForm).not.toHaveBeenCalled()
    expect(mockFetchAssessmentFormVersions).not.toHaveBeenCalled()
    expect(wrapper.find('.canvas-stub').text()).toContain(String(expectedQuestionCount))
    expect(warnSpy).not.toHaveBeenCalled()
    expect(errorSpy).not.toHaveBeenCalled()
  })

  it('shows a friendly toast when save draft validation fails', async () => {
    const validationError = new Error('Validation failed')
    validationError.response = { status: 422 }
    mockCreateAssessmentForm.mockRejectedValueOnce(validationError)

    const wrapper = mountWithPlugins(AssessmentFormBuilderPage, {
      messages: {
        en: { common: enCommon, ...enPreschool },
      },
      global: {
        stubs: stubs(),
      },
    })

    await flushPromises()

    const buttons = wrapper.findAll('button')
    const saveDraftButton = buttons.find(button => button.text().includes('Save Draft'))

    expect(saveDraftButton).toBeTruthy()

    await saveDraftButton.trigger('click')
    await flushPromises()

    expect(mockCreateAssessmentForm).toHaveBeenCalled()
    expect(mockToastAdd).toHaveBeenCalledWith(expect.objectContaining({
      severity: 'error',
      detail: expect.stringContaining('temporary IDs'),
    }))
    expect(wrapper.text()).toContain('temporary IDs')
  })
})

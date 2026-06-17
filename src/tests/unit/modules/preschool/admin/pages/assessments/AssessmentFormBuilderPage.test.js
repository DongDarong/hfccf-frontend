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

vi.mock('@/modules/preschool/services/api/preschoolAssessmentApi', () => ({
  archiveAssessmentForm: vi.fn(() => Promise.resolve({})),
  buildFormTemplatePayload: vi.fn(() => ({})),
  createAssessmentForm: vi.fn(() => Promise.resolve({ id: 1 })),
  duplicateAssessmentForm: vi.fn(() => Promise.resolve({ id: 1 })),
  fetchAssessmentForm: (...args) => mockFetchAssessmentForm(...args),
  fetchAssessmentFormVersions: (...args) => mockFetchAssessmentFormVersions(...args),
  fetchAssessmentQuestionTypes: (...args) => mockFetchAssessmentQuestionTypes(...args),
  publishAssessmentForm: vi.fn(() => Promise.resolve({})),
  restoreAssessmentForm: vi.fn(() => Promise.resolve({})),
  updateAssessmentForm: vi.fn(() => Promise.resolve({ id: 1 })),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

function stubs() {
  return {
    MainLayout: { template: '<div><slot /></div>' },
    HeaderSection: { props: ['title', 'subtitle'], template: '<header><h1>{{ title }}</h1><p>{{ subtitle }}</p></header>' },
    Button: { template: '<button><slot /></button>' },
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
})

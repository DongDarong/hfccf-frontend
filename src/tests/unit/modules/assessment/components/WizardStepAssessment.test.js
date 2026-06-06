import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { mountWithPlugins } from '../../../../helpers/mount'
import WizardStepAssessment from '@/modules/assessment/components/wizard/WizardStepAssessment.vue'

const mockStore = reactive({ selectedForm: null, answers: {}, setAnswer: vi.fn() })

vi.mock('@/modules/assessment/composables/useAssessmentWizard', () => ({
  useAssessmentWizard: () => ({ store: mockStore }),
}))

const mockListSections  = vi.fn()
const mockListQuestions = vi.fn()
vi.mock('@/modules/assessment/services/assessmentFormApi', () => ({
  assessmentFormApi: {
    listSections:  (...a) => mockListSections(...a),
    listQuestions: (...a) => mockListQuestions(...a),
  },
}))

const componentStubs = {
  QuestionRenderer: {
    props: ['question', 'modelValue'],
    template: '<div class="question-renderer">{{ question.question_text }}</div>',
  },
}

function mount() {
  return mountWithPlugins(WizardStepAssessment, { global: { stubs: componentStubs } })
}

beforeEach(() => {
  mockStore.selectedForm = null
  mockStore.answers = {}
  vi.clearAllMocks()
  mockListSections.mockResolvedValue({ data: { data: [] } })
  mockListQuestions.mockResolvedValue({ data: { data: [] } })
})

describe('WizardStepAssessment', () => {
  it('shows "No form selected" when selectedForm is null', async () => {
    const wrapper = mount()
    await flushPromises()
    expect(wrapper.text()).toContain('No form selected.')
  })

  it('calls listSections and listQuestions on mount when form is selected', async () => {
    mockStore.selectedForm = { id: 5 }
    mount()
    await flushPromises()
    expect(mockListSections).toHaveBeenCalledWith(5)
    expect(mockListQuestions).toHaveBeenCalledWith(5)
  })

  it('does not call APIs when no form is selected', async () => {
    mount()
    await flushPromises()
    expect(mockListSections).not.toHaveBeenCalled()
    expect(mockListQuestions).not.toHaveBeenCalled()
  })

  it('renders section titles', async () => {
    mockStore.selectedForm = { id: 5 }
    mockListSections.mockResolvedValue({ data: { data: [{ id: 1, title: 'Fine Motor', description: '' }] } })
    const wrapper = mount()
    await flushPromises()
    expect(wrapper.text()).toContain('Fine Motor')
  })

  it('renders section description when present', async () => {
    mockStore.selectedForm = { id: 5 }
    mockListSections.mockResolvedValue({ data: { data: [{ id: 1, title: 'Sec', description: 'Evaluate motor skills' }] } })
    const wrapper = mount()
    await flushPromises()
    expect(wrapper.text()).toContain('Evaluate motor skills')
  })

  it('renders questions grouped by section', async () => {
    mockStore.selectedForm = { id: 5 }
    mockListSections.mockResolvedValue({ data: { data: [{ id: 1, title: 'Section A' }] } })
    mockListQuestions.mockResolvedValue({ data: { data: [
      { id: 10, question_text: 'Can walk?', section_id: 1, order: 1 },
      { id: 11, question_text: 'Can run?',  section_id: 1, order: 2 },
    ]}})
    const wrapper = mount()
    await flushPromises()
    expect(wrapper.findAll('.question-renderer')).toHaveLength(2)
    expect(wrapper.text()).toContain('Can walk?')
    expect(wrapper.text()).toContain('Can run?')
  })

  it('excludes questions from other sections', async () => {
    mockStore.selectedForm = { id: 5 }
    mockListSections.mockResolvedValue({ data: { data: [{ id: 1, title: 'Section A' }] } })
    mockListQuestions.mockResolvedValue({ data: { data: [
      { id: 10, question_text: 'In section',     section_id: 1,  order: 1 },
      { id: 11, question_text: 'Not in section', section_id: 99, order: 1 },
    ]}})
    const wrapper = mount()
    await flushPromises()
    expect(wrapper.findAll('.question-renderer')).toHaveLength(1)
    expect(wrapper.text()).toContain('In section')
    expect(wrapper.text()).not.toContain('Not in section')
  })

  it('shows "No questions in this section" for empty sections', async () => {
    mockStore.selectedForm = { id: 5 }
    mockListSections.mockResolvedValue({ data: { data: [{ id: 1, title: 'Empty Section' }] } })
    const wrapper = mount()
    await flushPromises()
    expect(wrapper.text()).toContain('No questions in this section.')
  })

  it('shows "no sections" empty state when form has no sections', async () => {
    mockStore.selectedForm = { id: 5 }
    const wrapper = mount()
    await flushPromises()
    expect(wrapper.text()).toContain('This form has no sections.')
  })
})

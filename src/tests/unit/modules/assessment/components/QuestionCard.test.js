import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'
import { mountWithPlugins } from '../../../../helpers/mount'
import QuestionCard from '@/modules/assessment/components/form-builder/QuestionCard.vue'

const mockStore = reactive({
  template: { questions: [] },
})

vi.mock('@/modules/assessment/stores/useFormBuilderStore', () => ({
  useFormBuilderStore: () => mockStore,
}))

const mockDeleteQuestion = vi.fn()
vi.mock('@/modules/assessment/services/assessmentFormApi', () => ({
  assessmentFormApi: { deleteQuestion: (...a) => mockDeleteQuestion(...a) },
}))

const messages = {
  en: {
    formBuilder: {
      questions: { deleteQuestion: 'Delete question' },
      questionTypes: {
        short_text: 'Short Text',
        radio:      'Single Choice',
        date:       'Date',
      },
    },
  },
}

function makeQuestion(overrides = {}) {
  return {
    id:                 1,
    question_text:      'What is the child\'s name?',
    question_type_key:  'short_text',
    help_text:          '',
    is_required:        false,
    ...overrides,
  }
}

function mount(question = makeQuestion(), formId = 10, order = 1) {
  return mountWithPlugins(QuestionCard, {
    props: { question, formId, order },
    messages,
    global: {
      stubs: {
        Button: { props: ['icon', 'text', 'size', 'severity'], template: '<button v-bind="$attrs"><slot /></button>' },
      },
    },
  })
}

beforeEach(() => {
  mockStore.template = { questions: [makeQuestion()] }
  vi.clearAllMocks()
  mockDeleteQuestion.mockResolvedValue(undefined)
})

describe('QuestionCard (assessment)', () => {
  it('renders question text', () => {
    const wrapper = mount()
    expect(wrapper.text()).toContain("What is the child's name?")
  })

  it('renders the order number', () => {
    const wrapper = mount(makeQuestion(), 10, 3)
    expect(wrapper.text()).toContain('3')
  })

  it('does not render order when order is null', () => {
    const wrapper = mount(makeQuestion(), 10, null)
    const orderSpan = wrapper.find('span.rounded-full.bg-slate-100')
    expect(orderSpan.exists()).toBe(false)
  })

  it('renders the question type label via Tag', () => {
    // Tag stub renders data-status-label attribute
    const wrapper = mount()
    expect(wrapper.find('[data-status-label]').attributes('data-status-label')).toBe('Short Text')
  })

  it('renders help text when present', () => {
    const wrapper = mount(makeQuestion({ help_text: 'Enter full name' }))
    expect(wrapper.text()).toContain('Enter full name')
  })

  it('does not render help text when absent', () => {
    const wrapper = mount(makeQuestion({ help_text: '' }))
    expect(wrapper.find('span.text-slate-400.truncate').exists()).toBe(false)
  })

  it('shows required asterisk when is_required', () => {
    const wrapper = mount(makeQuestion({ is_required: true }))
    expect(wrapper.find('span.text-red-500').exists()).toBe(true)
  })

  it('does not show required asterisk when not required', () => {
    const wrapper = mount(makeQuestion({ is_required: false }))
    expect(wrapper.find('span.text-red-500').exists()).toBe(false)
  })

  it('uses pi-question-circle icon for unknown question type', () => {
    const wrapper = mount(makeQuestion({ question_type_key: 'unknown' }))
    expect(wrapper.find('i.pi-question-circle').exists()).toBe(true)
  })

  it('uses correct icon for known question types', () => {
    const wrapper = mount(makeQuestion({ question_type_key: 'radio' }))
    expect(wrapper.find('i.pi-circle').exists()).toBe(true)
  })

  it('calls deleteQuestion API and removes from store on delete', async () => {
    mockStore.template.questions = [makeQuestion()]
    const wrapper = mount()
    await wrapper.find('button').trigger('click')
    expect(mockDeleteQuestion).toHaveBeenCalledWith(10, 1)
    await vi.waitFor(() => expect(mockStore.template.questions).toHaveLength(0))
  })

  it('does not remove from store when template has no questions', async () => {
    mockStore.template = {}
    const wrapper = mount()
    await wrapper.find('button').trigger('click')
    expect(mockDeleteQuestion).toHaveBeenCalled()
    // No crash — just no mutation
  })
})

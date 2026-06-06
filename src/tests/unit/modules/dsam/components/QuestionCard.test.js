import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'
import { mountWithPlugins } from '../../../../helpers/mount'
import QuestionCard from '@/modules/dsam/components/form-builder/QuestionCard.vue'

const mockStore = reactive({
  activeQuestionId: null,
  isPublished: false,
  setActiveQuestion: vi.fn(),
  deleteQuestion: vi.fn(),
})

vi.mock('@/modules/dsam/stores/useDsamFormBuilderStore', () => ({
  useDsamFormBuilderStore: () => mockStore,
}))

const messages = {
  en: {
    dsamForms: {
      builder: {
        deleteQuestion:        'Delete question',
        deleteQuestionConfirm: 'Delete this question?',
        conditional:           'conditional',
      },
      inspector: {
        tabs: { scoring: 'Scoring' },
      },
    },
  },
}

function makeQuestion(overrides = {}) {
  return {
    id: 1,
    label: 'How old is the child?',
    question_type: { name: 'short_text', display_name: 'Short Text' },
    is_required: false,
    is_scored: false,
    is_conditional: false,
    options: [],
    ...overrides,
  }
}

function mount(question = makeQuestion(), sectionId = 10) {
  return mountWithPlugins(QuestionCard, {
    props: { question, sectionId },
    messages,
  })
}

beforeEach(() => {
  mockStore.activeQuestionId = null
  mockStore.isPublished = false
  vi.clearAllMocks()
  mockStore.deleteQuestion.mockResolvedValue(undefined)
})

describe('QuestionCard', () => {
  it('renders the question label', () => {
    const wrapper = mount()
    expect(wrapper.text()).toContain('How old is the child?')
  })

  it('renders the question type display name', () => {
    const wrapper = mount()
    expect(wrapper.text()).toContain('Short Text')
  })

  it('falls back to type name when no display_name', () => {
    const q = makeQuestion({ question_type: { name: 'radio' } })
    const wrapper = mount(q)
    expect(wrapper.text()).toContain('radio')
  })

  it('shows required asterisk when is_required', () => {
    const wrapper = mount(makeQuestion({ is_required: true }))
    expect(wrapper.find('span.text-red-400').exists()).toBe(true)
  })

  it('does not show required asterisk when not required', () => {
    const wrapper = mount(makeQuestion({ is_required: false }))
    expect(wrapper.find('span.text-red-400').exists()).toBe(false)
  })

  it('shows scored badge when is_scored', () => {
    const wrapper = mount(makeQuestion({ is_scored: true }))
    expect(wrapper.text()).toContain('Scoring')
  })

  it('does not show scored badge when not scored', () => {
    const wrapper = mount(makeQuestion({ is_scored: false }))
    expect(wrapper.find('span.text-emerald-500').exists()).toBe(false)
  })

  it('shows conditional badge when is_conditional', () => {
    const wrapper = mount(makeQuestion({ is_conditional: true }))
    expect(wrapper.text()).toContain('conditional')
  })

  it('does not show conditional badge when not conditional', () => {
    const wrapper = mount(makeQuestion({ is_conditional: false }))
    expect(wrapper.find('span.text-violet-600').exists()).toBe(false)
  })

  it('uses pi-question-circle icon for unknown question type', () => {
    const q = makeQuestion({ question_type: { name: 'unknown_type' } })
    const wrapper = mount(q)
    expect(wrapper.find('i.pi-question-circle').exists()).toBe(true)
  })

  it('applies active border when question is active', () => {
    mockStore.activeQuestionId = 1
    const wrapper = mount()
    expect(wrapper.find('div.border-blue-400').exists()).toBe(true)
  })

  it('does not apply active border when question is not active', () => {
    mockStore.activeQuestionId = 99
    const wrapper = mount()
    expect(wrapper.find('div.border-blue-400').exists()).toBe(false)
  })

  it('calls setActiveQuestion on click', async () => {
    const wrapper = mount()
    await wrapper.find('div[class*="rounded-lg"]').trigger('click')
    expect(mockStore.setActiveQuestion).toHaveBeenCalledWith(1)
  })

  it('shows delete button when not published', () => {
    mockStore.isPublished = false
    const wrapper = mount()
    expect(wrapper.find('button[title="Delete question"]').exists()).toBe(true)
  })

  it('hides delete button when published', () => {
    mockStore.isPublished = true
    const wrapper = mount()
    expect(wrapper.find('button[title="Delete question"]').exists()).toBe(false)
  })

  it('calls deleteQuestion after confirm', async () => {
    vi.stubGlobal('confirm', vi.fn(() => true))
    const wrapper = mount()
    await wrapper.find('button[title="Delete question"]').trigger('click')
    expect(mockStore.deleteQuestion).toHaveBeenCalledWith(10, 1)
    vi.unstubAllGlobals()
  })

  it('does not call deleteQuestion when confirm is cancelled', async () => {
    vi.stubGlobal('confirm', vi.fn(() => false))
    const wrapper = mount()
    await wrapper.find('button[title="Delete question"]').trigger('click')
    expect(mockStore.deleteQuestion).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'
import { mountWithPlugins } from '../../../../helpers/mount'
import FormSectionCanvas from '@/modules/assessment/components/form-builder/FormSectionCanvas.vue'

const mockStore = reactive({
  template: { status: 'draft', questions: [] },
  updateSection: vi.fn(),
  deleteSection: vi.fn(),
  questionTypes: [],
})

vi.mock('@/modules/assessment/stores/useFormBuilderStore', () => ({
  useFormBuilderStore: () => mockStore,
}))

vi.mock('@/modules/assessment/services/assessmentFormApi', () => ({
  assessmentFormApi: { createQuestion: vi.fn(), deleteQuestion: vi.fn() },
}))

const messages = {
  en: {
    formBuilder: {
      questions: {
        count:            '{n} question | {n} questions',
        noQuestionsYet:   'No questions yet',
        addFirstQuestion: 'Add your first question below.',
        addQuestion:      'Add question',
        deleteQuestion:   'Delete question',
        questionText:     'Question Text',
        questionType:     'Question Type',
        helpText:         'Help Text',
        required:         'Required',
      },
      sections:     { rename: 'Rename', deleteSection: 'Delete Section' },
      publishedLock: 'This form is published and locked.',
      questionTypes: { short_text: 'Short Text', radio: 'Single Choice' },
    },
    common: { cancel: 'Cancel', save: 'Save' },
  },
}

const componentStubs = {
  Button:           { props: ['label', 'icon', 'text', 'size', 'severity', 'loading', 'disabled'], template: '<button :data-icon="icon" v-bind="$attrs">{{ label }}</button>' },
  InputText:        { props: ['modelValue'], emits: ['update:modelValue'], template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" v-bind="$attrs" />' },
  QuestionCard:     { props: ['question', 'formId', 'order'], template: '<div class="question-card">{{ question.question_text }}</div>' },
  AddQuestionPanel: { props: ['sectionId', 'formId'], emits: ['close'], template: '<div class="add-panel"><button @click="$emit(\'close\')">Close</button></div>' },
}

const section = { id: 1, title: 'Motor Skills', order: 1 }

function mount(sectionOverride = section) {
  return mountWithPlugins(FormSectionCanvas, {
    props: { section: sectionOverride, formId: 10 },
    messages,
    global: { stubs: componentStubs },
  })
}

beforeEach(() => {
  mockStore.template = { status: 'draft', questions: [] }
  vi.clearAllMocks()
  mockStore.updateSection.mockResolvedValue(undefined)
  mockStore.deleteSection.mockResolvedValue(undefined)
})

describe('FormSectionCanvas', () => {
  it('renders section title', () => {
    const wrapper = mount()
    expect(wrapper.text()).toContain('Motor Skills')
  })

  it('renders question count label', () => {
    const wrapper = mount()
    expect(wrapper.text()).toContain('0 questions')
  })

  it('renders question count for multiple questions', () => {
    mockStore.template.questions = [
      { id: 1, question_text: 'Q1', section_id: 1, order: 1 },
      { id: 2, question_text: 'Q2', section_id: 1, order: 2 },
    ]
    const wrapper = mount()
    expect(wrapper.text()).toContain('2 questions')
  })

  it('only counts questions for this section', () => {
    mockStore.template.questions = [
      { id: 1, question_text: 'Q1', section_id: 1, order: 1 },
      { id: 2, question_text: 'Q2', section_id: 99, order: 1 },
    ]
    const wrapper = mount()
    expect(wrapper.text()).toContain('1 question')
    expect(wrapper.findAll('.question-card')).toHaveLength(1)
  })

  it('shows empty state when no questions', () => {
    const wrapper = mount()
    expect(wrapper.text()).toContain('No questions yet')
    expect(wrapper.text()).toContain('Add your first question below.')
  })

  it('does not show empty state when questions exist', () => {
    mockStore.template.questions = [{ id: 1, question_text: 'Q1', section_id: 1, order: 1 }]
    const wrapper = mount()
    expect(wrapper.text()).not.toContain('No questions yet')
  })

  it('shows add question button when draft', () => {
    const wrapper = mount()
    expect(wrapper.text()).toContain('Add question')
  })

  it('hides add question button when published', () => {
    mockStore.template.status = 'published'
    const wrapper = mount()
    const addBtn = wrapper.findAll('button').find(b => b.text() === 'Add question')
    expect(addBtn).toBeUndefined()
  })

  it('shows published lock notice when published', () => {
    mockStore.template.status = 'published'
    const wrapper = mount()
    expect(wrapper.text()).toContain('This form is published and locked.')
  })

  it('shows AddQuestionPanel when add question button clicked', async () => {
    const wrapper = mount()
    const addBtn = wrapper.findAll('button').find(b => b.text() === 'Add question')
    await addBtn.trigger('click')
    expect(wrapper.find('.add-panel').exists()).toBe(true)
  })

  it('hides AddQuestionPanel when close is emitted', async () => {
    const wrapper = mount()
    const addBtn = wrapper.findAll('button').find(b => b.text() === 'Add question')
    await addBtn.trigger('click')
    await wrapper.find('.add-panel button').trigger('click')
    expect(wrapper.find('.add-panel').exists()).toBe(false)
  })

  it('shows section action buttons when draft', () => {
    const wrapper = mount()
    expect(wrapper.find('button[data-icon="pi pi-pencil"]').exists()).toBe(true)
    expect(wrapper.find('button[data-icon="pi pi-trash"]').exists()).toBe(true)
  })

  it('hides section action buttons when published', () => {
    mockStore.template.status = 'published'
    const wrapper = mount()
    // No rename/delete actions rendered
    expect(wrapper.find('div.flex.shrink-0.items-center.gap-1').exists()).toBe(false)
  })

  it('enables title editing on double-click when draft', async () => {
    const wrapper = mount()
    await wrapper.find('h2').trigger('dblclick')
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('does not enable title editing on double-click when published', async () => {
    mockStore.template.status = 'published'
    const wrapper = mount()
    await wrapper.find('h2').trigger('dblclick')
    expect(wrapper.find('input').exists()).toBe(false)
  })

  it('calls updateSection when title is saved with a changed value', async () => {
    const wrapper = mount()
    await wrapper.find('h2').trigger('dblclick')
    await wrapper.find('input').setValue('Updated Title')
    await wrapper.find('input').trigger('keyup.enter')
    expect(mockStore.updateSection).toHaveBeenCalledWith(1, { title: 'Updated Title' })
  })

  it('does not call updateSection when title is unchanged', async () => {
    const wrapper = mount()
    await wrapper.find('h2').trigger('dblclick')
    // Don't change the value — it stays 'Motor Skills'
    await wrapper.find('input').trigger('blur')
    expect(mockStore.updateSection).not.toHaveBeenCalled()
  })

  it('calls deleteSection and emits deleted after confirm', async () => {
    vi.stubGlobal('confirm', vi.fn(() => true))
    const wrapper = mount()
    // Find delete button by its icon attribute
    const deleteBtn = wrapper.findAll('button').find(b => b.attributes('data-icon') === 'pi pi-trash')
    await deleteBtn.trigger('click')
    await vi.waitFor(() => expect(mockStore.deleteSection).toHaveBeenCalledWith(1))
    expect(wrapper.emitted('deleted')).toBeTruthy()
    vi.unstubAllGlobals()
  })

  it('does not call deleteSection when confirm is cancelled', async () => {
    vi.stubGlobal('confirm', vi.fn(() => false))
    const wrapper = mount()
    const deleteBtn = wrapper.findAll('button').find(b => b.attributes('data-icon') === 'pi pi-trash')
    await deleteBtn.trigger('click')
    expect(mockStore.deleteSection).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })
})

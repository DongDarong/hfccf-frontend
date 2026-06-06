import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { mountWithPlugins } from '../../../../helpers/mount'
import InspectorPanel from '@/modules/dsam/components/form-builder/InspectorPanel.vue'

const mockStore = reactive({
  activeQuestion: null,
  activeSection:  null,
  isPublished:    false,
  updateQuestion: vi.fn(),
  addOption:      vi.fn(),
  deleteOption:   vi.fn(),
})

vi.mock('@/modules/dsam/stores/useDsamFormBuilderStore', () => ({
  useDsamFormBuilderStore: () => mockStore,
}))

const messages = {
  en: {
    dsamForms: {
      inspector: {
        title:         'Question Settings',
        tabs:          { general: 'General', options: 'Options', scoring: 'Scoring' },
        labelEn:       'Label (EN)',
        labelKh:       'Label (KH)',
        placeholder:   'Placeholder',
        helpText:      'Help text',
        required:      'Required',
        noOptions:     'This question type does not have options.',
        addOption:     'Add option',
        newOptionDefault: 'New option',
        noScoring:     'This question type does not support scoring.',
        enableScoring: 'Enable scoring',
        maxScore:      'Max score',
        selectQuestion: 'Select a question to configure it',
      },
    },
    dsamShared: {
      actions: { save: 'Save' },
    },
  },
}

const componentStubs = {
  InputText:   { props: ['modelValue', 'disabled'], template: '<input :value="modelValue" :disabled="disabled" v-bind="$attrs" />' },
  Textarea:    { props: ['modelValue', 'disabled'], emits: ['update:modelValue'], template: '<textarea :value="modelValue" :disabled="disabled" @input="$emit(\'update:modelValue\', $event.target.value)" v-bind="$attrs"></textarea>' },
  InputNumber: { props: ['modelValue', 'disabled'], template: '<input type="number" :value="modelValue" :disabled="disabled" v-bind="$attrs" />' },
  Button:      { props: ['label', 'icon', 'size', 'severity'], template: '<button v-bind="$attrs">{{ label }}</button>' },
}

function makeQuestion(overrides = {}) {
  return {
    id: 1,
    label: 'Test Q',
    label_kh: '',
    placeholder: '',
    help_text: '',
    is_required: false,
    is_scored: false,
    max_score: null,
    question_type_id: 1,
    question_type: { has_options: false, has_scoring: false },
    options: [],
    ...overrides,
  }
}

function mount() {
  return mountWithPlugins(InspectorPanel, {
    messages,
    global: { stubs: componentStubs },
  })
}

beforeEach(() => {
  mockStore.activeQuestion = null
  mockStore.activeSection  = null
  mockStore.isPublished    = false
  vi.clearAllMocks()
  mockStore.updateQuestion.mockResolvedValue(undefined)
  mockStore.addOption.mockResolvedValue(undefined)
  mockStore.deleteOption.mockResolvedValue(undefined)
})

describe('InspectorPanel', () => {
  // empty state
  it('shows empty state when no active question', () => {
    const wrapper = mount()
    expect(wrapper.text()).toContain('Select a question to configure it')
  })

  it('does not show question panel when no active question', () => {
    const wrapper = mount()
    expect(wrapper.text()).not.toContain('Question Settings')
  })

  // question loaded
  it('shows question settings panel when question is active', async () => {
    mockStore.activeQuestion = makeQuestion()
    const wrapper = mount()
    await flushPromises()
    expect(wrapper.text()).toContain('Question Settings')
  })

  it('shows the three tabs', async () => {
    mockStore.activeQuestion = makeQuestion()
    const wrapper = mount()
    await flushPromises()
    expect(wrapper.text()).toContain('General')
    expect(wrapper.text()).toContain('Options')
    expect(wrapper.text()).toContain('Scoring')
  })

  // general tab (default)
  it('shows general tab fields by default', async () => {
    mockStore.activeQuestion = makeQuestion()
    const wrapper = mount()
    await flushPromises()
    expect(wrapper.text()).toContain('Label (EN)')
    expect(wrapper.text()).toContain('Required')
  })

  // tab switching
  it('switches to options tab on click', async () => {
    mockStore.activeQuestion = makeQuestion({ question_type: { has_options: true, has_scoring: false } })
    const wrapper = mount()
    await flushPromises()
    const tabs = wrapper.findAll('button.flex-1')
    const optionsTab = tabs.find(b => b.text() === 'Options')
    await optionsTab.trigger('click')
    expect(wrapper.text()).not.toContain('Label (EN)')
  })

  it('shows no-options message on options tab when type has no options', async () => {
    mockStore.activeQuestion = makeQuestion({ question_type: { has_options: false, has_scoring: false } })
    const wrapper = mount()
    await flushPromises()
    const tabs = wrapper.findAll('button.flex-1')
    await tabs.find(b => b.text() === 'Options').trigger('click')
    expect(wrapper.text()).toContain('This question type does not have options.')
  })

  it('renders options list on options tab when type has options', async () => {
    mockStore.activeQuestion = makeQuestion({
      question_type: { has_options: true, has_scoring: false },
      options: [
        { id: 10, label: 'Yes', score_value: 1 },
        { id: 11, label: 'No',  score_value: 0 },
      ],
    })
    const wrapper = mount()
    await flushPromises()
    const tabs = wrapper.findAll('button.flex-1')
    await tabs.find(b => b.text() === 'Options').trigger('click')
    expect(wrapper.text()).toContain('Yes')
    expect(wrapper.text()).toContain('No')
  })

  it('calls addOption when Add option button clicked', async () => {
    mockStore.activeSection  = { id: 5 }
    mockStore.activeQuestion = makeQuestion({ question_type: { has_options: true, has_scoring: false } })
    const wrapper = mount()
    await flushPromises()
    const tabs = wrapper.findAll('button.flex-1')
    await tabs.find(b => b.text() === 'Options').trigger('click')
    const addBtn = wrapper.findAll('button').find(b => b.text() === 'Add option')
    await addBtn.trigger('click')
    expect(mockStore.addOption).toHaveBeenCalledWith(5, 1, expect.objectContaining({ label: 'New option' }))
  })

  it('calls deleteOption when option remove button clicked', async () => {
    mockStore.activeSection  = { id: 5 }
    mockStore.activeQuestion = makeQuestion({
      question_type: { has_options: true, has_scoring: false },
      options: [{ id: 10, label: 'Yes', score_value: 1 }],
    })
    const wrapper = mount()
    await flushPromises()
    const tabs = wrapper.findAll('button.flex-1')
    await tabs.find(b => b.text() === 'Options').trigger('click')
    // find remove button inside option row (pi pi-times button)
    const removeBtn = wrapper.find('button i.pi-times').element.closest('button')
    await removeBtn.dispatchEvent(new Event('click'))
    expect(mockStore.deleteOption).toHaveBeenCalledWith(5, 1, 10)
  })

  // scoring tab
  it('shows no-scoring message on scoring tab when type has no scoring', async () => {
    mockStore.activeQuestion = makeQuestion({ question_type: { has_options: false, has_scoring: false } })
    const wrapper = mount()
    await flushPromises()
    const tabs = wrapper.findAll('button.flex-1')
    await tabs.find(b => b.text() === 'Scoring').trigger('click')
    expect(wrapper.text()).toContain('This question type does not support scoring.')
  })

  it('shows enable scoring toggle on scoring tab when type has scoring', async () => {
    mockStore.activeQuestion = makeQuestion({ question_type: { has_options: false, has_scoring: true } })
    const wrapper = mount()
    await flushPromises()
    const tabs = wrapper.findAll('button.flex-1')
    await tabs.find(b => b.text() === 'Scoring').trigger('click')
    expect(wrapper.text()).toContain('Enable scoring')
  })

  // save button
  it('hides save button initially (form not dirty)', async () => {
    mockStore.activeQuestion = makeQuestion()
    const wrapper = mount()
    await flushPromises()
    const saveBtn = wrapper.findAll('button').find(b => b.text() === 'Save')
    expect(saveBtn).toBeUndefined()
  })

  it('calls updateQuestion when save button clicked', async () => {
    mockStore.activeSection  = { id: 5 }
    mockStore.activeQuestion = makeQuestion()
    const wrapper = mount()
    await flushPromises()
    // Directly trigger isDirty by finding the label input and changing it
    const inputs = wrapper.findAll('textarea')
    await inputs[0].setValue('Updated label')
    await flushPromises()
    const saveBtn = wrapper.findAll('button').find(b => b.text() === 'Save')
    expect(saveBtn).toBeDefined()
    await saveBtn.trigger('click')
    expect(mockStore.updateQuestion).toHaveBeenCalledWith(5, 1, expect.any(Object))
  })

  it('hides save button when published', async () => {
    mockStore.isPublished    = true
    mockStore.activeSection  = { id: 5 }
    mockStore.activeQuestion = makeQuestion()
    const wrapper = mount()
    await flushPromises()
    const inputs = wrapper.findAll('textarea')
    await inputs[0].setValue('Updated label')
    await flushPromises()
    // isDirty may be true, but save button should not appear when published
    const saveBtn = wrapper.findAll('button').find(b => b.text() === 'Save')
    expect(saveBtn).toBeUndefined()
  })
})

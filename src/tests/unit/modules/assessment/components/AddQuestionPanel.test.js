import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'
import { mountWithPlugins } from '../../../../helpers/mount'
import AddQuestionPanel from '@/modules/assessment/components/form-builder/AddQuestionPanel.vue'

const mockStore = reactive({
  questionTypes: [
    { id: 1, key: 'short_text', label: 'Short Text' },
    { id: 2, key: 'radio',      label: 'Single Choice' },
  ],
  template: { questions: [] },
})

vi.mock('@/modules/assessment/stores/useFormBuilderStore', () => ({
  useFormBuilderStore: () => mockStore,
}))

const mockCreateQuestion = vi.fn()
vi.mock('@/modules/assessment/services/assessmentFormApi', () => ({
  assessmentFormApi: { createQuestion: (...a) => mockCreateQuestion(...a) },
}))

const messages = {
  en: {
    formBuilder: {
      questions: {
        addQuestion:  'Add question',
        questionText: 'Question Text',
        questionType: 'Question Type',
        helpText:     'Help Text',
        required:     'Required',
      },
      questionTypes: { short_text: 'Short Text', radio: 'Single Choice' },
    },
    common: { cancel: 'Cancel', save: 'Save' },
  },
}

const componentStubs = {
  Button:   { props: ['label', 'size', 'severity', 'loading', 'disabled'], template: '<button :disabled="disabled" v-bind="$attrs">{{ label }}</button>' },
  InputText: { props: ['modelValue'], emits: ['update:modelValue'], template: '<input data-type="InputText" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" v-bind="$attrs" />' },
  Textarea:  { props: ['modelValue'], emits: ['update:modelValue'], template: '<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" v-bind="$attrs"></textarea>' },
  Checkbox:  { props: ['modelValue', 'binary'], emits: ['update:modelValue'], template: '<input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" v-bind="$attrs" />' },
}

function mount() {
  return mountWithPlugins(AddQuestionPanel, {
    props: { sectionId: 10, formId: 5 },
    messages,
    global: { stubs: componentStubs },
  })
}

beforeEach(() => {
  mockStore.template = { questions: [] }
  vi.clearAllMocks()
  mockCreateQuestion.mockResolvedValue({ data: { data: { id: 99, question_text: 'New Q' } } })
})

describe('AddQuestionPanel', () => {
  it('renders the panel header', () => {
    const wrapper = mount()
    expect(wrapper.text()).toContain('Add question')
  })

  it('renders Question Text and Question Type labels', () => {
    const wrapper = mount()
    expect(wrapper.text()).toContain('Question Text')
    expect(wrapper.text()).toContain('Question Type')
  })

  it('emits close when close button clicked', async () => {
    const wrapper = mount()
    await wrapper.find('button i.pi-times').element.closest('button').dispatchEvent(new Event('click'))
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits close when Cancel button clicked', async () => {
    const wrapper = mount()
    const cancelBtn = wrapper.findAll('button').find(b => b.text() === 'Cancel')
    await cancelBtn.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('Save button is disabled when question text is empty', () => {
    const wrapper = mount()
    const saveBtn = wrapper.findAll('button').find(b => b.text() === 'Save')
    expect(saveBtn.attributes('disabled')).toBeDefined()
  })

  it('Save button is disabled when question type is not selected', async () => {
    const wrapper = mount()
    await wrapper.find('[data-type="InputText"]').setValue('Some question')
    const saveBtn = wrapper.findAll('button').find(b => b.text() === 'Save')
    expect(saveBtn.attributes('disabled')).toBeDefined()
  })

  it('calls createQuestion with correct payload on save', async () => {
    const wrapper = mount()
    await wrapper.find('[data-type="InputText"]').setValue('Child age?')
    // Simulate type selection via the Select stub (it renders as <select>)
    // We directly set the form value by finding the component and triggering modelValue update
    // The Select stub renders as <select> — set the value via wrapper vm access
    wrapper.vm.$.subTree  // force render
    // Set question_type_id directly on the form ref via the component's internal state
    // Use the Select stub's change to set the value
    const selectEl = wrapper.find('select')
    // The Select stub from mountWithPlugins doesn't natively propagate — we trigger via the component
    // Instead, access the underlying component state to set form.question_type_id
    const vm = wrapper.findComponent({ name: 'AddQuestionPanel' }).vm ?? wrapper.vm
    if (vm.form) {
      vm.form.question_type_id = 1
    }
    await wrapper.vm.$nextTick()
    const saveBtn = wrapper.findAll('button').find(b => b.text() === 'Save')
    await saveBtn.trigger('click')
    expect(mockCreateQuestion).toHaveBeenCalledWith(5, expect.objectContaining({
      section_id:    10,
      question_text: 'Child age?',
    }))
  })

  it('pushes new question to store and emits close on successful save', async () => {
    const wrapper = mount()
    await wrapper.find('[data-type="InputText"]').setValue('Test Q')
    const vm = wrapper.vm
    if (vm.form) vm.form.question_type_id = 1
    await wrapper.vm.$nextTick()
    const saveBtn = wrapper.findAll('button').find(b => b.text() === 'Save')
    await saveBtn.trigger('click')
    await vi.waitFor(() => expect(wrapper.emitted('close')).toBeTruthy())
    expect(mockStore.template.questions).toHaveLength(1)
  })

  it('passes type options derived from store questionTypes to the Select', () => {
    const wrapper = mount()
    const select = wrapper.findComponent({ name: 'Select' })
    const labels = select.props('options').map(o => o.label)
    expect(labels).toContain('Short Text')
    expect(labels).toContain('Single Choice')
  })
})

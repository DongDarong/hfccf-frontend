import { describe, it, expect } from 'vitest'
import { mountWithPlugins } from '../../../../helpers/mount'
import QuestionRenderer from '@/modules/assessment/components/questions/QuestionRenderer.vue'

const inputStubs = {
  InputText:   { props: ['modelValue'], emits: ['update:modelValue'], template: '<input data-type="InputText" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />' },
  Textarea:    { props: ['modelValue'], emits: ['update:modelValue'], template: '<textarea data-type="Textarea" @input="$emit(\'update:modelValue\', $event.target.value)">{{ modelValue }}</textarea>' },
  InputNumber: { props: ['modelValue'], emits: ['update:modelValue'], template: '<input data-type="InputNumber" type="number" :value="modelValue" @input="$emit(\'update:modelValue\', Number($event.target.value))" />' },
  RadioButton: { props: ['modelValue', 'value', 'inputId'], template: '<input data-type="RadioButton" type="radio" />' },
  Checkbox:    { props: ['modelValue', 'value', 'inputId', 'binary'], template: '<input data-type="Checkbox" type="checkbox" />' },
  MultiSelect: { props: ['modelValue', 'options'], template: '<div data-type="MultiSelect"></div>' },
  Rating:      { props: ['modelValue', 'stars'], template: '<div data-type="Rating"></div>' },
  FileUpload:  { props: ['mode', 'accept', 'auto'], template: '<div data-type="FileUpload"></div>' },
}

function makeQuestion(typeKey, extra = {}) {
  return { id: 1, question_text: 'Test?', question_type_key: typeKey, options: [], is_required: false, ...extra }
}

function mount(question, modelValue = null) {
  return mountWithPlugins(QuestionRenderer, {
    props: { question, modelValue },
    global: { stubs: inputStubs },
  })
}

describe('QuestionRenderer (assessment)', () => {
  // label
  it('renders question text', () => {
    const wrapper = mount(makeQuestion('short_text'))
    expect(wrapper.text()).toContain('Test?')
  })

  it('shows required asterisk when is_required', () => {
    const wrapper = mount(makeQuestion('short_text', { is_required: true }))
    expect(wrapper.find('span.text-red-500').exists()).toBe(true)
  })

  it('does not show required asterisk when not required', () => {
    const wrapper = mount(makeQuestion('short_text'))
    expect(wrapper.find('span.text-red-500').exists()).toBe(false)
  })

  it('renders help text when present', () => {
    const wrapper = mount(makeQuestion('short_text', { help_text: 'Hint here' }))
    expect(wrapper.text()).toContain('Hint here')
  })

  it('does not render help text when absent', () => {
    const wrapper = mount(makeQuestion('short_text'))
    expect(wrapper.find('p.text-xs.text-slate-400').exists()).toBe(false)
  })

  // input types
  it('renders InputText for short_text', () => {
    expect(mount(makeQuestion('short_text')).find('[data-type="InputText"]').exists()).toBe(true)
  })

  it('renders Textarea for long_text', () => {
    expect(mount(makeQuestion('long_text')).find('[data-type="Textarea"]').exists()).toBe(true)
  })

  it('renders InputNumber for number', () => {
    expect(mount(makeQuestion('number')).find('[data-type="InputNumber"]').exists()).toBe(true)
  })

  it('renders DatePicker for date', () => {
    // DatePicker is stubbed as <input type="text"> by mountWithPlugins defaults
    expect(mount(makeQuestion('date')).find('input[type="text"]').exists()).toBe(true)
  })

  it('renders RadioButtons for radio with options', () => {
    const q = makeQuestion('radio', {
      options: [
        { id: 1, option_text: 'Yes' },
        { id: 2, option_text: 'No'  },
      ],
    })
    const wrapper = mount(q)
    expect(wrapper.findAll('[data-type="RadioButton"]')).toHaveLength(2)
    expect(wrapper.text()).toContain('Yes')
    expect(wrapper.text()).toContain('No')
  })

  it('renders Checkboxes for checkbox with options', () => {
    const q = makeQuestion('checkbox', {
      options: [
        { id: 1, option_text: 'A' },
        { id: 2, option_text: 'B' },
      ],
    })
    expect(mount(q).findAll('[data-type="Checkbox"]')).toHaveLength(2)
  })

  it('renders Select for dropdown', () => {
    // Select is stubbed as <select> by mountWithPlugins defaults
    expect(mount(makeQuestion('dropdown')).find('select').exists()).toBe(true)
  })

  it('renders MultiSelect for multi_select', () => {
    expect(mount(makeQuestion('multi_select')).find('[data-type="MultiSelect"]').exists()).toBe(true)
  })

  it('renders Rating for rating_scale', () => {
    expect(mount(makeQuestion('rating_scale')).find('[data-type="Rating"]').exists()).toBe(true)
  })

  it('renders FileUpload for file_upload', () => {
    expect(mount(makeQuestion('file_upload')).find('[data-type="FileUpload"]').exists()).toBe(true)
  })

  it('renders FileUpload for image_upload', () => {
    expect(mount(makeQuestion('image_upload')).find('[data-type="FileUpload"]').exists()).toBe(true)
  })

  it('renders unsupported fallback for unknown type', () => {
    const wrapper = mount(makeQuestion('signature'))
    expect(wrapper.find('div.italic').exists()).toBe(true)
    expect(wrapper.text()).toContain('signature')
  })

  it('uses question_type.key as fallback for typeKey', () => {
    const q = { id: 1, question_text: 'Q', question_type: { key: 'short_text' }, options: [], is_required: false }
    const wrapper = mountWithPlugins(QuestionRenderer, {
      props: { question: q, modelValue: null },
      global: { stubs: inputStubs },
    })
    expect(wrapper.find('[data-type="InputText"]').exists()).toBe(true)
  })

  // v-model
  it('emits update:modelValue when InputText changes', async () => {
    const wrapper = mount(makeQuestion('short_text'), '')
    await wrapper.find('[data-type="InputText"]').setValue('hello')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hello'])
  })

  it('emits update:modelValue when InputNumber changes', async () => {
    const wrapper = mount(makeQuestion('number'), 0)
    await wrapper.find('[data-type="InputNumber"]').setValue('42')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})

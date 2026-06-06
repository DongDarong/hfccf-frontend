import { describe, it, expect } from 'vitest'
import { mountWithPlugins } from '../../../../helpers/mount'
import QuestionRendererFactory from '@/modules/dsam/components/wizard/QuestionRendererFactory.vue'

const messages = {
  en: {
    dsamWizard: {
      selectPlaceholder: 'Select...',
      uploadHint:        'Click to upload a file',
    },
  },
}

// Stubs for PrimeVue input components not covered by mountWithPlugins defaults.
const inputStubs = {
  InputText:   { props: ['modelValue'], emits: ['update:modelValue'], template: '<input data-type="InputText" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />' },
  Textarea:    { template: '<textarea data-type="Textarea" v-bind="$attrs"></textarea>' },
  InputNumber: { template: '<input data-type="InputNumber" v-bind="$attrs" />' },
  RadioButton: { template: '<input data-type="RadioButton" type="radio" v-bind="$attrs" />' },
  Checkbox:    { template: '<input data-type="Checkbox" type="checkbox" v-bind="$attrs" />' },
  Rating:      { template: '<div data-type="Rating" v-bind="$attrs"></div>' },
}

function makeQuestion(typeName, extra = {}) {
  return { id: 1, question_type: { name: typeName }, options: [], ...extra }
}

function mount(question, modelValue = null) {
  return mountWithPlugins(QuestionRendererFactory, {
    props: { question, modelValue },
    messages,
    global: { stubs: inputStubs },
  })
}

describe('QuestionRendererFactory', () => {
  it('renders InputText for short_text', () => {
    const wrapper = mount(makeQuestion('short_text'))
    expect(wrapper.find('[data-type="InputText"]').exists()).toBe(true)
  })

  it('renders Textarea for long_text', () => {
    const wrapper = mount(makeQuestion('long_text'))
    expect(wrapper.find('[data-type="Textarea"]').exists()).toBe(true)
  })

  it('renders InputNumber for number', () => {
    const wrapper = mount(makeQuestion('number'))
    expect(wrapper.find('[data-type="InputNumber"]').exists()).toBe(true)
  })

  it('renders DatePicker for date', () => {
    // DatePicker is stubbed as <input type="text"> by mountWithPlugins
    const wrapper = mount(makeQuestion('date'))
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
  })

  it('renders RadioButtons for radio type with options', () => {
    const question = makeQuestion('radio', {
      options: [
        { id: 1, value: 'yes', label: 'Yes' },
        { id: 2, value: 'no',  label: 'No'  },
      ],
    })
    const wrapper = mount(question)
    expect(wrapper.findAll('[data-type="RadioButton"]')).toHaveLength(2)
    expect(wrapper.text()).toContain('Yes')
    expect(wrapper.text()).toContain('No')
  })

  it('renders Checkboxes for checkbox type with options', () => {
    const question = makeQuestion('checkbox', {
      options: [
        { id: 1, value: 'a', label: 'Option A' },
        { id: 2, value: 'b', label: 'Option B' },
      ],
    })
    const wrapper = mount(question)
    expect(wrapper.findAll('[data-type="Checkbox"]')).toHaveLength(2)
  })

  it('renders Select for dropdown with placeholder', () => {
    // Select is stubbed as <select> by mountWithPlugins
    const wrapper = mount(makeQuestion('dropdown'))
    expect(wrapper.find('select').exists()).toBe(true)
  })

  it('renders Rating for rating_scale', () => {
    const question = makeQuestion('rating_scale', { config: { max: 5 } })
    const wrapper = mount(question)
    expect(wrapper.find('[data-type="Rating"]').exists()).toBe(true)
  })

  it('renders file upload hint for file_upload', () => {
    const wrapper = mount(makeQuestion('file_upload'))
    expect(wrapper.text()).toContain('Click to upload a file')
  })

  it('renders fallback for unrecognised type', () => {
    const wrapper = mount(makeQuestion('signature'))
    expect(wrapper.text()).toContain('signature — renderer not yet implemented')
  })

  it('renders fallback when question_type is missing', () => {
    const wrapper = mount({ id: 1, options: [] })
    // typeName is '' — falls through to fallback
    expect(wrapper.find('[data-type="InputText"]').exists()).toBe(false)
  })

  // v-model / emit
  it('emits update:modelValue when input changes', async () => {
    const wrapper = mount(makeQuestion('short_text'), '')
    await wrapper.find('[data-type="InputText"]').setValue('hello')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('radio renders no options when options array is empty', () => {
    const wrapper = mount(makeQuestion('radio', { options: [] }))
    expect(wrapper.findAll('[data-type="RadioButton"]')).toHaveLength(0)
  })
})

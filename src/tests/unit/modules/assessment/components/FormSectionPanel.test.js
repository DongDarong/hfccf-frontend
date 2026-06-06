import { describe, it, expect, vi } from 'vitest'
import { reactive } from 'vue'
import { mountWithPlugins } from '../../../../helpers/mount'
import FormSectionPanel from '@/modules/assessment/components/form-builder/FormSectionPanel.vue'

// FormSectionPanel is a thin pass-through wrapper over FormSectionCanvas.
// Stub FormSectionCanvas to keep this test focused on the wrapper contract.
vi.mock('@/modules/assessment/stores/useFormBuilderStore', () => ({
  useFormBuilderStore: () => reactive({
    template: { status: 'draft', questions: [] },
    updateSection: vi.fn(),
    deleteSection: vi.fn(),
    questionTypes: [],
  }),
}))

vi.mock('@/modules/assessment/services/assessmentFormApi', () => ({
  assessmentFormApi: { createQuestion: vi.fn(), deleteQuestion: vi.fn() },
}))

const messages = {
  en: {
    formBuilder: {
      questions: { count: '{n} question | {n} questions', noQuestionsYet: 'No questions yet', addFirstQuestion: 'Add first question.', addQuestion: 'Add question', deleteQuestion: 'Delete question', questionText: 'Question Text', questionType: 'Question Type', helpText: 'Help Text', required: 'Required' },
      sections:  { rename: 'Rename', deleteSection: 'Delete Section' },
      publishedLock: 'Published and locked.',
      questionTypes: { short_text: 'Short Text' },
    },
    common: { cancel: 'Cancel', save: 'Save' },
  },
}

const section = { id: 1, title: 'Intro', order: 1 }

describe('FormSectionPanel', () => {
  it('renders without errors and delegates to FormSectionCanvas', () => {
    const wrapper = mountWithPlugins(FormSectionPanel, {
      props: { section, formId: 10 },
      messages,
      global: {
        stubs: {
          Button:    { template: '<button v-bind="$attrs"><slot /></button>' },
          InputText: { props: ['modelValue'], template: '<input :value="modelValue" v-bind="$attrs" />' },
        },
      },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Intro')
  })

  it('emits deleted when FormSectionCanvas emits deleted', async () => {
    const wrapper = mountWithPlugins(FormSectionPanel, {
      props: { section, formId: 10 },
      messages,
      global: {
        stubs: {
          FormSectionCanvas: {
            props: ['section', 'formId'],
            emits: ['deleted'],
            template: '<div><button @click="$emit(\'deleted\')">Delete</button></div>',
          },
          Button:    { template: '<button v-bind="$attrs"><slot /></button>' },
          InputText: { props: ['modelValue'], template: '<input :value="modelValue" v-bind="$attrs" />' },
        },
      },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('deleted')).toBeTruthy()
  })
})

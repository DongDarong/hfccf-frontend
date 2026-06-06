import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, reactive } from 'vue'
import { mountWithPlugins } from '../../../../helpers/mount'
import WizardStepReview from '@/modules/assessment/components/wizard/WizardStepReview.vue'

const mockStore = reactive({
  selectedForm:    null,
  selectedStudent: null,
  answers:         {},
})

const answeredCount = computed(() => Object.keys(mockStore.answers).length)

vi.mock('@/modules/assessment/composables/useAssessmentWizard', () => ({
  useAssessmentWizard: () => ({ store: mockStore, answeredCount }),
}))

const messages = {
  en: {
    assessmentWizard: {
      review:         'Review & Submit',
      reviewHint:     'Please review before submitting.',
      steps:          { form: 'Form', student: 'Student' },
      answeredCount:  '{n} answered',
      confirmSubmit:  'Once submitted, this cannot be changed.',
    },
    submissions: { answers: 'Answers' },
  },
}

const componentStubs = {
  Tag: { props: ['value', 'severity'], template: '<span data-tag>{{ value }}</span>' },
}

function mount() {
  return mountWithPlugins(WizardStepReview, {
    messages,
    global: { stubs: componentStubs },
  })
}

beforeEach(() => {
  mockStore.selectedForm    = null
  mockStore.selectedStudent = null
  mockStore.answers         = {}
})

describe('WizardStepReview', () => {
  it('renders review heading', () => {
    expect(mount().text()).toContain('Review & Submit')
  })

  it('shows form name when form is selected', () => {
    mockStore.selectedForm = { name: 'Motor Assessment Form' }
    expect(mount().text()).toContain('Motor Assessment Form')
  })

  it('shows "—" placeholder when no form is selected', () => {
    expect(mount().text()).toContain('—')
  })

  it('shows student full_name when student is selected', () => {
    mockStore.selectedStudent = { full_name: 'Dara Chan', student_code: 'ST001' }
    expect(mount().text()).toContain('Dara Chan')
  })

  it('falls back to student fullName when full_name is absent', () => {
    mockStore.selectedStudent = { fullName: 'Sophea Kim' }
    expect(mount().text()).toContain('Sophea Kim')
  })

  it('shows student_code when present', () => {
    mockStore.selectedStudent = { full_name: 'Dara Chan', student_code: 'ST001' }
    expect(mount().text()).toContain('ST001')
  })

  it('shows answered count tag', () => {
    mockStore.answers = { '1_0': { answer_value: 'Yes' }, '2_0': { answer_value: 'No' } }
    const wrapper = mount()
    expect(wrapper.find('[data-tag]').text()).toContain('2 answered')
  })

  it('shows 0 answered when no answers', () => {
    const wrapper = mount()
    expect(wrapper.find('[data-tag]').text()).toContain('0 answered')
  })

  it('shows confirmation notice', () => {
    expect(mount().text()).toContain('Once submitted, this cannot be changed.')
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { mountWithPlugins } from '../../../../helpers/mount'
import WizardStepStudent from '@/modules/assessment/components/wizard/WizardStepStudent.vue'

const mockStore = reactive({ selectedStudent: null })

vi.mock('@/modules/assessment/composables/useAssessmentWizard', () => ({
  useAssessmentWizard: () => ({ store: mockStore, selectStudent: vi.fn() }),
}))

const mockHttpGet = vi.fn()
vi.mock('@/services/http', () => ({
  default: { get: (...a) => mockHttpGet(...a) },
}))

vi.mock('@/services/api', () => ({
  normalizePerPage: vi.fn(() => 100),
}))

const messages = {
  en: {
    assessmentWizard: {
      selectStudent:     'Select Student',
      selectStudentHint: 'Choose a student to assess',
    },
  },
}

function mount() {
  return mountWithPlugins(WizardStepStudent, { messages })
}

beforeEach(() => {
  mockStore.selectedStudent = null
  vi.clearAllMocks()
  mockHttpGet.mockResolvedValue({ data: { data: [] } })
})

describe('WizardStepStudent', () => {
  it('renders select student heading', async () => {
    const wrapper = mount()
    await flushPromises()
    expect(wrapper.text()).toContain('Select Student')
  })

  it('calls http.get for students on mount', async () => {
    mount()
    await flushPromises()
    expect(mockHttpGet).toHaveBeenCalledWith('/preschool/students', expect.any(Object))
  })

  it('renders a Select dropdown', async () => {
    const wrapper = mount()
    await flushPromises()
    expect(wrapper.find('select').exists()).toBe(true)
  })

  it('shows student preview when a student is selected', async () => {
    mockStore.selectedStudent = { full_name: 'Dara Chan', student_code: 'ST001' }
    const wrapper = mount()
    await flushPromises()
    expect(wrapper.text()).toContain('Dara Chan')
    expect(wrapper.text()).toContain('ST001')
  })

  it('uses fullName when full_name is absent', async () => {
    mockStore.selectedStudent = { fullName: 'Sophea Kim', student_code: 'ST002' }
    const wrapper = mount()
    await flushPromises()
    expect(wrapper.text()).toContain('Sophea Kim')
  })

  it('does not show student preview when no student is selected', async () => {
    const wrapper = mount()
    await flushPromises()
    expect(wrapper.find('.pi-user').exists()).toBe(false)
  })
})

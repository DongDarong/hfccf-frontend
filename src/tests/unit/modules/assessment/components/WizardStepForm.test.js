import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { mountWithPlugins } from '../../../../helpers/mount'
import WizardStepForm from '@/modules/assessment/components/wizard/WizardStepForm.vue'

const mockStore = reactive({ selectedForm: null })
const mockSelectForm = vi.fn()

vi.mock('@/modules/assessment/composables/useAssessmentWizard', () => ({
  useAssessmentWizard: () => ({ store: mockStore, selectForm: mockSelectForm }),
}))

const mockFormList = vi.fn()
vi.mock('@/modules/assessment/services/assessmentFormApi', () => ({
  assessmentFormApi: { list: (...a) => mockFormList(...a) },
}))

const messages = {
  en: {
    assessmentWizard: {
      selectForm:       'Select Form',
      selectFormHint:   'Choose a published form',
      noPublishedForms: 'No published forms available.',
    },
    formBuilder: { statuses: { published: 'Published' } },
  },
}

const componentStubs = {
  Tag: { props: ['value', 'severity'], template: '<span data-tag>{{ value }}</span>' },
}

function mount() {
  return mountWithPlugins(WizardStepForm, {
    messages,
    global: { stubs: componentStubs },
  })
}

beforeEach(() => {
  mockStore.selectedForm = null
  vi.clearAllMocks()
  mockFormList.mockResolvedValue({ data: { data: [] } })
})

describe('WizardStepForm', () => {
  it('renders select form heading', async () => {
    const wrapper = mount()
    await flushPromises()
    expect(wrapper.text()).toContain('Select Form')
  })

  it('calls assessmentFormApi.list on mount with published status', async () => {
    mount()
    await flushPromises()
    expect(mockFormList).toHaveBeenCalledWith(expect.objectContaining({ status: 'published' }))
  })

  it('renders a Select dropdown', async () => {
    const wrapper = mount()
    await flushPromises()
    expect(wrapper.find('select').exists()).toBe(true)
  })

  it('shows empty state when no published forms and not loading', async () => {
    const wrapper = mount()
    await flushPromises()
    expect(wrapper.text()).toContain('No published forms available.')
  })

  it('does not show empty state when forms are available', async () => {
    mockFormList.mockResolvedValue({ data: { data: [{ id: 1, name: 'Motor Assessment' }] } })
    const wrapper = mount()
    await flushPromises()
    expect(wrapper.text()).not.toContain('No published forms available.')
  })

  it('shows form preview card when a form is selected', async () => {
    mockStore.selectedForm = { id: 1, name: 'Motor Assessment', description: '' }
    const wrapper = mount()
    await flushPromises()
    expect(wrapper.text()).toContain('Motor Assessment')
    expect(wrapper.find('[data-tag]').text()).toContain('Published')
  })

  it('shows form description in preview when present', async () => {
    mockStore.selectedForm = { id: 1, name: 'Test Form', description: 'Evaluates fine motor skills' }
    const wrapper = mount()
    await flushPromises()
    expect(wrapper.text()).toContain('Evaluates fine motor skills')
  })

  it('does not show empty state when a form is selected', async () => {
    mockStore.selectedForm = { id: 1, name: 'Motor Assessment' }
    const wrapper = mount()
    await flushPromises()
    expect(wrapper.text()).not.toContain('No published forms available.')
  })
})

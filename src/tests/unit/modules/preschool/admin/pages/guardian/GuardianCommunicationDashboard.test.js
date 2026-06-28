import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'

import { mountWithPlugins } from '@/tests/helpers/mount'
import enPreschool from '@/i18n/en/preschool'
import khPreschool from '@/i18n/kh/preschool'
import GuardianCommunicationDashboard from '@/modules/preschool/admin/pages/guardian/GuardianCommunicationDashboard.vue'

const mockFetchPreschoolStudents = vi.fn()
const mockFetchGuardianCommunications = vi.fn()
const mockCreateStudentGuardianCommunication = vi.fn()
const mockMarkGuardianCommunicationSent = vi.fn()
const mockAcknowledgeGuardianCommunication = vi.fn()
const mockCancelGuardianCommunication = vi.fn()

vi.mock('@/modules/preschool/services/preschoolApi', () => ({
  fetchPreschoolStudents: (...args) => mockFetchPreschoolStudents(...args),
}))

vi.mock('@/modules/preschool/services/api/preschoolGuardianCommunicationApi', () => ({
  fetchGuardianCommunications: (...args) => mockFetchGuardianCommunications(...args),
  createStudentGuardianCommunication: (...args) => mockCreateStudentGuardianCommunication(...args),
  markGuardianCommunicationSent: (...args) => mockMarkGuardianCommunicationSent(...args),
  acknowledgeGuardianCommunication: (...args) => mockAcknowledgeGuardianCommunication(...args),
  cancelGuardianCommunication: (...args) => mockCancelGuardianCommunication(...args),
}))

vi.mock('@/store/userStore', () => ({
  useUserStore: () => ({
    currentUser: {
      fullName: 'Ms. Dara',
      name: 'Ms. Dara',
      email: 'dara@example.com',
    },
  }),
}))

function createRoute() {
  return {
    path: '/module/preschool-admin/guardians/communications',
    name: 'dashboard-preschool-admin-guardian-communications',
    component: { template: '<div />' },
  }
}

function mockResolvedData() {
  mockFetchPreschoolStudents.mockResolvedValue({
    items: [
      {
        id: 'student-1',
        fullName: 'Alice Student',
        publicId: 'STU-HFCCF-0005',
        guardians: [
          {
            id: 'guardian-1',
            fullName: 'Sokha Guardian',
            phone: '012345678',
          },
        ],
      },
    ],
  })

  mockFetchGuardianCommunications.mockResolvedValue({ items: [] })
  mockCreateStudentGuardianCommunication.mockResolvedValue({ id: 'contact-1' })
  mockMarkGuardianCommunicationSent.mockResolvedValue({})
  mockAcknowledgeGuardianCommunication.mockResolvedValue({})
  mockCancelGuardianCommunication.mockResolvedValue({})
}

async function mountDashboard() {
  const wrapper = mountWithPlugins(GuardianCommunicationDashboard, {
    messages: {
      en: enPreschool,
      kh: khPreschool,
    },
    routes: [createRoute()],
    global: {
      stubs: {
        AppButton: {
          props: ['type', 'variant', 'size'],
          emits: ['click'],
          template: '<button :type="type" @click="$emit(\'click\')"><slot /></button>',
        },
        AppBadge: {
          props: ['variant'],
          template: '<span><slot /></span>',
        },
      },
    },
  })

  await flushPromises()
  await flushPromises()
  return wrapper
}

function getSelects(wrapper) {
  return wrapper.findAll('select')
}

beforeEach(() => {
  vi.clearAllMocks()
  mockResolvedData()
})

describe('GuardianCommunicationDashboard', () => {
  it('renders the contact log title and structured contact form', async () => {
    const wrapper = await mountDashboard()

    expect(mockFetchPreschoolStudents).toHaveBeenCalledWith({ perPage: 200 })
    expect(mockFetchGuardianCommunications).toHaveBeenCalledWith({ studentId: 'student-1' })
    expect(wrapper.text()).toContain('Guardian Contact Log')
    expect(wrapper.text()).toContain('Record Guardian Contact')
    expect(wrapper.text()).toContain('Who')
    expect(wrapper.text()).toContain('Contact Details')
    expect(wrapper.text()).toContain('Follow-up')
    expect(wrapper.text()).toContain('Contact History')
    expect(wrapper.text()).toContain('Contact method')
    expect(wrapper.text()).toContain('Reason / Topic')
    expect(wrapper.text()).toContain('Discussion Summary')
    expect(wrapper.text()).toContain('Outcome')
    expect(wrapper.text()).toContain('Save contact log')
    expect(wrapper.text()).toContain('Select a student')
  })

  it('shows the follow-up date input only when follow-up is required', async () => {
    const wrapper = await mountDashboard()

    expect(wrapper.find('input[type="date"]').exists()).toBe(false)

    const selects = getSelects(wrapper)
    await selects[6].setValue('true')
    await flushPromises()

    expect(wrapper.find('input[type="date"]').exists()).toBe(true)
  })

  it('saves a structured contact log using the current backend payload shape', async () => {
    const wrapper = await mountDashboard()
    const selects = getSelects(wrapper)
    const textarea = wrapper.find('textarea')

    await selects[2].setValue('phone-call')
    await selects[3].setValue('attendance')
    await textarea.setValue('Guardian confirmed the pickup plan for tomorrow.')
    await selects[4].setValue('guardian-acknowledged')
    await selects[5].setValue('high')
    await selects[6].setValue('false')
    await flushPromises()

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockCreateStudentGuardianCommunication).toHaveBeenCalledTimes(1)
    expect(mockCreateStudentGuardianCommunication).toHaveBeenCalledWith(
      expect.objectContaining({
        studentId: 'student-1',
        guardianId: 'guardian-1',
        sourceType: 'manual_note',
        channel: 'phone-call',
        subject: 'attendance',
        severity: 'high',
        status: 'queued',
        message: expect.stringContaining('[contact-log]'),
      }),
    )
    expect(mockCreateStudentGuardianCommunication.mock.calls[0][0].message).toContain('Guardian confirmed the pickup plan for tomorrow.')
  })

  it('renders the empty history state when there are no communication records', async () => {
    mockFetchGuardianCommunications.mockResolvedValue({ items: [] })
    const wrapper = await mountDashboard()

    expect(wrapper.text()).toContain('No contact history yet')
    expect(wrapper.text()).toContain('Record the first guardian contact from this page.')
  })
})

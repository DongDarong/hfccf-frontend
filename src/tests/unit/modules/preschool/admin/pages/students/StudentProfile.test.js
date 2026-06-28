import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enPreschool from '@/i18n/en/preschool'
import StudentProfile from '@/modules/preschool/admin/pages/students/StudentProfile.vue'
import { buildGuardianContactLogMessage } from '@/modules/preschool/admin/pages/guardian/contactLogUtils'

const mockFetchPreschoolStudent = vi.fn()
const mockFetchStudentHealthSummary = vi.fn()
const mockFetchPreschoolStudentPaymentSummary = vi.fn()
const mockFetchStudentGuardianCommunications = vi.fn()
const mockBuildLocationAddress = vi.fn()

vi.mock('@/modules/preschool/services/preschoolApi', () => ({
  fetchPreschoolStudent: (...args) => mockFetchPreschoolStudent(...args),
}))

vi.mock('@/modules/preschool/services/api/preschoolHealthApi', () => ({
  fetchStudentHealthSummary: (...args) => mockFetchStudentHealthSummary(...args),
}))

vi.mock('@/modules/preschool/services/api/preschoolPaymentApi', () => ({
  fetchPreschoolStudentPaymentSummary: (...args) => mockFetchPreschoolStudentPaymentSummary(...args),
}))

vi.mock('@/modules/preschool/services/api/preschoolGuardianCommunicationApi', () => ({
  fetchStudentGuardianCommunications: (...args) => mockFetchStudentGuardianCommunications(...args),
}))

vi.mock('@/modules/preschool/services/cambodiaLocationService', () => ({
  buildLocationAddress: (...args) => mockBuildLocationAddress(...args),
}))

function createStudentProfileRoute() {
  return {
    path: '/module/preschool-admin/students/:id/profile',
    name: 'dashboard-preschool-admin-student-profile',
    component: { template: '<div />' },
  }
}

function createGuardianContactLogRoute() {
  return {
    path: '/module/preschool-admin/guardians/communications',
    name: 'dashboard-preschool-admin-guardian-communications',
    component: { template: '<div />' },
  }
}

async function mountProfilePage(studentId = 'student-1') {
  const wrapper = mountWithPlugins(StudentProfile, {
    messages: {
      en: enPreschool,
    },
    routes: [createStudentProfileRoute(), createGuardianContactLogRoute()],
    global: {
      stubs: {
        MainLayout: { template: '<div><slot /></div>' },
        HeaderSection: {
          props: ['title', 'subtitle'],
          template: '<header><h1>{{ title }}</h1><p>{{ subtitle }}</p></header>',
        },
        Button: {
          props: ['disabled', 'loading'],
          emits: ['click'],
          template: '<button :disabled="disabled || loading" @click="$emit(\'click\')"><slot /></button>',
        },
      },
    },
  })

  await wrapper.vm.$router.push({
    name: 'dashboard-preschool-admin-student-profile',
    params: { id: studentId },
  })
  await flushPromises()

  return wrapper
}

function mockResolvedStudentData() {
  mockFetchPreschoolStudent.mockResolvedValue({
    id: 'student-1',
    fullName: 'Alice Student',
    studentCode: 'S-001',
    avatarUrl: '',
    gender: 'female',
    status: 'active',
    dateOfBirth: '2019-04-02',
    guardianName: 'Sokha Guardian',
    guardianPhone: '012345678',
    classes: [
      {
        id: 'class-1',
        name: 'Morning Stars',
        level: 'Nursery',
      },
    ],
    classesCount: 1,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-02T08:00:00Z',
    raw: {
      address: 'Sample Street',
      province: 'Phnom Penh',
      district: 'Dangkao',
      commune: 'Prek Pra',
      village: 'Village 1',
    },
  })

  mockFetchStudentHealthSummary.mockResolvedValue({
    counts: {
      allergies: 1,
      vaccinations: 2,
      medications: 0,
      incidents: 0,
      emergencyContacts: 1,
      healthChecks: 3,
    },
  })

  mockFetchPreschoolStudentPaymentSummary.mockResolvedValue({
    summary: {
      outstandingBalance: 25,
      totalBilled: 125,
      totalPaid: 100,
    },
    recentInvoices: [
      {
        id: 'invoice-1',
        invoiceNumber: 'INV-001',
        status: 'Open',
        issueDate: '2025-01-03T08:00:00Z',
        balanceDue: 25,
      },
    ],
    recentReceipts: [
      {
        id: 'receipt-1',
        receiptNumber: 'RC-001',
        paymentMethod: 'Cash',
        issuedAt: '2025-01-04T08:00:00Z',
        amount: 100,
      },
    ],
  })

  mockFetchStudentGuardianCommunications.mockResolvedValue({
    items: [
      {
        id: 'comm-1',
        subject: 'Attendance',
        message: buildGuardianContactLogMessage({
          student: 'Alice Student — STU-HFCCF-0005',
          guardian: 'Sokha Guardian',
          method: 'Phone Call',
          reason: 'Attendance',
          summary: 'Parent confirmed the pickup plan for tomorrow.',
          outcome: 'Guardian acknowledged',
          followUpRequired: true,
          followUpDate: '2025-01-06',
          priority: 'medium',
          sourceEvent: 'Attendance alert',
        }, {}, 'Ms. Dara'),
        status: 'sent',
        severity: 'medium',
        channel: 'manual_note',
        sourceType: 'student',
        createdAt: '2025-01-05T08:00:00Z',
        followUpDate: '2025-01-06',
      },
    ],
    summary: {
      total: 1,
      queued: 0,
      sent: 1,
      acknowledged: 0,
    },
  })

  mockBuildLocationAddress.mockImplementation((source = {}, locale = 'en') => {
    const parts = [source.village, source.commune, source.district, source.province].filter(Boolean)
    return `${locale}:${parts.join(', ')}`
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  mockResolvedStudentData()
})

describe('StudentProfile', () => {
  it('mounts with mock student data and renders the current sections', async () => {
    const wrapper = await mountProfilePage()

    expect(mockFetchPreschoolStudent).toHaveBeenCalledWith('student-1')
    expect(mockFetchStudentHealthSummary).toHaveBeenCalledWith('student-1')
    expect(mockFetchPreschoolStudentPaymentSummary).toHaveBeenCalledWith('student-1')
    expect(mockFetchStudentGuardianCommunications).toHaveBeenCalledWith('student-1', { perPage: 5 })
    expect(mockBuildLocationAddress).toHaveBeenCalledWith(expect.objectContaining({ province: 'Phnom Penh' }), 'en')

    expect(wrapper.text()).toContain('Student Profile')
    expect(wrapper.text()).toContain('Back to Students')
    expect(wrapper.text()).toContain('Health Records')
    expect(wrapper.text()).toContain('Payment Summary')
    expect(wrapper.text()).toContain('Alice Student')
    expect(wrapper.text()).toContain('Morning Stars')
    expect(wrapper.text()).toContain('Guardian Contact History')
    expect(wrapper.text()).toContain('Recent Guardian Contacts')
    expect(wrapper.text()).toContain('Latest Contact')
    expect(wrapper.text()).toContain('Last Contact Date')
    expect(wrapper.text()).toContain('Contact method')
    expect(wrapper.text()).toContain('Reason / Topic')
    expect(wrapper.text()).toContain('Outcome')
    expect(wrapper.text()).toContain('Follow-up Status')
    expect(wrapper.text()).toContain('View Full Contact History')
    expect(wrapper.text()).toContain('Parent confirmed the pickup plan for tomorrow.')
    expect(wrapper.find('.student-profile-page__avatar-initials').text()).toBe('AS')
    expect(wrapper.text()).toContain('en:Village 1, Prek Pra, Dangkao, Phnom Penh')

    await wrapper.get('[data-testid="view-full-contact-history"]').trigger('click')
    await flushPromises()
    expect(wrapper.vm.$router.currentRoute.value.name).toBe('dashboard-preschool-admin-guardian-communications')
    expect(wrapper.vm.$router.currentRoute.value.query.studentId).toBe('student-1')
  })

  it('renders a loading state while the student request is pending', async () => {
    let resolveStudent
    mockFetchPreschoolStudent.mockReturnValue(new Promise((resolve) => {
      resolveStudent = resolve
    }))

    const wrapper = mountWithPlugins(StudentProfile, {
      messages: {
        en: enPreschool,
      },
      routes: [createStudentProfileRoute(), createGuardianContactLogRoute()],
      global: {
        stubs: {
          MainLayout: { template: '<div><slot /></div>' },
          HeaderSection: {
            props: ['title', 'subtitle'],
            template: '<header><h1>{{ title }}</h1><p>{{ subtitle }}</p></header>',
          },
          Button: {
            props: ['disabled', 'loading'],
            emits: ['click'],
            template: '<button :disabled="disabled || loading" @click="$emit(\'click\')"><slot /></button>',
          },
        },
      },
    })

    await wrapper.vm.$router.push({
      name: 'dashboard-preschool-admin-student-profile',
      params: { id: 'student-1' },
    })

    expect(wrapper.text()).toContain('Loading student profile...')

    resolveStudent({
      id: 'student-1',
      fullName: 'Alice Student',
      studentCode: 'S-001',
      classes: [],
      raw: {},
    })

    await flushPromises()
    expect(wrapper.text()).not.toContain('Loading student profile...')
  })

  it('renders a not-found state when the student does not exist', async () => {
    mockFetchPreschoolStudent.mockResolvedValue(null)

    const wrapper = await mountProfilePage()

    expect(wrapper.text()).toContain('Student profile was not found.')
  })

  it('renders an error state when the student request fails', async () => {
    mockFetchPreschoolStudent.mockRejectedValue(new Error('Request failed'))

    const wrapper = await mountProfilePage()

    expect(wrapper.text()).toContain('Request failed')
  })
})

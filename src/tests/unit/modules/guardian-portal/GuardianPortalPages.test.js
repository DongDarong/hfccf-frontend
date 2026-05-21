import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enGuardianPortal from '@/i18n/en/guardian-portal'
import khGuardianPortal from '@/i18n/kh/guardian-portal'
import GuardianPortalDashboard from '@/modules/guardian-portal/pages/GuardianPortalDashboard.vue'
import GuardianPortalStudents from '@/modules/guardian-portal/pages/GuardianPortalStudents.vue'
import GuardianPortalActivate from '@/modules/guardian-portal/pages/GuardianPortalActivate.vue'
import GuardianAttendanceSummary from '@/modules/guardian-portal/pages/GuardianAttendanceSummary.vue'
import GuardianScheduleSummary from '@/modules/guardian-portal/pages/GuardianScheduleSummary.vue'
import GuardianProgressReports from '@/modules/guardian-portal/pages/GuardianProgressReports.vue'
import GuardianReportsSummary from '@/modules/guardian-portal/pages/GuardianReportsSummary.vue'
import GuardianPortalAccounts from '@/modules/preschool/admin/pages/GuardianPortalAccounts.vue'
import InviteGuardianPortal from '@/modules/preschool/admin/pages/InviteGuardianPortal.vue'

// Keep the portal page surfaces mount-tested so the new guardian workflow does
// not drift into raw keys, duplicate loading, or broken route/component wiring.
const routeState = {
  params: { studentId: '10', guardianId: '11' },
  query: {},
}

const routerMock = {
  push: vi.fn(),
}

const mockGuardianAuthComposable = vi.fn()
const mockGuardianStudentsComposable = vi.fn()
const mockGuardianSummaryComposable = vi.fn()
const mockGuardianAdminComposable = vi.fn()

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')

  return {
    ...actual,
    useRoute: () => routeState,
    useRouter: () => routerMock,
  }
})

vi.mock('@/modules/guardian-portal/composables/useGuardianPortalAuth', () => ({
  useGuardianPortalAuth: () => mockGuardianAuthComposable(),
}))

vi.mock('@/modules/guardian-portal/composables/useGuardianPortalStudents', () => ({
  useGuardianPortalStudents: () => mockGuardianStudentsComposable(),
}))

vi.mock('@/modules/guardian-portal/composables/useGuardianStudentSummary', () => ({
  useGuardianStudentSummary: () => mockGuardianSummaryComposable(),
}))

vi.mock('@/modules/guardian-portal/composables/useGuardianPortalAdmin', () => ({
  useGuardianPortalAdmin: () => mockGuardianAdminComposable(),
}))

beforeEach(() => {
  vi.clearAllMocks()

  routeState.params.studentId = '10'
  routeState.params.guardianId = '11'

  mockGuardianAuthComposable.mockReturnValue({
    t: (key, params = {}) => {
      const messages = enGuardianPortal
      const template = key.split('.').reduce((carry, part) => carry?.[part], messages)

      if (typeof template !== 'string') return key

      return template.replace(/\{(\w+)\}/g, (_, paramKey) => String(params[paramKey] ?? `{${paramKey}}`))
    },
    form: ref({
      token: '',
      password: '',
      passwordConfirmation: '',
    }),
    loading: ref(false),
    errorMessage: ref(''),
    successMessage: ref(''),
    profile: ref({
      guardian: { fullName: 'Guardian One' },
      account: { email: 'guardian.one@hfccf.org', status: 'active', lastLoginAt: '2026-05-20 10:00' },
    }),
    isFormValid: ref(true),
    activateInvitation: vi.fn().mockResolvedValue(undefined),
    loadProfile: vi.fn().mockResolvedValue({}),
  })

  mockGuardianStudentsComposable.mockReturnValue({
    items: ref([
      { id: 10, fullName: 'Student One', studentCode: 'PS-001', guardianName: 'Guardian One', guardianPhone: '012345678', status: 'active' },
    ]),
    loading: ref(false),
    errorMessage: ref(''),
    pagination: ref({ page: 1, perPage: 10, total: 1, totalPages: 1 }),
    loadStudents: vi.fn().mockResolvedValue(undefined),
  })

  mockGuardianSummaryComposable.mockReturnValue({
    student: ref({
      id: 10,
      fullName: 'Student One',
      studentCode: 'PS-001',
      guardianName: 'Guardian One',
      guardianPhone: '012345678',
    }),
    attendanceSummary: ref({ summary: { attendanceCount: 2 } }),
    scheduleSummary: ref({ summary: { scheduleCount: 2 } }),
    progressSummary: ref({ summary: { progressCount: 2 } }),
    reportsSummary: ref({ summary: { reportCount: 2 } }),
    loading: ref(false),
    errorMessage: ref(''),
    loadSummary: vi.fn().mockResolvedValue(undefined),
  })

  mockGuardianAdminComposable.mockReturnValue({
    items: ref([
      { id: 1, email: 'guardian.one@hfccf.org', guardian: { fullName: 'Guardian One' }, status: 'active' },
    ]),
    pagination: ref({ page: 1, perPage: 10, total: 1, totalPages: 1 }),
    loading: ref(false),
    errorMessage: ref(''),
    actionMessage: ref(''),
    loadAccounts: vi.fn().mockResolvedValue(undefined),
    invite: vi.fn().mockResolvedValue({ activationUrl: '/guardian-portal/activate?token=test' }),
    revoke: vi.fn().mockResolvedValue({ id: 1, status: 'revoked' }),
  })
})

function baseStubs() {
  return {
    MainLayout: { template: '<div><slot /></div>' },
    AuthLayout: { template: '<div><slot /></div>' },
    HeaderSection: { props: ['title', 'subtitle'], template: '<header><h1>{{ title }}</h1><p>{{ subtitle }}</p></header>' },
    GuardianPortalLayout: { template: '<div><slot /></div>' },
    GuardianReadOnlyNotice: { template: '<div><slot /></div>' },
    GuardianSummaryCard: { props: ['title', 'subtitle'], template: '<section><h2>{{ title }}</h2><p>{{ subtitle }}</p><slot /></section>' },
    GuardianStudentCard: { props: ['student', 'actionLabel'], template: '<article>{{ student.fullName }} {{ actionLabel }}</article>' },
    // Preserve the PrimeVue card/content contract so page tests observe the
    // same text the real portal renders instead of blank wrapper stubs.
    Card: { template: '<div><slot name="content" /><slot /></div>' },
    GuardianPortalInviteForm: { template: '<div />' },
    GuardianPortalAccessList: { template: '<div />' },
    Button: { props: ['label'], template: '<button>{{ label }}<slot /></button>' },
    Message: { template: '<div><slot /></div>' },
    InputText: { template: '<input />' },
    Password: { template: '<input />' },
    Dialog: { template: '<div><slot /></div>' },
  }
}

describe('guardian portal pages', () => {
  it('mounts the guardian dashboard and list pages', async () => {
    const dashboard = mountWithPlugins(GuardianPortalDashboard, {
      messages: { en: enGuardianPortal, kh: khGuardianPortal },
      global: { stubs: baseStubs() },
    })

    const students = mountWithPlugins(GuardianPortalStudents, {
      messages: { en: enGuardianPortal, kh: khGuardianPortal },
      global: { stubs: baseStubs() },
    })

    await flushPromises()

    expect(dashboard.text()).toContain(enGuardianPortal.guardianPortal.dashboard.title)
    expect(dashboard.text()).toContain(enGuardianPortal.guardianPortal.dashboard.viewChild)
    expect(students.text()).toContain(enGuardianPortal.guardianPortal.students.total.replace('{count}', '1'))
  })

  it('mounts the child summary and read-only summary pages', async () => {
    const attendance = mountWithPlugins(GuardianAttendanceSummary, {
      messages: { en: enGuardianPortal, kh: khGuardianPortal },
      global: { stubs: baseStubs() },
    })
    const schedule = mountWithPlugins(GuardianScheduleSummary, {
      messages: { en: enGuardianPortal, kh: khGuardianPortal },
      global: { stubs: baseStubs() },
    })
    const progress = mountWithPlugins(GuardianProgressReports, {
      messages: { en: enGuardianPortal, kh: khGuardianPortal },
      global: { stubs: baseStubs() },
    })
    const reports = mountWithPlugins(GuardianReportsSummary, {
      messages: { en: enGuardianPortal, kh: khGuardianPortal },
      global: { stubs: baseStubs() },
    })

    await flushPromises()

    expect(attendance.text()).toContain(enGuardianPortal.guardianPortal.attendance.title)
    expect(schedule.text()).toContain(enGuardianPortal.guardianPortal.schedule.title)
    expect(progress.text()).toContain(enGuardianPortal.guardianPortal.progress.title)
    expect(reports.text()).toContain(enGuardianPortal.guardianPortal.reports.title)
  })

  it('mounts the activation and admin management pages', async () => {
    const activation = mountWithPlugins(GuardianPortalActivate, {
      messages: { en: enGuardianPortal, kh: khGuardianPortal },
      global: { stubs: baseStubs() },
    })
    const accounts = mountWithPlugins(GuardianPortalAccounts, {
      messages: { en: enGuardianPortal, kh: khGuardianPortal },
      global: { stubs: baseStubs() },
    })
    const invite = mountWithPlugins(InviteGuardianPortal, {
      messages: { en: enGuardianPortal, kh: khGuardianPortal },
      global: { stubs: baseStubs() },
    })

    await flushPromises()

    expect(activation.text()).toContain(enGuardianPortal.guardianPortal.activation.title)
    expect(accounts.text()).toContain(enGuardianPortal.guardianPortal.admin.accountsTitle)
    expect(invite.text()).toContain(enGuardianPortal.guardianPortal.admin.inviteTitle)
  })
})

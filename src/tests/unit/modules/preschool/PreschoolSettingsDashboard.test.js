import { describe, expect, it, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enPreschool from '@/i18n/en/preschool'
import { canAccessRoute } from '@/services/accessControl'
import { preschoolRoutes } from '@/modules/preschool/routes'
import PreschoolSettingsDashboard from '@/modules/preschool/admin/pages/settings/PreschoolSettingsDashboard.vue'
import { fetchPreschoolSettingsDashboard } from '@/modules/preschool/services/preschoolApi'

vi.mock('@/modules/preschool/services/preschoolApi', () => ({
  fetchPreschoolSettingsDashboard: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

function stubs() {
  return {
    MainLayout: { template: '<div><slot /></div>' },
    HeaderSection: { props: ['title', 'subtitle'], template: '<header><h1>{{ title }}</h1><p>{{ subtitle }}</p></header>' },
    Button: { props: ['label'], template: '<button>{{ label }}<slot /></button>' },
    PreschoolSettingsSectionCard: { template: '<section><slot /></section>' },
  }
}

function makeRouteMatch(route) {
  return { matched: [{ meta: route.meta }] }
}

function makeUser(role, scope = 'admin', domain = 'preschool') {
  return {
    role,
    scope,
    domain,
  }
}

describe('Preschool settings dashboard', () => {
  it('shows the loading state before the dashboard request resolves', async () => {
    let resolveDashboard
    fetchPreschoolSettingsDashboard.mockReturnValueOnce(new Promise((resolve) => {
      resolveDashboard = resolve
    }))

    const wrapper = mountWithPlugins(PreschoolSettingsDashboard, {
      messages: { en: enPreschool },
      global: { stubs: stubs() },
    })

    expect(wrapper.find('[data-testid="settings-dashboard-loading"]').exists()).toBe(true)

    resolveDashboard({
      academic: { activeAcademicYear: '', activeAcademicYearDateRange: '', activeTerm: '', activeTermDateRange: '', academicStatus: '', isConfigured: false },
      attendance: { lateThresholdMinutes: '', absenceAlertDays: '', schoolWeekLabel: '', calendarEventsCount: '', isConfigured: false },
      payments: { currency: '', invoicePrefix: '', receiptPrefix: '', isConfigured: false },
      assessments: { activeGradingScale: '', assessmentCategories: [], isConfigured: false },
      health: { alertSeverityLevels: [], healthCategories: [], isConfigured: false },
      preferences: { organizationName: '', language: '', brandingStatus: '', isConfigured: false },
    })

    await flushPromises()
    expect(wrapper.find('[data-testid="settings-dashboard-loading"]').exists()).toBe(false)
  })

  it('renders empty state copy when the dashboard payload is blank', async () => {
    fetchPreschoolSettingsDashboard.mockResolvedValueOnce({
      academic: { activeAcademicYear: '', activeAcademicYearDateRange: '', activeTerm: '', activeTermDateRange: '', academicStatus: '', isConfigured: false },
      attendance: { lateThresholdMinutes: '', absenceAlertDays: '', schoolWeekLabel: '', calendarEventsCount: '', isConfigured: false },
      payments: { currency: '', invoicePrefix: '', receiptPrefix: '', isConfigured: false },
      assessments: { activeGradingScale: '', assessmentCategories: [], isConfigured: false },
      health: { alertSeverityLevels: [], healthCategories: [], isConfigured: false },
      preferences: { organizationName: '', language: '', brandingStatus: '', isConfigured: false },
    })

    const wrapper = mountWithPlugins(PreschoolSettingsDashboard, {
      messages: { en: enPreschool },
      global: { stubs: stubs() },
    })

    await flushPromises()

    expect(wrapper.find('[data-testid="settings-dashboard-empty"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('No Academic Year Configured')
    expect(wrapper.text()).toContain('No Currency Configured')
    expect(wrapper.text()).toContain('No Preschool settings have been configured yet.')
  })

  it('keeps the settings dashboard route admin-only', () => {
    const dashboardRoute = preschoolRoutes.find((route) => route.name === 'dashboard-preschool-admin-settings')

    expect(canAccessRoute(makeUser('teacher-preschool', 'staff', 'preschool'), makeRouteMatch(dashboardRoute))).toBe(false)
    expect(canAccessRoute(makeUser('adminpreschool', 'admin', 'preschool'), makeRouteMatch(dashboardRoute))).toBe(true)
    expect(canAccessRoute(makeUser('superadmin', 'super_admin', 'global'), makeRouteMatch(dashboardRoute))).toBe(true)
  })
})

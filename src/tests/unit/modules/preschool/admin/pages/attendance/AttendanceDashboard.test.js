import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enPreschool from '@/i18n/en/preschool'
import AttendanceDashboard from '@/modules/preschool/admin/pages/attendance/AttendanceDashboard.vue'

const mockFetchPreschoolClasses = vi.fn()
const mockFetchPreschoolAttendance = vi.fn()
const mockFetchTodayAttendanceSessions = vi.fn()
const mockFetchMissingAttendanceSessions = vi.fn()
const mockFetchPreschoolAttendanceAlertSummary = vi.fn()

vi.mock('@/modules/preschool/services/preschoolApi', () => ({
  fetchPreschoolClasses: (...args) => mockFetchPreschoolClasses(...args),
  fetchPreschoolAttendance: (...args) => mockFetchPreschoolAttendance(...args),
}))

vi.mock('@/modules/preschool/services/api/preschoolAttendanceAlertApi', () => ({
  fetchPreschoolAttendanceAlertSummary: (...args) => mockFetchPreschoolAttendanceAlertSummary(...args),
}))

vi.mock('@/modules/preschool/services/api/preschoolAttendanceSessionApi', () => ({
  fetchMissingAttendanceSessions: (...args) => mockFetchMissingAttendanceSessions(...args),
  fetchTodayAttendanceSessions: (...args) => mockFetchTodayAttendanceSessions(...args),
  openAttendanceSession: vi.fn(() => Promise.resolve(null)),
}))

function createRoute() {
  return {
    path: '/module/preschool-admin/attendance/dashboard',
    name: 'dashboard-preschool-admin-attendance-dashboard',
    component: { template: '<div />' },
  }
}

async function mountPage() {
  const wrapper = mountWithPlugins(AttendanceDashboard, {
    messages: {
      en: enPreschool,
    },
    routes: [createRoute()],
    global: {
      stubs: {
        MainLayout: { template: '<div><slot /></div>' },
        HeaderSection: {
          props: ['title', 'subtitle'],
          template: '<header><h1>{{ title }}</h1><p>{{ subtitle }}</p></header>',
        },
        Button: {
          props: ['type', 'variant', 'size', 'loading'],
          emits: ['click'],
          template: '<button :type="type" :disabled="loading" @click="$emit(\'click\')"><slot /></button>',
        },
        RouterLink: { props: ['to'], template: '<a><slot /></a>' },
      },
    },
  })

  await wrapper.vm.$router.push({
    name: 'dashboard-preschool-admin-attendance-dashboard',
  })
  await flushPromises()
  await flushPromises()

  return wrapper
}

beforeEach(() => {
  vi.clearAllMocks()

  mockFetchPreschoolClasses.mockResolvedValue({
    items: [
      { id: 'class-1', name: 'Morning Stars' },
    ],
  })

  mockFetchPreschoolAttendance.mockResolvedValue({
    items: [
      {
        id: 'att-1',
        classId: 'class-1',
        className: 'Morning Stars',
        studentId: 'student-1',
        studentName: 'Alice Student',
        status: 'present',
      },
    ],
  })

  mockFetchTodayAttendanceSessions.mockResolvedValue({
    items: [
      {
        id: 'session-1',
        classId: 'class-1',
        className: 'Morning Stars',
        roomName: 'Room 1',
        teacherName: 'Teacher One',
        attendanceDate: '2026-05-19',
        startTime: '08:00',
        endTime: '10:00',
        status: 'open',
        studentCount: 18,
        generatedFromSchedule: true,
      },
    ],
    summary: {
      open: 1,
      closed: 0,
      cancelled: 0,
      missing: 1,
    },
  })

  mockFetchMissingAttendanceSessions.mockResolvedValue({
    items: [
      {
        id: 'missing-1',
        classId: 'class-1',
        className: 'Morning Stars',
        attendanceDate: '2026-05-19',
        status: 'scheduled',
        generatedFromSchedule: true,
      },
    ],
    count: 1,
  })

  mockFetchPreschoolAttendanceAlertSummary.mockResolvedValue({
    summary: {
      total: 2,
      open: 1,
      acknowledged: 1,
      overdue: 1,
      byClass: [
        {
          classId: 'class-1',
          className: 'Morning Stars',
          total: 2,
          open: 1,
          acknowledged: 1,
          overdue: 1,
        },
      ],
      bySeverity: [
        { severity: 'high', total: 1 },
        { severity: 'medium', total: 1 },
      ],
    },
    recentAlerts: [
      {
        id: 'alert-1',
        studentName: 'Alice Student',
        className: 'Morning Stars',
        guardianName: 'Sokha Guardian',
        alertLabel: 'Repeated Absence',
        followUpStatus: 'open',
      },
    ],
  })
})

describe('AttendanceDashboard', () => {
  it('renders canonical attendance alert summary alongside attendance counts', async () => {
    const wrapper = await mountPage()

    expect(mockFetchPreschoolAttendance).toHaveBeenCalled()
    expect(mockFetchTodayAttendanceSessions).toHaveBeenCalledWith(
      expect.objectContaining({
        classId: '',
      }),
    )
    expect(mockFetchMissingAttendanceSessions).toHaveBeenCalledWith(
      expect.objectContaining({
        startDate: expect.any(String),
        endDate: expect.any(String),
      }),
    )
    expect(mockFetchPreschoolAttendanceAlertSummary).toHaveBeenCalledWith(
      expect.objectContaining({
        classId: undefined,
        dateFrom: expect.any(String),
        dateTo: expect.any(String),
        perPage: 4,
      }),
    )

    expect(wrapper.text()).toContain('Attendance Dashboard')
    expect(wrapper.text()).toContain('Operational Summary')
    expect(wrapper.text()).toContain('Today’s Sessions')
    expect(wrapper.text()).toContain('Attendance alert summary')
    expect(wrapper.text()).toContain('Open Alerts')
    expect(wrapper.text()).toContain('Overdue')
    expect(wrapper.text()).toContain('Recent repeated absences')
    expect(wrapper.text()).toContain('Teacher One')
    expect(wrapper.text()).toContain('Room 1')
    expect(wrapper.text()).toContain('Alice Student')
    expect(wrapper.text()).toContain('Repeated Absence')
  })

  it('keeps the empty repeated-absence state visible when the backend returns none', async () => {
    mockFetchPreschoolAttendanceAlertSummary.mockResolvedValue({
      summary: {
        total: 0,
        open: 0,
        acknowledged: 0,
        overdue: 0,
        byClass: [],
        bySeverity: [],
      },
      recentAlerts: [],
    })

    const wrapper = await mountPage()

    expect(wrapper.text()).toContain('No repeated absence alerts available.')
  })
})

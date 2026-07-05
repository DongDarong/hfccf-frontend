import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enPreschool from '@/i18n/en/preschool'
import TeacherDashboard from '@/modules/preschool/teacher/pages/Dashboard.vue'

const mockFetchPreschoolDashboard = vi.fn()
const mockFetchTodayAttendanceSessions = vi.fn()
const mockOpenAttendanceSession = vi.fn()

vi.mock('@/modules/preschool/services/preschoolApi', () => ({
  fetchPreschoolDashboard: (...args) => mockFetchPreschoolDashboard(...args),
}))

vi.mock('@/modules/preschool/services/api/preschoolAttendanceSessionApi', () => ({
  fetchTodayAttendanceSessions: (...args) => mockFetchTodayAttendanceSessions(...args),
  openAttendanceSession: (...args) => mockOpenAttendanceSession(...args),
}))

function createRoute() {
  return {
    path: '/module/preschool-admin/dashboard',
    name: 'dashboard-preschool-teacher',
    component: { template: '<div />' },
  }
}

async function mountPage() {
  const wrapper = mountWithPlugins(TeacherDashboard, {
    messages: { en: enPreschool },
    routes: [createRoute()],
    global: {
      stubs: {
        MainLayout: { template: '<div><slot /></div>' },
        HeaderSection: { props: ['title', 'subtitle'], template: '<header><h1>{{ title }}</h1><p>{{ subtitle }}</p></header>' },
        Button: { props: ['type', 'variant', 'size', 'loading'], emits: ['click'], template: '<button :disabled="loading" @click="$emit(\'click\')"><slot /></button>' },
        PreschoolDashboardSummary: { props: ['cards'], template: '<div />' },
        PreschoolDashboardSpotlight: { props: ['title', 'text'], template: '<div />' },
        PreschoolDashboardActionList: { props: ['title', 'items'], template: '<div />' },
        PreschoolDashboardActivity: { props: ['items'], template: '<div />' },
      },
    },
  })

  await wrapper.vm.$router.push({ name: 'dashboard-preschool-teacher' })
  await flushPromises()
  await flushPromises()

  return wrapper
}

beforeEach(() => {
  vi.clearAllMocks()

  mockFetchPreschoolDashboard.mockResolvedValue({
    summary: {
      students: 20,
      classes: 2,
      teachers: 1,
      attendanceToday: 8,
      pendingPayments: 0,
      overduePayments: 0,
    },
    recentAttendance: [],
    upcomingClasses: [],
    paymentSummary: { paid: 0, pending: 0, overdue: 0, cancelled: 0 },
  })

  mockFetchTodayAttendanceSessions.mockResolvedValue({
    items: [
      {
        id: 'session-1',
        classId: 'class-1',
        className: 'Morning Stars',
        roomName: 'Room 1',
        attendanceDate: '2026-05-19',
        startTime: '08:00',
        endTime: '10:00',
        status: 'scheduled',
        studentCount: 18,
      },
    ],
  })

  mockOpenAttendanceSession.mockResolvedValue({
    id: 'session-1',
    classId: 'class-1',
    className: 'Morning Stars',
    attendanceDate: '2026-05-19',
    status: 'open',
  })
})

describe('TeacherDashboard', () => {
  it('renders assigned today sessions and routes with attendance_session_id', async () => {
    const wrapper = await mountPage()
    const pushSpy = vi.spyOn(wrapper.vm.$router, 'push')

    expect(wrapper.text()).toContain('Today’s Sessions')
    expect(wrapper.text()).toContain('Morning Stars')
    expect(wrapper.text()).toContain('Room 1')
    expect(wrapper.text()).toContain('Take Attendance')

    const takeAttendanceButton = wrapper.findAll('button').find((button) => button.text().includes('Take Attendance'))
    if (takeAttendanceButton) {
      await takeAttendanceButton.trigger('click')
    }
    await flushPromises()

    expect(mockOpenAttendanceSession).toHaveBeenCalledWith('session-1')
    expect(pushSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.objectContaining({
          attendance_session_id: 'session-1',
        }),
      }),
    )
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enPreschool from '@/i18n/en/preschool'
import AttendanceStudents from '@/modules/preschool/admin/pages/attendance/AttendanceStudents.vue'

const mockFetchAcademicLifecycle = vi.fn()
const mockFetchAttendanceSession = vi.fn()
const mockFetchAttendanceSessions = vi.fn()
const mockFetchPreschoolClasses = vi.fn()
const mockFetchPreschoolStudents = vi.fn()
const mockFetchPreschoolAttendance = vi.fn()
const mockSavePreschoolAttendance = vi.fn()
const mockSaveAttendanceSessionRecords = vi.fn()

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({
    add: vi.fn(),
  }),
}))

vi.mock('@/modules/preschool/services/api/preschoolAcademicLifecycleApi', () => ({
  fetchAcademicLifecycle: (...args) => mockFetchAcademicLifecycle(...args),
}))

vi.mock('@/modules/preschool/services/api/preschoolAttendanceSessionApi', () => ({
  fetchAttendanceSession: (...args) => mockFetchAttendanceSession(...args),
  fetchAttendanceSessions: (...args) => mockFetchAttendanceSessions(...args),
  openAttendanceSession: vi.fn(() => Promise.resolve({ id: 'session-1' })),
  completeAttendanceSession: vi.fn(() => Promise.resolve({ id: 'session-1', status: 'completed' })),
  saveAttendanceSessionRecords: (...args) => mockSaveAttendanceSessionRecords(...args),
}))

vi.mock('@/modules/preschool/services/preschoolApi', () => ({
  fetchPreschoolClasses: (...args) => mockFetchPreschoolClasses(...args),
  fetchPreschoolStudents: (...args) => mockFetchPreschoolStudents(...args),
  fetchPreschoolAttendance: (...args) => mockFetchPreschoolAttendance(...args),
  savePreschoolAttendance: (...args) => mockSavePreschoolAttendance(...args),
}))

function createRoute(query = {}) {
  return {
    path: '/module/preschool-admin/attendance/students',
    name: 'dashboard-preschool-admin-attendance-students',
    component: { template: '<div />' },
    query,
  }
}

async function mountPage(routeQuery = {}) {
  const wrapper = mountWithPlugins(AttendanceStudents, {
    messages: { en: enPreschool },
    routes: [createRoute(routeQuery)],
    global: {
      stubs: {
        MainLayout: { template: '<div><slot /></div>' },
        HeaderSection: { props: ['title', 'subtitle'], template: '<header><h1>{{ title }}</h1><p>{{ subtitle }}</p></header>' },
        Button: { props: ['type', 'variant', 'size', 'loading', 'disabled'], emits: ['click'], template: '<button :disabled="disabled || loading" @click="$emit(\'click\')"><slot /></button>' },
        Select: { props: ['modelValue', 'options', 'placeholder', 'disabled'], emits: ['update:modelValue'], template: '<select :disabled="disabled"><option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option></select>' },
        Toast: { template: '<div />' },
      },
    },
  })

  await wrapper.vm.$router.push({
    name: 'dashboard-preschool-admin-attendance-students',
    query: routeQuery,
  })
  await flushPromises()
  await flushPromises()

  return wrapper
}

beforeEach(() => {
  vi.clearAllMocks()

  mockFetchAcademicLifecycle.mockResolvedValue({
    currentContext: {
      term_status: 'open',
      academic_year_id: 'ay-1',
      term_id: 'term-1',
    },
  })

  mockFetchPreschoolClasses.mockResolvedValue({
    items: [{ id: 'class-1', name: 'Morning Stars' }],
  })

  mockFetchPreschoolStudents.mockResolvedValue({
    items: [
      { id: 'student-1', fullName: 'Alice Student', studentCode: 'S-1' },
      { id: 'student-2', fullName: 'Bopha Student', studentCode: 'S-2' },
    ],
  })

  mockFetchPreschoolAttendance.mockResolvedValue({
    items: [
      { id: 'att-1', studentId: 'student-1', status: 'present', note: 'On time' },
    ],
  })

  mockFetchAttendanceSessions.mockResolvedValue({
    items: [
      {
        id: 'session-1',
        classId: 'class-1',
        className: 'Morning Stars',
        attendanceDate: '2026-05-19',
        status: 'open',
        startTime: '08:00',
        endTime: '10:00',
      },
    ],
  })

  mockFetchAttendanceSession.mockResolvedValue({
    id: 'session-1',
    classId: 'class-1',
    className: 'Morning Stars',
    attendanceDate: '2026-05-19',
    status: 'open',
    teacherName: 'Teacher One',
    roomName: 'Room 1',
    studentCount: 2,
    generatedFromSchedule: true,
  })
})

describe('AttendanceStudents', () => {
  it('uses the session API when a session id exists', async () => {
    const wrapper = await mountPage({
      classId: 'class-1',
      date: '2026-05-19',
      attendance_session_id: 'session-1',
    })

    expect(mockFetchAttendanceSession).toHaveBeenCalledWith('session-1')
    expect(mockSaveAttendanceSessionRecords).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Morning Stars')
    expect(wrapper.text()).toContain('Teacher One')
    expect(wrapper.text()).toContain('Room 1')
    expect(wrapper.text()).toContain('Save Attendance')
  })

  it('uses the legacy API when no session is selected', async () => {
    const wrapper = await mountPage({
      classId: 'class-1',
      date: '2026-05-19',
    })

    const saveButton = wrapper.findAll('button').find((button) => button.text().includes('Save Attendance'))
    if (saveButton) {
      await saveButton.trigger('click')
    }
    await flushPromises()

    expect(mockFetchAttendanceSession).not.toHaveBeenCalled()
    expect(mockSavePreschoolAttendance).toHaveBeenCalled()
  })

  it('disables edit actions for locked sessions', async () => {
    mockFetchAttendanceSession.mockResolvedValueOnce({
      id: 'session-locked',
      classId: 'class-1',
      className: 'Morning Stars',
      attendanceDate: '2026-05-19',
      status: 'locked',
      teacherName: 'Teacher One',
      roomName: 'Room 1',
      studentCount: 2,
    })

    const wrapper = await mountPage({
      classId: 'class-1',
      date: '2026-05-19',
      attendance_session_id: 'session-locked',
    })

    const shortButtons = wrapper.findAll('button').filter((button) => ['P', 'A', 'L', 'E'].includes(button.text()))
    expect(shortButtons.length).toBeGreaterThan(0)
    expect(shortButtons[0].attributes('disabled')).toBeDefined()
  })
})

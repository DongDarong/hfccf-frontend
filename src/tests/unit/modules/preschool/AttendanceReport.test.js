import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enAttendance from '@/i18n/en/preschool/attendance'
import AttendanceReport from '@/modules/preschool/admin/pages/reports/AttendanceReport.vue'
import * as preschoolApi from '@/modules/preschool/services/preschoolApi'
import * as lifecycleApi from '@/modules/preschool/services/api/preschoolAcademicLifecycleApi'

vi.mock('@/modules/preschool/services/preschoolApi', () => ({
  fetchPreschoolClasses: vi.fn(),
  fetchPreschoolStudents: vi.fn(),
  fetchPreschoolAttendance: vi.fn(),
}))

vi.mock('@/modules/preschool/services/api/preschoolAcademicLifecycleApi', () => ({
  fetchAcademicLifecycle: vi.fn(),
}))

function stubs() {
  return {
    MainLayout: { template: '<div><slot /></div>' },
    HeaderSection: { props: ['title', 'subtitle'], template: '<header><h1>{{ title }}</h1></header>' },
    Button: { emits: ['click'], template: '<button @click="$emit(\'click\')"><slot /></button>' },
    Select: { props: ['modelValue', 'options'], emits: ['update:modelValue'], template: '<select @change="$emit(\'update:modelValue\', $event.target.value)"><slot /></select>' },
  }
}

beforeEach(() => {
  vi.clearAllMocks()

  lifecycleApi.fetchAcademicLifecycle.mockResolvedValue({
    academicYears: [
      { id: 1, code: 'AY2026', label: 'Academic Year 2026' },
    ],
  })

  preschoolApi.fetchPreschoolClasses.mockResolvedValue({
    items: [
      { id: 1, name: 'Preschool-A' },
      { id: 2, name: 'Preschool-B' },
    ],
  })

  preschoolApi.fetchPreschoolStudents.mockResolvedValue({
    items: [
      { id: 1, fullName: 'Sokha', studentCode: 'P001', status: 'active' },
      { id: 2, fullName: 'Sophea', studentCode: 'P002', status: 'active' },
    ],
  })

  preschoolApi.fetchPreschoolAttendance.mockResolvedValue({
    items: [
      { studentId: 1, status: 'present', attendanceDate: '2026-07-01' },
      { studentId: 1, status: 'absent', attendanceDate: '2026-07-02' },
      { studentId: 2, status: 'present', attendanceDate: '2026-07-01' },
    ],
  })
})

describe('AttendanceReport', () => {
  it('renders the report page with filters', async () => {
    const wrapper = mountWithPlugins(AttendanceReport, {
      messages: { en: enAttendance },
      global: { stubs: stubs() },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Attendance Report')
    expect(wrapper.text()).toContain('Filters')
  })

  it('loads filter options on mount', async () => {
    mountWithPlugins(AttendanceReport, {
      messages: { en: enAttendance },
      global: { stubs: stubs() },
    })

    await flushPromises()

    expect(lifecycleApi.fetchAcademicLifecycle).toHaveBeenCalled()
    expect(preschoolApi.fetchPreschoolClasses).toHaveBeenCalled()
  })

  it('shows empty state when no report generated', async () => {
    const wrapper = mountWithPlugins(AttendanceReport, {
      messages: { en: enAttendance },
      global: { stubs: stubs() },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Select filters and click Generate Report')
  })

  it('supports monthly report period', async () => {
    const wrapper = mountWithPlugins(AttendanceReport, {
      messages: { en: enAttendance },
      global: { stubs: stubs() },
    })

    await flushPromises()

    expect(wrapper.vm.reportPeriod).toBe('monthly')
  })

  it('toggles between monthly and yearly modes', async () => {
    const wrapper = mountWithPlugins(AttendanceReport, {
      messages: { en: enAttendance },
      global: { stubs: stubs() },
    })

    await flushPromises()

    expect(wrapper.vm.reportPeriod).toBe('monthly')
    wrapper.vm.reportPeriod = 'yearly'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.reportPeriod).toBe('yearly')
  })
})

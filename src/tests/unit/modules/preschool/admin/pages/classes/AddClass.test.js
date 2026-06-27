import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enPreschool from '@/i18n/en/preschool'
import AddClass from '@/modules/preschool/admin/pages/classes/AddClass.vue'

const mockFetchTeachers = vi.fn()
const mockFetchClasses = vi.fn()
const mockFetchClass = vi.fn()
const mockCreateClass = vi.fn()
const mockUpdateClass = vi.fn()

vi.mock('@/modules/preschool/services/preschoolApi', () => ({
  fetchPreschoolTeachers: (...args) => mockFetchTeachers(...args),
  fetchPreschoolClasses: (...args) => mockFetchClasses(...args),
  fetchPreschoolClass: (...args) => mockFetchClass(...args),
  createPreschoolClass: (...args) => mockCreateClass(...args),
  updatePreschoolClass: (...args) => mockUpdateClass(...args),
}))

function mountPage() {
  return mountWithPlugins(AddClass, {
    messages: {
      en: enPreschool,
    },
    global: {
      stubs: {
        MainLayout: { template: '<div><slot /></div>' },
        HeaderSection: { props: ['title', 'subtitle'], template: '<div data-testid="header">{{ title }} {{ subtitle }}</div>' },
        AdminSummaryCards: { template: '<div data-testid="summary" />' },
        AdminChecklistPanel: { template: '<aside data-testid="checklist" />' },
        AlertError: { template: '<div data-testid="error" />' },
        AlertSuccess: { template: '<div data-testid="success" />' },
      },
    },
  })
}

beforeEach(() => {
  mockFetchTeachers.mockReset()
  mockFetchClasses.mockReset()
  mockFetchClass.mockReset()
  mockCreateClass.mockReset()
  mockUpdateClass.mockReset()

  mockFetchTeachers.mockResolvedValue({
    items: [
      {
        id: 'teacher-1',
        fullName: 'Teacher Alpha',
      },
    ],
  })

  mockFetchClasses.mockImplementation(({ level } = {}) => {
    if (level === 'Kindergarten A') {
      return Promise.resolve({
        items: [
          { code: 'PS-KIN-01' },
        ],
      })
    }

    return Promise.resolve({
      items: [
        { code: 'PS-NUR-01' },
        { code: 'PS-NUR-02' },
      ],
    })
  })

  mockFetchClass.mockResolvedValue(null)
  mockCreateClass.mockResolvedValue({ id: 'class-1' })
  mockUpdateClass.mockResolvedValue({ id: 'class-1' })
})

describe('AddClass', () => {
  it('renders generated code, schedule options, and shared footer actions', async () => {
    const wrapper = mountPage()

    await flushPromises()

    expect(mockFetchTeachers).toHaveBeenCalled()
    expect(mockFetchClasses).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'Nursery',
      }),
    )
    expect(wrapper.text()).toContain('PS-NUR-03')
    expect(wrapper.text()).toContain('Create Class')
    expect(wrapper.text()).toContain('Back to Classes')

    const scheduleOptions = wrapper.find('[data-testid="add-class-schedule-select"]').findAll('option').map((option) => option.text())
    expect(scheduleOptions).toContain('Select a schedule')
    expect(scheduleOptions.some((label) => label.includes('Morning'))).toBe(true)
    expect(scheduleOptions.some((label) => label.includes('Afternoon'))).toBe(true)
    expect(scheduleOptions.some((label) => label.includes('Full Day'))).toBe(true)
    expect(scheduleOptions.some((label) => label.includes('Custom / To be scheduled'))).toBe(true)
  })

  it('regenerates the class code when the level changes and submits the selected schedule', async () => {
    const wrapper = mountPage()
    const fields = wrapper.findComponent({ name: 'AddClassFormFields' })

    await flushPromises()

    fields.vm.$emit('update:name', 'Morning Nursery Blue')
    fields.vm.$emit('update:teacher', 'teacher-1')
    fields.vm.$emit('update:room', 'A1')
    fields.vm.$emit('update:notes', 'Optional note')
    fields.vm.$emit('update:students', 12)
    fields.vm.$emit('update:status', 'active')
    fields.vm.$emit('update:schedule', 'Afternoon')
    await flushPromises()

    expect(wrapper.text()).toContain('PS-NUR-03')

    fields.vm.$emit('update:level', 'Kindergarten A')
    await flushPromises()

    expect(mockFetchClasses).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'Kindergarten A',
      }),
    )
    expect(wrapper.text()).toContain('PS-KIN-02')

    await wrapper.find('form').trigger('submit.prevent')

    expect(mockCreateClass).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'PS-KIN-02',
        name: 'Morning Nursery Blue',
        teacher_user_id: 'teacher-1',
        level: 'Kindergarten A',
        schedule: 'Afternoon',
        students_count: 12,
        status: 'active',
        room: 'A1',
        notes: 'Optional note',
      }),
    )
  })
})

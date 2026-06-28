import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enPreschool from '@/i18n/en/preschool'
import khPreschool from '@/i18n/kh/preschool'
import AddClass from '@/modules/preschool/admin/pages/classes/AddClass.vue'

const mockFetchTeachers = vi.fn()
const mockFetchStudents = vi.fn()
const mockFetchClasses = vi.fn()
const mockFetchClass = vi.fn()
const mockCreateClass = vi.fn()
const mockUpdateClass = vi.fn()

vi.mock('@/modules/preschool/services/preschoolApi', () => ({
  fetchPreschoolTeachers: (...args) => mockFetchTeachers(...args),
  fetchPreschoolStudents: (...args) => mockFetchStudents(...args),
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
        MultiSelect: {
          name: 'MultiSelect',
          props: ['modelValue', 'options', 'placeholder', 'loading', 'disabled'],
          template: '<div data-testid="student-multiselect" />',
        },
      },
    },
  })
}

beforeEach(() => {
  mockFetchTeachers.mockReset()
  mockFetchStudents.mockReset()
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

  mockFetchStudents.mockResolvedValue({
    items: [
      {
        id: 101,
        fullName: 'រ៉ា សុភក្ត្រា',
        publicId: 'STU-HFCCF-0005',
        avatarUrl: '',
        status: 'active',
      },
      {
        id: 202,
        fullName: 'លី មុន្នី',
        publicId: 'STU-HFCCF-0009',
        avatarUrl: '',
        status: 'active',
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
  it('renders generated code, student multiselect, and shared footer actions', async () => {
    const wrapper = mountPage()

    await flushPromises()

    expect(mockFetchTeachers).toHaveBeenCalled()
    expect(mockFetchStudents).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'active',
        perPage: 100,
      }),
    )
    expect(mockFetchClasses).toHaveBeenCalledWith(
      expect.objectContaining({
        level: '',
      }),
    )
    expect(wrapper.text()).toContain('PS-CLS-01')
    expect(wrapper.text()).toContain('Create Class')
    expect(wrapper.text()).toContain('Cancel')
    expect(wrapper.text()).toContain('Selected: 0 students')

    expect(wrapper.find('[data-testid="add-class-level-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="add-class-schedule-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="add-class-code-preview"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="student-multiselect"]').exists()).toBe(true)
    expect(wrapper.find('input[type="number"]').exists()).toBe(false)
  })

  it('updates the selected student count and submits student ids', async () => {
    const wrapper = mountPage()
    const fields = wrapper.findComponent({ name: 'AddClassFormFields' })

    await flushPromises()

    fields.vm.$emit('update:name', 'Morning Nursery Blue')
    fields.vm.$emit('update:teacher', 'teacher-1')
    fields.vm.$emit('update:selectedStudentIds', [101, 202])
    fields.vm.$emit('update:room', 'A1')
    fields.vm.$emit('update:notes', 'Optional note')
    fields.vm.$emit('update:status', 'active')

    await wrapper.find('[data-testid="add-class-level-input"]').setValue('Level A')
    await wrapper.find('[data-testid="add-class-schedule-input"]').setValue('Afternoon')
    await flushPromises()

    expect(wrapper.text()).toContain('PS-LEV-01')
    expect(wrapper.text()).toContain('Selected: 2 students')

    expect(mockFetchClasses).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'Level A',
      }),
    )

    await wrapper.find('form').trigger('submit.prevent')

    expect(mockCreateClass).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'PS-LEV-01',
        name: 'Morning Nursery Blue',
        teacher_user_id: 'teacher-1',
        level: 'Level A',
        schedule: 'Afternoon',
        students_count: 2,
        student_ids: [101, 202],
        status: 'active',
        room: 'A1',
        notes: 'Optional note',
      }),
    )
  })

  it('keeps the selected count as the submitted fallback when student assignment data is unavailable', async () => {
    mockFetchClass.mockResolvedValueOnce({
      id: 'class-1',
      code: 'PS-KIN-02',
      name: 'Kindergarten A',
      teacherUserId: 'teacher-1',
      teacherDisplayName: 'Teacher Alpha',
      level: 'Kindergarten A',
      schedule: 'Morning',
      studentsCount: 5,
      studentAssignments: [],
      activeStudentAssignments: [],
      status: 'active',
      room: 'Room 1',
      notes: '',
    })

    const wrapper = mountPage()

    await wrapper.vm.$router.push({ query: { mode: 'edit', id: 'class-1' } })
    await flushPromises()

    expect(wrapper.text()).toContain('Selected: 5 students')

    await wrapper.find('form').trigger('submit.prevent')

    expect(mockUpdateClass).toHaveBeenCalledWith(
      'class-1',
      expect.objectContaining({
        students_count: 5,
      }),
    )

    expect(mockUpdateClass.mock.calls[0][1]).not.toHaveProperty('student_ids')
  })

  it('exposes the localized student selector copy in both languages', () => {
    expect(enPreschool.preschoolAddClass.selectStudents).toBe('Select students')
    expect(enPreschool.preschoolAddClass.noStudentsFound).toBe('No students found')
    expect(enPreschool.preschoolAddClass.loadingStudents).toBe('Loading students...')
    expect(enPreschool.preschoolAddClass.selectedStudentsCount).toBe('Selected: {count} students')
    expect(enPreschool.preschoolAddClass.studentAssignment).toBe('Student assignment')
    expect(enPreschool.preschoolAddClass.selectedStudents).toBe('Selected students')

    expect(khPreschool.preschoolAddClass.selectStudents).toBe('ជ្រើសរើសសិស្ស')
    expect(khPreschool.preschoolAddClass.noStudentsFound).toBe('រកមិនឃើញសិស្ស')
    expect(khPreschool.preschoolAddClass.loadingStudents).toBe('កំពុងផ្ទុកសិស្ស...')
    expect(khPreschool.preschoolAddClass.selectedStudentsCount).toBe('បានជ្រើស: {count} នាក់')
    expect(khPreschool.preschoolAddClass.studentAssignment).toBe('ការចាត់តាំងសិស្ស')
    expect(khPreschool.preschoolAddClass.selectedStudents).toBe('សិស្សដែលបានជ្រើស')
  })
})

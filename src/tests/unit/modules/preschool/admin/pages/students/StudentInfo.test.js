import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enPreschool from '@/i18n/en/preschool'
import StudentInfo from '@/modules/preschool/admin/pages/students/StudentInfo.vue'

const mockFetchPreschoolClasses = vi.fn()
const mockFetchPreschoolStudents = vi.fn()
const mockDeletePreschoolStudent = vi.fn()

vi.mock('@/modules/preschool/services/preschoolApi', () => ({
  fetchPreschoolClasses: (...args) => mockFetchPreschoolClasses(...args),
  fetchPreschoolStudents: (...args) => mockFetchPreschoolStudents(...args),
  deletePreschoolStudent: (...args) => mockDeletePreschoolStudent(...args),
}))

function mountPage() {
  return mountWithPlugins(StudentInfo, {
    messages: {
      en: enPreschool,
    },
    global: {
      stubs: {
        MainLayout: { template: '<div><slot /></div>' },
        HeaderSection: {
          props: ['title', 'subtitle'],
          template: '<header><h1>{{ title }}</h1><p>{{ subtitle }}</p></header>',
        },
        Pagination: {
          props: ['modelValue', 'totalPages'],
          template: '<div data-testid="pagination-stub" />',
        },
        AlertQuestion: {
          props: ['show'],
          template: '<div v-if="show" data-testid="alert-question-stub" />',
        },
        AlertSuccess: {
          props: ['show'],
          template: '<div v-if="show" data-testid="alert-success-stub" />',
        },
        Button: {
          props: ['disabled'],
          emits: ['click'],
          template: '<button :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
        },
        Table: {
          props: ['rows', 'columns', 'loading', 'emptyText'],
          template:
            '<div data-testid="student-table">{{ rows?.length || 0 }}|{{ rows?.[0]?.avatarUrl || "" }}</div>',
        },
      },
    },
  })
}

beforeEach(() => {
  vi.clearAllMocks()

  mockFetchPreschoolClasses.mockResolvedValue({
    items: [
      {
        id: 'class-1',
        code: 'PS-01',
        name: 'Morning Stars',
      },
    ],
    pagination: { page: 1, perPage: 100, total: 1, totalPages: 1 },
  })

  mockFetchPreschoolStudents.mockImplementation(({ search = '', status = '', gender = '', classId = '' } = {}) => {
    const hasFilters = Boolean(search || status || gender || classId)

    return Promise.resolve({
      items: hasFilters
        ? [
            {
              id: 'student-1',
              fullName: 'Alice Student',
              avatarUrl: '/uploads/alice-filtered.jpg',
              status: 'active',
              gender: 'female',
              className: 'Morning Stars',
            },
          ]
        : [
            {
              id: 'student-1',
              fullName: 'Alice Student',
              avatarUrl: '/uploads/alice-full-list.jpg',
              status: 'active',
              gender: 'female',
              className: 'Morning Stars',
            },
            {
              id: 'student-2',
              fullName: 'Ben Student',
              avatarUrl: '',
              status: 'pending',
              gender: 'male',
              className: 'Morning Stars',
            },
          ],
      pagination: { page: 1, perPage: 10, total: hasFilters ? 1 : 2, totalPages: 1 },
    })
  })
})

describe('StudentInfo', () => {
  it('keeps the student avatar url through filtering and resets filters back to the full list', async () => {
    const wrapper = mountPage()

    await flushPromises()

    expect(mockFetchPreschoolStudents).toHaveBeenCalledWith(expect.objectContaining({
      page: 1,
      perPage: 10,
      search: '',
      status: '',
      gender: '',
      classId: '',
    }))
    expect(wrapper.find('[data-testid="student-table"]').text()).toBe('2|/uploads/alice-full-list.jpg')

    const searchInput = wrapper.find('input[type="search"]')
    const statusSelect = wrapper.findAll('select').at(0)
    const genderSelect = wrapper.findAll('select').at(1)
    const classSelect = wrapper.findAll('select').at(2)

    await searchInput.setValue('Alice')
    await statusSelect.setValue('active')
    await genderSelect.setValue('female')
    await classSelect.setValue('class-1')
    await flushPromises()

    expect(mockFetchPreschoolStudents).toHaveBeenLastCalledWith(expect.objectContaining({
      page: 1,
      perPage: 10,
      search: 'Alice',
      status: 'active',
      gender: 'female',
      classId: 'class-1',
    }))
    expect(wrapper.find('[data-testid="student-table"]').text()).toBe('1|/uploads/alice-filtered.jpg')

    const clearButton = wrapper.findAll('button').find((button) => button.text() === 'Clear Filters')
    await clearButton.trigger('click')
    await flushPromises()

    expect(searchInput.element.value).toBe('')
    expect(statusSelect.element.value).toBe('')
    expect(genderSelect.element.value).toBe('')
    expect(classSelect.element.value).toBe('')
    expect(clearButton.attributes('disabled')).toBeDefined()
    expect(wrapper.find('[data-testid="student-table"]').text()).toBe('2|/uploads/alice-full-list.jpg')
    expect(mockFetchPreschoolStudents).toHaveBeenLastCalledWith(expect.objectContaining({
      page: 1,
      perPage: 10,
      search: '',
      status: '',
      gender: '',
      classId: '',
    }))
  })
})

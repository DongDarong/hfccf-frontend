import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as englishApi from '@/modules/english/services/englishApi'

const mockHttpRequest = vi.fn()
const mockBuildQueryParams = vi.fn()
const mockGetApiErrorMessage = vi.fn()
const mockUnwrapApiData = vi.fn()
const mockUnwrapApiItems = vi.fn()
const mockUnwrapApiPagination = vi.fn()

vi.mock('@/services/http', () => ({
  default: {
    request: (...args) => mockHttpRequest(...args),
  },
}))

vi.mock('@/services/api', () => ({
  buildQueryParams: (...args) => mockBuildQueryParams(...args),
  getApiErrorMessage: (...args) => mockGetApiErrorMessage(...args),
  unwrapApiData: (...args) => mockUnwrapApiData(...args),
  unwrapApiItems: (...args) => mockUnwrapApiItems(...args),
  unwrapApiPagination: (...args) => mockUnwrapApiPagination(...args),
}))

beforeEach(() => {
  vi.clearAllMocks()
  mockGetApiErrorMessage.mockReturnValue('Unable to complete the request.')
  mockBuildQueryParams.mockReturnValue({})
  mockUnwrapApiData.mockReturnValue(null)
  mockUnwrapApiItems.mockReturnValue([])
  mockUnwrapApiPagination.mockReturnValue({ page: 1, perPage: 10, total: 0, totalPages: 0 })
})

describe('englishApi', () => {
  describe('fetchEnglishDashboard', () => {
    it('fetches dashboard data and unwraps response', async () => {
      const mockData = { summaryStats: { activeClasses: 5 } }
      mockHttpRequest.mockResolvedValueOnce({ data: mockData })
      mockUnwrapApiData.mockReturnValueOnce(mockData)

      const result = await englishApi.fetchEnglishDashboard()

      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: '/english/dashboard',
        }),
      )
      expect(result).toEqual(mockData)
    })

    it('returns empty object when response is null', async () => {
      mockHttpRequest.mockResolvedValueOnce({ data: null })
      mockUnwrapApiData.mockReturnValueOnce(null)

      const result = await englishApi.fetchEnglishDashboard()

      expect(result).toEqual({})
    })

    it('throws error on http request failure', async () => {
      const error = new Error('Network error')
      mockHttpRequest.mockRejectedValueOnce(error)
      mockGetApiErrorMessage.mockReturnValueOnce('Network error')

      await expect(englishApi.fetchEnglishDashboard()).rejects.toThrow()
    })
  })

  describe('fetchTeacherDashboard', () => {
    it('fetches teacher dashboard data', async () => {
      const mockData = { myClasses: 3, myStudents: 45 }
      mockHttpRequest.mockResolvedValueOnce({ data: mockData })
      mockUnwrapApiData.mockReturnValueOnce(mockData)

      const result = await englishApi.fetchTeacherDashboard()

      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: '/english/teacher/dashboard',
        }),
      )
      expect(result).toEqual(mockData)
    })
  })

  describe('fetchEnglishTeachers', () => {
    it('fetches teachers with default pagination', async () => {
      const mockItems = [{ id: 1, name: 'Teacher A' }]
      const mockPagination = { page: 1, perPage: 10, total: 1, totalPages: 1 }
      mockHttpRequest.mockResolvedValueOnce({})
      mockUnwrapApiItems.mockReturnValueOnce(mockItems)
      mockUnwrapApiPagination.mockReturnValueOnce(mockPagination)
      mockBuildQueryParams.mockReturnValueOnce({})

      const result = await englishApi.fetchEnglishTeachers()

      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: '/english/teachers',
          params: {},
        }),
      )
      expect(result).toEqual({ items: mockItems, pagination: mockPagination })
    })

    it('normalizes perPage param to per_page', async () => {
      mockHttpRequest.mockResolvedValueOnce({})
      mockUnwrapApiItems.mockReturnValueOnce([])
      mockUnwrapApiPagination.mockReturnValueOnce({})
      mockBuildQueryParams.mockReturnValueOnce({ perPage: 20 })

      await englishApi.fetchEnglishTeachers({ perPage: 20 })

      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({ per_page: 20 }),
        }),
      )
    })

    it('preserves other query params', async () => {
      mockHttpRequest.mockResolvedValueOnce({})
      mockUnwrapApiItems.mockReturnValueOnce([])
      mockUnwrapApiPagination.mockReturnValueOnce({})
      mockBuildQueryParams.mockReturnValueOnce({ search: 'john', sort: 'name' })

      await englishApi.fetchEnglishTeachers({ search: 'john', sort: 'name' })

      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            search: 'john',
            sort: 'name',
          }),
        }),
      )
    })
  })

  describe('createEnglishTeacher', () => {
    it('creates teacher and unwraps user entity', async () => {
      const payload = { name: 'John Doe', email: 'john@example.com' }
      const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' }
      mockHttpRequest.mockResolvedValueOnce({ data: { user: mockUser } })
      mockUnwrapApiData.mockReturnValueOnce({ user: mockUser })

      const result = await englishApi.createEnglishTeacher(payload)

      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: '/english/teachers',
          data: payload,
        }),
      )
      expect(result).toEqual(mockUser)
    })

    it('returns payload when user entity not found', async () => {
      mockHttpRequest.mockResolvedValueOnce({})
      mockUnwrapApiData.mockReturnValueOnce({ message: 'Created' })

      const result = await englishApi.createEnglishTeacher({})

      expect(result).toEqual({ message: 'Created' })
    })
  })

  describe('updateEnglishTeacher', () => {
    it('updates teacher with trimmed ID', async () => {
      const payload = { name: 'Updated Name' }
      mockHttpRequest.mockResolvedValueOnce({})
      mockUnwrapApiData.mockReturnValueOnce({})

      await englishApi.updateEnglishTeacher('  123  ', payload)

      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: '/english/teachers/123',
        }),
      )
    })

    it('encodes special characters in ID', async () => {
      mockHttpRequest.mockResolvedValueOnce({})
      mockUnwrapApiData.mockReturnValueOnce({})

      await englishApi.updateEnglishTeacher('user@domain.com', {})

      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/english/teachers/user%40domain.com',
        }),
      )
    })
  })

  describe('deleteEnglishTeacher', () => {
    it('deletes teacher and returns true', async () => {
      mockHttpRequest.mockResolvedValueOnce({})

      const result = await englishApi.deleteEnglishTeacher('123')

      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'delete',
          url: '/english/teachers/123',
        }),
      )
      expect(result).toBe(true)
    })
  })

  describe('fetchEnglishStudents', () => {
    it('fetches students with pagination', async () => {
      const mockItems = [{ id: 1, name: 'Student A' }]
      const mockPagination = { page: 2, perPage: 20, total: 100, totalPages: 5 }
      mockHttpRequest.mockResolvedValueOnce({})
      mockUnwrapApiItems.mockReturnValueOnce(mockItems)
      mockUnwrapApiPagination.mockReturnValueOnce(mockPagination)
      mockBuildQueryParams.mockReturnValueOnce({ page: 2, perPage: 20 })

      const result = await englishApi.fetchEnglishStudents({ page: 2, perPage: 20 })

      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: '/english/students',
        }),
      )
      expect(result).toEqual({ items: mockItems, pagination: mockPagination })
    })
  })

  describe('createEnglishStudent', () => {
    it('creates student and unwraps student entity', async () => {
      const payload = { name: 'Jane Doe' }
      const mockStudent = { id: 1, name: 'Jane Doe' }
      mockHttpRequest.mockResolvedValueOnce({})
      mockUnwrapApiData.mockReturnValueOnce({ student: mockStudent })

      const result = await englishApi.createEnglishStudent(payload)

      expect(result).toEqual(mockStudent)
    })
  })

  describe('updateEnglishStudent', () => {
    it('updates student with trimmed ID', async () => {
      mockHttpRequest.mockResolvedValueOnce({})
      mockUnwrapApiData.mockReturnValueOnce({})

      await englishApi.updateEnglishStudent('  456  ', { name: 'Updated' })

      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/english/students/456',
        }),
      )
    })
  })

  describe('deleteEnglishStudent', () => {
    it('deletes student and returns true', async () => {
      mockHttpRequest.mockResolvedValueOnce({})

      const result = await englishApi.deleteEnglishStudent('456')

      expect(result).toBe(true)
    })
  })

  describe('fetchEnglishClasses', () => {
    it('fetches classes with params', async () => {
      const mockItems = [{ id: 1, name: 'Class A' }]
      mockHttpRequest.mockResolvedValueOnce({})
      mockUnwrapApiItems.mockReturnValueOnce(mockItems)
      mockUnwrapApiPagination.mockReturnValueOnce({})
      mockBuildQueryParams.mockReturnValueOnce({ status: 'active' })

      const result = await englishApi.fetchEnglishClasses({ status: 'active' })

      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/english/classes',
        }),
      )
      expect(result.items).toEqual(mockItems)
    })
  })

  describe('createEnglishClass', () => {
    it('creates class and unwraps class entity', async () => {
      const payload = { name: 'Class A', level: 1 }
      const mockClass = { id: 1, name: 'Class A', level: 1 }
      mockHttpRequest.mockResolvedValueOnce({})
      mockUnwrapApiData.mockReturnValueOnce({ class: mockClass })

      const result = await englishApi.createEnglishClass(payload)

      expect(result).toEqual(mockClass)
    })
  })

  describe('updateEnglishClass', () => {
    it('updates class with encoded ID', async () => {
      mockHttpRequest.mockResolvedValueOnce({})
      mockUnwrapApiData.mockReturnValueOnce({})

      await englishApi.updateEnglishClass('class#1', { name: 'Updated' })

      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/english/classes/class%231',
        }),
      )
    })
  })

  describe('deleteEnglishClass', () => {
    it('deletes class and returns true', async () => {
      mockHttpRequest.mockResolvedValueOnce({})

      const result = await englishApi.deleteEnglishClass('1')

      expect(result).toBe(true)
    })
  })

  describe('fetchEnglishTasks', () => {
    it('fetches tasks', async () => {
      mockHttpRequest.mockResolvedValueOnce({})
      mockUnwrapApiItems.mockReturnValueOnce([{ id: 1 }])
      mockUnwrapApiPagination.mockReturnValueOnce({})

      const result = await englishApi.fetchEnglishTasks()

      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/english/tasks',
        }),
      )
      expect(result.items).toHaveLength(1)
    })
  })

  describe('createEnglishTask', () => {
    it('creates task and unwraps task entity', async () => {
      const mockTask = { id: 1, title: 'Task A' }
      mockHttpRequest.mockResolvedValueOnce({})
      mockUnwrapApiData.mockReturnValueOnce({ task: mockTask })

      const result = await englishApi.createEnglishTask({ title: 'Task A' })

      expect(result).toEqual(mockTask)
    })
  })

  describe('updateEnglishTask', () => {
    it('updates task with trimmed ID', async () => {
      mockHttpRequest.mockResolvedValueOnce({})
      mockUnwrapApiData.mockReturnValueOnce({})

      await englishApi.updateEnglishTask('  789  ', { title: 'Updated' })

      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/english/tasks/789',
        }),
      )
    })
  })

  describe('deleteEnglishTask', () => {
    it('deletes task and returns true', async () => {
      mockHttpRequest.mockResolvedValueOnce({})

      const result = await englishApi.deleteEnglishTask('789')

      expect(result).toBe(true)
    })
  })

  describe('fetchEnglishSubmissions', () => {
    it('fetches submissions', async () => {
      mockHttpRequest.mockResolvedValueOnce({})
      mockUnwrapApiItems.mockReturnValueOnce([{ id: 1 }])
      mockUnwrapApiPagination.mockReturnValueOnce({})

      const result = await englishApi.fetchEnglishSubmissions()

      expect(result.items).toHaveLength(1)
    })
  })

  describe('createEnglishSubmission', () => {
    it('creates submission and unwraps submission entity', async () => {
      const mockSubmission = { id: 1, taskId: 1 }
      mockHttpRequest.mockResolvedValueOnce({})
      mockUnwrapApiData.mockReturnValueOnce({ submission: mockSubmission })

      const result = await englishApi.createEnglishSubmission({ taskId: 1 })

      expect(result).toEqual(mockSubmission)
    })
  })

  describe('updateEnglishSubmission', () => {
    it('updates submission with trimmed ID', async () => {
      mockHttpRequest.mockResolvedValueOnce({})
      mockUnwrapApiData.mockReturnValueOnce({})

      await englishApi.updateEnglishSubmission('  999  ', { status: 'graded' })

      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/english/submissions/999',
        }),
      )
    })
  })

  describe('fetchTeacherClasses', () => {
    it('fetches teacher-scoped classes', async () => {
      mockHttpRequest.mockResolvedValueOnce({})
      mockUnwrapApiItems.mockReturnValueOnce([{ id: 1, name: 'My Class' }])
      mockUnwrapApiPagination.mockReturnValueOnce({})

      const result = await englishApi.fetchTeacherClasses()

      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/english/teacher/classes',
        }),
      )
      expect(result.items[0].name).toBe('My Class')
    })
  })

  describe('fetchTeacherStudents', () => {
    it('fetches teacher-scoped students', async () => {
      mockHttpRequest.mockResolvedValueOnce({})
      mockUnwrapApiItems.mockReturnValueOnce([{ id: 1, name: 'My Student' }])
      mockUnwrapApiPagination.mockReturnValueOnce({})

      const result = await englishApi.fetchTeacherStudents()

      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/english/teacher/students',
        }),
      )
    })
  })

  describe('fetchTeacherTasks', () => {
    it('fetches teacher-scoped tasks', async () => {
      mockHttpRequest.mockResolvedValueOnce({})
      mockUnwrapApiItems.mockReturnValueOnce([{ id: 1, title: 'My Task' }])
      mockUnwrapApiPagination.mockReturnValueOnce({})

      const result = await englishApi.fetchTeacherTasks()

      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/english/teacher/tasks',
        }),
      )
    })
  })
})

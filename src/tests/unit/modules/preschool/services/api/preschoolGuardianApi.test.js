import { beforeEach, describe, expect, it, vi } from 'vitest'
import http from '@/services/http'
import {
  archiveGuardian,
  archiveStudentGuardian,
  archiveStudentGuardianByPair,
  createGuardian,
  fetchEmergencyContacts,
  fetchGuardian,
  fetchGuardians,
  fetchStudentGuardians,
  linkStudentGuardian,
  restoreStudentGuardianByPair,
  setPrimaryStudentGuardian,
  updateGuardian,
  updateStudentGuardian,
  updateStudentGuardianByPair,
} from '@/modules/preschool/services/api/preschoolGuardianApi'

// Keep the guardian HTTP contract tested so the new Preschool relationship
// screens cannot drift into wrong endpoints or unsafe pagination limits.
vi.mock('@/services/http', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

function stubResponse(data) {
  return { data: { success: true, message: 'ok', data } }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('preschool guardian api', () => {
  it('clamps guardian list pagination and resolves the correct endpoints', async () => {
    http.get.mockResolvedValueOnce(stubResponse({ items: [] }))

    await fetchGuardians({ page: 2, perPage: 250, search: '  mom  ', status: 'active' })

    expect(http.get).toHaveBeenCalledWith('/preschool/guardians', expect.objectContaining({
      params: expect.objectContaining({
        page: 2,
        per_page: 100,
        search: 'mom',
        status: 'active',
      }),
    }))
  })

  it('covers the guardian and relationship CRUD endpoints', async () => {
    http.get.mockResolvedValueOnce(stubResponse({ guardian: { id: 11, full_name: 'Guardian One' } }))
    await expect(fetchGuardian(11)).resolves.toMatchObject({ id: 11, fullName: 'Guardian One' })
    expect(http.get).toHaveBeenCalledWith('/preschool/guardians/11', { signal: undefined })

    http.post.mockResolvedValueOnce(stubResponse({ guardian: { id: 12, full_name: 'Guardian Two' } }))
    await expect(createGuardian({ full_name: 'Guardian Two', phone: '012345678' })).resolves.toMatchObject({ id: 12, fullName: 'Guardian Two' })
    expect(http.post).toHaveBeenCalledWith('/preschool/guardians', { full_name: 'Guardian Two', phone: '012345678' })

    http.patch.mockResolvedValueOnce(stubResponse({ guardian: { id: 12, full_name: 'Guardian Two Updated' } }))
    await expect(updateGuardian(12, { full_name: 'Guardian Two Updated' })).resolves.toMatchObject({ id: 12, fullName: 'Guardian Two Updated' })
    expect(http.patch).toHaveBeenCalledWith('/preschool/guardians/12', { full_name: 'Guardian Two Updated' })

    http.delete.mockResolvedValueOnce({})
    await expect(archiveGuardian(12)).resolves.toBe(true)
    expect(http.delete).toHaveBeenCalledWith('/preschool/guardians/12')

    http.get.mockResolvedValueOnce(stubResponse({ items: [] }))
    await fetchStudentGuardians(7)
    expect(http.get).toHaveBeenCalledWith('/preschool/students/7/guardians', { signal: undefined })

    http.post.mockResolvedValueOnce(stubResponse({ relationship: { id: 21, guardian_name: 'Guardian One' } }))
    await expect(linkStudentGuardian(7, { guardian_id: 11 })).resolves.toMatchObject({ id: 21, guardianName: 'Guardian One' })
    expect(http.post).toHaveBeenCalledWith('/preschool/students/7/guardians', { guardian_id: 11 })

    http.patch.mockResolvedValueOnce(stubResponse({ relationship: { id: 21, guardian_name: 'Guardian One Updated' } }))
    await expect(updateStudentGuardian(21, { status: 'inactive' })).resolves.toMatchObject({ id: 21, guardianName: 'Guardian One Updated' })
    expect(http.patch).toHaveBeenCalledWith('/preschool/student-guardians/21', { status: 'inactive' })

    http.delete.mockResolvedValueOnce({})
    await expect(archiveStudentGuardian(21)).resolves.toBe(true)
    expect(http.delete).toHaveBeenCalledWith('/preschool/student-guardians/21')

    http.get.mockResolvedValueOnce(
      stubResponse({
        items: [
          { id: 1, relationship_type: 'father', emergency_priority: 2, guardian_name: 'Second Contact' },
          { id: 2, relationship_type: 'mother', is_primary: true, emergency_priority: 1, guardian_name: 'Primary Contact' },
        ],
      }),
    )
    await expect(fetchEmergencyContacts(7)).resolves.toMatchObject({
      items: [
        { id: 2, guardianName: 'Primary Contact' },
        { id: 1, guardianName: 'Second Contact' },
      ],
    })
    expect(http.get).toHaveBeenCalledWith('/preschool/students/7/emergency-contacts', { signal: undefined })

    http.put.mockResolvedValueOnce(stubResponse({ relationship: { id: 31, guardian_name: 'Pair Update' } }))
    await expect(updateStudentGuardianByPair(7, 11, { notes: 'Updated via pair route' })).resolves.toMatchObject({
      id: 31,
      guardianName: 'Pair Update',
    })
    expect(http.put).toHaveBeenCalledWith('/preschool/students/7/guardians/11', { notes: 'Updated via pair route' })

    http.post.mockResolvedValueOnce(stubResponse({ relationship: { id: 32, guardian_name: 'Primary Pair' } }))
    await expect(setPrimaryStudentGuardian(7, 11)).resolves.toMatchObject({ id: 32, guardianName: 'Primary Pair' })
    expect(http.post).toHaveBeenCalledWith('/preschool/students/7/guardians/11/set-primary')

    http.post.mockResolvedValueOnce(stubResponse({ relationship: { id: 32, guardian_name: 'Archived Pair' } }))
    await expect(archiveStudentGuardianByPair(7, 11)).resolves.toMatchObject({
      id: 32,
      guardianName: 'Archived Pair',
    })
    expect(http.post).toHaveBeenCalledWith('/preschool/students/7/guardians/11/archive')

    http.post.mockResolvedValueOnce(stubResponse({ relationship: { id: 33, guardian_name: 'Restored Pair' } }))
    await expect(restoreStudentGuardianByPair(7, 11)).resolves.toMatchObject({
      id: 33,
      guardianName: 'Restored Pair',
    })
    expect(http.post).toHaveBeenCalledWith('/preschool/students/7/guardians/11/restore')
  })
})

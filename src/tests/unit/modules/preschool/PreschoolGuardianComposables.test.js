import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  archiveGuardian,
  archiveStudentGuardian,
  createGuardian,
  fetchEmergencyContacts,
  fetchGuardians,
  fetchStudentGuardians,
  linkStudentGuardian,
  updateGuardian,
  updateStudentGuardian,
} from '@/modules/preschool/services/api/preschoolGuardianApi'
import { fetchMyPreschoolStudents, fetchPreschoolStudents } from '@/modules/preschool/services/preschoolApi'
import { useEmergencyContacts } from '@/modules/preschool/composables/useEmergencyContacts'
import { usePreschoolGuardians } from '@/modules/preschool/composables/usePreschoolGuardians'
import { useStudentGuardians } from '@/modules/preschool/composables/useStudentGuardians'

// Keep the guardian composables covered so the new relationship workflows do
// not regress into broken state management or missing fallback messages.
vi.mock('@/composables/useLanguage', () => ({
  useLanguage: () => ({ t: (key) => key }),
}))

vi.mock('@/modules/preschool/services/api/preschoolGuardianApi', () => ({
  fetchGuardians: vi.fn(),
  createGuardian: vi.fn(),
  fetchGuardian: vi.fn(),
  updateGuardian: vi.fn(),
  archiveGuardian: vi.fn(),
  fetchStudentGuardians: vi.fn(),
  linkStudentGuardian: vi.fn(),
  updateStudentGuardian: vi.fn(),
  archiveStudentGuardian: vi.fn(),
  fetchEmergencyContacts: vi.fn(),
}))

vi.mock('@/modules/preschool/services/preschoolApi', () => ({
  fetchPreschoolStudents: vi.fn(),
  fetchMyPreschoolStudents: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('preschool guardian composables', () => {
  it('loads, saves, and archives guardian master records', async () => {
    fetchGuardians.mockResolvedValueOnce({
      items: [{ id: 1, full_name: 'Guardian One', phone: '012345678' }],
      pagination: { page: 1, perPage: 10, total: 1, totalPages: 1 },
    })
    createGuardian.mockResolvedValueOnce({ id: 2, fullName: 'Guardian Two' })
    updateGuardian.mockResolvedValueOnce({ id: 1, fullName: 'Guardian One Updated' })
    archiveGuardian.mockResolvedValueOnce(true)

    const guard = usePreschoolGuardians()
    await guard.loadGuardians()
    expect(guard.guardians.value).toHaveLength(1)

    guard.guardianForm.full_name = 'Guardian Two'
    guard.guardianForm.phone = '012345679'
    const created = await guard.saveGuardian()
    expect(created.fullName).toBe('Guardian Two')

    guard.openEditGuardian({ id: 1, fullName: 'Guardian One', phone: '012345678' })
    guard.guardianForm.full_name = 'Guardian One Updated'
    const updated = await guard.saveGuardian()
    expect(updated.fullName).toBe('Guardian One Updated')

    await guard.archiveSelectedGuardian(1)
    expect(archiveGuardian).toHaveBeenCalledWith('1')
  })

  it('loads student relationships and ordered emergency contacts', async () => {
    fetchPreschoolStudents.mockResolvedValueOnce({
      items: [{ id: 10, fullName: 'Student One', studentCode: 'S-001' }],
    })
    fetchGuardians.mockResolvedValueOnce({
      items: [{ id: 1, fullName: 'Guardian One', phone: '012345678' }],
      pagination: { page: 1, perPage: 10, total: 1, totalPages: 1 },
    })
    fetchStudentGuardians.mockResolvedValue({
      items: [{ id: 1, guardianName: 'Guardian One', relationshipType: 'mother', isPrimary: true, canPickup: true, emergencyPriority: 1 }],
      pagination: { page: 1, perPage: 10, total: 1, totalPages: 1 },
    })
    fetchEmergencyContacts.mockResolvedValue({
      items: [{ id: 1, guardianName: 'Guardian One', relationshipType: 'mother', isPrimary: true, canPickup: true, emergencyPriority: 1 }],
    })
    linkStudentGuardian.mockResolvedValueOnce({ id: 2, guardianName: 'Guardian One' })
    updateStudentGuardian.mockResolvedValueOnce({ id: 2, guardianName: 'Guardian One Updated' })
    archiveStudentGuardian.mockResolvedValueOnce(true)

    const student = useStudentGuardians()
    await student.loadLookups()
    await student.loadStudentData('10')

    expect(student.studentOptions.value).toHaveLength(1)
    expect(student.guardianOptions.value).toHaveLength(1)
    expect(student.relationships.value).toHaveLength(1)
    expect(student.emergencyContacts.value[0].guardianName).toBe('Guardian One')

    student.relationshipForm.guardian_id = 1
    student.relationshipForm.relationship_type = 'mother'
    student.relationshipForm.is_primary = true
    student.relationshipForm.can_pickup = true
    const linked = await student.saveRelationship()
    expect(linked.guardianName).toBe('Guardian One')

    student.openEditRelationship({ id: 2, guardianId: 1, guardianName: 'Guardian One' })
    student.relationshipForm.notes = 'Updated note'
    const updated = await student.saveRelationship()
    expect(updated.guardianName).toBe('Guardian One Updated')

    await student.archiveRelationship(2)
    expect(archiveStudentGuardian).toHaveBeenCalledWith('2')
  })

  it('loads emergency contacts for assigned students', async () => {
    fetchMyPreschoolStudents.mockResolvedValueOnce({
      items: [{ id: 10, fullName: 'Student One', studentCode: 'S-001' }],
    })
    fetchEmergencyContacts.mockResolvedValue({
      items: [{ id: 1, guardianName: 'Guardian One', relationshipType: 'mother', isPrimary: true, canPickup: true, emergencyPriority: 1 }],
    })

    const contacts = useEmergencyContacts()
    await contacts.loadStudents()
    await contacts.loadEmergencyContacts('10')

    expect(contacts.studentOptions.value).toHaveLength(1)
    expect(contacts.contacts.value[0].guardianName).toBe('Guardian One')
  })
})

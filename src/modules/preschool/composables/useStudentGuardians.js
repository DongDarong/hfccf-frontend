// Keep student guardian relations in one composable so the admin page can
// manage history, primary contacts, and pickup permissions without direct API
// calls in the template.
// Keep fallback messages in the locale tree so relationship errors stay
// aligned across EN/KH and do not drift back to hardcoded English.
import { reactive, ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { fetchPreschoolStudents } from '@/modules/preschool/services/preschoolApi'
import {
  archiveStudentGuardianByPair,
  fetchEmergencyContacts,
  fetchGuardians,
  fetchStudentGuardians,
  linkStudentGuardian,
  restoreStudentGuardianByPair,
  setPrimaryStudentGuardian,
  updateStudentGuardianByPair,
} from '@/modules/preschool/services/api/preschoolGuardianApi'

function normalizeText(value) {
  return String(value ?? '').trim()
}

function buildStudentOptions(items = []) {
  return items.map((item) => ({
    label: `${normalizeText(item.fullName || item.name)}${item.studentCode ? ` (${item.studentCode})` : ''}`,
    value: item.id,
    raw: item,
  }))
}

function buildGuardianOptions(items = []) {
  return items.map((item) => ({
    label: `${normalizeText(item.fullName)}${item.phone ? ` (${item.phone})` : ''}`,
    value: item.id,
    raw: item,
  }))
}

function createRelationshipForm() {
  return {
    guardian_id: '',
    relationship_type: 'guardian',
    is_primary: false,
    can_pickup: false,
    emergency_priority: '',
    status: 'active',
    starts_at: '',
    ends_at: '',
    notes: '',
  }
}

function findRelationshipById(items = [], relationshipId = '') {
  const id = String(relationshipId || '').trim()
  return items.find((item) => String(item.id || '').trim() === id) || null
}

export function useStudentGuardians() {
  const { t } = useLanguage()
  const loading = ref(false)
  const saving = ref(false)
  const errorMessage = ref('')
  const studentOptions = ref([])
  const guardianOptions = ref([])
  const relationships = ref([])
  const emergencyContacts = ref([])
  const selectedStudentId = ref('')
  const selectedRelationship = ref(null)
  const relationshipDialogOpen = ref(false)
  const relationshipMode = ref('create')
  const relationshipForm = reactive(createRelationshipForm())
  const pagination = ref({ page: 1, perPage: 10, total: 0, totalPages: 1 })

  async function loadLookups() {
    loading.value = true
    errorMessage.value = ''

    try {
      const [studentsResponse, guardiansResponse] = await Promise.all([
        fetchPreschoolStudents({ page: 1, perPage: 100 }),
        fetchGuardians({ page: 1, perPage: 100, status: 'active' }),
      ])

      studentOptions.value = buildStudentOptions(studentsResponse.items || [])
      guardianOptions.value = buildGuardianOptions(guardiansResponse.items || [])

      if (!selectedStudentId.value) {
        selectedStudentId.value = String(studentOptions.value[0]?.value || '').trim()
      }
    } catch (error) {
      studentOptions.value = []
      guardianOptions.value = []
      errorMessage.value = error?.message || t('preschoolStudentGuardiansPage.errors.loadLookup')
    } finally {
      loading.value = false
    }
  }

  async function loadStudentData(studentId = selectedStudentId.value) {
    const resolvedStudentId = String(studentId || '').trim()
    if (!resolvedStudentId) {
      relationships.value = []
      emergencyContacts.value = []
      return null
    }

    loading.value = true
    errorMessage.value = ''

    try {
      const [relationshipsResponse, contactsResponse] = await Promise.all([
        fetchStudentGuardians(resolvedStudentId),
        fetchEmergencyContacts(resolvedStudentId),
      ])

      relationships.value = relationshipsResponse.items || []
      emergencyContacts.value = contactsResponse.items || []
      selectedStudentId.value = resolvedStudentId
      pagination.value = relationshipsResponse.pagination || pagination.value

      return { relationships: relationships.value, contacts: emergencyContacts.value }
    } catch (error) {
      relationships.value = []
      emergencyContacts.value = []
      errorMessage.value = error?.message || t('preschoolStudentGuardiansPage.errors.loadData')
      throw error
    } finally {
      loading.value = false
    }
  }

  function resetRelationshipForm() {
    Object.assign(relationshipForm, createRelationshipForm())
  }

  function openCreateRelationship() {
    relationshipMode.value = 'create'
    selectedRelationship.value = null
    resetRelationshipForm()
    relationshipDialogOpen.value = true
  }

  function openEditRelationship(relationship) {
    relationshipMode.value = 'edit'
    selectedRelationship.value = relationship || null
    Object.assign(relationshipForm, createRelationshipForm(), {
      guardian_id: relationship?.guardianId || relationship?.guardian?.id || '',
      relationship_type: relationship?.relationshipType || 'guardian',
      is_primary: Boolean(relationship?.isPrimary),
      can_pickup: Boolean(relationship?.canPickup),
      emergency_priority: relationship?.emergencyPriority ?? '',
      status: relationship?.status || 'active',
      starts_at: relationship?.startsAt || '',
      ends_at: relationship?.endsAt || '',
      notes: relationship?.notes || '',
    })
    relationshipDialogOpen.value = true
  }

  function closeRelationshipDialog() {
    relationshipDialogOpen.value = false
    selectedRelationship.value = null
    resetRelationshipForm()
  }

  async function saveRelationship() {
    const studentId = String(selectedStudentId.value || '').trim()
    if (!studentId) {
      throw new Error('Student id is required.')
    }

    saving.value = true
    errorMessage.value = ''

    try {
      const payload = {
        guardian_id: relationshipForm.guardian_id,
        relationship_type: relationshipForm.relationship_type,
        is_primary: Boolean(relationshipForm.is_primary),
        can_pickup: Boolean(relationshipForm.can_pickup),
        emergency_priority: normalizeText(relationshipForm.emergency_priority) || null,
        status: normalizeText(relationshipForm.status) || 'active',
        starts_at: normalizeText(relationshipForm.starts_at) || null,
        ends_at: normalizeText(relationshipForm.ends_at) || null,
        notes: normalizeText(relationshipForm.notes) || null,
      }

      const result = relationshipMode.value === 'edit' && selectedRelationship.value?.id
        ? await updateStudentGuardianByPair(studentId, relationshipForm.guardian_id, payload)
        : await linkStudentGuardian(studentId, payload)

      await loadStudentData(studentId)
      closeRelationshipDialog()

      return result
    } catch (error) {
      errorMessage.value = error?.response?.data?.message || error?.message || t('preschoolStudentGuardiansPage.errors.save')
      throw error
    } finally {
      saving.value = false
    }
  }

  async function archiveRelationship(relationshipId = selectedRelationship.value?.id) {
    const relationship = findRelationshipById(relationships.value, relationshipId) || selectedRelationship.value
    const guardianId = String(relationship?.guardianId || relationship?.guardian?.id || '').trim()
    const studentId = String(selectedStudentId.value || '').trim()
    if (!guardianId || !studentId) return false

    saving.value = true
    errorMessage.value = ''

    try {
      const result = await archiveStudentGuardianByPair(studentId, guardianId)
      await loadStudentData()
      return result
    } catch (error) {
      errorMessage.value = error?.response?.data?.message || error?.message || t('preschoolStudentGuardiansPage.errors.archive')
      throw error
    } finally {
      saving.value = false
    }
  }

  function setSelectedStudentId(studentId) {
    selectedStudentId.value = String(studentId || '').trim()
  }

  async function setPrimaryRelationship(relationship = selectedRelationship.value) {
    const resolved = typeof relationship === 'object' ? relationship : findRelationshipById(relationships.value, relationship)
    const guardianId = String(resolved?.guardianId || resolved?.guardian?.id || '').trim()
    const studentId = String(selectedStudentId.value || '').trim()
    if (!guardianId || !studentId) return null

    saving.value = true
    errorMessage.value = ''

    try {
      const result = await setPrimaryStudentGuardian(studentId, guardianId)
      await loadStudentData(studentId)
      return result
    } catch (error) {
      errorMessage.value = error?.response?.data?.message || error?.message || t('preschoolStudentGuardiansPage.errors.save')
      throw error
    } finally {
      saving.value = false
    }
  }

  async function restoreRelationship(relationship = selectedRelationship.value) {
    const resolved = typeof relationship === 'object' ? relationship : findRelationshipById(relationships.value, relationship)
    const guardianId = String(resolved?.guardianId || resolved?.guardian?.id || '').trim()
    const studentId = String(selectedStudentId.value || '').trim()
    if (!guardianId || !studentId) return null

    saving.value = true
    errorMessage.value = ''

    try {
      const result = await restoreStudentGuardianByPair(studentId, guardianId)
      await loadStudentData(studentId)
      return result
    } catch (error) {
      errorMessage.value = error?.response?.data?.message || error?.message || t('preschoolStudentGuardiansPage.errors.save')
      throw error
    } finally {
      saving.value = false
    }
  }

  return {
    archiveRelationship,
    closeRelationshipDialog,
    emergencyContacts,
    errorMessage,
    guardianOptions,
    loadLookups,
    loadStudentData,
    loading,
    openCreateRelationship,
    openEditRelationship,
    pagination,
    relationshipDialogOpen,
    relationshipForm,
    relationshipMode,
    relationships,
    saveRelationship,
    saving,
    selectedRelationship,
    selectedStudentId,
    setSelectedStudentId,
    setPrimaryRelationship,
    studentOptions,
    restoreRelationship,
  }
}

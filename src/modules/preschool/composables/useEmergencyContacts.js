// Keep the teacher emergency-contact experience read-only and selection-based
// so assigned students can be inspected without exposing guardian edit flows.
// Keep failure copy localizable so teachers see the same fallback message in
// EN and KH when the emergency-contact request cannot load.
import { ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { fetchMyPreschoolStudents } from '@/modules/preschool/services/preschoolApi'
import { fetchEmergencyContacts } from '@/modules/preschool/services/api/preschoolGuardianApi'

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

export function useEmergencyContacts() {
  const { t } = useLanguage()
  const loading = ref(false)
  const errorMessage = ref('')
  const studentOptions = ref([])
  const selectedStudentId = ref('')
  const contacts = ref([])

  async function loadStudents() {
    loading.value = true
    errorMessage.value = ''

    try {
      const response = await fetchMyPreschoolStudents({ page: 1, perPage: 100 })
      studentOptions.value = buildStudentOptions(response.items || [])

      if (!selectedStudentId.value) {
        selectedStudentId.value = String(studentOptions.value[0]?.value || '').trim()
      }
    } catch (error) {
      studentOptions.value = []
      errorMessage.value = error?.message || t('preschoolEmergencyContactsPage.errors.loadStudents')
    } finally {
      loading.value = false
    }
  }

  async function loadEmergencyContacts(studentId = selectedStudentId.value) {
    const resolvedStudentId = String(studentId || '').trim()
    if (!resolvedStudentId) {
      contacts.value = []
      return null
    }

    loading.value = true
    errorMessage.value = ''

    try {
      const response = await fetchEmergencyContacts(resolvedStudentId)
      contacts.value = response.items || []
      selectedStudentId.value = resolvedStudentId
      return contacts.value
    } catch (error) {
      contacts.value = []
      errorMessage.value = error?.message || t('preschoolEmergencyContactsPage.errors.loadContacts')
      throw error
    } finally {
      loading.value = false
    }
  }

  function setSelectedStudentId(studentId) {
    selectedStudentId.value = String(studentId || '').trim()
  }

  return {
    contacts,
    errorMessage,
    loadEmergencyContacts,
    loadStudents,
    loading,
    selectedStudentId,
    setSelectedStudentId,
    studentOptions,
  }
}

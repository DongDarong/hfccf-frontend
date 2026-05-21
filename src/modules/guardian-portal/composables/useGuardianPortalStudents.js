import { ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { fetchGuardianPortalStudents } from '@/modules/guardian-portal/services/api/guardianPortalApi'

/**
 * Read-only student lists are loaded through a dedicated composable so the
 * portal dashboard never talks to the API directly.
 */
export function useGuardianPortalStudents() {
  const { t } = useLanguage()
  const items = ref([])
  const loading = ref(false)
  const errorMessage = ref('')
  const pagination = ref({
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 0,
  })

  async function loadStudents() {
    loading.value = true
    errorMessage.value = ''

    try {
      const response = await fetchGuardianPortalStudents()
      items.value = response.items
      pagination.value = response.pagination
    } catch (error) {
      errorMessage.value = error?.message || t('guardianPortal.errors.loadStudents')
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    loading,
    errorMessage,
    pagination,
    loadStudents,
  }
}

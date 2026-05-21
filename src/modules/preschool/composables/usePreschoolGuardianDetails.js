// Keep guardian summary loading isolated so the details page can stay
// read-only and reuse the same normalized guardian contract as the list view.
// Regression protection: this avoids direct HTTP calls in the page and keeps
// guardian summary loading aligned with the admin-only data model.
import { ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { fetchGuardian } from '@/modules/preschool/services/api/preschoolGuardianApi'

export function usePreschoolGuardianDetails() {
  const { t } = useLanguage()
  const loading = ref(false)
  const errorMessage = ref('')
  const guardian = ref(null)

  async function loadGuardianDetails(guardianId) {
    const id = String(guardianId || '').trim()
    if (!id) {
      guardian.value = null
      return null
    }

    loading.value = true
    errorMessage.value = ''

    try {
      const result = await fetchGuardian(id)
      guardian.value = result
      return result
    } catch (error) {
      guardian.value = null
      errorMessage.value = error?.message || t('preschoolGuardianDetailsPage.errors.load')
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    errorMessage,
    guardian,
    loadGuardianDetails,
    loading,
  }
}

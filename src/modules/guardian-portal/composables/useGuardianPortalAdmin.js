import { ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import {
  fetchGuardianPortalAccounts,
  inviteGuardianPortal,
  revokeGuardianPortal,
} from '@/modules/preschool/services/api/preschoolGuardianPortalAdminApi'

/**
 * Preschool admins manage guardian portal access through a separate
 * composable so invitation and revocation stay isolated from student data.
 */
export function useGuardianPortalAdmin() {
  const { t } = useLanguage()
  const items = ref([])
  const pagination = ref({
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 0,
  })
  const loading = ref(false)
  const errorMessage = ref('')
  const actionMessage = ref('')

  async function loadAccounts(params = {}) {
    loading.value = true
    errorMessage.value = ''

    try {
      const response = await fetchGuardianPortalAccounts(params)
      items.value = response.items
      pagination.value = response.pagination
    } catch (error) {
      errorMessage.value = error?.message || t('guardianPortal.errors.loadAccounts')
    } finally {
      loading.value = false
    }
  }

  async function invite(guardianId, payload) {
    const resolvedGuardianId = String(guardianId || '').trim()
    if (!resolvedGuardianId) {
      errorMessage.value = t('guardianPortal.admin.guardianIdRequired')
      return null
    }

    loading.value = true
    errorMessage.value = ''
    actionMessage.value = ''

    try {
      const response = await inviteGuardianPortal(resolvedGuardianId, payload)
      actionMessage.value = response.activationUrl
        ? t('guardianPortal.admin.activationUrl', { url: response.activationUrl })
        : t('guardianPortal.admin.invitationSent')
      await loadAccounts()
      return response
    } catch (error) {
      errorMessage.value = error?.message || t('guardianPortal.errors.inviteAccount')
      return null
    } finally {
      loading.value = false
    }
  }

  async function revoke(accountId) {
    loading.value = true
    errorMessage.value = ''
    actionMessage.value = ''

    try {
      const response = await revokeGuardianPortal(accountId)
      actionMessage.value = t('guardianPortal.admin.accountRevoked', {
        id: response.id || accountId,
      })
      await loadAccounts()
      return response
    } catch (error) {
      errorMessage.value = error?.message || t('guardianPortal.errors.revokeAccount')
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    pagination,
    loading,
    errorMessage,
    actionMessage,
    loadAccounts,
    invite,
    revoke,
  }
}

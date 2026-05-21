// Keep remediation state isolated so the center page stays presentational and
// all API calls, error handling, and confirmation gates live in one place.
import { ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import {
  archiveDuplicateCandidate,
  archiveOrphanGuardian,
  clearInvalidEmergencyContact,
  clearInvalidPrimary,
  fetchRemediationLogs,
  markIssueReviewed,
  reconcileLegacyFields,
  setPrimaryGuardian,
} from '@/modules/preschool/services/api/preschoolGuardianRemediationApi'

function createEmptyLogState() {
  return {
    items: [],
    meta: { currentPage: 1, lastPage: 1, perPage: 25, total: 0 },
  }
}

export function usePreschoolGuardianRemediation() {
  const { t } = useLanguage()
  const loading = ref(false)
  const actionLoading = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')
  const logs = ref(createEmptyLogState())

  async function loadLogs(params = {}) {
    loading.value = true
    errorMessage.value = ''

    try {
      const result = await fetchRemediationLogs(params)
      logs.value = result
    } catch (error) {
      logs.value = createEmptyLogState()
      errorMessage.value =
        error?.response?.data?.message ||
        error?.message ||
        t('preschoolGuardianRemediation.errors.loadLogsFailed')
    } finally {
      loading.value = false
    }
  }

  async function runAction(apiFn, payload, successKey) {
    actionLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
      await apiFn(payload)
      successMessage.value = t(successKey)
      return true
    } catch (error) {
      errorMessage.value =
        error?.response?.data?.message ||
        error?.message ||
        t('preschoolGuardianRemediation.errors.actionFailed')
      return false
    } finally {
      actionLoading.value = false
    }
  }

  function doMarkReviewed(payload) {
    return runAction(
      markIssueReviewed,
      payload,
      'preschoolGuardianRemediation.success.markReviewed',
    )
  }

  function doSetPrimary(payload) {
    return runAction(
      setPrimaryGuardian,
      payload,
      'preschoolGuardianRemediation.success.setPrimary',
    )
  }

  function doClearInvalidPrimary(payload) {
    return runAction(
      clearInvalidPrimary,
      payload,
      'preschoolGuardianRemediation.success.clearInvalidPrimary',
    )
  }

  function doClearInvalidEmergencyContact(payload) {
    return runAction(
      clearInvalidEmergencyContact,
      payload,
      'preschoolGuardianRemediation.success.clearInvalidEmergencyContact',
    )
  }

  function doReconcileLegacyFields(payload) {
    return runAction(
      reconcileLegacyFields,
      payload,
      'preschoolGuardianRemediation.success.reconcileLegacyFields',
    )
  }

  function doArchiveDuplicateCandidate(payload) {
    return runAction(
      archiveDuplicateCandidate,
      payload,
      'preschoolGuardianRemediation.success.archiveDuplicateCandidate',
    )
  }

  function doArchiveOrphanGuardian(payload) {
    return runAction(
      archiveOrphanGuardian,
      payload,
      'preschoolGuardianRemediation.success.archiveOrphanGuardian',
    )
  }

  function clearMessages() {
    errorMessage.value = ''
    successMessage.value = ''
  }

  return {
    actionLoading,
    clearMessages,
    doArchiveDuplicateCandidate,
    doArchiveOrphanGuardian,
    doClearInvalidEmergencyContact,
    doClearInvalidPrimary,
    doMarkReviewed,
    doReconcileLegacyFields,
    doSetPrimary,
    errorMessage,
    loadLogs,
    loading,
    logs,
    successMessage,
  }
}

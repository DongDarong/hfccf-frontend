import { ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import {
  acknowledgeIssue,
  assignIssue,
  dismissIssue,
  fetchGovernanceIssue,
  fetchGovernanceIssues,
  fetchRecurringIssues,
  fetchStaleIssues,
  resolveIssue,
  syncGovernanceIssues,
} from '@/modules/preschool/services/api/preschoolGuardianGovernanceApi'

function createEmptyIssueState() {
  return {
    items: [],
    meta: { currentPage: 1, lastPage: 1, perPage: 25, total: 0 },
  }
}

export function usePreschoolGuardianGovernance() {
  const { t } = useLanguage()
  const loading = ref(false)
  const actionLoading = ref(false)
  const syncLoading = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')
  const issues = ref(createEmptyIssueState())
  const staleIssues = ref(createEmptyIssueState())
  const recurringIssues = ref(createEmptyIssueState())
  const currentIssue = ref(null)

  async function loadIssues(params = {}) {
    loading.value = true
    errorMessage.value = ''

    try {
      const result = await fetchGovernanceIssues(params)
      issues.value = result
    } catch (error) {
      issues.value = createEmptyIssueState()
      errorMessage.value =
        error?.response?.data?.message ||
        error?.message ||
        t('preschoolGuardianGovernance.errors.loadIssuesFailed')
    } finally {
      loading.value = false
    }
  }

  async function loadIssue(id) {
    loading.value = true
    errorMessage.value = ''

    try {
      currentIssue.value = await fetchGovernanceIssue(id)
    } catch (error) {
      currentIssue.value = null
      errorMessage.value =
        error?.response?.data?.message ||
        error?.message ||
        t('preschoolGuardianGovernance.errors.loadIssueFailed')
    } finally {
      loading.value = false
    }
  }

  async function loadStaleIssues(params = {}) {
    loading.value = true
    errorMessage.value = ''

    try {
      const result = await fetchStaleIssues(params)
      staleIssues.value = result
    } catch (error) {
      staleIssues.value = createEmptyIssueState()
      errorMessage.value =
        error?.response?.data?.message ||
        error?.message ||
        t('preschoolGuardianGovernance.errors.loadIssuesFailed')
    } finally {
      loading.value = false
    }
  }

  async function loadRecurringIssues(params = {}) {
    loading.value = true
    errorMessage.value = ''

    try {
      const result = await fetchRecurringIssues(params)
      recurringIssues.value = result
    } catch (error) {
      recurringIssues.value = createEmptyIssueState()
      errorMessage.value =
        error?.response?.data?.message ||
        error?.message ||
        t('preschoolGuardianGovernance.errors.loadIssuesFailed')
    } finally {
      loading.value = false
    }
  }

  async function doSync() {
    syncLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
      const result = await syncGovernanceIssues()
      successMessage.value = t('preschoolGuardianGovernance.success.synced', {
        created: result?.created ?? 0,
        updated: result?.updated ?? 0,
      })
      return true
    } catch (error) {
      errorMessage.value =
        error?.response?.data?.message ||
        error?.message ||
        t('preschoolGuardianGovernance.errors.syncFailed')
      return false
    } finally {
      syncLoading.value = false
    }
  }

  async function runLifecycleAction(apiFn, id, payload, successKey) {
    actionLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
      const updated = await apiFn(id, payload)
      if (currentIssue.value?.id === id) {
        currentIssue.value = updated
      }
      successMessage.value = t(successKey)
      return updated
    } catch (error) {
      errorMessage.value =
        error?.response?.data?.message ||
        error?.message ||
        t('preschoolGuardianGovernance.errors.actionFailed')
      return null
    } finally {
      actionLoading.value = false
    }
  }

  function doAcknowledge(id, payload = {}) {
    return runLifecycleAction(
      acknowledgeIssue,
      id,
      payload,
      'preschoolGuardianGovernance.success.acknowledged',
    )
  }

  function doAssign(id, payload) {
    return runLifecycleAction(
      assignIssue,
      id,
      payload,
      'preschoolGuardianGovernance.success.assigned',
    )
  }

  function doResolve(id, payload = {}) {
    return runLifecycleAction(
      resolveIssue,
      id,
      payload,
      'preschoolGuardianGovernance.success.resolved',
    )
  }

  function doDismiss(id, payload) {
    return runLifecycleAction(
      dismissIssue,
      id,
      payload,
      'preschoolGuardianGovernance.success.dismissed',
    )
  }

  function clearMessages() {
    errorMessage.value = ''
    successMessage.value = ''
  }

  return {
    actionLoading,
    clearMessages,
    currentIssue,
    doAcknowledge,
    doAssign,
    doDismiss,
    doResolve,
    doSync,
    errorMessage,
    issues,
    loadIssue,
    loadIssues,
    loadRecurringIssues,
    loadStaleIssues,
    loading,
    recurringIssues,
    staleIssues,
    successMessage,
    syncLoading,
  }
}

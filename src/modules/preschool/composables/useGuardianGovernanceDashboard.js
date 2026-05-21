import { ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { fetchGovernanceDashboard } from '@/modules/preschool/services/api/preschoolGuardianGovernanceApi'

function createEmptyMetrics() {
  return {
    totalIssues: 0,
    activeIssues: 0,
    resolvedIssues: 0,
    dismissedIssues: 0,
    bySeverity: { critical: 0, warning: 0, info: 0 },
    byPriority: { urgent: 0, high: 0, medium: 0, low: 0 },
    byStatus: { detected: 0, acknowledged: 0, assigned: 0, inReview: 0 },
    staleIssues: 0,
    recurringIssues: 0,
    unassignedIssues: 0,
    criticalUnresolved: 0,
    generatedAt: null,
  }
}

export function useGuardianGovernanceDashboard() {
  const { t } = useLanguage()
  const loading = ref(false)
  const errorMessage = ref('')
  const metrics = ref(createEmptyMetrics())

  async function loadDashboard() {
    loading.value = true
    errorMessage.value = ''

    try {
      const result = await fetchGovernanceDashboard()
      metrics.value = result ?? createEmptyMetrics()
    } catch (error) {
      metrics.value = createEmptyMetrics()
      errorMessage.value =
        error?.response?.data?.message ||
        error?.message ||
        t('preschoolGuardianGovernance.errors.loadDashboardFailed')
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    errorMessage.value = ''
  }

  return {
    clearError,
    errorMessage,
    loadDashboard,
    loading,
    metrics,
  }
}

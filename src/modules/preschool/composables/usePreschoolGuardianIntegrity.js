// Keep guardian integrity loading in one composable so the report page stays
// purely presentational and the duplicate/consistency contracts stay aligned.
import { ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import {
  fetchGuardianConsistencyReport,
  fetchGuardianDuplicates,
} from '@/modules/preschool/services/api/preschoolGuardianIntegrityApi'

function createEmptyState() {
  return {
    summary: {
      studentsWithoutActiveGuardian: 0,
      multiplePrimaryGuardianStudents: 0,
      guardiansWithoutStudents: 0,
      pickupPermissionIssues: 0,
      archivedPrimaryRelationships: 0,
      inactiveEmergencyContacts: 0,
      legacyMismatches: 0,
      criticalCount: 0,
      warningCount: 0,
      infoCount: 0,
      issueCount: 0,
    },
    items: [],
    generatedAt: '',
  }
}

function createEmptyDuplicateState() {
  return {
    summary: {
      candidateGroups: 0,
      matchedGuardians: 0,
      strongSignalGroups: 0,
      reviewRecommended: false,
    },
    items: [],
    generatedAt: '',
  }
}

export function usePreschoolGuardianIntegrity() {
  const { t } = useLanguage()
  const loading = ref(false)
  const errorMessage = ref('')
  const report = ref(createEmptyState())
  const duplicates = ref(createEmptyDuplicateState())

  async function loadIntegrityData() {
    loading.value = true
    errorMessage.value = ''

    try {
      const [reportResponse, duplicatesResponse] = await Promise.all([
        fetchGuardianConsistencyReport(),
        fetchGuardianDuplicates(),
      ])

      report.value = reportResponse || createEmptyState()
      duplicates.value = duplicatesResponse || createEmptyDuplicateState()
      return { report: report.value, duplicates: duplicates.value }
    } catch (error) {
      report.value = createEmptyState()
      duplicates.value = createEmptyDuplicateState()
      errorMessage.value = error?.message || t('preschoolGuardianShared.errors.loadIntegrity')
      throw error
    } finally {
      loading.value = false
    }
  }

  function refreshIntegrityData() {
    return loadIntegrityData()
  }

  return {
    duplicates,
    errorMessage,
    loadIntegrityData,
    loading,
    refreshIntegrityData,
    report,
  }
}

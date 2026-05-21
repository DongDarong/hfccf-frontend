import { computed, ref, watch } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import {
  fetchGuardianAttendanceSummary,
  fetchGuardianPortalStudent,
  fetchGuardianProgressSummary,
  fetchGuardianReports,
  fetchGuardianScheduleSummary,
} from '@/modules/guardian-portal/services/api/guardianPortalApi'

/**
 * Each child summary view is read-only and derived from backend summaries so
 * guardians never receive raw mutable Preschool records.
 */
export function useGuardianStudentSummary(studentId) {
  const { t } = useLanguage()
  const student = ref(null)
  const attendanceSummary = ref(null)
  const scheduleSummary = ref(null)
  const progressSummary = ref(null)
  const reportsSummary = ref(null)
  const loading = ref(false)
  const errorMessage = ref('')

  const resolvedStudentId = computed(() => String(studentId?.value ?? studentId ?? '').trim())

  async function loadSummary() {
    const id = resolvedStudentId.value
    if (!id) return

    loading.value = true
    errorMessage.value = ''

    try {
      student.value = await fetchGuardianPortalStudent(id)
      attendanceSummary.value = await fetchGuardianAttendanceSummary(id)
      scheduleSummary.value = await fetchGuardianScheduleSummary(id)
      progressSummary.value = await fetchGuardianProgressSummary(id)
      reportsSummary.value = await fetchGuardianReports(id)
    } catch (error) {
      errorMessage.value = error?.message || t('guardianPortal.errors.loadSummary')
      return null
    } finally {
      loading.value = false
    }
  }

  watch(resolvedStudentId, loadSummary, { immediate: true })

  return {
    student,
    attendanceSummary,
    scheduleSummary,
    progressSummary,
    reportsSummary,
    loading,
    errorMessage,
    loadSummary,
  }
}

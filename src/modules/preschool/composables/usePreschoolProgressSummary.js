// Keep progress summary state separate from the assessment list so future
// Preschool reporting can reuse the same API data without duplicating queries.
import { ref } from 'vue'
import { fetchProgressSummary } from '@/modules/preschool/services/api/preschoolAssessmentApi'

export function usePreschoolProgressSummary() {
  const summary = ref({})
  const categories = ref([])
  const recentAssessments = ref([])
  const loading = ref(false)
  const errorMessage = ref('')

  async function loadProgressSummary(studentId) {
    const resolvedStudentId = String(studentId || '').trim()
    if (!resolvedStudentId) return

    loading.value = true
    errorMessage.value = ''

    try {
      const payload = await fetchProgressSummary(resolvedStudentId)
      summary.value = payload.summary || {}
      categories.value = payload.categories || []
      recentAssessments.value = payload.recentAssessments || []
    } catch (error) {
      summary.value = {}
      categories.value = []
      recentAssessments.value = []
      errorMessage.value = error?.message || 'Failed to load Preschool progress summary.'
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    errorMessage,
    loadProgressSummary,
    loading,
    recentAssessments,
    summary,
  }
}

// Keep progress summary state separate from the assessment list so future
// Preschool reporting can reuse the same API data without duplicating queries.
import { ref } from 'vue'
import { fetchProgressSummary } from '@/modules/preschool/services/api/preschoolAssessmentApi'

export function usePreschoolProgressSummary() {
  const summary = ref({})
  const categories = ref([])
  const recentAssessments = ref([])
  const snapshot = ref(null)
  const source = ref('live')
  const frozen = ref(false)
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
      snapshot.value = payload.snapshot || null
      source.value = payload.source || 'live'
      frozen.value = Boolean(payload.frozen)
    } catch (error) {
      summary.value = {}
      categories.value = []
      recentAssessments.value = []
      snapshot.value = null
      source.value = 'live'
      frozen.value = false
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
    snapshot,
    source,
    frozen,
    summary,
  }
}

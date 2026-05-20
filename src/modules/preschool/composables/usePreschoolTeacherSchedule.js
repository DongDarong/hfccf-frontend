// Keep teacher timetable reads separate from admin schedule management so the
// teacher page can stay read-only and easy to reason about.
import { ref } from 'vue'
import { fetchMySchedule, fetchTeacherSchedule } from '@/modules/preschool/services/api/preschoolScheduleApi'
import { fetchPreschoolTeachers } from '@/modules/preschool/services/preschoolApi'

function normalizeText(value) {
  return String(value ?? '').trim()
}

export function usePreschoolTeacherSchedule() {
  const loading = ref(false)
  const errorMessage = ref('')
  const teacherOptions = ref([])
  const selectedTeacherId = ref('')
  const teacherSummary = ref(null)
  const schedules = ref([])

  async function loadTeacherOptions() {
    loading.value = true
    errorMessage.value = ''

    try {
      const response = await fetchPreschoolTeachers({ page: 1, perPage: 100 })
      teacherOptions.value = (response.items || []).map((item) => ({
        label: `${normalizeText(item.fullName || item.name)}${item.username ? ` (${item.username})` : ''}`,
        value: item.id,
        raw: item,
      }))

      if (!selectedTeacherId.value) {
        selectedTeacherId.value = String(teacherOptions.value[0]?.value || '').trim()
      }
    } catch (error) {
      teacherOptions.value = []
      errorMessage.value = error?.message || 'Failed to load Preschool teachers.'
    } finally {
      loading.value = false
    }
  }

  async function loadTeacherSchedule(teacherId = selectedTeacherId.value) {
    const resolvedTeacherId = String(teacherId || '').trim()
    if (!resolvedTeacherId) return null

    loading.value = true
    errorMessage.value = ''

    try {
      const bundle = await fetchTeacherSchedule(resolvedTeacherId)
      teacherSummary.value = bundle.teacher || null
      schedules.value = bundle.items || []
      selectedTeacherId.value = resolvedTeacherId
      return bundle
    } catch (error) {
      teacherSummary.value = null
      schedules.value = []
      errorMessage.value = error?.message || 'Failed to load the Preschool teacher schedule.'
      throw error
    } finally {
      loading.value = false
    }
  }

  async function loadMySchedule() {
    loading.value = true
    errorMessage.value = ''

    try {
      const bundle = await fetchMySchedule()
      teacherSummary.value = bundle.teacher || null
      schedules.value = bundle.items || []
      return bundle
    } catch (error) {
      teacherSummary.value = null
      schedules.value = []
      errorMessage.value = error?.message || 'Failed to load your Preschool schedule.'
      throw error
    } finally {
      loading.value = false
    }
  }

  function setSelectedTeacherId(teacherId) {
    selectedTeacherId.value = String(teacherId || '').trim()
  }

  return {
    errorMessage,
    loadMySchedule,
    loadTeacherOptions,
    loadTeacherSchedule,
    loading,
    schedules,
    selectedTeacherId,
    setSelectedTeacherId,
    teacherOptions,
    teacherSummary,
  }
}

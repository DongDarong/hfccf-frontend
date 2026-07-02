import { ref } from 'vue'
import { useRoute } from 'vue-router'

export function createDefaultAnalyticsDetailFilters(query = {}) {
  return {
    academicYearId: String(query.academicYearId || query.academic_year_id || ''),
    classId: String(query.classId || query.class_id || ''),
    teacherUserId: String(query.teacherUserId || query.teacher_user_id || ''),
    dateFrom: String(query.dateFrom || query.date_from || ''),
    dateTo: String(query.dateTo || query.date_to || ''),
    status: String(query.status || ''),
  }
}

export function useAnalyticsDetailFilters() {
  const route = useRoute()
  const filters = ref(createDefaultAnalyticsDetailFilters(route.query))

  function resetFilters() {
    filters.value = createDefaultAnalyticsDetailFilters()
  }

  function updateFilters(nextFilters = {}) {
    filters.value = {
      ...filters.value,
      ...nextFilters,
    }
  }

  return {
    filters,
    resetFilters,
    updateFilters,
  }
}

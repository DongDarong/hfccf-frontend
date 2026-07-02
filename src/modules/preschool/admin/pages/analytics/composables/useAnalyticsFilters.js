import { ref } from 'vue'

export function createDefaultAnalyticsFilters() {
  return {
    academicYearId: '',
    classId: '',
    teacherUserId: '',
    dateFrom: '',
    dateTo: '',
    status: '',
  }
}

export function useAnalyticsFilters(initialFilters = {}) {
  const filters = ref({
    ...createDefaultAnalyticsFilters(),
    ...initialFilters,
  })

  function resetFilters() {
    filters.value = createDefaultAnalyticsFilters()
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

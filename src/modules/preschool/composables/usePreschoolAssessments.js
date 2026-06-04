// Keep assessment loading and mutations in one composable so the Preschool
// pages stay thin and do not drift back into direct HTTP calls.
import { computed, ref } from 'vue'
import { getCurrentUser } from '@/services/auth'
import { useLanguage } from '@/composables/useLanguage'
import {
  fetchAssessmentCategories,
  fetchStudentAssessments,
  createStudentAssessment,
  updateAssessment,
  finalizeAssessment,
  archiveAssessment,
} from '@/modules/preschool/services/api/preschoolAssessmentApi'
import { fetchAcademicLifecycle } from '@/modules/preschool/services/api/preschoolAcademicLifecycleApi'
import {
  fetchMyPreschoolClasses,
  fetchMyPreschoolStudents,
  fetchPreschoolClasses,
  fetchPreschoolStudents,
} from '@/modules/preschool/services/preschoolApi'

function normalizeOptionLabel(item, fallback = '') {
  return String(item || fallback || '').trim()
}

function buildStudentOptions(items = []) {
  return items.map((item) => ({
    label: `${normalizeOptionLabel(item.fullName || item.name)}${(item.publicId || item.studentCode) ? ` (${item.publicId || item.studentCode})` : ''}`,
    value: item.id,
    raw: item,
  }))
}

function buildClassOptions(items = []) {
  return items.map((item) => ({
    label: `${normalizeOptionLabel(item.code)} - ${normalizeOptionLabel(item.name)}`,
    value: item.id,
    raw: item,
  }))
}

export function usePreschoolAssessments() {
  const currentUser = computed(() => getCurrentUser() || {})
  const isTeacher = computed(() => String(currentUser.value?.role || '') === 'teacher-preschool')
  const { t } = useLanguage()

  const loading = ref(false)
  const saving = ref(false)
  const errorMessage = ref('')
  const assessmentItems = ref([])
  const pagination = ref({ page: 1, perPage: 10, total: 0, totalPages: 1 })
  const categoryOptions = ref([])
  const studentOptions = ref([])
  const classOptions = ref([])
  const lifecycleContext = ref({})

  const selectedStudentId = ref('')
  const selectedClassId = ref('')
  const selectedStatus = ref('')
  const selectedCategoryId = ref('')
  const searchQuery = ref('')
  const selectedPeriodLabel = ref('')

  async function loadCategories() {
    categoryOptions.value = await fetchAssessmentCategories()
  }

  async function loadStudents() {
    const loader = isTeacher.value ? fetchMyPreschoolStudents : fetchPreschoolStudents
    const response = await loader({ page: 1, perPage: 100 })
    studentOptions.value = buildStudentOptions(response.items || [])
  }

  async function loadClasses() {
    const loader = isTeacher.value ? fetchMyPreschoolClasses : fetchPreschoolClasses
    const response = await loader({ page: 1, perPage: 100 })
    classOptions.value = buildClassOptions(response.items || [])
  }

  async function loadLookupData() {
    loading.value = true
    errorMessage.value = ''

    try {
      await Promise.all([loadCategories(), loadStudents(), loadClasses()])
      try {
        const lifecycle = await fetchAcademicLifecycle()
        lifecycleContext.value = lifecycle.currentContext || {}
      } catch {
        lifecycleContext.value = {}
      }
      if (!selectedStudentId.value) {
        selectedStudentId.value = String(studentOptions.value[0]?.value || '').trim()
      }
    } catch (error) {
      errorMessage.value = error?.message || 'Failed to load Preschool assessment data.'
    } finally {
      loading.value = false
    }
  }

  async function loadAssessments(studentId = selectedStudentId.value, params = {}) {
    const resolvedStudentId = String(studentId || '').trim()
    if (!resolvedStudentId) return

    loading.value = true
    errorMessage.value = ''

    try {
      const response = await fetchStudentAssessments(resolvedStudentId, {
        page: params.page ?? pagination.value.page ?? 1,
        perPage: params.perPage ?? pagination.value.perPage ?? 10,
        status: params.status ?? selectedStatus.value,
        categoryId: params.categoryId ?? selectedCategoryId.value,
        periodLabel: params.periodLabel ?? selectedPeriodLabel.value,
        search: params.search ?? searchQuery.value,
        classId: params.classId ?? selectedClassId.value,
        sortBy: params.sortBy ?? 'assessment_date',
        sortDirection: params.sortDirection ?? 'desc',
      })

      assessmentItems.value = response.items || []
      pagination.value = response.pagination || pagination.value
      selectedStudentId.value = resolvedStudentId
    } catch (error) {
      assessmentItems.value = []
      pagination.value = { page: 1, perPage: 10, total: 0, totalPages: 1 }
      errorMessage.value = error?.message || 'Failed to load Preschool assessments.'
    } finally {
      loading.value = false
    }
  }

  async function saveAssessment(studentId, payload, assessmentId = '') {
    const resolvedStudentId = String(studentId || '').trim()
    if (!resolvedStudentId) {
      throw new Error('Student selection is required.')
    }

    saving.value = true
    errorMessage.value = ''

    try {
      const result = assessmentId
        ? await updateAssessment(assessmentId, payload)
        : await createStudentAssessment(resolvedStudentId, payload)

      await loadAssessments(resolvedStudentId)
      return result
    } catch (error) {
      errorMessage.value = error?.message || 'Unable to save Preschool assessment right now.'
      throw error
    } finally {
      saving.value = false
    }
  }

  async function finalizeAssessmentById(assessmentId) {
    if (!assessmentId) return null

    saving.value = true
    errorMessage.value = ''

    try {
      const result = await finalizeAssessment(assessmentId)
      await loadAssessments(selectedStudentId.value)
      return result
    } catch (error) {
      errorMessage.value = error?.message || 'Unable to finalize the assessment right now.'
      throw error
    } finally {
      saving.value = false
    }
  }

  async function archiveAssessmentById(assessmentId) {
    if (!assessmentId) return null

    saving.value = true
    errorMessage.value = ''

    try {
      const result = await archiveAssessment(assessmentId)
      await loadAssessments(selectedStudentId.value)
      return result
    } catch (error) {
      errorMessage.value = error?.message || 'Unable to archive the assessment right now.'
      throw error
    } finally {
      saving.value = false
    }
  }

  function setSelectedStudentId(studentId) {
    selectedStudentId.value = String(studentId || '').trim()
  }

  function setSelectedClassId(classId) {
    selectedClassId.value = String(classId || '').trim()
  }

  function setSelectedStatus(status) {
    selectedStatus.value = String(status || '').trim()
  }

  function setSelectedCategoryId(categoryId) {
    selectedCategoryId.value = String(categoryId || '').trim()
  }

  function setSearchQuery(search) {
    searchQuery.value = String(search || '')
  }

  function setSelectedPeriodLabel(periodLabel) {
    selectedPeriodLabel.value = String(periodLabel || '')
  }

  const lockedReportStatuses = ['finalized', 'locked', 'archived']
  const isTermLocked = computed(() => ['closed', 'archived'].includes(String(lifecycleContext.value.term_status || '').toLowerCase()))
  const lockMessage = computed(() => {
    const status = String(lifecycleContext.value.term_status || '').toLowerCase()
    const reportPeriodStatus = String(
      lifecycleContext.value.report_period_status || lifecycleContext.value.reportPeriodStatus || '',
    ).toLowerCase()

    if (status === 'closed') {
      return t('preschoolLifecyclePage.messages.termClosed')
    }

    if (status === 'archived') {
      return t('preschoolLifecyclePage.messages.termArchived')
    }

    if (reportPeriodStatus === 'finalized') {
      return t('preschoolLifecyclePage.messages.reportPeriodFinalized')
    }

    if (reportPeriodStatus === 'archived') {
      return t('preschoolLifecyclePage.messages.reportPeriodArchived')
    }

    if (lockedReportStatuses.includes(reportPeriodStatus)) {
      return t('preschoolLifecyclePage.messages.reportPeriodLocked')
    }

    return ''
  })

  const isReportPeriodLocked = computed(() =>
    lockedReportStatuses.includes(
      String(lifecycleContext.value.report_period_status || lifecycleContext.value.reportPeriodStatus || '').toLowerCase(),
    ),
  )

  return {
    assessmentItems,
    archiveAssessmentById,
    categoryOptions,
    classOptions,
    lifecycleContext,
    isTermLocked,
    isReportPeriodLocked,
    errorMessage,
    finalizeAssessmentById,
    isTeacher,
    loadAssessments,
    loadCategories,
    loadClasses,
    loadLookupData,
    loadStudents,
    loading,
    pagination,
    saveAssessment,
    searchQuery,
    selectedCategoryId,
    selectedClassId,
    selectedPeriodLabel,
    selectedStatus,
    selectedStudentId,
    setSelectedClassId,
    setSelectedCategoryId,
    setSelectedPeriodLabel,
    setSelectedStatus,
    setSelectedStudentId,
    setSearchQuery,
    saving,
    studentOptions,
    lockMessage,
  }
}

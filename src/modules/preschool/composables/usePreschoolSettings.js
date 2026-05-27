import { computed, ref, watch } from 'vue'

// Keep Preschool settings state in one composable so the page can stay focused
// on layout, validation messaging, and section orchestration.
function cloneValue(value) {
  if (value instanceof Date) {
    return new Date(value.getTime())
  }

  if (Array.isArray(value)) {
    return value.map((item) => cloneValue(item))
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, nestedValue]) => [key, cloneValue(nestedValue)]))
  }

  return value
}

function createDate(year, month, day) {
  return new Date(year, month, day)
}

export function createDefaultAcademicYear() {
  return {
    currentAcademicYear: '2025 - 2026',
    startDate: createDate(2025, 7, 1),
    endDate: createDate(2026, 4, 31),
    status: 'active',
  }
}

export function createDefaultTerm(id = 'term-1', name = 'Term 1', startDate = createDate(2025, 7, 1), endDate = createDate(2025, 10, 30), status = 'active') {
  return {
    id,
    name,
    startDate,
    endDate,
    status,
  }
}

export function createDefaultClassConfiguration(id = 'class-1', classLevel = 'nursery', capacity = 18, assignedTeacher = 'lead-teacher', room = 'Room A', status = 'active') {
  return {
    id,
    classLevel,
    capacity,
    assignedTeacher,
    room,
    status,
  }
}

export function createDefaultAttendanceConfiguration() {
  return {
    markingWindow: '07:30 - 08:15',
    lateThreshold: 15,
    absenceRule: 'window-and-threshold',
    teacherCanEditAttendance: true,
  }
}

export function createDefaultPaymentConfiguration() {
  return {
    defaultTuitionFee: 120,
    paymentCycle: 'monthly',
    dueDay: 5,
    lateFeeRule: 'fixed',
    enableOverdueReminders: true,
  }
}

export function createDefaultPreschoolSettings() {
  return {
    academicYear: createDefaultAcademicYear(),
    terms: [
      createDefaultTerm('term-1', 'Term 1', createDate(2025, 7, 1), createDate(2025, 10, 30), 'active'),
      createDefaultTerm('term-2', 'Term 2', createDate(2025, 11, 1), createDate(2026, 2, 28), 'inactive'),
    ],
    classConfigurations: [
      createDefaultClassConfiguration('class-1', 'nursery', 18, 'lead-teacher', 'Room A', 'active'),
      createDefaultClassConfiguration('class-2', 'kindergarten-1', 20, 'assistant-teacher', 'Room B', 'inactive'),
      createDefaultClassConfiguration('class-3', 'prep', 22, 'floating-teacher', 'Room C', 'active'),
    ],
    attendance: createDefaultAttendanceConfiguration(),
    payment: createDefaultPaymentConfiguration(),
  }
}

function createSectionValidation() {
  return {}
}

function isDateValue(value) {
  return value instanceof Date && !Number.isNaN(value.getTime())
}

function compareDateOrder(startDate, endDate) {
  if (!isDateValue(startDate) || !isDateValue(endDate)) return false

  return endDate.getTime() >= startDate.getTime()
}

function validateRequiredText(value) {
  return String(value || '').trim().length > 0
}

export function createEmptyTermDraft() {
  return {
    id: '',
    name: '',
    startDate: null,
    endDate: null,
    status: 'active',
  }
}

export function validatePreschoolTermDraft(termDraft = {}) {
  const errors = createSectionValidation()

  if (!validateRequiredText(termDraft.name)) {
    errors.name = 'required'
  }

  if (!isDateValue(termDraft.startDate)) {
    errors.startDate = 'required'
  }

  if (!isDateValue(termDraft.endDate)) {
    errors.endDate = 'required'
  }

  if (isDateValue(termDraft.startDate) && isDateValue(termDraft.endDate) && !compareDateOrder(termDraft.startDate, termDraft.endDate)) {
    errors.endDate = 'range'
  }

  if (!validateRequiredText(termDraft.status)) {
    errors.status = 'required'
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  }
}

export function validatePreschoolSettings(settings = {}) {
  const errors = {
    academicYear: createSectionValidation(),
    terms: {},
    classConfigurations: {},
    attendance: createSectionValidation(),
    payment: createSectionValidation(),
  }

  const academicYear = settings.academicYear || {}
  if (!validateRequiredText(academicYear.currentAcademicYear)) {
    errors.academicYear.currentAcademicYear = 'required'
  }
  if (!isDateValue(academicYear.startDate)) {
    errors.academicYear.startDate = 'required'
  }
  if (!isDateValue(academicYear.endDate)) {
    errors.academicYear.endDate = 'required'
  }
  if (isDateValue(academicYear.startDate) && isDateValue(academicYear.endDate) && !compareDateOrder(academicYear.startDate, academicYear.endDate)) {
    errors.academicYear.endDate = 'range'
  }
  if (!validateRequiredText(academicYear.status)) {
    errors.academicYear.status = 'required'
  }

  ;(settings.terms || []).forEach((term, index) => {
    const termErrors = createSectionValidation()

    if (!validateRequiredText(term.name)) termErrors.name = 'required'
    if (!isDateValue(term.startDate)) termErrors.startDate = 'required'
    if (!isDateValue(term.endDate)) termErrors.endDate = 'required'
    if (isDateValue(term.startDate) && isDateValue(term.endDate) && !compareDateOrder(term.startDate, term.endDate)) {
      termErrors.endDate = 'range'
    }
    if (!validateRequiredText(term.status)) termErrors.status = 'required'

    if (Object.keys(termErrors).length) {
      errors.terms[index] = termErrors
    }
  })

  ;(settings.classConfigurations || []).forEach((item, index) => {
    const classErrors = createSectionValidation()

    if (!validateRequiredText(item.classLevel)) classErrors.classLevel = 'required'
    if (!(Number(item.capacity) > 0)) classErrors.capacity = 'positive'
    if (!validateRequiredText(item.status)) classErrors.status = 'required'

    if (Object.keys(classErrors).length) {
      errors.classConfigurations[index] = classErrors
    }
  })

  const attendance = settings.attendance || {}
  if (!validateRequiredText(attendance.markingWindow)) errors.attendance.markingWindow = 'required'
  if (!(Number(attendance.lateThreshold) >= 0)) errors.attendance.lateThreshold = 'positive'
  if (!validateRequiredText(attendance.absenceRule)) errors.attendance.absenceRule = 'required'
  if (typeof attendance.teacherCanEditAttendance !== 'boolean') errors.attendance.teacherCanEditAttendance = 'required'

  const payment = settings.payment || {}
  if (!(Number(payment.defaultTuitionFee) > 0)) errors.payment.defaultTuitionFee = 'positive'
  if (!validateRequiredText(payment.paymentCycle)) errors.payment.paymentCycle = 'required'
  if (!(Number(payment.dueDay) >= 1 && Number(payment.dueDay) <= 31)) errors.payment.dueDay = 'range'
  if (!validateRequiredText(payment.lateFeeRule)) errors.payment.lateFeeRule = 'required'
  if (typeof payment.enableOverdueReminders !== 'boolean') errors.payment.enableOverdueReminders = 'required'

  const issueCount = [
    errors.academicYear,
    ...Object.values(errors.terms),
    ...Object.values(errors.classConfigurations),
    errors.attendance,
    errors.payment,
  ].reduce((total, sectionErrors) => total + Object.keys(sectionErrors || {}).length, 0)

  return {
    errors,
    issueCount,
    isValid: issueCount === 0,
  }
}

export function usePreschoolSettings() {
  // The page owns the visible form, while this composable keeps the local
  // configuration snapshot, validation logic, and reset/save behavior together.
  const settings = ref(createDefaultPreschoolSettings())
  const savedSettings = ref(cloneValue(settings.value))
  const validationErrors = ref(validatePreschoolSettings(settings.value).errors)
  const lastSavedAt = ref(null)

  const issueCount = computed(() => validatePreschoolSettings(settings.value).issueCount)
  const hasValidationIssues = computed(() => issueCount.value > 0)

  // Keep validation state in sync with the live draft so each section can show
  // simple inline feedback without requiring a save attempt first.
  watch(
    settings,
    () => {
      validationErrors.value = validatePreschoolSettings(settings.value).errors
    },
    { deep: true, immediate: true },
  )

  function refreshValidation() {
    const result = validatePreschoolSettings(settings.value)
    validationErrors.value = result.errors

    return result
  }

  function saveSettings() {
    const result = refreshValidation()

    if (!result.isValid) {
      return { ok: false, issueCount: result.issueCount }
    }

    savedSettings.value = cloneValue(settings.value)
    lastSavedAt.value = new Date()

    return { ok: true, issueCount: 0 }
  }

  function resetSettings() {
    settings.value = cloneValue(savedSettings.value)
    validationErrors.value = validatePreschoolSettings(settings.value).errors
  }

  function addTerm(term) {
    settings.value.terms = [...(settings.value.terms || []), cloneValue(term)]
  }

  function updateTerm(index, term) {
    const next = [...(settings.value.terms || [])]
    next.splice(index, 1, cloneValue(term))
    settings.value.terms = next
  }

  function removeTerm(index) {
    settings.value.terms = (settings.value.terms || []).filter((_, itemIndex) => itemIndex !== index)
  }

  function addClassConfiguration(configuration) {
    settings.value.classConfigurations = [...(settings.value.classConfigurations || []), cloneValue(configuration)]
  }

  function updateClassConfiguration(index, field, value) {
    const next = [...(settings.value.classConfigurations || [])]
    const current = cloneValue(next[index] || {})
    next.splice(index, 1, {
      ...current,
      [field]: cloneValue(value),
    })
    settings.value.classConfigurations = next
  }

  function removeClassConfiguration(index) {
    settings.value.classConfigurations = (settings.value.classConfigurations || []).filter((_, itemIndex) => itemIndex !== index)
  }

  return {
    settings,
    savedSettings,
    validationErrors,
    lastSavedAt,
    issueCount,
    hasValidationIssues,
    refreshValidation,
    saveSettings,
    resetSettings,
    addTerm,
    updateTerm,
    removeTerm,
    addClassConfiguration,
    updateClassConfiguration,
    removeClassConfiguration,
  }
}

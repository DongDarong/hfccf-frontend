<script setup>
import { onMounted, ref } from 'vue'
import Button from '@/components/buttons/Button.vue'
import Select from 'primevue/select'
import html2pdf from 'html2pdf.js'
import * as XLSX from 'xlsx'
import { useLanguage } from '@/composables/useLanguage'
import {
  fetchPreschoolClasses,
  fetchPreschoolStudents,
  fetchPreschoolStudent,
  fetchPreschoolAttendance,
} from '@/modules/preschool/services/preschoolApi'
import { fetchAcademicLifecycle } from '@/modules/preschool/services/api/preschoolAcademicLifecycleApi'
import StudentIdentityCard from './StudentIdentityCard.vue'
import StudentAttendanceSummary from './StudentAttendanceSummary.vue'
import ClassSummaryTable from './ClassSummaryTable.vue'

defineOptions({
  name: 'StudentSummaryReportPanel',
})

const { t } = useLanguage()

const loading = ref(false)
const reportGenerated = ref(false)
const errorMessage = ref('')
const exportLoading = ref(false)
const scopeType = ref('individual')
const academicYearId = ref('')
const classId = ref('')
const studentId = ref('')

const filterOptions = ref({
  academicYears: [],
  classes: [],
  students: [],
})

const reportData = ref({
  student: null,
  attendance: null,
  classStudents: [],
})

async function loadFilterOptions() {
  try {
    const lifecycle = await fetchAcademicLifecycle()
    filterOptions.value.academicYears = (lifecycle.academicYears || []).map(ay => ({
      label: ay.label || ay.code,
      value: ay.id,
    }))

    if (filterOptions.value.academicYears.length > 0) {
      academicYearId.value = filterOptions.value.academicYears[0].value
    }

    const classes = await fetchPreschoolClasses()
    filterOptions.value.classes = (classes.items || []).map(c => ({
      label: c.name,
      value: c.id,
    }))

    if (filterOptions.value.classes.length > 0) {
      classId.value = filterOptions.value.classes[0].value
      await loadStudents()
    }
  } catch {
    errorMessage.value = t('preschoolReportsPage.messages.loadFailed') || 'Failed to load filter options'
  }
}

async function loadStudents() {
  if (!classId.value) {
    filterOptions.value.students = []
    return
  }

  try {
    const students = await fetchPreschoolStudents({ classId: classId.value, perPage: 100 })
    filterOptions.value.students = (students.items || []).map(s => ({
      label: `${s.fullName} (${s.studentCode || s.publicId})`,
      value: s.id,
    }))

    if (filterOptions.value.students.length > 0 && !studentId.value) {
      studentId.value = filterOptions.value.students[0].value
    }
  } catch {
    filterOptions.value.students = []
  }
}

async function generateIndividualReport() {
  if (!studentId.value || !classId.value) {
    errorMessage.value = 'Please select both student and class'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const studentData = await fetchPreschoolStudent(studentId.value)

    const attendanceData = await fetchPreschoolAttendance({
      studentId: studentId.value,
      classId: classId.value,
      perPage: 1000,
    })

    reportData.value = {
      student: studentData,
      attendance: attendanceData,
    }

    reportGenerated.value = true
  } catch (error) {
    errorMessage.value = error?.message || 'Failed to generate report'
  } finally {
    loading.value = false
  }
}

async function generateClassReport() {
  if (!classId.value) {
    errorMessage.value = 'Please select a class'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const studentsData = await fetchPreschoolStudents({ classId: classId.value, perPage: 1000 })
    const students = studentsData.items || []

    const batchSize = 5
    const classStudents = []

    for (let i = 0; i < students.length; i += batchSize) {
      const batch = students.slice(i, i + batchSize)

      const batchResults = await Promise.all(
        batch.map(async (student) => {
          const attendance = await fetchPreschoolAttendance({
            studentId: student.id,
            classId: classId.value,
            perPage: 1000,
          })

          const attendancePercentage = calculateAttendancePercentage(attendance)

          return {
            student,
            attendancePercentage,
          }
        }),
      )

      classStudents.push(...batchResults)
    }

    reportData.value = {
      classStudents,
    }

    reportGenerated.value = true
  } catch (error) {
    errorMessage.value = error?.message || 'Failed to generate class report'
  } finally {
    loading.value = false
  }
}

function calculateAttendancePercentage(attendanceData) {
  if (!attendanceData || attendanceData.total === 0) return 0
  return Math.round((attendanceData.items?.filter(a => a.status === 'present').length || 0) / attendanceData.total * 100)
}

function generateReport() {
  if (scopeType.value === 'individual') {
    generateIndividualReport()
  } else {
    generateClassReport()
  }
}

function resetFilters() {
  scopeType.value = 'individual'
  studentId.value = filterOptions.value.students[0]?.value || ''
  reportGenerated.value = false
  reportData.value = {
    student: null,
    attendance: null,
    classStudents: [],
  }
}

async function exportReport(format) {
  try {
    exportLoading.value = true

    const timestamp = new Date().toISOString().split('T')[0]
    const reportTypeLabel = scopeType.value === 'individual' ? 'Individual' : 'Class'
    const filename = `StudentSummaryReport_${reportTypeLabel}_${timestamp}`

    if (format === 'pdf') {
      await exportToPdf(filename)
    } else if (format === 'excel') {
      exportToExcel(filename)
    } else if (format === 'print') {
      window.print()
    }
  } catch (error) {
    errorMessage.value = 'Failed to export report'
    console.error('Error exporting report:', error)
  } finally {
    exportLoading.value = false
  }
}

async function exportToPdf(filename) {
  const element = document.querySelector('.preschool-student-summary-report-content')
  if (!element) {
    throw new Error('Report content not found')
  }

  const clonedElement = element.cloneNode(true)

  // Sanitize unsupported colors before PDF generation
  sanitizeColorsInClonedElement(clonedElement)

  const options = {
    margin: [15, 15, 15, 15],
    filename: `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff',
      letterRendering: true,
    },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
  }

  try {
    await html2pdf()
      .set(options)
      .from(clonedElement)
      .save()
  } catch (error) {
    throw new Error(`PDF generation failed: ${error.message}`)
  }
}

/**
 * Sanitize oklch() and unsupported CSS colors in cloned DOM
 * This prevents html2canvas from failing on modern Tailwind colors
 */
function sanitizeColorsInClonedElement(clonedElement) {
  if (!clonedElement) return

  const walk = (element) => {
    if (!element || element.nodeType !== 1) return

    try {
      const computedStyle = window.getComputedStyle(element)

      // Sanitize color property
      if (computedStyle.color) {
        const safeColor = convertColorToSafe(computedStyle.color)
        if (safeColor && safeColor !== computedStyle.color) {
          element.style.color = safeColor
        }
      }

      // Sanitize background-color property
      if (computedStyle.backgroundColor && computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
        const safeColor = convertColorToSafe(computedStyle.backgroundColor)
        if (safeColor && safeColor !== computedStyle.backgroundColor) {
          element.style.backgroundColor = safeColor
        }
      }

      // Sanitize border-color property
      if (computedStyle.borderColor) {
        const safeColor = convertColorToSafe(computedStyle.borderColor)
        if (safeColor && safeColor !== computedStyle.borderColor) {
          element.style.borderColor = safeColor
        }
      }
    } catch (error) {
      console.debug(`Color sanitization error: ${error.message}`)
    }

    // Recurse to children
    for (let child of element.childNodes) {
      if (child.nodeType === 1) {
        walk(child)
      }
    }
  }

  walk(clonedElement)
}

/**
 * Convert computed color values to safe HEX/RGB values
 * Handles oklch(), color-mix(), and maps Tailwind colors to HEX
 */
function convertColorToSafe(colorValue) {
  if (!colorValue) return colorValue

  colorValue = colorValue.trim()

  // Already safe formats
  if (colorValue.startsWith('#') || colorValue.startsWith('rgb')) {
    return colorValue
  }

  // Tailwind color mapping (RGB to HEX)
  const colorMap = {
    'rgb(248, 250, 252)': '#f8fafc', // slate-50
    'rgb(241, 245, 249)': '#f1f5f9', // slate-100
    'rgb(226, 232, 240)': '#e2e8f0', // slate-200
    'rgb(203, 213, 225)': '#cbd5e1', // slate-300
    'rgb(148, 163, 184)': '#94a3b8', // slate-400
    'rgb(100, 116, 139)': '#64748b', // slate-500
    'rgb(71, 85, 99)': '#475563',    // slate-600
    'rgb(51, 65, 85)': '#334155',    // slate-700
    'rgb(30, 41, 59)': '#1e293b',    // slate-800
    'rgb(15, 23, 42)': '#0f172a',    // slate-900
    'rgb(240, 253, 244)': '#f0fdf4', // green-50
    'rgb(220, 252, 231)': '#dcfce7', // green-100
    'rgb(187, 247, 208)': '#bbf7d0', // green-200
    'rgb(134, 239, 172)': '#86efac', // green-300
    'rgb(74, 222, 128)': '#4ade80',  // green-400
    'rgb(34, 197, 94)': '#22c55e',   // green-500
    'rgb(22, 163, 74)': '#16a34a',   // green-600
    'rgb(16, 185, 129)': '#10b981',  // green-600-alt
    'rgb(21, 128, 61)': '#15803d',   // green-700
    'rgb(254, 242, 242)': '#fef2f2', // red-50
    'rgb(254, 226, 226)': '#fee2e2', // red-100
    'rgb(254, 202, 202)': '#fecaca', // red-200
    'rgb(252, 165, 165)': '#fca5a5', // red-300
    'rgb(248, 113, 113)': '#f87171', // red-400
    'rgb(239, 68, 68)': '#ef4444',   // red-500
    'rgb(220, 38, 38)': '#dc2626',   // red-600
    'rgb(185, 28, 28)': '#b91c1c',   // red-700
    'rgb(254, 252, 232)': '#fffce8', // yellow-50
    'rgb(254, 248, 204)': '#fef8cc', // yellow-100
    'rgb(253, 230, 138)': '#fde68a', // yellow-300
    'rgb(250, 204, 21)': '#facc15',  // yellow-400
    'rgb(234, 179, 8)': '#eab308',   // yellow-500
    'rgb(202, 138, 4)': '#ca8a04',   // yellow-600
    'rgb(161, 98, 7)': '#a16207',    // yellow-700
    'rgb(239, 246, 255)': '#eff6ff', // blue-50
    'rgb(219, 234, 254)': '#dbeafe', // blue-100
    'rgb(191, 219, 254)': '#bfdbfe', // blue-200
    'rgb(147, 197, 253)': '#93c5fd', // blue-300
    'rgb(96, 165, 250)': '#60a5fa',  // blue-400
    'rgb(59, 130, 246)': '#3b82f6',  // blue-500
    'rgb(37, 99, 235)': '#2563eb',   // blue-600
    'rgb(29, 78, 216)': '#1d4ed8',   // blue-700
    'rgb(249, 250, 251)': '#f9fafb', // gray-50
    'rgb(243, 244, 246)': '#f3f4f6', // gray-100
    'rgb(229, 231, 235)': '#e5e7eb', // gray-200
    'rgb(209, 213, 219)': '#d1d5db', // gray-300
    'rgb(156, 163, 175)': '#9ca3af', // gray-400
    'rgb(107, 114, 128)': '#6b7280', // gray-500
    'rgb(75, 85, 99)': '#4b5563',    // gray-600
    'rgb(55, 65, 81)': '#374151',    // gray-700
    'rgb(31, 41, 55)': '#1f2937',    // gray-800
    'rgb(17, 24, 39)': '#111827',    // gray-900
    'rgb(255, 255, 255)': '#ffffff', // white
    'rgb(0, 0, 0)': '#000000',       // black
  }

  if (colorMap[colorValue]) {
    return colorMap[colorValue]
  }

  // Handle oklch() colors
  if (colorValue.includes('oklch')) {
    console.debug(`Detected oklch color: ${colorValue}`)
    return colorValue.includes('0.') ? '#f8fafc' : '#4b5563'
  }

  // Handle color-mix()
  if (colorValue.includes('color-mix')) {
    console.debug(`Detected color-mix: ${colorValue}`)
    return '#e5e7eb'
  }

  return colorValue
}

function exportToExcel(filename) {
  const workbook = XLSX.utils.book_new()

  const metaData = [
    ['Student Summary Report'],
    ['Type', scopeType.value === 'individual' ? 'Individual' : 'Class'],
    ['Generated On', new Date().toLocaleString()],
    ['Academic Year', filterOptions.value.academicYears.find(y => y.value === academicYearId.value)?.label || 'All'],
  ]

  if (scopeType.value === 'individual') {
    metaData.push(['Student', reportData.value.student?.firstName + ' ' + reportData.value.student?.lastName || 'N/A'])
  } else {
    metaData.push(['Class', filterOptions.value.classes.find(c => c.value === classId.value)?.label || 'All Classes'])
  }

  const metaSheet = XLSX.utils.aoa_to_sheet(metaData)
  XLSX.utils.book_append_sheet(workbook, metaSheet, 'Report Info')

  if (scopeType.value === 'individual' && reportData.value.student) {
    const studentData = [
      ['First Name', reportData.value.student.firstName || ''],
      ['Last Name', reportData.value.student.lastName || ''],
      ['Enrollment Number', reportData.value.student.enrollmentNumber || ''],
      ['Date of Birth', reportData.value.student.dateOfBirth || ''],
    ]
    const studentSheet = XLSX.utils.aoa_to_sheet(studentData)
    XLSX.utils.book_append_sheet(workbook, studentSheet, 'Student Info')
  }

  if (reportData.value.attendance) {
    const attendanceData = [
      ['Metric', 'Value'],
      ['Total Days', reportData.value.attendance.totalDays || 0],
      ['Present', reportData.value.attendance.presentDays || 0],
      ['Absent', reportData.value.attendance.absentDays || 0],
      ['Attendance Rate', reportData.value.attendance.attendanceRate || '0%'],
    ]
    const attendanceSheet = XLSX.utils.aoa_to_sheet(attendanceData)
    XLSX.utils.book_append_sheet(workbook, attendanceSheet, 'Attendance')
  }

  if (scopeType.value === 'class' && reportData.value.classStudents.length > 0) {
    const studentList = reportData.value.classStudents.map(s => [
      s.firstName || '',
      s.lastName || '',
      s.enrollmentNumber || '',
    ])
    studentList.unshift(['First Name', 'Last Name', 'Enrollment Number'])
    const classSheet = XLSX.utils.aoa_to_sheet(studentList)
    XLSX.utils.book_append_sheet(workbook, classSheet, 'Class Students')
  }

  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

onMounted(() => {
  loadFilterOptions()
})
</script>

<template>
  <div class="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <!-- Filters -->
    <div class="rounded-xl border border-slate-200 bg-slate-50 p-6">
      <h3 class="mb-6 text-sm font-bold uppercase tracking-wide text-slate-900">
        {{ t('preschoolReportsPage.filters') }}
      </h3>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <label class="block">
          <span class="mb-2 block text-xs font-semibold text-slate-700">
            {{ t('preschoolReportsPage.reportYear') }}
          </span>
          <Select
            v-model="academicYearId"
            :options="filterOptions.academicYears"
            option-label="label"
            option-value="value"
            class="w-full"
            :placeholder="t('preschoolReportsPage.reportYear')"
          />
        </label>

        <label class="space-y-2">
          <span class="text-sm font-medium text-slate-700">
            {{ t('preschoolReportsPage.reportClass') }}
          </span>
          <Select
            v-model="classId"
            :options="filterOptions.classes"
            option-label="label"
            option-value="value"
            class="w-full"
            :placeholder="t('preschoolReportsPage.reportClass')"
            @update:model-value="loadStudents"
          />
        </label>

        <label v-show="scopeType === 'individual'" class="space-y-2">
          <span class="text-sm font-medium text-slate-700">
            {{ t('preschoolReportsPage.individual') }}
          </span>
          <Select
            v-model="studentId"
            :options="filterOptions.students"
            option-label="label"
            option-value="value"
            class="w-full"
            :placeholder="t('preschoolReportsPage.individual')"
          />
        </label>

        <label class="space-y-2 md:col-span-2">
          <span class="text-sm font-medium text-slate-700">
            {{ t('preschoolReportsPage.scope') }}
          </span>
          <div class="flex items-center gap-6 pt-2">
            <label class="flex items-center gap-2">
              <input
                v-model="scopeType"
                type="radio"
                value="individual"
                class="rounded"
              />
              <span class="text-sm text-slate-700">{{ t('preschoolReportsPage.individual') }}</span>
            </label>
            <label class="flex items-center gap-2">
              <input
                v-model="scopeType"
                type="radio"
                value="class"
                class="rounded"
              />
              <span class="text-sm text-slate-700">{{ t('preschoolReportsPage.entireClass') }}</span>
            </label>
          </div>
        </label>
      </div>
    </div>

    <!-- Generate & Reset Buttons -->
    <div class="flex flex-wrap items-center gap-3">
      <Button
        type="button"
        variant="primary"
        size="md"
        rounded="lg"
        :loading="loading"
        @click="generateReport"
      >
        {{ t('preschoolReportsPage.generateReport') }}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="md"
        rounded="lg"
        @click="resetFilters"
      >
        {{ t('preschoolReportsPage.reset') }}
      </Button>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      {{ errorMessage }}
    </div>

    <!-- Individual Student Report -->
    <template v-if="reportGenerated && scopeType === 'individual' && reportData.student">
      <div class="preschool-student-summary-report-content">
        <StudentIdentityCard :student="reportData.student" />
        <StudentAttendanceSummary :attendance="reportData.attendance" />
      </div>

      <!-- Export Toolbar -->
      <div class="rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Export</h2>
        <div class="flex flex-wrap items-center gap-3">
          <Button type="button" variant="secondary" size="md" rounded="lg" :loading="exportLoading" @click="exportReport('pdf')">
            <i class="pi pi-file-pdf mr-2" /> PDF
          </Button>
          <Button type="button" variant="secondary" size="md" rounded="lg" :loading="exportLoading" @click="exportReport('excel')">
            <i class="pi pi-file-excel mr-2" /> Excel
          </Button>
          <Button type="button" variant="secondary" size="md" rounded="lg" :loading="exportLoading" @click="exportReport('print')">
            <i class="pi pi-print mr-2" /> Print
          </Button>
        </div>
      </div>
    </template>

    <!-- Class Report -->
    <template v-if="reportGenerated && scopeType === 'class' && reportData.classStudents.length > 0">
      <div class="preschool-student-summary-report-content">
        <ClassSummaryTable :students="reportData.classStudents" />
      </div>

      <!-- Export Toolbar -->
      <div class="rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Export</h2>
        <div class="flex flex-wrap items-center gap-3">
          <Button type="button" variant="secondary" size="md" rounded="lg" :loading="exportLoading" @click="exportReport('pdf')">
            <i class="pi pi-file-pdf mr-2" /> PDF
          </Button>
          <Button type="button" variant="secondary" size="md" rounded="lg" :loading="exportLoading" @click="exportReport('excel')">
            <i class="pi pi-file-excel mr-2" /> Excel
          </Button>
          <Button type="button" variant="secondary" size="md" rounded="lg" :loading="exportLoading" @click="exportReport('print')">
            <i class="pi pi-print mr-2" /> Print
          </Button>
        </div>
      </div>
    </template>

    <!-- Class Report Empty State -->
    <div v-if="reportGenerated && scopeType === 'class' && reportData.classStudents.length === 0" class="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
      <i class="pi pi-user-minus text-4xl text-slate-300" />
      <p class="mt-4 text-slate-600">No students found in this class.</p>
    </div>

    <!-- Initial Empty State -->
    <div v-if="!reportGenerated" class="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
      <i class="pi pi-inbox text-4xl text-slate-300" />
      <p class="mt-4 text-slate-600">
        {{ t('preschoolReportsPage.emptyState') }}
      </p>
    </div>
  </div>
</template>

<style scoped>
@media print {
  /* Hide all UI elements during print */
  .space-y-5,
  .rounded-xl.border.border-slate-200.bg-slate-50.p-6,
  .rounded-xl.border.border-slate-200.bg-white.p-6,
  .flex.flex-wrap.items-center.gap-3 {
    display: none !important;
  }

  /* Show only the report content */
  .preschool-student-summary-report-content {
    margin: 0;
    padding: 0;
    border: none;
    background: white;
    page-break-inside: avoid;
  }

  /* Ensure content is visible */
  body {
    margin: 0;
    padding: 0;
  }
}
</style>

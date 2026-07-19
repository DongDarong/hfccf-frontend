<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
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
import StudentIdentityCard from './components/StudentIdentityCard.vue'
import StudentAttendanceSummary from './components/StudentAttendanceSummary.vue'
import ClassSummaryTable from './components/ClassSummaryTable.vue'
import ReportSwitcher from './components/ReportSwitcher.vue'

defineOptions({
  name: 'StudentSummaryReportPage',
})

const { t } = useLanguage()
const router = useRouter()

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

function backToReports() {
  router.push({ name: 'dashboard-preschool-admin-reports' })
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

  const options = {
    margin: 10,
    filename: `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
  }

  await html2pdf().set(options).from(element).save()
}

function exportToExcel(filename) {
  const workbook = XLSX.utils.book_new()

  // Metadata
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

  // Student details (if individual)
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

  // Attendance summary
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

  // Class students (if class report)
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
  <MainLayout>
    <section class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <HeaderSection
          :title="t('preschoolReportsPage.reportTypes.student-summary')"
          :subtitle="t('preschoolReportsPage.reportTypeDesc.student-summary')"
        />
        <Button
          type="button"
          variant="ghost"
          size="md"
          rounded="lg"
          @click="backToReports"
          class="flex items-center gap-2"
        >
          <i class="pi pi-chevron-left" />
          {{ t('preschoolReportsPage.backToReports') || 'Back to Reports' }}
        </Button>
      </div>

      <!-- Report Switcher -->
      <ReportSwitcher />

      <!-- Filters -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          {{ t('preschoolReportsPage.filters') }}
        </h3>

        <div class="grid gap-4 md:grid-cols-2">
          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolReportsCenterPage.filters.academicYear') }}
            </span>
            <Select
              v-model="academicYearId"
              :options="filterOptions.academicYears"
              option-label="label"
              option-value="value"
              class="w-full"
              :placeholder="t('preschoolReportsCenterPage.filters.academicYear')"
            />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolReportsCenterPage.filters.class') }}
            </span>
            <Select
              v-model="classId"
              :options="filterOptions.classes"
              option-label="label"
              option-value="value"
              class="w-full"
              :placeholder="t('preschoolReportsCenterPage.filters.class')"
              @update:model-value="loadStudents"
            />
          </label>

          <label v-show="scopeType === 'individual'" class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolReportsCenterPage.filters.student') }}
            </span>
            <Select
              v-model="studentId"
              :options="filterOptions.students"
              option-label="label"
              option-value="value"
              class="w-full"
              :placeholder="t('preschoolReportsCenterPage.filters.student')"
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
          size="lg"
          rounded="xl"
          :loading="loading"
          @click="generateReport"
          class="px-8"
        >
          {{ t('preschoolReportsPage.generateReport') }}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          rounded="xl"
          @click="resetFilters"
        >
          {{ t('preschoolReportsPage.reset') }}
        </Button>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ errorMessage }}
      </div>

      <!-- Individual Student Report -->
      <template v-if="reportGenerated && scopeType === 'individual' && reportData.student">
        <div class="preschool-student-summary-report-content">
          <StudentIdentityCard :student="reportData.student" />
          <StudentAttendanceSummary :attendance="reportData.attendance" />
        </div>

        <!-- Export Toolbar -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">{{ t('preschoolReportsCenterPage.exports.title') }}</h2>
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
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">{{ t('preschoolReportsCenterPage.exports.title') }}</h2>
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
      <div v-if="reportGenerated && scopeType === 'class' && reportData.classStudents.length === 0" class="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
        <i class="pi pi-user-minus text-4xl text-slate-300" />
        <p class="mt-4 text-slate-600">No students found in this class.</p>
      </div>

      <!-- Initial Empty State -->
      <div v-if="!reportGenerated" class="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
        <i class="pi pi-inbox text-4xl text-slate-300" />
        <p class="mt-4 text-slate-600">
          {{ t('preschoolReportsPage.emptyState') }}
        </p>
      </div>
    </section>
  </MainLayout>
</template>

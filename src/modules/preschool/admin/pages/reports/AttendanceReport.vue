<script setup>
import { computed, onMounted, ref } from 'vue'
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
  fetchPreschoolAttendance,
} from '@/modules/preschool/services/preschoolApi'
import { fetchAcademicLifecycle } from '@/modules/preschool/services/api/preschoolAcademicLifecycleApi'
import MonthlyAttendanceReport from './components/MonthlyAttendanceReport.vue'
import YearlyAttendanceReport from './components/YearlyAttendanceReport.vue'
import ReportSwitcher from './components/ReportSwitcher.vue'
import FilterSummary from './components/FilterSummary.vue'
import ExportMenu from './components/ExportMenu.vue'
import ReportStatistics from './components/ReportStatistics.vue'
import { fetchAllPages } from './reportPaginationHelper'

defineOptions({
  name: 'AttendanceReportPage',
})

const { t } = useLanguage()
const router = useRouter()

const loading = ref(false)
const reportGenerated = ref(false)
const errorMessage = ref('')
const exportLoading = ref(false)

const reportPeriod = ref('monthly')
const academicYearId = ref('')
const classId = ref('')
const selectedMonth = ref(new Date().getMonth() + 1)
const selectedYear = ref(new Date().getFullYear())

const filterOptions = ref({
  academicYears: [],
  classes: [],
})

const reportData = ref({
  monthlyAttendance: [],
  yearlyAttendance: [],
  students: [],
  classInfo: null,
})

const months = computed(() => [
  { label: t('preschoolAttendanceReportPage.months.january') || 'January', value: 1 },
  { label: t('preschoolAttendanceReportPage.months.february') || 'February', value: 2 },
  { label: t('preschoolAttendanceReportPage.months.march') || 'March', value: 3 },
  { label: t('preschoolAttendanceReportPage.months.april') || 'April', value: 4 },
  { label: t('preschoolAttendanceReportPage.months.may') || 'May', value: 5 },
  { label: t('preschoolAttendanceReportPage.months.june') || 'June', value: 6 },
  { label: t('preschoolAttendanceReportPage.months.july') || 'July', value: 7 },
  { label: t('preschoolAttendanceReportPage.months.august') || 'August', value: 8 },
  { label: t('preschoolAttendanceReportPage.months.september') || 'September', value: 9 },
  { label: t('preschoolAttendanceReportPage.months.october') || 'October', value: 10 },
  { label: t('preschoolAttendanceReportPage.months.november') || 'November', value: 11 },
  { label: t('preschoolAttendanceReportPage.months.december') || 'December', value: 12 },
])

const yearOptions = computed(() => {
  const years = []
  const currentYear = new Date().getFullYear()
  for (let i = currentYear - 5; i <= currentYear + 1; i++) {
    years.push({ label: String(i), value: i })
  }
  return years
})

const canGenerate = computed(() => {
  return academicYearId.value && classId.value && (
    reportPeriod.value === 'yearly' ? selectedYear.value : (selectedMonth.value && selectedYear.value)
  )
})

const selectedAcademicYearLabel = computed(() => {
  return filterOptions.value.academicYears.find(y => y.value === academicYearId.value)?.label || ''
})

const selectedClassLabel = computed(() => {
  return filterOptions.value.classes.find(c => c.value === classId.value)?.label || ''
})

const selectedMonthLabel = computed(() => {
  return months.value.find(m => m.value === selectedMonth.value)?.label || ''
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
    }
  } catch {
    errorMessage.value = t('preschoolAttendanceReportPage.messages.loadFailed') || 'Failed to load filters'
  }
}

function getDateRange() {
  if (reportPeriod.value === 'monthly') {
    const year = selectedYear.value
    const month = selectedMonth.value
    const from = `${year}-${String(month).padStart(2, '0')}-01`
    const lastDay = new Date(year, month, 0).getDate()
    const to = `${year}-${String(month).padStart(2, '0')}-${lastDay}`
    return { from, to }
  } else {
    const year = selectedYear.value
    return { from: `${year}-01-01`, to: `${year}-12-31` }
  }
}

async function generateReport() {
  if (!canGenerate.value) return

  loading.value = true
  errorMessage.value = ''

  try {
    const dateRange = getDateRange()

    // Fetch all pages to ensure complete dataset
    const [attendanceData, studentsData] = await Promise.all([
      fetchAllPages(fetchPreschoolAttendance, {
        classId: classId.value,
        dateFrom: dateRange.from,
        dateTo: dateRange.to,
      }),
      fetchAllPages(fetchPreschoolStudents, {
        classId: classId.value,
      }),
    ])

    if (reportPeriod.value === 'monthly') {
      reportData.value.monthlyAttendance = attendanceData.items || []
    } else {
      reportData.value.yearlyAttendance = attendanceData.items || []
    }

    reportData.value.students = studentsData.items || []
    reportGenerated.value = true
  } catch (error) {
    errorMessage.value = error?.message || 'Failed to generate report'
  } finally {
    loading.value = false
  }
}

function resetFilters() {
  reportGenerated.value = false
  selectedMonth.value = new Date().getMonth() + 1
  selectedYear.value = new Date().getFullYear()
  reportData.value = {
    monthlyAttendance: [],
    yearlyAttendance: [],
    students: [],
    classInfo: null,
  }
}

function changeReportPeriod() {
  reportGenerated.value = false
}

function backToReports() {
  router.push({ name: 'dashboard-preschool-admin-reports' })
}

async function exportReport(format) {
  try {
    exportLoading.value = true

    const timestamp = new Date().toISOString().split('T')[0]
    const reportTypeLabel = reportPeriod.value === 'monthly' ? 'Monthly' : 'Yearly'
    const filename = `AttendanceReport_${reportTypeLabel}_${timestamp}`

    if (format === 'pdf') {
      await exportToPdf(filename)
    } else if (format === 'excel') {
      exportToExcel(filename)
    } else if (format === 'csv') {
      exportToCsv(filename)
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
  const element = document.querySelector('.preschool-attendance-report-content')
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

  // Class info and metadata
  const metaData = [
    ['Attendance Report'],
    ['Type', reportPeriod.value === 'monthly' ? 'Monthly' : 'Yearly'],
    ['Generated On', new Date().toLocaleString()],
    ['Academic Year', filterOptions.value.academicYears.find(y => y.value === academicYearId.value)?.label || 'All'],
    ['Class', reportData.value.classInfo?.name || 'All Classes'],
  ]
  if (reportPeriod.value === 'monthly') {
    metaData.push(['Month', `${selectedMonth.value}/${selectedYear.value}`])
  } else {
    metaData.push(['Year', selectedYear.value])
  }

  const metaSheet = XLSX.utils.aoa_to_sheet(metaData)
  XLSX.utils.book_append_sheet(workbook, metaSheet, 'Report Info')

  // Attendance data
  if (reportPeriod.value === 'monthly' && reportData.value.monthlyAttendance.length > 0) {
    const attendanceSheet = XLSX.utils.aoa_to_sheet(reportData.value.monthlyAttendance)
    XLSX.utils.book_append_sheet(workbook, attendanceSheet, 'Monthly Attendance')
  } else if (reportPeriod.value === 'yearly' && reportData.value.yearlyAttendance.length > 0) {
    const attendanceSheet = XLSX.utils.aoa_to_sheet(reportData.value.yearlyAttendance)
    XLSX.utils.book_append_sheet(workbook, attendanceSheet, 'Yearly Attendance')
  }

  // Students list
  if (reportData.value.students.length > 0) {
    const studentData = reportData.value.students.map(s => [
      s.firstName || '',
      s.lastName || '',
      s.enrollmentNumber || '',
    ])
    studentData.unshift(['First Name', 'Last Name', 'Enrollment Number'])
    const studentSheet = XLSX.utils.aoa_to_sheet(studentData)
    XLSX.utils.book_append_sheet(workbook, studentSheet, 'Students')
  }

  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

function exportToCsv(filename) {
  const records = reportPeriod.value === 'monthly'
    ? reportData.value.monthlyAttendance
    : reportData.value.yearlyAttendance

  if (records.length === 0) return

  const headers = Object.keys(records[0])
  const csvContent = [
    headers.join(','),
    ...records.map(record => headers.map(h => {
      const value = record[h]
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
    }).join(',')),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

function scrollToFilters() {
  const filtersElement = document.querySelector('.preschool-attendance-report-filters')
  if (filtersElement) {
    filtersElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(() => {
  loadFilterOptions()
})
</script>

<template>
  <MainLayout>
    <section class="space-y-6">
      <!-- Breadcrumb Navigation -->
      <nav class="flex items-center gap-2 text-sm text-slate-600">
        <button
          type="button"
          @click="backToReports"
          class="flex items-center gap-1 hover:text-slate-900"
        >
          <i class="pi pi-chevron-left" />
          Reports
        </button>
        <span class="text-slate-300">/</span>
        <span class="font-semibold text-slate-900">Attendance</span>
      </nav>

      <!-- Header -->
      <HeaderSection
        :title="t('preschoolAttendanceReportPage.title') || 'Attendance Report'"
        :subtitle="t('preschoolAttendanceReportPage.subtitle') || 'Monthly and yearly attendance reports by class'"
      />

      <!-- Report Switcher - Enhanced -->
      <ReportSwitcher />

      <!-- Error Message -->
      <div v-if="errorMessage" class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        <div class="flex items-center gap-2">
          <i class="pi pi-exclamation-triangle" />
          {{ errorMessage }}
        </div>
      </div>

      <!-- Filters Panel - Enhanced -->
      <div class="preschool-attendance-report-filters rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="mb-6 text-sm font-semibold uppercase tracking-wide text-slate-500">
          <i class="pi pi-sliders-h mr-2" />
          Report Filters
        </h3>

        <!-- Filter Groups -->
        <div class="space-y-6">
          <!-- Primary Filters -->
          <div class="grid gap-4 md:grid-cols-3">
            <!-- Academic Year -->
            <label class="space-y-2">
              <span class="text-sm font-semibold text-slate-700">
                {{ t('preschoolReportsCenterPage.filters.academicYear') || 'Academic Year' }}
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

            <!-- Class -->
            <label class="space-y-2">
              <span class="text-sm font-semibold text-slate-700">
                {{ t('preschoolReportsCenterPage.filters.class') || 'Class' }}
              </span>
              <Select
                v-model="classId"
                :options="filterOptions.classes"
                option-label="label"
                option-value="value"
                class="w-full"
                :placeholder="t('preschoolReportsCenterPage.filters.class')"
              />
            </label>

            <!-- Report Period -->
            <label class="space-y-2">
              <span class="text-sm font-semibold text-slate-700">
                {{ t('preschoolAttendanceReportPage.reportPeriod') || 'Report Period' }}
              </span>
              <Select
                v-model="reportPeriod"
                :options="[
                  { label: t('preschoolAttendanceReportPage.monthly') || 'Monthly', value: 'monthly' },
                  { label: t('preschoolAttendanceReportPage.yearly') || 'Yearly', value: 'yearly' },
                ]"
                option-label="label"
                option-value="value"
                class="w-full"
                @update:model-value="changeReportPeriod"
              />
            </label>
          </div>

          <!-- Dynamic Filters -->
          <div v-if="reportPeriod === 'monthly'" class="grid gap-4 md:grid-cols-2 border-t border-slate-200 pt-6">
            <label class="space-y-2">
              <span class="text-sm font-semibold text-slate-700">
                {{ t('preschoolAttendanceReportPage.month') || 'Month' }}
              </span>
              <Select
                v-model="selectedMonth"
                :options="months"
                option-label="label"
                option-value="value"
                class="w-full"
              />
            </label>

            <label class="space-y-2">
              <span class="text-sm font-semibold text-slate-700">
                {{ t('preschoolAttendanceReportPage.year') || 'Year' }}
              </span>
              <Select
                v-model="selectedYear"
                :options="yearOptions"
                option-label="label"
                option-value="value"
                class="w-full"
              />
            </label>
          </div>

          <div v-else class="grid gap-4 md:grid-cols-1 border-t border-slate-200 pt-6">
            <label class="space-y-2">
              <span class="text-sm font-semibold text-slate-700">
                {{ t('preschoolAttendanceReportPage.year') || 'Year' }}
              </span>
              <Select
                v-model="selectedYear"
                :options="yearOptions"
                option-label="label"
                option-value="value"
                class="w-full"
              />
            </label>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6">
          <Button
            type="button"
            variant="primary"
            size="lg"
            rounded="xl"
            :loading="loading"
            :disabled="!canGenerate"
            @click="generateReport"
            class="flex items-center gap-2"
          >
            <i class="pi pi-chart-line" />
            {{ t('preschoolAttendanceReportPage.generateReport') || 'Generate Report' }}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            rounded="xl"
            @click="resetFilters"
            class="flex items-center gap-2"
          >
            <i class="pi pi-refresh" />
            {{ t('preschoolAttendanceReportPage.reset') || 'Reset' }}
          </Button>
        </div>
      </div>

      <!-- Filter Summary -->
      <FilterSummary
        v-if="reportGenerated"
        :academic-year-label="selectedAcademicYearLabel"
        :class-label="selectedClassLabel"
        :report-period="reportPeriod"
        :month-label="selectedMonthLabel"
        :year="selectedYear"
        @clear-filters="resetFilters"
      />

      <!-- Report Statistics -->
      <template v-if="reportGenerated">
        <ReportStatistics
          :students="reportData.students"
          :attendance-records="reportPeriod === 'monthly' ? reportData.monthlyAttendance : reportData.yearlyAttendance"
          :class-label="selectedClassLabel"
        />
      </template>

      <!-- Report Content -->
      <template v-if="reportGenerated && reportPeriod === 'monthly'">
        <div class="preschool-attendance-report-content">
          <MonthlyAttendanceReport
            :attendance-records="reportData.monthlyAttendance"
            :students="reportData.students"
            :month="selectedMonth"
            :year="selectedYear"
          />
        </div>

        <!-- Unified Export Toolbar -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <i class="pi pi-download mr-2" />
            {{ t('preschoolReportsCenterPage.exports.title') || 'Export Options' }}
          </h2>
          <ExportMenu :loading="exportLoading" @export="exportReport" />
        </div>
      </template>

      <!-- Yearly Report -->
      <template v-if="reportGenerated && reportPeriod === 'yearly'">
        <div class="preschool-attendance-report-content">
          <YearlyAttendanceReport
            :attendance-records="reportData.yearlyAttendance"
            :students="reportData.students"
            :year="selectedYear"
          />
        </div>

        <!-- Unified Export Toolbar -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <i class="pi pi-download mr-2" />
            {{ t('preschoolReportsCenterPage.exports.title') || 'Export Options' }}
          </h2>
          <ExportMenu :loading="exportLoading" @export="exportReport" />
        </div>
      </template>

      <!-- Empty State - Enhanced -->
      <div v-if="!reportGenerated" class="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
        <div class="mx-auto w-full max-w-sm">
          <div class="mx-auto w-20 rounded-full bg-slate-200 p-4 text-center">
            <i class="pi pi-chart-bar text-3xl text-slate-400" />
          </div>
          <h3 class="mt-4 text-lg font-semibold text-slate-900">
            {{ t('preschoolAttendanceReportPage.noReport') || 'No Report Generated' }}
          </h3>
          <p class="mt-2 text-slate-600">
            {{ t('preschoolAttendanceReportPage.emptyState') || 'Configure your filters above and click Generate Report to view attendance data and statistics.' }}
          </p>
          <div class="mt-6">
            <Button
              type="button"
              variant="primary"
              size="md"
              rounded="xl"
              @click="scrollToFilters"
              class="inline-flex items-center gap-2"
            >
              <i class="pi pi-arrow-up" />
              {{ t('preschoolAttendanceReportPage.configureReport') || 'Configure Report' }}
            </Button>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

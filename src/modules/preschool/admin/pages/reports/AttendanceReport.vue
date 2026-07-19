<script setup>
import { computed, onMounted, ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Select from 'primevue/select'
import { useLanguage } from '@/composables/useLanguage'
import {
  fetchPreschoolClasses,
  fetchPreschoolStudents,
  fetchPreschoolAttendance,
} from '@/modules/preschool/services/preschoolApi'
import { fetchAcademicLifecycle } from '@/modules/preschool/services/api/preschoolAcademicLifecycleApi'
import MonthlyAttendanceReport from './components/MonthlyAttendanceReport.vue'
import YearlyAttendanceReport from './components/YearlyAttendanceReport.vue'
import { fetchAllPages } from './reportPaginationHelper'

defineOptions({
  name: 'AttendanceReportPage',
})

const { t } = useLanguage()

const loading = ref(false)
const reportGenerated = ref(false)
const errorMessage = ref('')

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

onMounted(() => {
  loadFilterOptions()
})
</script>

<template>
  <MainLayout>
    <section class="space-y-6">
      <!-- Header -->
      <HeaderSection
        :title="t('preschoolAttendanceReportPage.title') || 'Attendance Report'"
        :subtitle="t('preschoolAttendanceReportPage.subtitle') || 'Monthly and yearly attendance reports by class'"
      />

      <!-- Filters -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          {{ t('preschoolAttendanceReportPage.filters') || 'Filters' }}
        </h3>

        <div class="grid gap-4 md:grid-cols-3">
          <!-- Academic Year -->
          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
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
            <span class="text-sm font-medium text-slate-700">
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
            <span class="text-sm font-medium text-slate-700">
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

        <!-- Month/Year Filters (shown only in monthly mode) -->
        <div v-if="reportPeriod === 'monthly'" class="mt-4 grid gap-4 md:grid-cols-2">
          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
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
            <span class="text-sm font-medium text-slate-700">
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

        <!-- Year Filter (shown only in yearly mode) -->
        <div v-else class="mt-4 grid gap-4 md:grid-cols-1">
          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
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

      <!-- Generate & Reset Buttons -->
      <div class="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="primary"
          size="lg"
          rounded="xl"
          :loading="loading"
          :disabled="!canGenerate"
          @click="generateReport"
          class="px-8"
        >
          {{ t('preschoolAttendanceReportPage.generateReport') || 'Generate Report' }}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          rounded="xl"
          @click="resetFilters"
        >
          {{ t('preschoolAttendanceReportPage.reset') || 'Reset' }}
        </Button>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ errorMessage }}
      </div>

      <!-- Monthly Report -->
      <template v-if="reportGenerated && reportPeriod === 'monthly'">
        <MonthlyAttendanceReport
          :attendance-records="reportData.monthlyAttendance"
          :students="reportData.students"
          :month="selectedMonth"
          :year="selectedYear"
        />

        <!-- Export Toolbar (Placeholder) -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            {{ t('preschoolReportsCenterPage.exports.title') || 'Export' }}
          </h2>
          <div class="flex flex-wrap items-center gap-3">
            <Button type="button" variant="secondary" size="md" rounded="lg" disabled class="opacity-50">
              <i class="pi pi-file-pdf mr-2" /> PDF
            </Button>
            <Button type="button" variant="secondary" size="md" rounded="lg" disabled class="opacity-50">
              <i class="pi pi-file-excel mr-2" /> Excel
            </Button>
            <Button type="button" variant="secondary" size="md" rounded="lg" disabled class="opacity-50">
              <i class="pi pi-print mr-2" /> Print
            </Button>
          </div>
        </div>
      </template>

      <!-- Yearly Report -->
      <template v-if="reportGenerated && reportPeriod === 'yearly'">
        <YearlyAttendanceReport
          :attendance-records="reportData.yearlyAttendance"
          :students="reportData.students"
          :year="selectedYear"
        />

        <!-- Export Toolbar (Placeholder) -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            {{ t('preschoolReportsCenterPage.exports.title') || 'Export' }}
          </h2>
          <div class="flex flex-wrap items-center gap-3">
            <Button type="button" variant="secondary" size="md" rounded="lg" disabled class="opacity-50">
              <i class="pi pi-file-pdf mr-2" /> PDF
            </Button>
            <Button type="button" variant="secondary" size="md" rounded="lg" disabled class="opacity-50">
              <i class="pi pi-file-excel mr-2" /> Excel
            </Button>
            <Button type="button" variant="secondary" size="md" rounded="lg" disabled class="opacity-50">
              <i class="pi pi-print mr-2" /> Print
            </Button>
          </div>
        </div>
      </template>

      <!-- Empty State -->
      <div v-if="!reportGenerated" class="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
        <i class="pi pi-inbox text-4xl text-slate-300" />
        <p class="mt-4 text-slate-600">
          {{ t('preschoolAttendanceReportPage.emptyState') || 'Select filters and click Generate Report to view attendance data' }}
        </p>
      </div>
    </section>
  </MainLayout>
</template>

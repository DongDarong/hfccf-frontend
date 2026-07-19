<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Select from 'primevue/select'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'PreschoolReportsDashboardPage',
})

const { t } = useLanguage()
const router = useRouter()

const REPORT_TYPES = [
  { key: 'student-summary', label: 'Student Summary', icon: 'pi-user', routeName: 'dashboard-preschool-admin-reports-student-summary' },
  { key: 'attendance', label: 'Attendance', icon: 'pi-calendar', routeName: 'dashboard-preschool-admin-reports-attendance' },
  { key: 'assessment', label: 'Assessment', icon: 'pi-chart-bar', routeName: 'dashboard-preschool-admin-reports-assessments' },
]

const selectedReportType = ref('student-summary')
const reportGenerated = ref(false)

const filters = ref({
  academicYearId: '',
  classId: '',
  studentId: '',
  termId: '',
  reportPeriodId: '',
  reportMonth: '',
  reportYear: new Date().getFullYear(),
  scopeType: 'individual',
})

const filterOptions = ref({
  academicYears: [],
  classes: [],
  students: [],
  terms: [],
  periods: [],
})

const reportTypeOptions = computed(() =>
  REPORT_TYPES.map(type => ({
    ...type,
    label: t(`preschoolReportsPage.reportTypes.${type.key}`) || type.label,
  })),
)

function selectReportType(typeKey) {
  const reportType = REPORT_TYPES.find(rt => rt.key === typeKey)
  if (reportType?.routeName) {
    router.push({ name: reportType.routeName })
  }
  selectedReportType.value = typeKey
  reportGenerated.value = false
  resetFilters()
}

function resetFilters() {
  filters.value = {
    academicYearId: '',
    classId: '',
    studentId: '',
    termId: '',
    reportPeriodId: '',
    reportMonth: '',
    reportYear: new Date().getFullYear(),
    scopeType: 'individual',
  }
}

function generateReport() {
  reportGenerated.value = true
}
</script>

<template>
  <MainLayout>
    <section class="space-y-6">
      <!-- Section 1: Page Header -->
      <HeaderSection
        :title="t('preschoolReportsPage.title')"
        :subtitle="t('preschoolReportsPage.subtitle')"
      />

      <!-- Section 2: Report Type Selector -->
      <div class="space-y-3">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {{ t('preschoolReportsPage.selectReportType') || 'Select Report Type' }}
        </h2>
        <div class="grid gap-3 md:grid-cols-3">
          <button
            v-for="reportType in reportTypeOptions"
            :key="reportType.key"
            type="button"
            @click="selectReportType(reportType.key)"
            :class="[
              'rounded-2xl border-2 p-6 text-left transition-all duration-200',
              selectedReportType === reportType.key
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm',
            ]"
          >
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-semibold text-slate-900">{{ reportType.label }}</h3>
                <p class="mt-1 text-xs text-slate-500">
                  {{ t(`preschoolReportsPage.reportTypeDesc.${reportType.key}`) || '' }}
                </p>
              </div>
              <div
                v-if="selectedReportType === reportType.key"
                class="rounded-full bg-blue-500 p-1.5"
              >
                <i class="pi pi-check text-sm text-white" />
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Section 3: Dynamic Filters -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          {{ t('preschoolReportsPage.filters') || 'Filters' }}
        </h3>

        <!-- Student Summary Filters -->
        <div v-if="selectedReportType === 'student-summary'" class="grid gap-4 md:grid-cols-2">
          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolReportsCenterPage.filters.academicYear') }}
            </span>
            <Select
              v-model="filters.academicYearId"
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
              v-model="filters.classId"
              :options="filterOptions.classes"
              option-label="label"
              option-value="value"
              class="w-full"
              :placeholder="t('preschoolReportsCenterPage.filters.class')"
            />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolReportsCenterPage.filters.student') }}
            </span>
            <Select
              v-model="filters.studentId"
              :options="filterOptions.students"
              option-label="label"
              option-value="value"
              class="w-full"
              :placeholder="t('preschoolReportsCenterPage.filters.student')"
            />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolReportsPage.scope') || 'Scope' }}
            </span>
            <div class="flex items-center gap-4 pt-2">
              <label class="flex items-center gap-2">
                <input
                  v-model="filters.scopeType"
                  type="radio"
                  value="individual"
                  class="rounded"
                />
                <span class="text-sm text-slate-700">{{ t('preschoolReportsPage.individual') || 'Individual Student' }}</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  v-model="filters.scopeType"
                  type="radio"
                  value="class"
                  class="rounded"
                />
                <span class="text-sm text-slate-700">{{ t('preschoolReportsPage.entireClass') || 'Entire Class' }}</span>
              </label>
            </div>
          </label>
        </div>

        <!-- Attendance Report Filters -->
        <div v-if="selectedReportType === 'attendance'" class="grid gap-4 md:grid-cols-2">
          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolReportsCenterPage.filters.academicYear') }}
            </span>
            <Select
              v-model="filters.academicYearId"
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
              v-model="filters.classId"
              :options="filterOptions.classes"
              option-label="label"
              option-value="value"
              class="w-full"
              :placeholder="t('preschoolReportsCenterPage.filters.class')"
            />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolReportsPage.reportMonth') || 'Month' }}
            </span>
            <Select
              v-model="filters.reportMonth"
              :options="[
                { label: 'January', value: '01' },
                { label: 'February', value: '02' },
                { label: 'March', value: '03' },
                { label: 'April', value: '04' },
                { label: 'May', value: '05' },
                { label: 'June', value: '06' },
                { label: 'July', value: '07' },
                { label: 'August', value: '08' },
                { label: 'September', value: '09' },
                { label: 'October', value: '10' },
                { label: 'November', value: '11' },
                { label: 'December', value: '12' },
              ]"
              option-label="label"
              option-value="value"
              class="w-full"
              :placeholder="t('preschoolReportsPage.reportMonth')"
            />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolReportsPage.reportYear') || 'Year' }}
            </span>
            <Select
              v-model="filters.reportYear"
              :options="[
                { label: '2024', value: 2024 },
                { label: '2025', value: 2025 },
                { label: '2026', value: 2026 },
              ]"
              option-label="label"
              option-value="value"
              class="w-full"
              :placeholder="t('preschoolReportsPage.reportYear')"
            />
          </label>
        </div>

        <!-- Assessment Report Filters -->
        <div v-if="selectedReportType === 'assessment'" class="grid gap-4 md:grid-cols-2">
          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolReportsCenterPage.filters.academicYear') }}
            </span>
            <Select
              v-model="filters.academicYearId"
              :options="filterOptions.academicYears"
              option-label="label"
              option-value="value"
              class="w-full"
              :placeholder="t('preschoolReportsCenterPage.filters.academicYear')"
            />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolReportsCenterPage.filters.term') }}
            </span>
            <Select
              v-model="filters.termId"
              :options="filterOptions.terms"
              option-label="label"
              option-value="value"
              class="w-full"
              :placeholder="t('preschoolReportsCenterPage.filters.term')"
            />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolReportsCenterPage.filters.class') }}
            </span>
            <Select
              v-model="filters.classId"
              :options="filterOptions.classes"
              option-label="label"
              option-value="value"
              class="w-full"
              :placeholder="t('preschoolReportsCenterPage.filters.class')"
            />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolReportsCenterPage.filters.student') }}
            </span>
            <Select
              v-model="filters.studentId"
              :options="filterOptions.students"
              option-label="label"
              option-value="value"
              class="w-full"
              :placeholder="t('preschoolReportsCenterPage.filters.student')"
            />
          </label>

          <label class="space-y-2 md:col-span-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolReportsPage.scope') || 'Scope' }}
            </span>
            <div class="flex items-center gap-4 pt-2">
              <label class="flex items-center gap-2">
                <input
                  v-model="filters.scopeType"
                  type="radio"
                  value="individual"
                  class="rounded"
                />
                <span class="text-sm text-slate-700">{{ t('preschoolReportsPage.individual') || 'Individual Student' }}</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  v-model="filters.scopeType"
                  type="radio"
                  value="class"
                  class="rounded"
                />
                <span class="text-sm text-slate-700">{{ t('preschoolReportsPage.entireClass') || 'Entire Class' }}</span>
              </label>
            </div>
          </label>
        </div>
      </div>

      <!-- Section 4: Generate & Reset Buttons -->
      <div class="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="primary"
          size="lg"
          rounded="xl"
          @click="generateReport"
          class="px-8"
        >
          {{ t('preschoolReportsPage.generateReport') || 'Generate Report' }}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          rounded="xl"
          @click="resetFilters"
        >
          {{ t('preschoolReportsPage.reset') || 'Reset' }}
        </Button>
      </div>

      <!-- Section 5: Report Result Placeholder -->
      <div v-if="reportGenerated" class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="space-y-4">
          <div class="grid gap-4 md:grid-cols-4">
            <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p class="text-xs font-semibold uppercase text-slate-500">Metric 1</p>
              <p class="mt-2 text-2xl font-semibold text-slate-900">—</p>
            </div>
            <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p class="text-xs font-semibold uppercase text-slate-500">Metric 2</p>
              <p class="mt-2 text-2xl font-semibold text-slate-900">—</p>
            </div>
            <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p class="text-xs font-semibold uppercase text-slate-500">Metric 3</p>
              <p class="mt-2 text-2xl font-semibold text-slate-900">—</p>
            </div>
            <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p class="text-xs font-semibold uppercase text-slate-500">Metric 4</p>
              <p class="mt-2 text-2xl font-semibold text-slate-900">—</p>
            </div>
          </div>

          <div class="grid gap-4 lg:grid-cols-3">
            <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 lg:col-span-2">
              <p class="text-sm font-semibold text-slate-700">Report Table</p>
              <div class="mt-4 space-y-2">
                <div class="h-8 w-full rounded bg-slate-200" />
                <div class="h-8 w-full rounded bg-slate-200" />
                <div class="h-8 w-full rounded bg-slate-200" />
              </div>
            </div>

            <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p class="text-sm font-semibold text-slate-700">Chart</p>
              <div class="mt-4 space-y-2">
                <div class="h-24 w-full rounded bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 6: Export Toolbar Placeholder -->
      <div v-if="reportGenerated" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-sm font-semibold text-slate-700">{{ t('preschoolReportsCenterPage.exports.title') || 'Export' }}:</span>
          <Button
            type="button"
            variant="secondary"
            size="md"
            rounded="lg"
            disabled
            class="opacity-50"
          >
            <i class="pi pi-file-pdf mr-2" /> PDF
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="md"
            rounded="lg"
            disabled
            class="opacity-50"
          >
            <i class="pi pi-file-excel mr-2" /> Excel
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="md"
            rounded="lg"
            disabled
            class="opacity-50"
          >
            <i class="pi pi-print mr-2" /> Print
          </Button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!reportGenerated" class="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
        <i class="pi pi-inbox text-4xl text-slate-300" />
        <p class="mt-4 text-slate-600">
          {{ t('preschoolReportsPage.emptyState') || 'Select a report type and filters, then click "Generate Report" to view results.' }}
        </p>
      </div>
    </section>
  </MainLayout>
</template>

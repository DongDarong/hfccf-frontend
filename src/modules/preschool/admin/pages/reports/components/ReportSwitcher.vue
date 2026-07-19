<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Select from 'primevue/select'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()
const router = useRouter()
const route = useRoute()

const REPORTS = [
  {
    key: 'student-summary',
    label: 'Student Summary',
    routeName: 'dashboard-preschool-admin-reports-student-summary',
    icon: 'pi-user-check',
    color: 'blue',
  },
  {
    key: 'attendance',
    label: 'Attendance',
    routeName: 'dashboard-preschool-admin-reports-attendance',
    icon: 'pi-calendar-check',
    color: 'emerald',
  },
  {
    key: 'assessment',
    label: 'Assessment',
    icon: 'pi-chart-bar',
    color: 'violet',
  },
]

const reportOptions = computed(() =>
  REPORTS.map(report => ({
    ...report,
    label: t(`preschoolReportsPage.reportTypes.${report.key}`) || report.label,
  })),
)

const currentReport = computed(() => {
  const routeName = route.name
  return REPORTS.find(r => r.routeName === routeName)?.key || ''
})

const currentReportData = computed(() => {
  return reportOptions.value.find(r => r.key === currentReport.value)
})

function switchReport(reportKey) {
  const report = REPORTS.find(r => r.key === reportKey)
  if (report?.routeName) {
    router.push({ name: report.routeName })
  }
}

const colorMap = {
  blue: 'border-blue-200 bg-blue-50 text-blue-700',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  violet: 'border-violet-200 bg-violet-50 text-violet-700',
}
</script>

<template>
  <!-- Desktop: Enhanced Horizontal Tabs -->
  <div class="hidden gap-2 md:flex">
    <button
      v-for="report in reportOptions"
      :key="report.key"
      type="button"
      @click="switchReport(report.key)"
      :class="[
        'group flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200',
        currentReport === report.key
          ? `border-2 ${colorMap[report.color]} shadow-sm`
          : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
      ]"
    >
      <i :class="`pi ${report.icon}`" />
      <span>{{ report.label }}</span>
    </button>
  </div>

  <!-- Mobile: Dropdown Select with Icon -->
  <div class="md:hidden">
    <div v-if="currentReportData" class="mb-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <i :class="`pi ${currentReportData.icon} text-lg`" />
      <span class="text-sm font-semibold text-slate-900">{{ currentReportData.label }}</span>
    </div>
    <Select
      :model-value="currentReport"
      :options="reportOptions"
      option-label="label"
      option-value="key"
      @update:model-value="switchReport"
      class="w-full"
    />
  </div>
</template>

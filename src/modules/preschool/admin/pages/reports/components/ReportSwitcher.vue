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
  },
  {
    key: 'attendance',
    label: 'Attendance',
    routeName: 'dashboard-preschool-admin-reports-attendance',
  },
  {
    key: 'assessment',
    label: 'Assessment',
    routeName: 'dashboard-preschool-admin-reports-assessments',
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

function switchReport(reportKey) {
  const report = REPORTS.find(r => r.key === reportKey)
  if (report) {
    router.push({ name: report.routeName })
  }
}
</script>

<template>
  <!-- Desktop: Horizontal Tabs -->
  <div class="hidden gap-1 md:flex">
    <button
      v-for="report in reportOptions"
      :key="report.key"
      type="button"
      @click="switchReport(report.key)"
      :class="[
        'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
        currentReport === report.key
          ? 'bg-blue-100 text-blue-700'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
      ]"
    >
      {{ report.label }}
    </button>
  </div>

  <!-- Mobile: Dropdown Select -->
  <div class="md:hidden">
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

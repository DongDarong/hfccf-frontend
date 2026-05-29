<script setup>
import ReportSummaryCard from '@/modules/preschool/shared/components/report/ReportSummaryCard.vue'

const props = defineProps({
  summary: {
    type: Object,
    default: () => ({}),
  },
  retentionReview: {
    type: Object,
    default: () => ({}),
  },
})

const hasRetentionReview = Object.keys(props.retentionReview || {}).length > 0
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="space-y-1">
      <h3 class="text-sm font-semibold text-slate-900">Historical State Summary</h3>
      <p class="text-sm text-slate-500">Immutable reconstruction counts and retention review metadata.</p>
    </div>

    <div class="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <ReportSummaryCard title="Snapshots" :value="summary.snapshotCount ?? 0" caption="Frozen snapshot records" />
      <ReportSummaryCard title="Audits" :value="summary.auditCount ?? 0" caption="Lifecycle audit records" />
      <ReportSummaryCard title="Exports" :value="summary.exportCount ?? 0" caption="Institutional export records" />
      <ReportSummaryCard title="Assignments" :value="summary.assignmentCount ?? 0" caption="Historical assignment events" />
    </div>

    <div class="mt-4 grid gap-4 lg:grid-cols-2">
      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <h4 class="text-sm font-semibold text-slate-900">Report Periods</h4>
        <p class="mt-2">Count: <span class="font-semibold text-slate-900">{{ summary.reportPeriodCount ?? 0 }}</span></p>
        <p class="mt-1">Academic Years: <span class="font-semibold text-slate-900">{{ summary.academicYearCount ?? 0 }}</span></p>
        <p class="mt-1">Terms: <span class="font-semibold text-slate-900">{{ summary.termCount ?? 0 }}</span></p>
      </div>
      <div v-if="hasRetentionReview" class="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <h4 class="text-sm font-semibold text-slate-900">Retention Review</h4>
        <p class="mt-2">Archived academic years: <span class="font-semibold text-slate-900">{{ retentionReview.archivedAcademicYears ?? 0 }}</span></p>
        <p class="mt-1">Archived terms: <span class="font-semibold text-slate-900">{{ retentionReview.archivedTerms ?? 0 }}</span></p>
        <p class="mt-1">Archived report periods: <span class="font-semibold text-slate-900">{{ retentionReview.archivedReportPeriods ?? 0 }}</span></p>
        <p class="mt-1">Retention window: <span class="font-semibold text-slate-900">{{ retentionReview.retentionWindowDays ?? 0 }} days</span></p>
      </div>
    </div>
  </div>
</template>

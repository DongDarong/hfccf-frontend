<script setup>
import { computed } from 'vue'
import AnalyticsMetricCard from '../components/AnalyticsMetricCard.vue'
import AnalyticsChartCard from '../components/AnalyticsChartCard.vue'
import AnalyticsBreakdownList from '../components/AnalyticsBreakdownList.vue'
import AnalyticsEmptyState from '../components/AnalyticsEmptyState.vue'

const props = defineProps({
  analytics: {
    type: Object,
    default: () => ({}),
  },
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  emptyText: {
    type: String,
    default: '',
  },
})

function toSeries(value) {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.series)) return value.series
  if (Array.isArray(value?.items)) return value.items
  if (Array.isArray(value?.rows)) return value.rows
  return []
}

const summary = computed(() => props.analytics?.summary || {})
const breakdownItems = computed(() => toSeries(
  props.analytics?.breakdowns?.byWeek
  || props.analytics?.breakdowns?.byMonth
  || props.analytics?.datasets?.byWeek
  || [],
))
</script>

<template>
  <section class="space-y-4">
    <div>
      <h2 class="text-lg font-semibold text-slate-900">{{ title }}</h2>
      <p class="text-sm text-slate-500">{{ subtitle }}</p>
    </div>

    <AnalyticsEmptyState v-if="!Object.keys(summary).length" :title="emptyText" />

    <template v-else>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AnalyticsMetricCard title="Assigned Classes" :value="summary.assignedClasses ?? summary.classes ?? '—'" tone="violet" />
        <AnalyticsMetricCard title="Students" :value="summary.students ?? summary.activeStudents ?? '—'" tone="emerald" />
        <AnalyticsMetricCard title="Attendance Sessions" :value="summary.attendanceSessions ?? summary.sessions ?? '—'" tone="blue" />
        <AnalyticsMetricCard title="Attendance Rate" :value="summary.attendanceRate ?? summary.attendance_rate ?? '—'" tone="amber" />
      </div>

      <div class="grid gap-4 xl:grid-cols-2">
        <AnalyticsChartCard
          title="Teacher Utilization"
          subtitle="Weekly or monthly workload snapshots."
          chart-type="bar"
          :series="toSeries(analytics?.charts?.teachers || analytics?.trends?.teachers || [])"
          empty-text="No teacher utilization data available."
        />
        <AnalyticsBreakdownList
          title="Teacher Breakdown"
          subtitle="Weekly or monthly teacher analytics from the backend."
          :items="breakdownItems"
          empty-text="No teacher breakdown data available."
        />
      </div>
    </template>
  </section>
</template>

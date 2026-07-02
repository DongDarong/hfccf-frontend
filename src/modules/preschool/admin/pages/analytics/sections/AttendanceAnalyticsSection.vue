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
const chartSeries = computed(() => toSeries(
  props.analytics?.charts?.attendance
  || props.analytics?.trends?.attendance
  || props.analytics?.datasets?.attendance
  || [],
))
const breakdownItems = computed(() => toSeries(
  props.analytics?.breakdowns?.byClass
  || props.analytics?.breakdowns?.classBreakdown
  || props.analytics?.datasets?.byClass
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
        <AnalyticsMetricCard title="Attendance Rate" :value="summary.attendanceRate ?? summary.attendance_rate ?? '—'" tone="emerald" />
        <AnalyticsMetricCard title="Present" :value="summary.present ?? '—'" tone="blue" />
        <AnalyticsMetricCard title="Absent" :value="summary.absent ?? '—'" tone="rose" />
        <AnalyticsMetricCard title="Late / Excused" :value="`${summary.late ?? 0} / ${summary.excused ?? 0}`" tone="amber" />
      </div>

      <div class="grid gap-4 xl:grid-cols-2">
        <AnalyticsChartCard
          title="Attendance Trend"
          subtitle="Trend-ready data supplied by the backend."
          chart-type="line"
          :series="chartSeries"
          empty-text="No attendance trend data available."
        />
        <AnalyticsBreakdownList
          title="Attendance Status Breakdown"
          subtitle="By class or backend-provided attendance grouping."
          :items="breakdownItems"
          empty-text="No attendance breakdown data available."
        />
      </div>
    </template>
  </section>
</template>

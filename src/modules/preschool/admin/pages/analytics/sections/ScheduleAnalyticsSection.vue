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
  props.analytics?.charts?.schedules
  || props.analytics?.trends?.schedules
  || props.analytics?.datasets?.schedules
  || [],
))
const breakdownItems = computed(() => toSeries(
  props.analytics?.breakdowns?.byClass
  || props.analytics?.breakdowns?.utilization
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
        <AnalyticsMetricCard title="Active Schedules" :value="summary.activeSchedules ?? summary.active_schedules ?? '—'" tone="emerald" />
        <AnalyticsMetricCard title="Inactive Schedules" :value="summary.inactiveSchedules ?? summary.inactive_schedules ?? '—'" tone="slate" />
        <AnalyticsMetricCard title="Weekly Sessions" :value="summary.weeklySessions ?? summary.weekly_sessions ?? '—'" tone="blue" />
        <AnalyticsMetricCard title="Generated Sessions" :value="summary.generatedSessions ?? summary.generated_sessions ?? '—'" tone="violet" />
      </div>

      <div class="grid gap-4 xl:grid-cols-2">
        <AnalyticsChartCard
          title="Schedule Utilization"
          subtitle="Room, teacher, and schedule utilization snapshots."
          chart-type="heatmap"
          :series="chartSeries"
          empty-text="No schedule utilization data available."
        />
        <AnalyticsBreakdownList
          title="Schedule Breakdown"
          subtitle="Backend-provided class or utilization breakdowns."
          :items="breakdownItems"
          empty-text="No schedule breakdown data available."
        />
      </div>
    </template>
  </section>
</template>

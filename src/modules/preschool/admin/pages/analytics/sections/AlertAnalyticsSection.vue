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
const severityBreakdown = computed(() => toSeries(
  props.analytics?.breakdowns?.severity
  || props.analytics?.breakdowns?.bySeverity
  || props.analytics?.datasets?.severity
  || [],
))
const alertTrend = computed(() => toSeries(
  props.analytics?.charts?.alerts
  || props.analytics?.trends?.alerts
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
        <AnalyticsMetricCard title="Total Alerts" :value="summary.totalAlerts ?? summary.total ?? '—'" tone="rose" />
        <AnalyticsMetricCard title="Open Alerts" :value="summary.openAlerts ?? summary.open ?? '—'" tone="amber" />
        <AnalyticsMetricCard title="Completed" :value="summary.completedAlerts ?? summary.completed ?? '—'" tone="emerald" />
        <AnalyticsMetricCard title="Overdue Alerts" :value="summary.overdueAlerts ?? summary.overdue ?? '—'" tone="violet" />
      </div>

      <div class="grid gap-4 xl:grid-cols-2">
        <AnalyticsChartCard
          title="Alert Trend"
          subtitle="Daily, weekly, or monthly alert movement."
          chart-type="line"
          :series="alertTrend"
          empty-text="No alert trend data available."
        />
        <AnalyticsBreakdownList
          title="Severity Breakdown"
          subtitle="Severity-level distribution supplied by the backend."
          :items="severityBreakdown"
          empty-text="No alert breakdown data available."
        />
      </div>
    </template>
  </section>
</template>

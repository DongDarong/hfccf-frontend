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
  props.analytics?.breakdowns?.byMethod
  || props.analytics?.breakdowns?.contactMethod
  || props.analytics?.datasets?.byMethod
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
        <AnalyticsMetricCard title="Contact Logs" :value="summary.contactLogs ?? summary.total ?? '—'" tone="blue" />
        <AnalyticsMetricCard title="Follow-ups" :value="summary.followUps ?? summary.follow_ups ?? '—'" tone="amber" />
        <AnalyticsMetricCard title="Completed" :value="summary.completed ?? '—'" tone="emerald" />
        <AnalyticsMetricCard title="Outstanding" :value="summary.outstandingFollowUps ?? summary.outstanding ?? '—'" tone="rose" />
      </div>

      <div class="grid gap-4 xl:grid-cols-2">
        <AnalyticsChartCard
          title="Guardian Contact Trend"
          subtitle="Daily, weekly, or monthly contact volume."
          chart-type="bar"
          :series="toSeries(analytics?.charts?.guardianContacts || analytics?.trends?.guardianContacts || [])"
          empty-text="No guardian contact trend data available."
        />
        <AnalyticsBreakdownList
          title="Contact Method Breakdown"
          subtitle="Contact method, reason, staff member, or class."
          :items="breakdownItems"
          empty-text="No guardian contact breakdown data available."
        />
      </div>
    </template>
  </section>
</template>

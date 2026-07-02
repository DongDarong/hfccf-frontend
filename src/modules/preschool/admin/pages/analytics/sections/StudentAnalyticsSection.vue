<script setup>
import { computed } from 'vue'
import AnalyticsMetricCard from '../components/AnalyticsMetricCard.vue'
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
        <AnalyticsMetricCard title="Active Students" :value="summary.activeStudents ?? summary.students ?? '—'" tone="emerald" />
        <AnalyticsMetricCard title="Attendance %" :value="summary.attendanceRate ?? summary.attendance_rate ?? '—'" tone="blue" />
        <AnalyticsMetricCard title="Alert Count" :value="summary.alertCount ?? summary.alerts ?? '—'" tone="rose" />
        <AnalyticsMetricCard title="Guardian Contacts" :value="summary.guardianContacts ?? summary.guardian_contacts ?? '—'" tone="amber" />
      </div>

      <AnalyticsBreakdownList
        title="Student Breakdown"
        subtitle="Class or academic-year level student analytics."
        :items="breakdownItems"
        empty-text="No student breakdown data available."
      />
    </template>
  </section>
</template>

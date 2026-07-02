<script setup>
import AnalyticsMetricCard from '../components/AnalyticsMetricCard.vue'
import AnalyticsEmptyState from '../components/AnalyticsEmptyState.vue'

defineProps({
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

function pickMetric(source, keys, fallback = '') {
  for (const key of keys) {
    const value = source?.[key]
    if (value !== undefined && value !== null && `${value}`.trim() !== '') {
      return value
    }
  }

  return fallback
}
</script>

<template>
  <section class="space-y-4">
    <div>
      <h2 class="text-lg font-semibold text-slate-900">{{ title }}</h2>
      <p class="text-sm text-slate-500">{{ subtitle }}</p>
    </div>

    <AnalyticsEmptyState
      v-if="!Object.keys(analytics.summary || {}).length"
      :title="emptyText"
    />

    <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AnalyticsMetricCard
        :title="pickMetric(analytics.summary, ['attendanceRateLabel', 'attendanceRateTitle'], 'Attendance Rate')"
        :value="pickMetric(analytics.summary, ['attendanceRate', 'attendance_rate'], '—')"
        :caption="pickMetric(analytics.summary, ['attendanceRateCaption'], '')"
        tone="emerald"
      />
      <AnalyticsMetricCard
        :title="pickMetric(analytics.summary, ['sessionsGeneratedLabel', 'sessionsGeneratedTitle'], 'Sessions Generated')"
        :value="pickMetric(analytics.summary, ['sessionsGenerated', 'sessions_generated'], '—')"
        :caption="pickMetric(analytics.summary, ['sessionsGeneratedCaption'], '')"
        tone="blue"
      />
      <AnalyticsMetricCard
        :title="pickMetric(analytics.summary, ['openAlertsLabel', 'openAlertsTitle'], 'Open Alerts')"
        :value="pickMetric(analytics.summary, ['openAlerts', 'open_alerts'], '—')"
        :caption="pickMetric(analytics.summary, ['openAlertsCaption'], '')"
        tone="rose"
      />
      <AnalyticsMetricCard
        :title="pickMetric(analytics.summary, ['guardianContactsLabel', 'guardianContactsTitle'], 'Guardian Contacts')"
        :value="pickMetric(analytics.summary, ['guardianContacts', 'guardian_contacts'], '—')"
        :caption="pickMetric(analytics.summary, ['guardianContactsCaption'], '')"
        tone="amber"
      />
    </div>
  </section>
</template>

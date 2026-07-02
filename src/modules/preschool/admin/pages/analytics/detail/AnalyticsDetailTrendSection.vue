<script setup>
import AnalyticsDetailChartCard from './components/AnalyticsDetailChartCard.vue'
import AnalyticsDetailEmptyState from './components/AnalyticsDetailEmptyState.vue'

defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  chartType: {
    type: String,
    default: 'line',
  },
  series: {
    type: Array,
    default: () => [],
  },
  emptyText: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section class="space-y-4">
    <div>
      <h2 class="text-lg font-semibold text-slate-900">{{ title }}</h2>
      <p class="text-sm text-slate-500">{{ subtitle }}</p>
    </div>

    <AnalyticsDetailEmptyState v-if="!series.length" :title="emptyText" />
    <AnalyticsDetailChartCard
      v-else
      :title="title"
      :subtitle="subtitle"
      :chart-type="chartType"
      :series="series"
      :empty-text="emptyText"
    />
  </section>
</template>

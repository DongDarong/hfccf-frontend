<script setup>
import AnalyticsMetricCard from '../../components/AnalyticsMetricCard.vue'

defineProps({
  title: {
    type: String,
    default: '',
  },
  value: {
    type: [String, Number],
    default: '',
  },
  caption: {
    type: String,
    default: '',
  },
  tone: {
    type: String,
    default: 'slate',
  },
  to: {
    type: [Object, String],
    default: null,
  },
})
</script>

<template>
  <AnalyticsMetricCard
    :title="title"
    :value="value"
    :caption="caption"
    :tone="tone"
    :to="to"
  />
</template>

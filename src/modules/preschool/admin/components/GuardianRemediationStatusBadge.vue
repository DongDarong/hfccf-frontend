<template>
  <Tag :value="label" :severity="severity" />
</template>

<script setup>
import Tag from 'primevue/tag'

const props = defineProps({
  severity: {
    type: String,
    default: 'info',
    validator: (v) => ['critical', 'warning', 'info', 'resolved'].includes(v),
  },
  label: {
    type: String,
    required: true,
  },
})

// Map domain severity to PrimeVue Tag severity
const SEVERITY_MAP = {
  critical: 'danger',
  warning: 'warn',
  info: 'info',
  resolved: 'success',
}

const severity = computed(() => SEVERITY_MAP[props.severity] ?? 'info')
</script>

<script>
import { computed } from 'vue'
</script>

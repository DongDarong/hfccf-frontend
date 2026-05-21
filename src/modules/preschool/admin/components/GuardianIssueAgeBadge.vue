<template>
  <Tag
    :value="`${daysSinceDetection} ${t('preschoolGuardianGovernance.labels.days')}`"
    :severity="ageSeverity"
  />
</template>

<script setup>
import Tag from 'primevue/tag'
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

const props = defineProps({
  daysSinceDetection: { type: Number, required: true },
  staleThresholdDays: { type: Number, default: 14 },
})

const { t } = useLanguage()

const ageSeverity = computed(() => {
  const ratio = props.daysSinceDetection / props.staleThresholdDays
  if (ratio >= 1) return 'danger'
  if (ratio >= 0.7) return 'warn'
  return 'secondary'
})
</script>

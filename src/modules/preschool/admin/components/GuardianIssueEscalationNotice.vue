<template>
  <Message v-if="isStale" severity="warn">
    <span v-if="severity === 'critical'">
      {{ t('preschoolGuardianGovernance.escalation.critical', { days: daysSinceDetection }) }}
    </span>
    <span v-else>
      {{ t('preschoolGuardianGovernance.escalation.warning', { days: staleThresholdDays }) }}
    </span>
  </Message>
</template>

<script setup>
import Message from 'primevue/message'
import { useLanguage } from '@/composables/useLanguage'

defineProps({
  isStale: { type: Boolean, default: false },
  severity: { type: String, default: 'info' },
  daysSinceDetection: { type: Number, default: 0 },
  staleThresholdDays: { type: Number, default: 14 },
})

const { t } = useLanguage()
</script>

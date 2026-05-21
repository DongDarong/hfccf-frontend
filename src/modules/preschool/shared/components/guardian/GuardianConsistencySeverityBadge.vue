<script setup>
// Keep severity labels centralized so warning and critical states stay
// localized consistently across the integrity summary and issue list.
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'GuardianConsistencySeverityBadge',
})

const { t } = useLanguage()

const props = defineProps({
  severity: {
    type: String,
    default: 'info',
  },
})

const badgeClasses = computed(() => {
  switch (String(props.severity || 'info')) {
    case 'critical':
      return 'border-rose-200 bg-rose-50 text-rose-700'
    case 'warning':
      return 'border-amber-200 bg-amber-50 text-amber-700'
    default:
      return 'border-sky-200 bg-sky-50 text-sky-700'
  }
})

const label = computed(() => {
  const key = `preschoolGuardianShared.integritySeverityLabels.${String(props.severity || 'info')}`
  return t(key)
})
</script>

<template>
  <span class="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold" :class="badgeClasses">
    {{ label }}
  </span>
</template>

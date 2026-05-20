<script setup>
// Keep guardian status labels localized and centralized so archived contacts
// cannot drift into hardcoded English badges later.
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'GuardianStatusBadge',
})

const { t } = useLanguage()

const props = defineProps({
  status: {
    type: String,
    default: 'active',
  },
})

const badgeClasses = computed(() => {
  const status = String(props.status || '').toLowerCase()
  if (status === 'archived') return 'bg-slate-100 text-slate-700 border-slate-200'
  if (status === 'inactive') return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-emerald-50 text-emerald-700 border-emerald-200'
})

const statusLabel = computed(() => {
  const key = `preschoolGuardianShared.statusLabels.${String(props.status || 'active').toLowerCase()}`
  return t(key)
})
</script>

<template>
  <span class="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold" :class="badgeClasses">
    {{ statusLabel }}
  </span>
</template>

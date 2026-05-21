<script setup>
// Keep guardian portal status labels localized so portal account state does
// not fall back to raw enums or stale English strings later.
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'GuardianPortalStatusBadge',
})

const { t } = useLanguage()

const props = defineProps({
  status: {
    type: String,
    default: '',
  },
})

const badgeClass = computed(() => {
  const status = String(props.status || '').toLowerCase()

  if (status === 'active') return 'bg-emerald-100 text-emerald-800'
  if (status === 'invited') return 'bg-sky-100 text-sky-800'
  if (status === 'revoked') return 'bg-rose-100 text-rose-800'
  if (status === 'suspended') return 'bg-amber-100 text-amber-800'

  return 'bg-slate-100 text-slate-700'
})

const statusLabel = computed(() => {
  const status = String(props.status || '').toLowerCase()
  const key = `guardianPortal.common.statusLabels.${status}`

  return status ? t(key) : t('guardianPortal.common.emptyValue')
})
</script>

<template>
  <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide" :class="badgeClass">
    {{ statusLabel }}
  </span>
</template>

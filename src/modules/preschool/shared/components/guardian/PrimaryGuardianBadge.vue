<script setup>
// Primary guardian markers stay explicit so active pickup ordering is visible
// in both admin and teacher views.
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'PrimaryGuardianBadge',
})

const { t } = useLanguage()

const props = defineProps({
  isPrimary: {
    type: Boolean,
    default: false,
  },
})

const label = computed(() => (props.isPrimary ? t('preschoolGuardianShared.primaryGuardian.primary') : t('preschoolGuardianShared.primaryGuardian.secondary')))
const classes = computed(() => (props.isPrimary ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-600 border-slate-200'))
</script>

<template>
  <span class="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold" :class="classes">
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

const props = defineProps({
  level: { type: String, default: null }, // 'low' | 'medium' | 'high' | 'critical'
  size:  { type: String, default: 'md' }, // 'sm' | 'md'
})

const clsMap = {
  low:      'bg-green-50 text-green-700 ring-green-200',
  medium:   'bg-amber-50 text-amber-700 ring-amber-200',
  high:     'bg-orange-50 text-orange-700 ring-orange-200',
  critical: 'bg-red-50 text-red-700 ring-red-200',
}

const label = computed(() =>
  props.level ? t('dsamShared.riskLevels.' + props.level) : null
)
</script>

<template>
  <span
    v-if="level && clsMap[level]"
    :class="[
      'inline-flex items-center rounded-full font-semibold ring-1 ring-inset',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
      clsMap[level],
    ]"
  >
    {{ label }}
  </span>
  <span v-else class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-sm font-medium text-slate-500">
    —
  </span>
</template>

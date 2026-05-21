<script setup>
// Keep summary cards reusable so the integrity report can stay compact and
// future staff-only overview screens can reuse the same visual contract.
import { computed } from 'vue'

defineOptions({
  name: 'GuardianConsistencySummaryCard',
})

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  value: {
    type: [Number, String],
    default: 0,
  },
  caption: {
    type: String,
    default: '',
  },
  tone: {
    type: String,
    default: 'info',
  },
})

const toneClass = computed(() => {
  switch (String(props.tone || 'info')) {
    case 'critical':
      return 'border-rose-200 bg-rose-50 text-rose-800'
    case 'warning':
      return 'border-amber-200 bg-amber-50 text-amber-800'
    case 'success':
      return 'border-emerald-200 bg-emerald-50 text-emerald-800'
    default:
      return 'border-slate-200 bg-white text-slate-900'
  }
})
</script>

<template>
  <article class="rounded-2xl border p-4 shadow-sm" :class="toneClass">
    <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ title }}</p>
    <div class="mt-2 text-3xl font-semibold text-inherit">{{ value }}</div>
    <p v-if="caption" class="mt-2 text-sm text-slate-500">{{ caption }}</p>
  </article>
</template>

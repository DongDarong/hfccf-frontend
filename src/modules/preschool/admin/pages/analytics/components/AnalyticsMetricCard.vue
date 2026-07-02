<script setup>
const props = defineProps({
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
})

const toneClasses = {
  slate: 'border-slate-200 bg-white text-slate-900',
  blue: 'border-blue-100 bg-blue-50 text-blue-900',
  emerald: 'border-emerald-100 bg-emerald-50 text-emerald-900',
  amber: 'border-amber-100 bg-amber-50 text-amber-900',
  rose: 'border-rose-100 bg-rose-50 text-rose-900',
  violet: 'border-violet-100 bg-violet-50 text-violet-900',
}

const className = toneClasses[props.tone] || toneClasses.slate
</script>

<template>
  <article :class="['rounded-2xl border p-4 shadow-sm', className]">
    <p class="text-xs font-semibold uppercase tracking-wide opacity-75">{{ title }}</p>
    <div class="mt-2 text-3xl font-semibold">{{ value }}</div>
    <p v-if="caption" class="mt-2 text-sm opacity-80">{{ caption }}</p>
  </article>
</template>

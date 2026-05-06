<script setup>
/**
 * ResultListHeader
 * Lightweight header: title on the left, export label on the right.
 */
defineOptions({
  name: 'ResultListHeader',
})

defineProps({
  title: {
    type: String,
    required: true,
  },
  exportLabel: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <header class="flex flex-wrap items-start justify-between gap-3">
    <h2 class="text-[1.15rem] font-black leading-tight text-[#1D1D1B]">
      {{ title }}
    </h2>
    <span class="text-[0.72rem] font-extrabold tracking-[0.12em] uppercase text-slate-500">
      {{ exportLabel }}
    </span>
  </header>
</template>

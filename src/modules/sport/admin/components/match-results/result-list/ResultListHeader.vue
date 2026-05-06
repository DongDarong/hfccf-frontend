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
  <header class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
    <div class="flex min-w-0 items-center gap-3">
      <span class="h-9 w-1.5 rounded-full bg-[#00AEEF]" aria-hidden="true" />
      <h2 class="truncate text-[1.15rem] font-black leading-tight text-[#1D1D1B]">
        {{ title }}
      </h2>
    </div>

    <span class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[0.72rem] font-extrabold tracking-[0.12em] uppercase text-slate-500">
      {{ exportLabel }}
    </span>
  </header>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: 'This module page is ready for implementation.',
  },
})
</script>

<template>
  <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Module Page</p>
    <h1 class="mt-3 text-2xl font-bold text-slate-900">{{ title }}</h1>
    <p class="mt-2 max-w-2xl text-sm text-slate-600">{{ description }}</p>
  </section>
</template>



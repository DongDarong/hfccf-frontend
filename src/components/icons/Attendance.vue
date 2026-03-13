<script setup>
defineOptions({
  name: 'AttendanceIcon',
})

defineProps({
  size: {
    type: Number,
    default: 20,
  },
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    aria-hidden="true"
  >
    <rect x="4" y="3" width="16" height="18" rx="2.5" stroke-width="2" />
    <path d="M8 7h8" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" />
    <path d="M8 11h8" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" />
    <path d="M8 15h4" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" />
    <path d="M9 19l2 2 4-4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
  </svg>
</template>

<script setup>
defineOptions({
  name: 'PerformanceIcon',
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
    <path
      d="M4 18h16"
      stroke-width="2"
      stroke-linecap="round"
    />
    <polyline
      points="5 14 9 10 12 13 16 7 19 11"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <circle cx="5" cy="14" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="9" cy="10" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="12" cy="13" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="16" cy="7" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="19" cy="11" r="1.3" fill="currentColor" stroke="none" />
  </svg>
</template>

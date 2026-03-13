<script setup>
defineOptions({
  name: 'ClassIcon',
})

defineProps({
  size: {
    type: Number,
    default: 18,
  },
})
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" ry="2" stroke-width="2" />
    <path d="M3 10h18" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
    <path d="M8 5v-1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
    <path d="M7 15h10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
    <path d="M7 18h10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
    <path d="M7 12h.01" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
    <path d="M10 12h.01" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
    <path d="M13 12h.01" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
  </svg>
</template>

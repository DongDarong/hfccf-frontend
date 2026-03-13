<script setup>
defineOptions({
  name: 'PlayersIcon',
})

defineProps({
  size: {
    type: Number,
    default: 20,
  },
})
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
    <circle cx="8" cy="8" r="2.5" stroke-width="2" />
    <circle cx="16" cy="8" r="2.5" stroke-width="2" />
    <path d="M4 14c0-2.5 2-4.5 4.5-4.5h0M15.5 9.5h0" stroke="none" />
    <path d="M5 19c0-2.2 2.4-4 5.5-4s5.5 1.8 5.5 4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12 18v3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M3 21h18" stroke-width="2" stroke-linecap="round" />
    <path d="M11 12h2" stroke-width="1.5" stroke-linecap="round" />
  </svg>
</template>

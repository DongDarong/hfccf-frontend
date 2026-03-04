<script setup>
defineOptions({
  name: 'InfoIcon',
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
    <circle cx="12" cy="12" r="9" stroke-width="2" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6" />
    <circle cx="12" cy="7" r="1" fill="currentColor" stroke="none" />
  </svg>
</template>

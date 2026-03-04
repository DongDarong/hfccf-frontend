<script setup>
defineOptions({
  name: 'HomeIcon',
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
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10.5L12 3l9 7.5" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.25 9.75V21h13.5V9.75" />
  </svg>
</template>

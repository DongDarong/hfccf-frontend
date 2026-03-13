<script setup>
defineOptions({
  name: 'MatchesIcon',
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
    <path d="M5 5h14v4H5z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M7 9v10h10V9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M9 15h6" stroke-width="1.5" stroke-linecap="round" />
    <path d="M9 12h6" stroke-width="1.5" stroke-linecap="round" />
    <path d="M5 5l2 2" stroke-width="2" stroke-linecap="round" />
    <path d="M19 5l-2 2" stroke-width="2" stroke-linecap="round" />
  </svg>
</template>

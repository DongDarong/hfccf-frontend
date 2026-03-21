<script setup>
defineOptions({
  name: 'TournamentsIcon',
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
    <path d="M6 4h12v4H6z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M8 20v-5h8v5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M4 8l8 4 8-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12 13v7" stroke-width="2" stroke-linecap="round" />
    <path d="M11 16h2" stroke-width="2" stroke-linecap="round" />
    <path d="M10 18h4" stroke-width="2" stroke-linecap="round" />
  </svg>
</template>



<script setup>
defineOptions({
  name: 'UsersIcon',
})

defineProps({
  // Kept numeric because this icon is used with fixed pixel-based controls.
  size: {
    type: Number,
    default: 18,
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
      d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    />
    <circle cx="10" cy="7" r="4" stroke-width="2" />
    <path
      d="M21 21v-2a4 4 0 0 0-3-3.87"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    />
    <path d="M17 7a4 4 0 0 1 0 8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
  </svg>
</template>



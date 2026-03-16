<script setup>
defineOptions({
  name: 'BallIcon',
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
    <circle cx="12" cy="12" r="10" stroke-width="2" />
    <path
      d="M4.9 7.6c1.6 1.6 3.9 2 6 1.4s4-2.2 5-4.4"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.7"
    />
    <path
      d="M5 16.5c1.6-1.6 3.9-2 5.9-1.4s4 2.2 5 4.4"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.7"
    />
    <path d="M12 2v20" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" />
  </svg>
</template>



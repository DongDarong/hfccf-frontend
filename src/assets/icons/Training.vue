<script setup>
defineOptions({
  name: 'TrainingIcon',
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
      d="M12 4c-4.418 0-8 1.79-8 4v6c0 2.21 3.582 4 8 4s8-1.79 8-4V8c0-2.21-3.582-4-8-4z"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path d="M8 15h8" stroke-width="1.7" stroke-linecap="round" />
    <path d="M8 11h8" stroke-width="1.7" stroke-linecap="round" />
    <path d="M12 11v4" stroke-width="1.7" stroke-linecap="round" />
    <path d="M7 6h10" stroke-width="1.7" stroke-linecap="round" />
    <path d="M4 6h0" stroke-width="2" stroke-linecap="round" />
    <path d="M20 6h0" stroke-width="2" stroke-linecap="round" />
  </svg>
</template>



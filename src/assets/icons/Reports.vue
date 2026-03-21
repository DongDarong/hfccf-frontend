<script setup>
defineOptions({
  name: 'ReportsIcon',
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
      d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path d="M6 8h12" stroke-width="1.7" stroke-linecap="round" />
    <rect x="8" y="11" width="3" height="6" rx="1" stroke-width="1.7" />
    <rect x="13" y="13" width="3" height="4" rx="1" stroke-width="1.7" />
    <path d="M10 15h4" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>



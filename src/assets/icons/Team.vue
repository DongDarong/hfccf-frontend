<script setup>
defineOptions({
  name: 'TeamIcon',
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
    <circle cx="12" cy="8" r="3" stroke-width="2" />
    <path
      d="M5 20c0-3 3-5 7-5s7 2 7 5"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M4 9c-1 2-1 4 0 5s1.5 2 2.5 2.5"
      stroke-width="1.7"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M20 9c1 2 1 4 0 5s-1.5 2-2.5 2.5"
      stroke-width="1.7"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8 5l0.5-1a1 1 0 0 1 .9-0.5h5a1 1 0 0 1 .9 0.5l0.5 1"
      stroke-width="1.7"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>



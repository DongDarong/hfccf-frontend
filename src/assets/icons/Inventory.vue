<script setup>
defineOptions({
  name: 'InventoryIcon',
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
    <rect x="3" y="5" width="18" height="4" rx="1.5" stroke-width="2" />
    <rect x="3" y="11" width="18" height="4" rx="1.5" stroke-width="2" />
    <rect x="3" y="17" width="18" height="4" rx="1.5" stroke-width="2" />
    <path d="M6 7h0" stroke-width="2" stroke-linecap="round" />
    <path d="M6 13h0" stroke-width="2" stroke-linecap="round" />
    <path d="M6 19h0" stroke-width="2" stroke-linecap="round" />
    <path d="M18 7h0" stroke-width="2" stroke-linecap="round" />
    <path d="M18 13h0" stroke-width="2" stroke-linecap="round" />
    <path d="M18 19h0" stroke-width="2" stroke-linecap="round" />
  </svg>
</template>



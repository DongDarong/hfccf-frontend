<script setup>
defineOptions({
  name: 'NotificationIcon',
})

defineProps({
  // Accept number or CSS string values (e.g. 20, "1.25rem") for flexible sizing.
  size: {
    type: [Number, String],
    default: 20,
  },
  strokeWidth: {
    type: [Number, String],
    default: 2,
  },
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M15 17H20L18.6 15.6C18.2 15.2 18 14.7 18 14.2V11C18 7.7 15.8 4.9 13 4.2V3.5C13 2.7 12.3 2 11.5 2C10.7 2 10 2.7 10 3.5V4.2C7.2 4.9 5 7.7 5 11V14.2C5 14.7 4.8 15.2 4.4 15.6L3 17H8M9 17C9 18.4 10.1 19.5 11.5 19.5C12.9 19.5 14 18.4 14 17"
      stroke="currentColor"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>



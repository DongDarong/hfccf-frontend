<script setup>
defineOptions({
  name: 'ShowPasswordIcon',
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
  visible: {
    type: Boolean,
    default: false,
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
    <!-- Toggle icon path set based on whether the password is currently visible. -->
    <template v-if="visible">
      <path
        d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"
        stroke="currentColor"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle cx="12" cy="12" r="2.8" stroke="currentColor" :stroke-width="strokeWidth" />
    </template>

    <template v-else>
      <path
        d="M3 3l18 18"
        stroke="currentColor"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.58 10.58a2 2 0 002.84 2.84"
        stroke="currentColor"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.88 5.09A10.6 10.6 0 0112 5c6.5 0 10 7 10 7a17.3 17.3 0 01-4.42 5.09"
        stroke="currentColor"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6.61 6.61A17.5 17.5 0 002 12s3.5 7 10 7c1.4 0 2.67-.27 3.82-.73"
        stroke="currentColor"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>
  </svg>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sky-900">
    <div class="flex items-start gap-3">
      <i class="pi pi-lock mt-0.5 text-sky-700" aria-hidden="true"></i>
      <p class="text-sm font-semibold leading-6">
        <slot>{{ label }}</slot>
      </p>
    </div>
  </div>
</template>

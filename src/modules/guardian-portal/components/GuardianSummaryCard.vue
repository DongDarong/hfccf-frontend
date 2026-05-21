<script setup>
import Card from 'primevue/card'

defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <Card class="border-slate-200 shadow-sm">
    <template #content>
      <div class="grid gap-2">
        <p class="text-sm font-bold uppercase tracking-wide text-sky-700">{{ title }}</p>
        <p class="text-sm text-slate-500">{{ subtitle }}</p>
        <slot />
      </div>
    </template>
  </Card>
</template>

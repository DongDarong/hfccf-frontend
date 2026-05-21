<template>
  <div v-if="recurrenceCount > 0" class="flex items-center gap-1 text-orange-600 text-sm font-medium">
    <span>&#x21bb;</span>
    <span>{{ t('preschoolGuardianGovernance.badges.recurring') }} &times;{{ recurrenceCount }}</span>
  </div>
</template>

<script setup>
import { useLanguage } from '@/composables/useLanguage'

defineProps({
  recurrenceCount: { type: Number, required: true },
})

const { t } = useLanguage()
</script>

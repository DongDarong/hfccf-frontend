<template>
  <Message severity="warn" :closable="false" class="mb-4">
    <div class="font-semibold mb-1">{{ t('preschoolGuardianRemediation.warning.title') }}</div>
    <p class="text-sm">{{ t('preschoolGuardianRemediation.warning.body') }}</p>
  </Message>
</template>

<script setup>
import Message from 'primevue/message'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()
</script>

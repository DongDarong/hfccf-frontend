<template>
  <div class="flex flex-col gap-1">
    <label class="text-sm font-medium text-surface-700 dark:text-surface-200">
      {{ t('preschoolGuardianRemediation.labels.notes') }}
    </label>
    <Textarea
      :model-value="modelValue"
      :placeholder="t('preschoolGuardianRemediation.placeholders.notes')"
      :rows="3"
      auto-resize
      class="w-full"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup>
import Textarea from 'primevue/textarea'
import { useLanguage } from '@/composables/useLanguage'

defineProps({
  modelValue: { type: String, default: '' },
})

defineEmits(['update:modelValue'])

const { t } = useLanguage()
</script>

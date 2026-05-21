<template>
  <div class="space-y-3">
    <label class="block text-sm font-medium text-gray-700">
      {{ t('preschoolGuardianGovernance.labels.assignTo') }}
    </label>
    <InputText
      :modelValue="modelValue"
      :placeholder="t('preschoolGuardianGovernance.placeholders.assignToUserId')"
      class="w-full"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
    <Textarea
      :modelValue="notes"
      :placeholder="t('preschoolGuardianGovernance.placeholders.notes')"
      :rows="3"
      class="w-full"
      @update:modelValue="$emit('update:notes', $event)"
    />
  </div>
</template>

<script setup>
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import { useLanguage } from '@/composables/useLanguage'

defineProps({
  modelValue: { type: String, default: '' },
  notes: { type: String, default: '' },
})

defineEmits(['update:modelValue', 'update:notes'])

const { t } = useLanguage()
</script>

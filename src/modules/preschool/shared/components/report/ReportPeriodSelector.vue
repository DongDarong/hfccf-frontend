<script setup>
// Keep period selection isolated so report pages can switch periods without
// repeating dropdown wiring or losing the backend period contract.
import Button from '@/components/buttons/Button.vue'
import Dropdown from 'primevue/dropdown'
import { useLanguage } from '@/composables/useLanguage'

defineProps({
  label: {
    type: String,
    default: '',
  },
  modelValue: {
    type: String,
    default: '',
  },
  periods: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'refresh'])

const { t } = useLanguage()

function onUpdate(value) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <label class="space-y-2 text-sm font-medium text-slate-700">
      <span>{{ label }}</span>
      <Dropdown
        :model-value="modelValue"
        :options="periods"
        option-label="label"
        option-value="label"
        class="w-full"
        :placeholder="placeholder"
        :disabled="disabled || !periods.length"
        @update:model-value="onUpdate"
      />
    </label>

    <div class="mt-3 flex flex-wrap items-center gap-2">
      <Button type="button" variant="primary" size="md" rounded="xl" :loading="loading" @click="$emit('refresh')">
        {{ t('preschoolReportsShared.actions.refresh') }}
      </Button>
      <p class="text-xs text-slate-500">
        {{ t('preschoolReportsShared.periodHint') }}
      </p>
    </div>
  </div>
</template>

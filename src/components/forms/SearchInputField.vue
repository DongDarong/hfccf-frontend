<script setup>
import { computed } from 'vue'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import { useLanguage } from '@/composables/useLanguage'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
  inputId: {
    type: String,
    default: 'userSearchInput',
  },
  inputClass: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])
const { t } = useLanguage()

const resolvedPlaceholder = computed(
  () => props.placeholder || t('users.searchPlaceholder') || t('common.searchUsersPlaceholder'),
)

const inputClasses = computed(() =>
  [
    'ui-search-input w-full',
    props.inputClass,
  ]
    .join(' ')
    .trim(),
)
</script>

<template>
  <label class="block w-full" :for="inputId">
    <span class="sr-only">{{ resolvedPlaceholder }}</span>
    <IconField icon-position="left" class="w-full">
      <InputIcon class="pi pi-search" />
      <InputText
        :id="inputId"
        :model-value="modelValue"
        type="search"
        :placeholder="resolvedPlaceholder"
        :class="inputClasses"
        :disabled="disabled"
        autocomplete="off"
        spellcheck="false"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </IconField>
  </label>
</template>

<style scoped>
:deep(.ui-search-input.p-inputtext) {
  border-radius: 0.9rem;
  border-color: #cbd5e1;
  background: #fff;
  padding: 0.85rem 1rem 0.85rem 2.75rem;
  color: #0f172a;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
}

:deep(.ui-search-input.p-inputtext:enabled:hover) {
  border-color: #94a3b8;
}

:deep(.ui-search-input.p-inputtext:enabled:focus) {
  border-color: var(--color-base);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-base) 16%, white);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>

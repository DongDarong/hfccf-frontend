<script setup>
import { computed } from 'vue'
import { useLanguage } from '../../composables/useLanguage'

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
})

const emit = defineEmits(['update:modelValue'])
const { t } = useLanguage()

const resolvedPlaceholder = computed(
  () => props.placeholder || t('users.searchPlaceholder') || t('common.searchUsersPlaceholder'),
)

function onInput(event) {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <div class="relative w-full sm:w-64 md:w-72">
    <input
      :id="inputId"
      type="text"
      :placeholder="resolvedPlaceholder"
      class="w-full rounded-xl border-gray-300 border p-2.5 pl-10 text-gray-900 focus:border-hope-cyan focus:ring-hope-cyan sm:text-sm shadow-sm outline-none"
      :value="modelValue"
      :disabled="disabled"
      @input="onInput"
    >
    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </div>
</template>

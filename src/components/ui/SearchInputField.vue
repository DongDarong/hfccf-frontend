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
    'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-11 text-sm text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-[var(--color-base)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-base)_16%,white)] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500',
    props.inputClass,
  ]
    .join(' ')
    .trim(),
)

function onInput(event) {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <label class="relative block w-full" :for="inputId">
    <span class="sr-only">{{ resolvedPlaceholder }}</span>
    <input
      :id="inputId"
      type="search"
      :placeholder="resolvedPlaceholder"
      :class="inputClasses"
      :value="modelValue"
      :disabled="disabled"
      autocomplete="off"
      spellcheck="false"
      @input="onInput"
    />
    <svg
      class="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </label>
</template>

<style scoped>
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

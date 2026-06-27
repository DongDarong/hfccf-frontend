<script setup>
import { computed, useAttrs, useSlots } from 'vue'
import PrimeButton from 'primevue/button'

defineOptions({
  name: 'AppIconButton',
  inheritAttrs: false,
})

const props = defineProps({
  ariaLabel: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: 'secondary',
    validator: (value) =>
      ['primary', 'secondary', 'ghost', 'danger', 'success', 'warning'].includes(value),
  },
  size: {
    type: String,
    default: 'sm',
    validator: (value) => ['xs', 'sm', 'md'].includes(value),
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])
const attrs = useAttrs()
const slots = useSlots()

const sizeClass = computed(() => {
  const classes = {
    xs: '!h-7 !w-7 !min-h-7 !min-w-7',
    sm: '!h-[34px] !w-[34px] !min-h-[34px] !min-w-[34px]',
    md: '!h-10 !w-10 !min-h-10 !min-w-10',
  }

  return classes[props.size] || classes.sm
})

const variantClass = computed(() => {
  if (props.variant === 'primary') {
    return [
      '!border-brand-primary-600',
      '!bg-brand-primary-600',
      '!text-white',
      'hover:enabled:!border-brand-primary-700',
      'hover:enabled:!bg-brand-primary-700',
    ]
  }

  if (props.variant === 'danger') {
    return [
      '!border-rose-600',
      '!bg-rose-600',
      '!text-white',
      'hover:enabled:!border-rose-700',
      'hover:enabled:!bg-rose-700',
    ]
  }

  if (props.variant === 'success') {
    return [
      '!border-emerald-600',
      '!bg-emerald-600',
      '!text-white',
      'hover:enabled:!border-emerald-700',
      'hover:enabled:!bg-emerald-700',
    ]
  }

  if (props.variant === 'warning') {
    return [
      '!border-amber-500',
      '!bg-amber-500',
      '!text-white',
      'hover:enabled:!border-amber-600',
      'hover:enabled:!bg-amber-600',
    ]
  }

  if (props.variant === 'ghost') {
    return [
      '!border-transparent',
      '!bg-transparent',
      '!text-brand-surface-700',
      '!shadow-none',
      'hover:enabled:!bg-slate-100',
      'hover:enabled:!text-brand-surface-900',
    ]
  }

  return [
    '!border-brand-primary-200',
    '!bg-white',
    '!text-brand-surface-700',
    'hover:enabled:!border-brand-primary-300',
    'hover:enabled:!bg-brand-primary-50',
    'hover:enabled:!text-brand-surface-900',
  ]
})

const rootClass = computed(() => [
  'ui-icon-button',
  '!inline-flex',
  '!items-center',
  '!justify-center',
  '!rounded-[12px]',
  '!border',
  '!font-semibold',
  '!transition-all',
  '!duration-200',
  'focus-visible:!outline-none',
  'focus-visible:!shadow-[var(--ui-focus-ring)]',
  'disabled:!cursor-not-allowed',
  'disabled:!opacity-60',
  'disabled:!shadow-none',
  'active:enabled:scale-[0.98]',
  sizeClass.value,
  ...variantClass.value,
  props.active ? '!ring-2 !ring-brand-primary-200' : '',
])

const pt = computed(() => ({
  root: {
    class: rootClass.value,
  },
  loadingIcon: {
    class: 'ui-icon-button__spinner !text-current',
  },
}))

function handleClick(event) {
  if (props.disabled || props.loading) return
  emit('click', event)
}
</script>

<template>
  <PrimeButton
    v-bind="attrs"
    :type="type"
    :loading="loading"
    :disabled="disabled || loading"
    :pt="pt"
    :aria-label="ariaLabel"
    :aria-busy="loading ? 'true' : undefined"
    @click="handleClick"
  >
    <template v-if="slots.icon" #icon>
      <slot name="icon" />
    </template>
    <template v-else-if="slots.default" #icon>
      <slot />
    </template>
  </PrimeButton>
</template>

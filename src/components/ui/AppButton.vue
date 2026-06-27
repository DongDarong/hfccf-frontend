<script setup>
import { computed, useAttrs } from 'vue'
import PrimeButton from 'primevue/button'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'AppButton',
  inheritAttrs: false,
})

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) =>
      ['primary', 'secondary', 'outline', 'ghost', 'danger', 'success', 'warning', 'link'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value),
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
  block: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: String,
    default: 'lg',
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value),
  },
})

const emit = defineEmits(['click'])

const attrs = useAttrs()
const { t } = useLanguage()

const sizeClass = computed(() => {
  const classes = {
    xs: '!h-7 !min-h-7 !px-3 !text-xs !gap-1.5 !leading-[1.1]',
    sm: '!h-[34px] !min-h-[34px] !px-3.5 !text-sm !gap-1.5 !leading-[1.1]',
    md: '!h-10 !min-h-10 !px-4 !text-sm !gap-2 !leading-[1.1]',
    lg: '!h-[46px] !min-h-[46px] !px-5 !text-base !gap-2 !leading-[1.1]',
    xl: '!h-[46px] !min-h-[46px] !px-5 !text-base !gap-2 !leading-[1.1]',
  }

  return classes[props.size] || classes.md
})

const roundedClass = computed(() => {
  const classes = {
    sm: 'rounded-[10px]',
    md: 'rounded-[11px]',
    lg: 'rounded-[12px]',
    xl: 'rounded-[12px]',
    full: 'rounded-full',
  }

  return classes[props.rounded] || classes.lg
})

const variantClass = computed(() => {
  if (props.variant === 'secondary') {
    return [
      '!border-brand-primary-200',
      '!bg-white',
      '!text-brand-surface-800',
      'shadow-[var(--ui-button-shadow)]',
      'hover:enabled:!border-brand-primary-300',
      'hover:enabled:!bg-brand-primary-50',
      'hover:enabled:!text-brand-surface-950',
    ]
  }

  if (props.variant === 'outline') {
    return [
      '!border-brand-primary-200',
      '!bg-white',
      '!text-brand-surface-800',
      'shadow-[var(--ui-button-shadow)]',
      'hover:enabled:!border-brand-primary-300',
      'hover:enabled:!bg-brand-primary-50',
      'hover:enabled:!text-brand-surface-950',
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

  if (props.variant === 'danger') {
    return [
      '!border-rose-600',
      '!bg-rose-600',
      '!text-white',
      'shadow-[var(--ui-button-shadow)]',
      'hover:enabled:!border-rose-700',
      'hover:enabled:!bg-rose-700',
    ]
  }

  if (props.variant === 'success') {
    return [
      '!border-emerald-600',
      '!bg-emerald-600',
      '!text-white',
      'shadow-[var(--ui-button-shadow)]',
      'hover:enabled:!border-emerald-700',
      'hover:enabled:!bg-emerald-700',
    ]
  }

  if (props.variant === 'warning') {
    return [
      '!border-amber-500',
      '!bg-amber-500',
      '!text-white',
      'shadow-[var(--ui-button-shadow)]',
      'hover:enabled:!border-amber-600',
      'hover:enabled:!bg-amber-600',
    ]
  }

  if (props.variant === 'link') {
    return [
      '!border-transparent',
      '!bg-transparent',
      '!px-0',
      '!py-0',
      '!h-auto',
      '!min-h-0',
      '!text-brand-700',
      '!shadow-none',
      '!underline-offset-4',
      'hover:enabled:!underline',
      'hover:enabled:!text-brand-800',
    ]
  }

  return [
    '!border-brand-primary-600',
    '!bg-brand-primary-600',
    '!text-white',
    'shadow-[var(--ui-button-shadow-strong)]',
    'hover:enabled:!border-brand-primary-700',
    'hover:enabled:!bg-brand-primary-700',
  ]
})

const rootClass = computed(() => {
  const classes = [
    'ui-button',
    '!inline-flex',
    '!items-center',
    '!justify-center',
    '!min-w-0',
    'whitespace-nowrap',
    '!border',
    '!font-semibold',
    '!transition-all',
    '!duration-200',
    '!leading-none',
    'focus-visible:!outline-none',
    'focus-visible:!shadow-[var(--ui-focus-ring)]',
    'disabled:!cursor-not-allowed',
    'disabled:!opacity-60',
    'disabled:!shadow-none',
    'active:enabled:scale-[0.98]',
    roundedClass.value,
    sizeClass.value,
    ...variantClass.value,
  ]

  if (props.active) {
    classes.push('!ring-2', '!ring-brand-primary-200')
  }

  if (props.block) {
    classes.push('w-full')
  }

  return classes
})

const loadingLabel = computed(() => t('common.states.loading'))

const pt = computed(() => ({
  root: {
    class: rootClass.value,
  },
  label: {
    class: [
      'ui-button__label',
      'inline-flex',
      'items-center',
      'justify-center',
      'min-w-0',
      'max-w-full',
      'truncate',
      props.variant === 'link' ? 'leading-none' : '',
    ],
  },
  loadingIcon: {
    class: 'ui-button__spinner !text-current',
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
    :aria-busy="loading ? 'true' : undefined"
    @click="handleClick"
  >
    <template v-if="$slots.iconLeft && !loading" #icon>
      <slot name="iconLeft" />
    </template>

    <slot />

    <template v-if="!$slots.default && loading">
      {{ loadingLabel }}
    </template>

    <template v-if="$slots.iconRight && !loading">
      <slot name="iconRight" />
    </template>
  </PrimeButton>
</template>

<style scoped>
:deep(.ui-button.p-button .p-button-icon) {
  font-size: 0.95em;
}
</style>

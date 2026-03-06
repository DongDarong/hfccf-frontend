<script setup>
import { computed, useSlots } from 'vue'
import { useLanguage } from '../../composables/useLanguage'

defineOptions({
  name: 'UiButton',
})

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'ghost', 'danger', 'success'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value),
  },
  type: {
    type: String,
    default: 'button',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  block: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: String,
    default: 'xl', // xl, full, lg, md
  },
})

defineEmits(['click'])
const { t } = useLanguage()
const slots = useSlots()

const variantClasses = computed(() => {
  // Centralized style composition keeps button API stable across variants/sizes.
  const base = 'inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100'

  const variants = {
    primary: 'bg-[var(--hope-o-cyan-blue)] text-white shadow-sm shadow-blue-200 hover:bg-[#0087b8] hover:shadow-md hover:shadow-blue-300',
    secondary: 'bg-[var(--hope-h-lime-green)] text-white shadow-sm shadow-lime-200 hover:bg-[#7db135] hover:shadow-md hover:shadow-lime-300',
    danger: 'bg-[var(--hope-p-vibrant-red)] text-white shadow-sm shadow-red-200 hover:bg-[#d41920] hover:shadow-md hover:shadow-red-300',
    success: 'bg-emerald-500 text-white shadow-sm shadow-emerald-200 hover:bg-emerald-600 hover:shadow-md hover:shadow-emerald-300',
    outline: 'border-2 border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  }

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs gap-1.5',
    sm: 'px-3 py-2 text-sm gap-2',
    md: 'px-5 py-2.5 text-[15px] gap-2.5',
    lg: 'px-6 py-3 text-base gap-3',
    xl: 'px-8 py-4 text-lg gap-4',
  }

  const roundedMap = {
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  }

  return [
    base,
    variants[props.variant],
    sizes[props.size],
    roundedMap[props.rounded],
    props.block ? 'w-full' : '',
  ].join(' ')
})

const hasDefaultSlot = computed(() => Boolean(slots.default))
const loadingLabel = computed(() => t('common.loading'))
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="variantClasses"
    @click="$emit('click', $event)"
  >
    <svg
      v-if="loading"
      class="animate-spin h-[1.2em] w-[1.2em]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>

    <span v-if="$slots.iconLeft && !loading" class="flex-shrink-0">
      <slot name="iconLeft" />
    </span>

    <!-- Keep button width stable while loading by hiding slot text via opacity. -->
    <span v-if="hasDefaultSlot" :class="{ 'opacity-0': loading && !block }">
      <slot />
    </span>
    <span v-else-if="loading">
      {{ loadingLabel }}
    </span>

    <span v-if="$slots.iconRight && !loading" class="flex-shrink-0">
      <slot name="iconRight" />
    </span>
  </button>
</template>

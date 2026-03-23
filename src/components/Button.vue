<script setup>
import { computed, useAttrs, useSlots } from 'vue'
import PrimeButton from 'primevue/button'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'UiButton',
  inheritAttrs: false,
})

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) =>
      ['primary', 'secondary', 'outline', 'ghost', 'danger', 'success'].includes(value),
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
    default: 'xl',
  },
})

defineEmits(['click'])

const attrs = useAttrs()
const slots = useSlots()
const { t } = useLanguage()

const severity = computed(() => {
  if (props.variant === 'secondary') return 'success'
  if (props.variant === 'danger') return 'danger'
  if (props.variant === 'success') return 'success'
  return 'info'
})

const roundedClass = computed(() => {
  if (props.rounded === 'full') return 'rounded-full'
  if (props.rounded === 'md') return 'rounded-md'
  if (props.rounded === 'lg') return 'rounded-lg'
  return 'rounded-xl'
})

const buttonClass = computed(() => {
  const classes = [
    'ui-button',
    `ui-button--${props.variant}`,
    `ui-button--${props.size}`,
    roundedClass.value,
  ]

  if (props.block) classes.push('w-full')
  return classes.join(' ')
})

const loadingLabel = computed(() => t('common.loading'))
const passthrough = computed(() => ({
  root: { class: buttonClass.value },
  loadingIcon: { class: 'ui-button__spinner' },
  label: { class: props.loading && !slots.default ? '' : 'ui-button__label' },
}))
</script>

<template>
  <PrimeButton
    v-bind="attrs"
    :type="type"
    :severity="severity"
    :outlined="variant === 'outline'"
    :text="variant === 'ghost'"
    :loading="loading"
    :disabled="disabled || loading"
    :pt="passthrough"
    @click="$emit('click', $event)"
  >
    <template v-if="$slots.iconLeft && !loading" #icon>
      <slot name="iconLeft" />
    </template>

    <template v-if="$slots.default">
      <slot />
    </template>
    <template v-else-if="loading">
      {{ loadingLabel }}
    </template>
  </PrimeButton>
</template>

<style scoped>
:deep(.ui-button.p-button) {
  min-height: 2.75rem;
  border-width: 1px;
  font-weight: 700;
  justify-content: center;
  align-items: center;
  gap: 0.55rem;
  border-radius: inherit;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    opacity 0.2s ease;
}

:deep(.ui-button.p-button:focus-visible) {
  outline: none;
  box-shadow: 0 0 0 3px rgba(125, 211, 252, 0.2);
}

:deep(.ui-button.p-button:not(:disabled):active) {
  transform: scale(0.98);
}

:deep(.ui-button.p-button:disabled) {
  cursor: not-allowed;
  opacity: 0.62;
  transform: none;
  box-shadow: none;
  filter: saturate(0.86);
}

:deep(.ui-button--xs.p-button) {
  min-height: 2rem;
  padding: 0.4rem 0.7rem;
  font-size: 0.75rem;
  gap: 0.35rem;
}

:deep(.ui-button--sm.p-button) {
  min-height: 2.35rem;
  padding: 0.55rem 0.85rem;
  font-size: 0.82rem;
  gap: 0.45rem;
}

:deep(.ui-button--md.p-button) {
  min-height: 2.75rem;
  padding: 0.68rem 1.15rem;
  font-size: 0.94rem;
  gap: 0.55rem;
}

:deep(.ui-button--lg.p-button) {
  min-height: 3.1rem;
  padding: 0.8rem 1.35rem;
  font-size: 1rem;
  gap: 0.65rem;
}

:deep(.ui-button--xl.p-button) {
  min-height: 3.35rem;
  padding: 0.95rem 1.7rem;
  font-size: 1.06rem;
  gap: 0.75rem;
}

:deep(.ui-button--primary.p-button) {
  background: linear-gradient(180deg, #25bef8 0%, #00a7e5 100%);
  border-color: #0ea5e9;
  color: #ffffff;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 10px 22px -14px rgba(0, 174, 239, 0.46);
}

:deep(.ui-button--primary.p-button:not(:disabled):hover) {
  background: linear-gradient(180deg, #11b4ef 0%, #0284c7 100%);
  border-color: #0284c7;
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    0 14px 24px -14px rgba(2, 132, 199, 0.38);
}

:deep(.ui-button--secondary.p-button),
:deep(.ui-button--success.p-button) {
  background: linear-gradient(180deg, #8dd61b 0%, #65a30d 100%);
  border-color: #65a30d;
  color: #ffffff;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    0 10px 22px -14px rgba(101, 163, 13, 0.42);
}

:deep(.ui-button--secondary.p-button:not(:disabled):hover),
:deep(.ui-button--success.p-button:not(:disabled):hover) {
  background: linear-gradient(180deg, #76b814 0%, #4d7c0f 100%);
  border-color: #4d7c0f;
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    0 14px 24px -14px rgba(77, 124, 15, 0.36);
}

:deep(.ui-button--danger.p-button) {
  background: linear-gradient(180deg, #fb5373 0%, #e11d48 100%);
  border-color: #e11d48;
  color: #ffffff;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    0 10px 22px -14px rgba(225, 29, 72, 0.38);
}

:deep(.ui-button--danger.p-button:not(:disabled):hover) {
  background: linear-gradient(180deg, #ef365d 0%, #be123c 100%);
  border-color: #be123c;
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 14px 24px -14px rgba(190, 18, 60, 0.34);
}

:deep(.ui-button--outline.p-button) {
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  color: #334155;
  border-color: #d7e0ea;
  box-shadow: 0 8px 18px -18px rgba(15, 23, 42, 0.16);
}

:deep(.ui-button--outline.p-button:not(:disabled):hover) {
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  color: #0f172a;
  border-color: #cbd5e1;
}

:deep(.ui-button--ghost.p-button) {
  background: transparent;
  color: #475569;
  border-color: transparent;
  box-shadow: none;
}

:deep(.ui-button--ghost.p-button:not(:disabled):hover) {
  background: #f1f5f9;
  color: #0f172a;
}

:deep(.ui-button__label) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

:deep(.ui-button.p-button .p-button-icon) {
  font-size: 0.95em;
}

:deep(.ui-button__spinner) {
  color: currentColor;
}

@media (max-width: 640px) {
  :deep(.ui-button--md.p-button) {
    min-height: 2.6rem;
    padding: 0.64rem 1rem;
  }

  :deep(.ui-button--lg.p-button) {
    min-height: 2.95rem;
    padding: 0.78rem 1.2rem;
  }
}

</style>

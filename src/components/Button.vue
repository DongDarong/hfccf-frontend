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
  border-width: 1px;
  font-weight: 700;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
}

:deep(.ui-button.p-button:not(:disabled):active) {
  transform: scale(0.98);
}

:deep(.ui-button--xs.p-button) {
  padding: 0.4rem 0.7rem;
  font-size: 0.75rem;
  gap: 0.35rem;
}

:deep(.ui-button--sm.p-button) {
  padding: 0.55rem 0.85rem;
  font-size: 0.82rem;
  gap: 0.45rem;
}

:deep(.ui-button--md.p-button) {
  padding: 0.68rem 1.15rem;
  font-size: 0.94rem;
  gap: 0.55rem;
}

:deep(.ui-button--lg.p-button) {
  padding: 0.8rem 1.35rem;
  font-size: 1rem;
  gap: 0.65rem;
}

:deep(.ui-button--xl.p-button) {
  padding: 0.95rem 1.7rem;
  font-size: 1.06rem;
  gap: 0.75rem;
}

:deep(.ui-button--primary.p-button) {
  background: linear-gradient(135deg, var(--hope-cyan) 0%, #0087b8 100%);
  border-color: var(--hope-cyan);
  box-shadow: 0 8px 20px -10px rgba(0, 174, 239, 0.6);
}

:deep(.ui-button--primary.p-button:not(:disabled):hover) {
  background: linear-gradient(135deg, #0087b8 0%, #0076a1 100%);
  border-color: #0087b8;
  transform: translateY(-1px);
  box-shadow: 0 10px 22px -8px rgba(0, 174, 239, 0.7);
}

:deep(.ui-button--secondary.p-button),
:deep(.ui-button--success.p-button) {
  background: linear-gradient(135deg, var(--hope-lime) 0%, #7db135 100%);
  border-color: var(--hope-lime);
  box-shadow: 0 8px 20px -10px rgba(132, 186, 60, 0.6);
}

:deep(.ui-button--secondary.p-button:not(:disabled):hover),
:deep(.ui-button--success.p-button:not(:disabled):hover) {
  background: linear-gradient(135deg, #7db135 0%, #6b992d 100%);
  border-color: #7db135;
  transform: translateY(-1px);
  box-shadow: 0 10px 22px -8px rgba(132, 186, 60, 0.7);
}

:deep(.ui-button--danger.p-button) {
  background: linear-gradient(135deg, var(--hope-red) 0%, #d41920 100%);
  border-color: var(--hope-red);
  box-shadow: 0 8px 20px -10px rgba(230, 35, 41, 0.6);
}

:deep(.ui-button--danger.p-button:not(:disabled):hover) {
  background: linear-gradient(135deg, #d41920 0%, #b8151b 100%);
  border-color: #d41920;
  transform: translateY(-1px);
  box-shadow: 0 10px 22px -8px rgba(230, 35, 41, 0.7);
}

:deep(.ui-button--outline.p-button) {
  background: transparent;
  color: #334155;
  border-color: #d7e0ea;
}

:deep(.ui-button--outline.p-button:not(:disabled):hover) {
  background: #f8fafc;
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

</style>

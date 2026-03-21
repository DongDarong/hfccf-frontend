<script setup>
import { computed } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'
import { useLanguage } from '@/composables/useLanguage'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  tone: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'neutral'].includes(value),
  },
})

const { t } = useLanguage()
const resolvedLabel = computed(() => props.label || t('common.loading'))
const spinnerSize = computed(() => {
  if (props.size === 'sm') return '1.1rem'
  if (props.size === 'lg') return '1.6rem'
  return '1.3rem'
})
</script>

<template>
  <div class="loading" :class="`loading--${tone}`" role="status" aria-live="polite">
    <ProgressSpinner
      class="loading__spinner"
      stroke-width="6"
      fill="transparent"
      animation-duration=".8s"
      :style="{ width: spinnerSize, height: spinnerSize }"
    />
    <span class="loading__label">{{ resolvedLabel }}</span>
  </div>
</template>

<style scoped>
.loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  width: 100%;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.loading--primary {
  color: var(--hope-o-cyan-blue);
}

.loading--neutral {
  color: var(--hope-tagline-dark);
}

.loading__label {
  font-size: 0.74rem;
}

:deep(.loading__spinner svg) {
  color: currentColor;
}
</style>

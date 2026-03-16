<script setup>
import { computed } from 'vue'
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
// Prefer an explicit label when passed in, otherwise use localized default text.
const resolvedLabel = computed(() => props.label || t('common.loading'))
</script>

<template>
  <div
    class="loading"
    :class="[`loading--${size}`, `loading--${tone}`]"
    role="status"
    aria-live="polite"
  >
    <span class="loading__halo" aria-hidden="true">
      <span class="loading__spinner"></span>
    </span>
    <span class="loading__label">{{ resolvedLabel }}</span>
  </div>
</template>

<style scoped>
.loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--spinner-color, var(--hope-o-cyan-blue));
  font-size: 0.82rem;
  width: 100%;
}

.loading__halo {
  width: calc(var(--spinner-size, 1.2rem) + 0.45rem);
  height: calc(var(--spinner-size, 1.2rem) + 0.45rem);
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--spinner-color, var(--hope-o-cyan-blue)) 12%, transparent);
}

.loading__spinner {
  width: var(--spinner-size, 1.25rem);
  height: var(--spinner-size, 1.25rem);
  border-radius: 50%;
  border: 2.5px solid
    color-mix(in srgb, var(--spinner-color, var(--hope-o-cyan-blue)) 28%, transparent);
  border-top-color: var(--spinner-color, var(--hope-o-cyan-blue));
  border-right-color: var(--spinner-color, var(--hope-o-cyan-blue));
  animation: spin 0.8s linear infinite;
}

.loading__label {
  font-size: var(--loading-label-size, 0.74rem);
  color: color-mix(in srgb, var(--spinner-color, var(--hope-o-cyan-blue)) 86%, #1d1d1b);
}

.loading--sm {
  --spinner-size: 1rem;
  --loading-label-size: 0.66rem;
}

.loading--md {
  --spinner-size: 1.2rem;
  --loading-label-size: 0.74rem;
}

.loading--lg {
  --spinner-size: 1.45rem;
  --loading-label-size: 0.8rem;
}

.loading--primary {
  --spinner-color: var(--hope-o-cyan-blue);
}

.loading--neutral {
  --spinner-color: var(--hope-tagline-dark);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>



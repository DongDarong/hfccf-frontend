<script setup>
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

const props = defineProps({
  status: {
    type: String,
    default: 'neutral',
  },
  label: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md'].includes(value),
  },
  dot: {
    type: Boolean,
    default: true,
  },
})
const { t } = useLanguage()

const normalizedStatus = computed(() => {
  const value = props.status.trim().toLowerCase()
  // Badge style logic expects a non-empty key.
  return value || 'neutral'
})

function toStatusKey(value) {
  // Normalize statuses/labels to match translation key naming.
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
}

const statusLabel = computed(() => {
  if (props.label.trim()) {
    const providedKey = `common.status.${toStatusKey(props.label)}`
    const translatedProvided = t(providedKey)
    // Prefer explicit label (translated when possible).
    return translatedProvided !== providedKey ? translatedProvided : props.label
  }

  const key = `common.status.${toStatusKey(normalizedStatus.value)}`
  const localized = t(key)
  if (localized !== key) return localized
  // Final fallback to a readable capitalized value.
  return normalizedStatus.value.charAt(0).toUpperCase() + normalizedStatus.value.slice(1)
})

// Shared status-to-style mapping for consistent badge semantics.
const STATUS_BADGE_STYLES = {
  success: 'status-badge--success',
  active: 'status-badge--success',
  pending: 'status-badge--pending',
  warning: 'status-badge--warning',
  error: 'status-badge--error',
  suspended: 'status-badge--suspended',
  inactive: 'status-badge--inactive',
  info: 'status-badge--info',
  neutral: 'status-badge--neutral',
}

const statusClass = computed(
  () => STATUS_BADGE_STYLES[normalizedStatus.value] || STATUS_BADGE_STYLES.neutral,
)
</script>

<template>
  <span class="status-badge" :class="[statusClass, `status-badge--${size}`]">
    <span v-if="dot" class="status-badge__dot" aria-hidden="true"></span>
    {{ statusLabel }}
  </span>
</template>

<style scoped>
.status-badge {
  --badge-bg: rgba(29, 29, 27, 0.1);
  --badge-text: var(--hope-tagline-dark);
  --badge-dot: var(--hope-tagline-dark);

  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 999px;
  font-weight: 700;
  letter-spacing: 0.02em;
  background-color: var(--badge-bg);
  color: var(--badge-text);
  border: 1px solid color-mix(in srgb, var(--badge-text) 25%, transparent);
}

.status-badge--sm {
  padding: 0.2rem 0.45rem;
  font-size: 0.7rem;
}

.status-badge--md {
  padding: 0.28rem 0.6rem;
  font-size: 0.72rem;
}

.status-badge__dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background-color: var(--badge-dot);
}

.status-badge--success {
  --badge-bg: color-mix(in srgb, var(--hope-h-lime-green) 22%, white);
  --badge-text: #266122;
  --badge-dot: var(--hope-h-lime-green);
}

.status-badge--warning {
  --badge-bg: color-mix(in srgb, var(--hope-e-golden-yellow) 30%, white);
  --badge-text: #7a5a00;
  --badge-dot: var(--hope-e-golden-yellow);
}

.status-badge--error {
  --badge-bg: color-mix(in srgb, var(--hope-p-vibrant-red) 20%, white);
  --badge-text: #8f1318;
  --badge-dot: var(--hope-p-vibrant-red);
}

.status-badge--info {
  --badge-bg: color-mix(in srgb, var(--hope-o-cyan-blue) 20%, white);
  --badge-text: #045372;
  --badge-dot: var(--hope-o-cyan-blue);
}

.status-badge--pending {
  --badge-bg: color-mix(in srgb, var(--hope-o-cyan-blue) 16%, white);
  --badge-text: #0a4e69;
  --badge-dot: #3d93b5;
}

.status-badge--suspended {
  --badge-bg: color-mix(in srgb, var(--hope-p-vibrant-red) 18%, white);
  --badge-text: #8f1318;
  --badge-dot: var(--hope-p-vibrant-red);
}

.status-badge--inactive {
  --badge-bg: color-mix(in srgb, var(--hope-dark) 12%, white);
  --badge-text: #4b5563;
  --badge-dot: #9ca3af;
}

.status-badge--neutral {
  --badge-bg: color-mix(in srgb, var(--hope-tagline-dark) 20%, white);
  --badge-text: #374151;
  --badge-dot: var(--hope-tagline-dark);
}
</style>



<script setup>
import { computed } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'
import StatusBadge from './StatusBadge.vue'
import { useLanguage } from '../../composables/useLanguage'

defineOptions({
  name: 'DashboardStatsCards',
})

defineProps({
  cards: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
})
const { t, language } = useLanguage()
const isKh = computed(() => language.value === 'KH')

function toCardKey(value) {
  // Build safe i18n keys from API-provided card titles/labels.
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s-]+/g, '_')
}

function translateCardText(type, value) {
  const raw = String(value ?? '').trim()
  if (!raw) return ''
  const key = `common.dashboardStats.cards.${toCardKey(raw)}.${type}`
  const translated = t(key)
  // If no translation exists, preserve source text instead of showing key.
  return translated !== key ? translated : raw
}

function accentClass(status) {
  return `stats__card--${status || 'info'}`
}

function icon(status) {
  // Keep icon selection deterministic by status bucket.
  const key = (status || 'info').toLowerCase()

  if (key === 'success') {
    return 'M5 13l4 4L19 7'
  }

  if (key === 'warning') {
    return 'M12 8v4m0 4h.01M10.3 3.86l-7.5 13a1 1 0 00.87 1.5h16.66a1 1 0 00.87-1.5l-7.5-13a1 1 0 00-1.74 0z'
  }

  if (key === 'error') {
    return 'M6 18L18 6M6 6l12 12'
  }

  return 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
}

</script>

<template>
  <section class="stats" :class="{ 'stats--kh': isKh }">
    <div v-if="loading" class="stats__state">
      <LoadingSpinner :label="t('common.dashboardStats.loading')" size="md" />
    </div>
    <div v-else-if="error" class="stats__state stats__state--error">{{ error }}</div>

    <!-- Render order: loading -> error -> cards/empty. -->
    <div v-else class="stats__grid">
      <article v-for="card in cards" :key="card.title" class="stats__card" :class="accentClass(card.status)">
        <div class="stats__head">
          <p class="stats__title">{{ translateCardText('title', card.title) }}</p>
          <span class="stats__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path :d="icon(card.status)" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </div>
        <p class="stats__value">{{ card.value }}</p>
        <div class="stats__foot">
          <p class="stats__meta">{{ translateCardText('label', card.label) }}</p>
          <StatusBadge :status="card.status || 'info'" size="sm" />
        </div>
      </article>
      <article v-if="!cards.length" class="stats__empty">{{ t('common.dashboardStats.empty') }}</article>
    </div>
  </section>
</template>

<style scoped>
.stats__state {
  border: 1px dashed #c7d6e3;
  border-radius: 0.9rem;
  padding: 1rem;
  color: #5a7082;
  background: #fbfdff;
}

.stats__state--error {
  border-color: color-mix(in srgb, var(--hope-red) 45%, white);
  background: color-mix(in srgb, var(--hope-red) 7%, white);
  color: #8e1418;
}

.stats__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 0.9rem;
}

.stats__card {
  border: 1px solid #e3ecf4;
  border-radius: 0.95rem;
  padding: 0.95rem;
  background: linear-gradient(160deg, #ffffff 0%, #f7fbff 100%);
  box-shadow: 0 12px 24px rgba(4, 52, 80, 0.05);
  border-left: 4px solid var(--accent, var(--hope-cyan));
}

.stats__card--success {
  --accent: var(--hope-lime);
}

.stats__card--info {
  --accent: var(--hope-cyan);
}

.stats__card--warning {
  --accent: var(--hope-yellow);
}

.stats__card--error {
  --accent: var(--hope-red);
}

.stats__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
}

.stats__title {
  margin: 0;
  font-size: 0.76rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #5f7486;
}

.stats__icon {
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 0.58rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--accent, var(--hope-cyan));
  background: color-mix(in srgb, var(--accent, var(--hope-cyan)) 15%, white);
  border: 1px solid color-mix(in srgb, var(--accent, var(--hope-cyan)) 30%, white);
}

.stats__icon svg {
  width: 1.05rem;
  height: 1.05rem;
}

.stats__value {
  margin: 0.6rem 0 0;
  font-size: 1.75rem;
  font-weight: 800;
  color: #122f43;
  line-height: 1.1;
}

.stats__foot {
  margin-top: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.stats__meta {
  margin: 0;
  font-size: 0.78rem;
  color: #5d7385;
}

.stats__empty {
  grid-column: 1 / -1;
  border: 1px dashed #c9d7e3;
  border-radius: 0.9rem;
  padding: 1rem;
  text-align: center;
  font-size: 0.86rem;
  color: #5a7082;
  background: #fbfdff;
}

.stats--kh .stats__title,
.stats--kh .stats__meta,
.stats--kh .stats__state,
.stats--kh .stats__empty {
  font-family: 'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
}

.stats--kh .stats__title {
  text-transform: none;
  letter-spacing: 0.01em;
  font-size: 0.82rem;
}

.stats--kh .stats__meta {
  font-size: 0.8rem;
}

@media (max-width: 640px) {
  .stats__grid {
    grid-template-columns: 1fr;
    gap: 0.7rem;
  }

  .stats__card {
    padding: 0.8rem;
  }

  .stats__title {
    font-size: 0.7rem;
  }

  .stats__value {
    font-size: 1.5rem;
  }

  .stats__meta {
    font-size: 0.74rem;
  }

}

@media (max-width: 420px) {
  .stats__state,
  .stats__empty {
    padding: 0.82rem;
    font-size: 0.8rem;
  }

  .stats__card {
    border-radius: 0.85rem;
    padding: 0.72rem;
  }

  .stats__icon {
    width: 1.65rem;
    height: 1.65rem;
    border-radius: 0.5rem;
  }

  .stats__icon svg {
    width: 0.94rem;
    height: 0.94rem;
  }

  .stats__value {
    font-size: 1.34rem;
  }

  .stats__foot {
    margin-top: 0.35rem;
  }

  .stats__meta {
    font-size: 0.7rem;
  }
}
</style>

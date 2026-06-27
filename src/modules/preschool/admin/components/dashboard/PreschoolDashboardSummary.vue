<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'PreschoolDashboardSummary',
})

const props = defineProps({
  cards: {
    type: Array,
    default: () => [],
  },
})

function toneClass(status) {
  const normalized = String(status || '').trim().toLowerCase()
  if (normalized === 'success') return 'preschool-dashboard-summary__card--success'
  if (normalized === 'warning') return 'preschool-dashboard-summary__card--warning'
  if (normalized === 'error') return 'preschool-dashboard-summary__card--error'
  return 'preschool-dashboard-summary__card--info'
}

function trendClass(direction) {
  const normalized = String(direction || 'neutral').trim().toLowerCase()
  if (normalized === 'up') return 'preschool-dashboard-summary__trend--up'
  if (normalized === 'down') return 'preschool-dashboard-summary__trend--down'
  return 'preschool-dashboard-summary__trend--neutral'
}

function trendPath(direction) {
  const normalized = String(direction || 'neutral').trim().toLowerCase()
  if (normalized === 'up') return 'M6 14l4-4 4 4 4-6'
  if (normalized === 'down') return 'M6 10l4 4 4-4 4 6'
  return 'M5 12h14'
}

const normalizedCards = computed(() =>
  (Array.isArray(props.cards) ? props.cards : []).map((card) => ({
    ...card,
    trend: card?.trend || {
      direction: 'neutral',
      label: card?.comparison || '',
    },
    comparison: String(card?.comparison || '').trim(),
  })),
)
</script>

<template>
  <div class="preschool-dashboard-summary">
    <article
      v-for="card in normalizedCards"
      :key="card.title"
      :class="['preschool-dashboard-summary__card', toneClass(card.status)]"
    >
      <div class="preschool-dashboard-summary__header">
        <p class="preschool-dashboard-summary__title">{{ card.title }}</p>
        <span
          class="preschool-dashboard-summary__trend"
          :class="trendClass(card.trend.direction)"
          :data-direction="card.trend.direction || 'neutral'"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path :d="trendPath(card.trend.direction)" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>{{ card.trend.label || card.comparison || '—' }}</span>
        </span>
      </div>

      <p class="preschool-dashboard-summary__value">{{ card.value }}</p>
      <p class="preschool-dashboard-summary__label">{{ card.label }}</p>
      <p class="preschool-dashboard-summary__comparison">
        {{ card.comparison || card.trend.label || '' }}
      </p>
    </article>
  </div>
</template>

<style scoped>
.preschool-dashboard-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 1rem;
}

.preschool-dashboard-summary__card {
  min-height: 10rem;
  padding: 1.15rem 1.2rem;
  border-radius: 1.35rem;
  border: 1px solid #dbe6f2;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%);
  box-shadow: 0 18px 45px -34px rgba(15, 23, 42, 0.5);
}

.preschool-dashboard-summary__card--success {
  border-color: #bbf7d0;
  background: linear-gradient(180deg, #f7fff8 0%, #ecfdf3 100%);
}

.preschool-dashboard-summary__card--warning {
  border-color: #fde68a;
  background: linear-gradient(180deg, #fffdf5 0%, #fef3c7 100%);
}

.preschool-dashboard-summary__card--error {
  border-color: #fecaca;
  background: linear-gradient(180deg, #fff7f7 0%, #fee2e2 100%);
}

.preschool-dashboard-summary__card--info {
  border-color: #bfdbfe;
  background: linear-gradient(180deg, #f8fbff 0%, #dbeafe 100%);
}

.preschool-dashboard-summary__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.preschool-dashboard-summary__title {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 800;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.preschool-dashboard-summary__trend {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.76rem;
  font-weight: 800;
  white-space: nowrap;
}

.preschool-dashboard-summary__trend svg {
  width: 0.85rem;
  height: 0.85rem;
}

.preschool-dashboard-summary__trend--up {
  color: #047857;
  background: #ecfdf3;
  border-color: #bbf7d0;
}

.preschool-dashboard-summary__trend--down {
  color: #b91c1c;
  background: #fff1f2;
  border-color: #fecdd3;
}

.preschool-dashboard-summary__trend--neutral {
  color: #475569;
  background: #f8fafc;
  border-color: #e2e8f0;
}

.preschool-dashboard-summary__value {
  margin: 0.65rem 0 0;
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
}

.preschool-dashboard-summary__label {
  margin: 0.3rem 0 0;
  font-size: 0.92rem;
  color: #475569;
  line-height: 1.5;
}

.preschool-dashboard-summary__comparison {
  margin: 0.6rem 0 0;
  min-height: 1.25rem;
  font-size: 0.88rem;
  font-weight: 700;
  color: #0f172a;
}

@media (max-width: 640px) {
  .preschool-dashboard-summary {
    grid-template-columns: 1fr;
  }
}
</style>

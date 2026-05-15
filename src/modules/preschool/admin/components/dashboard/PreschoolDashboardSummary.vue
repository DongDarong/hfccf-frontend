<script setup>
defineOptions({
  name: 'PreschoolDashboardSummary',
})

defineProps({
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
</script>

<template>
  <div class="preschool-dashboard-summary">
    <article
      v-for="card in cards"
      :key="card.title"
      :class="['preschool-dashboard-summary__card', toneClass(card.status)]"
    >
      <p class="preschool-dashboard-summary__title">{{ card.title }}</p>
      <p class="preschool-dashboard-summary__value">{{ card.value }}</p>
      <p class="preschool-dashboard-summary__label">{{ card.label }}</p>
    </article>
  </div>
</template>

<style scoped>
.preschool-dashboard-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.preschool-dashboard-summary__card {
  padding: 1.2rem;
  border-radius: 1.25rem;
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

.preschool-dashboard-summary__title {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.preschool-dashboard-summary__value {
  margin: 0.55rem 0 0;
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

@media (max-width: 1100px) {
  .preschool-dashboard-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .preschool-dashboard-summary {
    grid-template-columns: 1fr;
  }
}
</style>

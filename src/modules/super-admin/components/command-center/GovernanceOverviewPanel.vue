<script setup>
import Card from 'primevue/card'
import StatusBadge from '@/components/badges/StatusBadge.vue'

defineOptions({
  name: 'GovernanceOverviewPanel',
})

defineProps({
  title: {
    type: String,
    required: true,
  },
  metrics: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <Card class="command-center-panel">
    <template #title>
      <h3 class="text-[1.02rem] font-extrabold text-slate-900">
        {{ title }}
      </h3>
    </template>

    <template #content>
      <div class="grid gap-3 sm:grid-cols-2">
        <article
          v-for="metric in metrics"
          :key="metric.id"
          class="rounded-[0.95rem] border border-surface-200 bg-slate-50/80 p-4"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-surface-500">
                {{ metric.title }}
              </p>
              <p class="mt-2 text-[1.65rem] leading-none font-extrabold text-slate-900">
                {{ metric.value }}
              </p>
            </div>
            <StatusBadge :status="metric.status" :label="metric.label" size="sm" :dot="false" />
          </div>
        </article>
      </div>
    </template>
  </Card>
</template>

<style scoped>
:deep(.command-center-panel.p-card) {
  border-radius: 1.1rem;
  border: 1px solid #e7eaf3;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 22px 50px -38px rgba(15, 23, 42, 0.46);
}
</style>

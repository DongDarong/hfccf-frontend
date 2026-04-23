<script setup>
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import StatusBadge from '@/components/badges/StatusBadge.vue'

defineOptions({
  name: 'RecentCriticalEventsPanel',
})

defineProps({
  title: {
    type: String,
    required: true,
  },
  events: {
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
      <div class="flex flex-col gap-3">
        <article
          v-for="event in events"
          :key="event.id"
          class="flex flex-col gap-3 rounded-[0.95rem] border border-surface-200 bg-white p-4 md:flex-row md:items-start md:justify-between"
        >
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <StatusBadge :status="event.severity" :label="event.severityLabel" size="sm" />
              <Tag :value="event.moduleLabel" severity="secondary" rounded />
            </div>
            <p class="mt-2 text-[0.95rem] font-semibold text-slate-900">
              {{ event.title }}
            </p>
          </div>

          <p class="shrink-0 text-[0.82rem] font-medium text-slate-500">
            {{ event.timestampLabel }}
          </p>
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

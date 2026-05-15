<script setup>
import Card from 'primevue/card'
import StatusBadge from '@/components/badges/StatusBadge.vue'
import { getCommandCenterTone } from './commandCenterTone'

defineOptions({
  name: 'ExecutiveStatusPanel',
})

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: Object,
    required: true,
  },
})

const tone = getCommandCenterTone(props.status.level)
</script>

<template>
  <Card class="command-center-panel">
    <template #title>
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="text-[1.02rem] font-extrabold text-slate-900">
            {{ title }}
          </h3>
          <p v-if="status.note" class="mt-1 text-[0.9rem] leading-6 text-slate-600">
            {{ status.note }}
          </p>
        </div>
        <StatusBadge :status="status.level" :label="status.levelLabel" size="sm" :dot="false" />
      </div>
    </template>

    <template #content>
      <div class="relative overflow-hidden rounded-[1rem] border border-surface-200 bg-white p-4">
        <div :class="['absolute inset-y-0 left-0 w-1.5 rounded-full', tone.accentClass]" />
        <div class="grid gap-4 lg:grid-cols-3">
          <div class="lg:col-span-3">
            <p class="text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-surface-500">
              {{ status.topIssueLabel }}
            </p>
            <p class="mt-1 text-[1rem] font-semibold text-slate-900">
              {{ status.topIssue }}
            </p>
          </div>

          <div class="rounded-[0.9rem] border border-surface-200 bg-slate-50/80 p-3">
            <p class="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-surface-500">
              {{ status.departmentLabel }}
            </p>
            <p class="mt-1 text-[0.96rem] font-bold text-slate-900">
              {{ status.department }}
            </p>
          </div>

          <div class="rounded-[0.9rem] border border-surface-200 bg-slate-50/80 p-3 lg:col-span-2">
            <p class="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-surface-500">
              {{ status.recommendedActionLabel }}
            </p>
            <p class="mt-1 text-[0.95rem] leading-6 text-slate-700">
              {{ status.recommendedAction }}
            </p>
          </div>
        </div>
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

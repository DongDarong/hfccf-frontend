<script setup>
import Button from '@/components/buttons/Button.vue'

defineOptions({
  name: 'AssessmentDashboardHero',
})

defineProps({
  workflowSteps: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['create', 'reports', 'settings', 'navigate'])
</script>

<template>
  <section class="rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-6 shadow-sm">
    <div class="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
      <div class="space-y-4">
        <p class="text-sm font-semibold uppercase tracking-[0.22em] text-sky-600">
          Preschool Assessment Workspace
        </p>
        <h2 class="text-3xl font-bold text-slate-900">
          Organize assessment capture, review, reports, and settings in one place.
        </h2>
        <p class="max-w-2xl text-base leading-7 text-slate-600">
          Start from the dashboard, move into student assessments, then review performance
          trends and configure the module without jumping across unrelated screens.
        </p>

        <div class="flex flex-wrap gap-3">
          <Button
            label="Create Assessment"
            icon="pi pi-plus"
            @click="emit('create')"
          />
          <Button
            label="Open Reports"
            icon="pi pi-chart-bar"
            variant="secondary"
            @click="emit('reports')"
          />
          <Button
            label="Workspace Settings"
            icon="pi pi-cog"
            variant="secondary"
            @click="emit('settings')"
          />
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          Workflow
        </p>
        <div class="mt-4 space-y-3">
          <button
            v-for="step in workflowSteps"
            :key="step.key"
            type="button"
            class="flex w-full items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-sky-200 hover:bg-sky-50"
            @click="emit('navigate', step.routeName)"
          >
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">
              {{ step.key.slice(0, 1).toUpperCase() }}
            </div>
            <div>
              <p class="font-semibold text-slate-900">{{ step.title }}</p>
              <p class="text-sm leading-6 text-slate-600">{{ step.description }}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

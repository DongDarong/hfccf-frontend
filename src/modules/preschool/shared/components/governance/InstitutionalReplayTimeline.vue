<script setup>
import { useLanguage } from '@/composables/useLanguage'
import StatusBadge from '@/components/badges/StatusBadge.vue'
import {
  resolveLifecycleActionLabel,
  resolveLifecycleContextLabel,
  resolveLifecycleEntityLabel,
} from '@/modules/preschool/shared/utils/lifecycleAuditLabels'

const { t, te } = useLanguage()

defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  emptyLabel: {
    type: String,
    default: '',
  },
})

function tone(source) {
  const normalized = String(source || '').toLowerCase()
  if (normalized === 'snapshot') return 'success'
  if (normalized === 'export') return 'warning'
  if (normalized === 'assignment') return 'info'
  if (normalized === 'report_period') return 'info'
  return 'primary'
}

function resolveItemAction(item = {}) {
  return resolveLifecycleActionLabel(t, item.actionType || item.title, te)
}

function resolveItemEntityContext(item = {}) {
  const entity = resolveLifecycleEntityLabel(t, item.entityType, te)
  const context = resolveLifecycleContextLabel(t, item.context, te)

  if (entity === '-' && context === '-') {
    return '-'
  }

  if (entity === '-') {
    return context
  }

  if (context === '-') {
    return entity
  }

  return `${entity} · ${context}`
}
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="space-y-1">
      <h3 class="text-sm font-semibold text-slate-900">{{ title }}</h3>
      <p class="text-sm text-slate-500">{{ subtitle }}</p>
    </div>

    <div v-if="loading" class="mt-4 text-sm text-slate-500">
      Loading...
    </div>

    <div v-else-if="!items.length" class="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
      {{ emptyLabel }}
    </div>

    <ol v-else class="mt-4 space-y-3">
      <li
        v-for="item in items"
        :key="item.id"
        class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <StatusBadge :status="tone(item.source)" :label="item.source" :translate-label="false" :dot="false" size="sm" />
              <span class="text-sm font-medium text-slate-900">{{ resolveItemAction(item) }}</span>
            </div>
            <p class="text-sm text-slate-600">{{ item.description || '-' }}</p>
            <p v-if="item.entityType || item.context" class="text-xs text-slate-500">{{ resolveItemEntityContext(item) }}</p>
          </div>
          <div class="text-right text-xs text-slate-500">
            <p class="font-medium text-slate-800">{{ item.recordedAt || '-' }}</p>
            <p>{{ item.actor?.displayName || item.actor?.roleCode || '-' }}</p>
          </div>
        </div>
        <div class="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
          <span v-if="item.context?.academicYearId">AY: {{ item.context.academicYearId }}</span>
          <span v-if="item.context?.termId">Term: {{ item.context.termId }}</span>
          <span v-if="item.context?.reportPeriodId">Report: {{ item.context.reportPeriodId }}</span>
          <span v-if="item.context?.classId">Class: {{ item.context.classId }}</span>
          <span v-if="item.context?.studentId">Student: {{ item.context.studentId }}</span>
        </div>
      </li>
    </ol>
  </div>
</template>

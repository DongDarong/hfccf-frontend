<script setup>
// Keep teacher observations isolated so report pages can present narrative
// notes without mixing them into the summary cards or assessment lists.
import { useLanguage } from '@/composables/useLanguage'

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

const { t } = useLanguage()
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div class="border-b border-slate-200 px-4 py-3">
      <h3 class="text-sm font-semibold text-slate-900">{{ t('preschoolReportsShared.observationsTitle') }}</h3>
    </div>

    <div v-if="!items.length" class="px-4 py-8 text-sm text-slate-500">
      {{ t('preschoolReportsShared.emptyObservations') }}
    </div>

    <ul v-else class="divide-y divide-slate-100">
      <li v-for="item in items" :key="item.assessmentId" class="space-y-2 px-4 py-3">
        <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>{{ item.assessmentDate || '-' }}</span>
          <span>•</span>
          <span>{{ item.studentName || t('preschoolReportsShared.labels.studentFallback') }}</span>
          <span>•</span>
          <span>{{ item.category?.name || '-' }}</span>
        </div>
        <p class="text-sm text-slate-700">{{ item.observation || item.teacherComment || '-' }}</p>
      </li>
    </ul>
  </section>
</template>

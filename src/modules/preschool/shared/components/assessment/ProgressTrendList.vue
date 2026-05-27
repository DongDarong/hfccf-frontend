<script setup>
// Keep the progress trend list focused on finalized assessment history so the
// summary page stays readable and future report widgets can reuse it safely.
import AssessmentCategoryBadge from './AssessmentCategoryBadge.vue'
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
  <div class="rounded-2xl border border-slate-200 bg-white">
    <div class="border-b border-slate-200 px-4 py-3">
      <h3 class="text-sm font-semibold text-slate-900">{{ t('preschoolProgressSummaryPage.trendsTitle') }}</h3>
    </div>
    <div v-if="!items.length" class="px-4 py-8 text-sm text-slate-500">
      {{ t('preschoolProgressSummaryPage.emptyTrends') }}
    </div>
    <ul v-else class="divide-y divide-slate-100">
      <li v-for="item in items" :key="item.category?.id || item.categoryId" class="flex items-center justify-between gap-4 px-4 py-3">
        <div class="space-y-1">
          <AssessmentCategoryBadge :category="item.category || { code: item.categoryCode, name: item.categoryName }" />
          <p class="text-sm text-slate-600">
            {{ t('preschoolProgressSummaryPage.countLabel', { count: item.count }) }}
          </p>
        </div>
        <div class="text-right text-sm text-slate-600">
          <p>{{ t('preschoolProgressSummaryPage.averageLabel', { score: item.averageScore ?? '-' }) }}</p>
          <p class="text-xs text-slate-400">{{ item.latestAssessmentDate || '-' }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

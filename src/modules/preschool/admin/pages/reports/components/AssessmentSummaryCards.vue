<script setup>
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

const props = defineProps({
  assessments: {
    type: Array,
    default: () => [],
  },
})

const { t } = useLanguage()

const summary = computed(() => {
  if (!props.assessments || props.assessments.length === 0) {
    return {
      total: 0,
      completed: 0,
      draft: 0,
      averageScore: null,
      highestScore: null,
      lowestScore: null,
      overallRating: null,
    }
  }

  const completed = props.assessments.filter(a => a.status === 'finalized' || a.status === 'archived').length
  const draft = props.assessments.filter(a => a.status === 'draft').length

  const validScores = props.assessments
    .filter(a => a.score !== null && a.score !== undefined)
    .map(a => Number(a.score))

  let averageScore = null
  let highestScore = null
  let lowestScore = null

  if (validScores.length > 0) {
    averageScore = (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
    highestScore = Math.max(...validScores)
    lowestScore = Math.min(...validScores)
  }

  return {
    total: props.assessments.length,
    completed,
    draft,
    averageScore,
    highestScore,
    lowestScore,
    overallRating: props.assessments[0]?.rating || null,
  }
})
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
      {{ t('preschoolAssessmentReportPage.summary.title') || 'Assessment Summary' }}
    </h2>

    <div class="grid gap-4 md:grid-cols-4">
      <!-- Total Assessments -->
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs font-semibold uppercase text-slate-500">
          {{ t('preschoolAssessmentReportPage.summary.total') || 'Total' }}
        </p>
        <p class="mt-2 text-2xl font-bold text-slate-900">{{ summary.total }}</p>
      </div>

      <!-- Completed -->
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs font-semibold uppercase text-slate-500">
          {{ t('preschoolAssessmentReportPage.summary.completed') || 'Completed' }}
        </p>
        <p class="mt-2 text-2xl font-bold text-green-700">{{ summary.completed }}</p>
      </div>

      <!-- Draft -->
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs font-semibold uppercase text-slate-500">
          {{ t('preschoolAssessmentReportPage.summary.draft') || 'Draft' }}
        </p>
        <p class="mt-2 text-2xl font-bold text-blue-700">{{ summary.draft }}</p>
      </div>

      <!-- Average Score -->
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs font-semibold uppercase text-slate-500">
          {{ t('preschoolAssessmentReportPage.summary.average') || 'Average' }}
        </p>
        <p class="mt-2 text-2xl font-bold text-slate-900">{{ summary.averageScore || '—' }}</p>
      </div>
    </div>

    <!-- Second Row -->
    <div v-if="summary.total > 0" class="mt-4 grid gap-4 md:grid-cols-4">
      <!-- Highest Score -->
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs font-semibold uppercase text-slate-500">
          {{ t('preschoolAssessmentReportPage.summary.highest') || 'Highest' }}
        </p>
        <p class="mt-2 text-2xl font-bold text-slate-900">{{ summary.highestScore || '—' }}</p>
      </div>

      <!-- Lowest Score -->
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs font-semibold uppercase text-slate-500">
          {{ t('preschoolAssessmentReportPage.summary.lowest') || 'Lowest' }}
        </p>
        <p class="mt-2 text-2xl font-bold text-slate-900">{{ summary.lowestScore || '—' }}</p>
      </div>

      <!-- Rating -->
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs font-semibold uppercase text-slate-500">
          {{ t('preschoolAssessmentReportPage.summary.rating') || 'Rating' }}
        </p>
        <p class="mt-2 text-2xl font-bold text-slate-900">{{ summary.overallRating || '—' }}</p>
      </div>

      <!-- Completion Rate -->
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs font-semibold uppercase text-slate-500">
          {{ t('preschoolAssessmentReportPage.summary.completionRate') || 'Completion' }}
        </p>
        <p class="mt-2 text-2xl font-bold text-slate-900">
          {{ summary.total > 0 ? Math.round((summary.completed / summary.total) * 100) : 0 }}%
        </p>
      </div>
    </div>
  </div>
</template>

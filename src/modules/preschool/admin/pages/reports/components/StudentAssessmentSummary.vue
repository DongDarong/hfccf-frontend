<script setup>
import { computed } from 'vue'

const props = defineProps({
  assessments: {
    type: Array,
    default: () => [],
  },
})

const summary = computed(() => {
  if (!props.assessments || props.assessments.length === 0) {
    return {
      latest: null,
      averageScore: null,
      categoryCount: 0,
    }
  }

  const latest = props.assessments[0]
  const validScores = props.assessments
    .filter(a => a.score !== null && a.score !== undefined)
    .map(a => Number(a.score))

  const averageScore = validScores.length > 0
    ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
    : null

  const categories = new Set(props.assessments.map(a => a.category?.id || a.categoryId))

  return {
    latest,
    averageScore,
    categoryCount: categories.size,
    totalAssessments: props.assessments.length,
  }
})
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Assessment Summary</h2>

    <!-- Empty State -->
    <div v-if="summary.totalAssessments === 0" class="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <i class="pi pi-chart-bar text-2xl text-slate-300" />
      <p class="mt-2 text-sm text-slate-500">No assessments available yet.</p>
    </div>

    <!-- Summary Cards -->
    <div v-else class="space-y-4">
      <!-- Overall Statistics -->
      <div class="grid gap-4 md:grid-cols-4">
        <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase text-slate-500">Average Score</p>
          <p class="mt-2 text-2xl font-bold text-slate-900">{{ summary.averageScore || '—' }}</p>
        </div>

        <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase text-slate-500">Total Records</p>
          <p class="mt-2 text-2xl font-bold text-slate-900">{{ summary.totalAssessments }}</p>
        </div>

        <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase text-slate-500">Categories</p>
          <p class="mt-2 text-2xl font-bold text-slate-900">{{ summary.categoryCount }}</p>
        </div>

        <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase text-slate-500">Status</p>
          <div class="mt-2">
            <span
              :class="[
                'inline-block rounded-full px-2 py-1 text-xs font-semibold',
                summary.latest?.status === 'finalized'
                  ? 'bg-green-100 text-green-800'
                  : summary.latest?.status === 'draft'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800',
              ]"
            >
              {{ summary.latest?.status || '—' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Latest Assessment & Comment -->
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs font-semibold uppercase text-slate-500 mb-2">Latest Assessment</p>
        <div class="space-y-2">
          <p class="text-sm">
            <strong>Category:</strong> {{ summary.latest?.category?.name || summary.latest?.categoryName || '—' }}
          </p>
          <p class="text-sm">
            <strong>Score:</strong> {{ summary.latest?.score || '—' }} / {{ summary.latest?.rating || '—' }}
          </p>
          <p class="text-sm">
            <strong>Date:</strong> {{ summary.latest?.assessment_date || summary.latest?.assessmentDate || '—' }}
          </p>
          <div v-if="summary.latest?.teacher_comment || summary.latest?.teacherComment" class="mt-3 border-t border-slate-300 pt-3">
            <p class="text-xs font-semibold uppercase text-slate-500 mb-1">Teacher Comment</p>
            <p class="text-sm text-slate-700">{{ summary.latest?.teacher_comment || summary.latest?.teacherComment }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

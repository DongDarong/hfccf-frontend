<script setup>
import Tag from 'primevue/tag'
import { useLanguage } from '@/composables/useLanguage'
import { useAssessmentWizard } from '../../composables/useAssessmentWizard'

const { t } = useLanguage()
const { store, answeredCount } = useAssessmentWizard()
</script>

<template>
  <div class="flex flex-col gap-5">
    <div>
      <h3 class="text-base font-semibold text-slate-800">{{ t('assessmentWizard.review') }}</h3>
      <p class="mt-0.5 text-sm text-slate-400">{{ t('assessmentWizard.reviewHint') }}</p>
    </div>

    <!-- Summary cards -->
    <div class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-xl border border-slate-200 bg-white p-4">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ t('assessmentWizard.steps.form') }}</p>
        <p class="mt-2 font-medium text-slate-800">{{ store.selectedForm?.name ?? '—' }}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-4">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ t('assessmentWizard.steps.student') }}</p>
        <p class="mt-2 font-medium text-slate-800">
          {{ store.selectedStudent?.full_name ?? store.selectedStudent?.fullName ?? '—' }}
        </p>
        <p v-if="store.selectedStudent?.student_code" class="text-xs text-slate-400">
          {{ store.selectedStudent.student_code }}
        </p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-4">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ t('submissions.answers') }}</p>
        <div class="mt-2">
          <Tag :value="t('assessmentWizard.answeredCount', { n: answeredCount })" severity="info" />
        </div>
      </div>
    </div>

    <!-- Confirmation notice -->
    <div class="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <i class="pi pi-info-circle mt-0.5 shrink-0 text-amber-500" />
      <p class="text-sm text-amber-700">{{ t('assessmentWizard.confirmSubmit') }}</p>
    </div>
  </div>
</template>

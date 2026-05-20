<script setup>
// Keep the student report body as a dedicated component so the page only
// handles selection logic while the rendered report stays consistent over time.
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import ProgressTrendList from '@/modules/preschool/shared/components/assessment/ProgressTrendList.vue'
import ReportSummaryCard from './ReportSummaryCard.vue'
import AttendanceSummaryCard from './AttendanceSummaryCard.vue'
import TeacherObservationPanel from './TeacherObservationPanel.vue'

const props = defineProps({
  report: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const { t } = useLanguage()

const summaryCards = computed(() => [
  {
    title: t('preschoolReportsShared.summary.finalized'),
    value: props.report?.summary?.finalizedAssessments ?? 0,
    caption: t('preschoolReportsShared.summary.finalizedCaption'),
  },
  {
    title: t('preschoolReportsShared.summary.average'),
    value: props.report?.summary?.averageScore ?? '-',
    caption: t('preschoolReportsShared.summary.averageCaption'),
  },
  {
    title: t('preschoolReportsShared.summary.observations'),
    value: props.report?.summary?.observationCount ?? 0,
    caption: t('preschoolReportsShared.summary.observationsCaption'),
  },
  {
    title: t('preschoolReportsShared.summary.latest'),
    value: props.report?.summary?.latestAssessmentDate || '-',
    caption: t('preschoolReportsShared.summary.latestCaption'),
  },
])
</script>

<template>
  <div v-if="loading" class="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-sm text-slate-500">
    {{ t('preschoolReportsShared.loading') }}
  </div>

  <div v-else-if="!report" class="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-sm text-slate-500">
    {{ t('preschoolReportsShared.emptyReport') }}
  </div>

  <div v-else class="space-y-4">
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <ReportSummaryCard
        v-for="card in summaryCards"
        :key="card.title"
        :title="card.title"
        :value="card.value"
        :caption="card.caption"
      />
    </div>

    <AttendanceSummaryCard :summary="report.attendanceSummary" />

    <ProgressTrendList :items="report.categorySummaries" />

    <TeacherObservationPanel :items="report.observations" />

    <section class="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-4 py-3">
        <h3 class="text-sm font-semibold text-slate-900">{{ t('preschoolReportsShared.assessmentsTitle') }}</h3>
      </div>
      <div v-if="!report.assessments?.length" class="px-4 py-8 text-sm text-slate-500">
        {{ t('preschoolReportsShared.emptyAssessments') }}
      </div>
      <ul v-else class="divide-y divide-slate-100">
        <li v-for="assessment in report.assessments" :key="assessment.id" class="px-4 py-3">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="space-y-1">
              <p class="text-sm font-semibold text-slate-900">
                {{ assessment.categoryName || assessment.category?.name || t('preschoolReportsShared.labels.categoryFallback') }}
              </p>
              <p class="text-xs text-slate-500">
                {{ assessment.periodLabel || '-' }} • {{ assessment.assessmentDate || '-' }}
              </p>
            </div>
            <div class="text-right text-sm text-slate-600">
              <p>{{ t('preschoolReportsShared.labels.score', { score: assessment.score ?? '-' }) }}</p>
              <p>{{ assessment.rating || '-' }}</p>
            </div>
          </div>
          <p v-if="assessment.observation || assessment.teacherComment" class="mt-2 text-sm text-slate-600">
            {{ assessment.observation || assessment.teacherComment }}
          </p>
        </li>
      </ul>
    </section>
  </div>
</template>

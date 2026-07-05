<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'
import OperationsMetricCard from '../components/OperationsMetricCard.vue'
import OperationsEmptyState from '../components/OperationsEmptyState.vue'
import OperationsTimelineItem from '../components/OperationsTimelineItem.vue'
import { resolveOperationsRoute } from '../composables/useOperationsActions'

const props = defineProps({
  assessments: {
    type: Object,
    default: () => ({}),
  },
})

const router = useRouter()
const { t } = useLanguage()

const summary = computed(() => props.assessments.summary || {})
const cards = computed(() => ([
  { title: t('preschoolOperationsPage.pendingAssessments'), value: summary.value.pending ?? summary.value.pendingReviews ?? '—', tone: 'amber', to: resolveOperationsRoute(router, 'preschool-assessment-dashboard') },
  { title: t('preschoolOperationsPage.upcomingAssessments'), value: summary.value.upcoming ?? summary.value.upcomingAssessments ?? '—', tone: 'blue' },
  { title: t('preschoolOperationsPage.overdueGrading'), value: summary.value.overdueGrading ?? summary.value.overdue ?? '—', tone: 'rose' },
  { title: t('preschoolOperationsPage.completed'), value: summary.value.completed ?? '—', tone: 'emerald' },
]))

const rows = computed(() => Array.isArray(props.assessments.rows) ? props.assessments.rows : Array.isArray(props.assessments.table) ? props.assessments.table : [])
</script>

<template>
  <section class="space-y-4">
    <div>
      <h2 class="text-lg font-semibold text-slate-900">{{ t('preschoolOperationsPage.assessmentOperations') }}</h2>
      <p class="text-sm text-slate-500">{{ t('preschoolOperationsPage.pendingAssessments') }}</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <OperationsMetricCard v-for="card in cards" :key="card.title" :title="card.title" :value="card.value" :tone="card.tone" :to="card.to" :details-label="card.to ? t('preschoolOperationsPage.viewDetails') : ''" />
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 class="text-sm font-semibold text-slate-900">{{ t('preschoolOperationsPage.viewDetails') }}</h3>
      <OperationsEmptyState v-if="rows.length === 0" :title="t('preschoolOperationsPage.noData')" />
      <div v-else class="mt-4 space-y-3">
        <OperationsTimelineItem v-for="item in rows" :key="item.id || item.title || item.createdAt" :item="item" />
      </div>
    </div>
  </section>
</template>

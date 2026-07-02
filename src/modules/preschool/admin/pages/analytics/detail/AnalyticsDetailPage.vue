<script setup>
import { computed, onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'
import AnalyticsFilterBar from '../components/AnalyticsFilterBar.vue'
import AnalyticsDetailHeaderSection from './AnalyticsDetailHeaderSection.vue'
import AnalyticsDetailSummarySection from './AnalyticsDetailSummarySection.vue'
import AnalyticsDetailTrendSection from './AnalyticsDetailTrendSection.vue'
import AnalyticsDetailBreakdownSection from './AnalyticsDetailBreakdownSection.vue'
import AnalyticsDetailDatasetSection from './AnalyticsDetailDatasetSection.vue'
import { useAnalyticsDetailActions } from './composables/useAnalyticsDetailActions'
import { useAnalyticsDetailData } from './composables/useAnalyticsDetailData'
import { useAnalyticsDetailFilters } from './composables/useAnalyticsDetailFilters'

defineOptions({
  name: 'PreschoolAnalyticsDetailPage',
})

const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
})

const { t } = useLanguage()
const { filters, resetFilters } = useAnalyticsDetailFilters()
const { goBack } = useAnalyticsDetailActions(props.config.backRouteName)
const {
  loading,
  errorMessage,
  detail,
  filterOptions,
  hasDetailData,
  loadDetail,
} = useAnalyticsDetailData(props.config.fetcher)

function resolvePath(source, path) {
  return String(path).split('.').reduce((carry, key) => carry?.[key], source)
}

function resolveFirstPath(source, paths = []) {
  for (const path of paths) {
    const value = resolvePath(source, path)
    if (Array.isArray(value) ? value.length : value !== undefined && value !== null && `${value}`.trim() !== '') {
      return value
    }
  }
  return null
}

function normalizeSeries(value) {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.series)) return value.series
  if (Array.isArray(value?.items)) return value.items
  if (Array.isArray(value?.rows)) return value.rows
  return []
}

const generatedAt = computed(() => detail.value.generatedAt ? `${t('preschoolAnalyticsPage.generatedAt')}: ${detail.value.generatedAt}` : '')

const metrics = computed(() => (props.config.summaryCards || []).map((metric) => ({
  label: t(metric.labelKey),
  value: resolveFirstPath(detail.value, metric.paths) ?? '—',
  caption: metric.captionKey ? t(metric.captionKey) : '',
  tone: metric.tone || 'slate',
  to: metric.to || null,
})))

const trendSeries = computed(() => {
  const trendConfig = props.config.trend
  if (!trendConfig) return []
  return normalizeSeries(resolveFirstPath(detail.value, trendConfig.sources || []))
})

const breakdownSections = computed(() => (props.config.breakdowns || []).map((section) => ({
  title: t(section.titleKey),
  subtitle: t(section.subtitleKey),
  items: normalizeSeries(resolveFirstPath(detail.value, section.sources || [])),
  emptyText: t(section.emptyKey || 'preschoolAnalyticsPage.noBreakdownData'),
})))

const datasetSections = computed(() => (props.config.datasets || []).map((section) => ({
  title: t(section.titleKey),
  subtitle: t(section.subtitleKey),
  columns: (section.columns || []).map((column) => ({
    key: column.key,
    label: t(column.labelKey),
  })),
  rows: normalizeSeries(resolveFirstPath(detail.value, section.sources || [])),
  emptyText: t(section.emptyKey || 'preschoolAnalyticsPage.noDatasetRows'),
})))

const detailLabels = computed(() => ({
  title: t(props.config.titleKey),
  subtitle: t(props.config.subtitleKey),
  backLabel: t('preschoolAnalyticsPage.backToAnalytics'),
  refreshLabel: t('preschoolAnalyticsPage.refresh'),
  filterTitle: t('preschoolAnalyticsPage.filters.title'),
  dateRange: t('preschoolAnalyticsPage.filters.dateRange'),
  academicYear: t('preschoolAnalyticsPage.filters.academicYear'),
  class: t('preschoolAnalyticsPage.filters.class'),
  teacher: t('preschoolAnalyticsPage.filters.teacher'),
  status: t('preschoolAnalyticsPage.filters.status'),
  apply: t('preschoolAnalyticsPage.filters.apply'),
  reset: t('preschoolAnalyticsPage.filters.reset'),
}))

async function refresh() {
  await loadDetail(filters.value)
}

function resetAndRefresh() {
  resetFilters()
  return loadDetail(filters.value)
}

onMounted(() => {
  loadDetail(filters.value)
})
</script>

<template>
  <MainLayout>
    <section class="space-y-6">
      <HeaderSection
        :title="detailLabels.title"
        :subtitle="detailLabels.subtitle"
      />

      <AnalyticsDetailHeaderSection
        :title="detailLabels.title"
        :subtitle="detailLabels.subtitle"
        :generated-at="generatedAt"
        :back-label="detailLabels.backLabel"
        :refresh-label="detailLabels.refreshLabel"
        :loading="loading"
        @back="goBack"
        @refresh="refresh"
      />

      <AnalyticsFilterBar
        v-model="filters"
        :options="filterOptions"
        :labels="{
          title: detailLabels.filterTitle,
          subtitle: '',
          dateRange: detailLabels.dateRange,
          academicYear: detailLabels.academicYear,
          class: detailLabels.class,
          teacher: detailLabels.teacher,
          status: detailLabels.status,
          apply: detailLabels.apply,
          reset: detailLabels.reset,
        }"
        :loading="loading"
        @apply="refresh"
        @reset="resetAndRefresh"
      />

      <div v-if="errorMessage" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ errorMessage }}
      </div>

      <AnalyticsDetailSummarySection
        :title="detailLabels.title"
        :subtitle="detailLabels.subtitle"
        :metrics="metrics"
        :empty-text="t('preschoolAnalyticsPage.noDetailData')"
      />

      <AnalyticsDetailTrendSection
        v-if="props.config.trend"
        :title="t(props.config.trend.titleKey)"
        :subtitle="t(props.config.trend.subtitleKey)"
        :chart-type="props.config.trend.chartType || 'line'"
        :series="trendSeries"
        :empty-text="t(props.config.trend.emptyKey || 'preschoolAnalyticsPage.noTrendData')"
      />

      <AnalyticsDetailBreakdownSection
        v-for="section in breakdownSections"
        :key="section.title"
        :title="section.title"
        :subtitle="section.subtitle"
        :items="section.items"
        :empty-text="section.emptyText"
      />

      <AnalyticsDetailDatasetSection
        v-for="section in datasetSections"
        :key="section.title + section.subtitle"
        :title="section.title"
        :subtitle="section.subtitle"
        :columns="section.columns"
        :rows="section.rows"
        :empty-text="t('preschoolAnalyticsPage.noDatasetRows')"
      />

      <div v-if="!loading && !hasDetailData" class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-sm text-slate-500">
        {{ t('preschoolAnalyticsPage.noDetailData') }}
      </div>
    </section>
  </MainLayout>
</template>

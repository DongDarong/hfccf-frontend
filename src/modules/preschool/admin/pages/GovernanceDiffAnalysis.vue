<script setup>
// Governance diff analysis stays admin-only and read-only so Preschool
// leadership can compare immutable states, review integrity warnings, and
// assess institutional risk without creating a new edit path on frozen data.
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Select from 'primevue/select'
import { useLanguage } from '@/composables/useLanguage'
import { usePreschoolAcademicLifecycle } from '@/modules/preschool/composables/usePreschoolAcademicLifecycle'
import { fetchPreschoolClasses, fetchPreschoolStudents } from '@/modules/preschool/services/preschoolApi'
import { fetchReportPeriods } from '@/modules/preschool/services/api/preschoolReportsApi'
import { fetchSnapshotArchive } from '@/modules/preschool/services/api/preschoolSnapshotArchiveApi'
import {
  compareGovernanceDiffContexts,
  fetchGovernanceDiffSummary,
  fetchIntegrityReview,
  submitIntegrityReviewAction,
} from '@/modules/preschool/services/api/preschoolGovernanceDiffApi'
import { fetchExportGovernanceHistory } from '@/modules/preschool/services/api/preschoolExportGovernanceApi'
import DiffSummaryCards from '@/modules/preschool/shared/components/governance-diff/DiffSummaryCards.vue'
import GovernanceDiffTable from '@/modules/preschool/shared/components/governance-diff/GovernanceDiffTable.vue'
import IntegrityWarningPanel from '@/modules/preschool/shared/components/governance-diff/IntegrityWarningPanel.vue'
import InstitutionalMismatchPanel from '@/modules/preschool/shared/components/governance-diff/InstitutionalMismatchPanel.vue'
import SnapshotDiffSelector from '@/modules/preschool/shared/components/governance-diff/SnapshotDiffSelector.vue'
import DiffReviewActions from '@/modules/preschool/shared/components/governance-diff/DiffReviewActions.vue'
import ChangeSeverityBadge from '@/modules/preschool/shared/components/governance-diff/ChangeSeverityBadge.vue'
import GovernanceAnalyticsCards from '@/modules/preschool/shared/components/governance/GovernanceAnalyticsCards.vue'
import InstitutionalReplayTimeline from '@/modules/preschool/shared/components/governance/InstitutionalReplayTimeline.vue'

defineOptions({
  name: 'PreschoolGovernanceDiffAnalysisPage',
})

const router = useRouter()
const { t } = useLanguage()
const { academicYears, terms, loadAcademicLifecycle } = usePreschoolAcademicLifecycle()

const summaryLoading = ref(false)
const comparisonLoading = ref(false)
const integrityLoading = ref(false)
const optionsLoading = ref(false)
const actionLoading = ref(false)
const summaryError = ref('')
const comparisonError = ref('')
const integrityError = ref('')
const actionError = ref('')

const summary = ref({
  overview: {},
  comparisonModes: [],
  severityBands: [],
  reviewActions: [],
  retentionReview: {},
  filters: {},
})

const comparison = ref({
  comparisonMode: '',
  reviewKey: '',
  left: {},
  right: {},
  summary: {},
  rows: [],
  warnings: [],
  mismatches: [],
  integrityWarnings: [],
  riskScore: 0,
  riskLevel: '',
  timeline: [],
  auditEvidence: {},
  reviewStatus: 'open',
  reviewTrail: [],
})

const integrityReview = ref({
  overview: {},
  warnings: [],
  mismatches: [],
  integrityWarnings: [],
  riskScore: 0,
  riskLevel: '',
  timeline: [],
  retentionReview: {},
  reviewKey: '',
  reviewStatus: 'open',
  reviewTrail: [],
})

const reviewNote = ref('')
const leftContext = ref({
  contextType: 'snapshot',
  snapshotId: '',
  exportRecordId: '',
  academicYearId: '',
  termId: '',
  reportPeriodId: '',
  classId: '',
  studentId: '',
  search: '',
})
const rightContext = ref({
  contextType: 'snapshot',
  snapshotId: '',
  exportRecordId: '',
  academicYearId: '',
  termId: '',
  reportPeriodId: '',
  classId: '',
  studentId: '',
  search: '',
})
const comparisonMode = ref('snapshot_vs_snapshot')
const snapshotOptions = ref([])
const exportOptions = ref([])
const classOptions = ref([])
const studentOptions = ref([])
const reportPeriodOptions = ref([])

const comparisonModeCatalog = computed(() => {
  const available = new Set((summary.value.comparisonModes || []).map((item) => item.value))
  const modes = [
    { value: 'snapshot_vs_snapshot', label: t('preschoolGovernanceDiffPage.modes.snapshotVsSnapshot') },
    { value: 'reconstruction_vs_reconstruction', label: t('preschoolGovernanceDiffPage.modes.reconstructionVsReconstruction') },
    { value: 'academic_year_vs_academic_year', label: t('preschoolGovernanceDiffPage.modes.academicYearVsAcademicYear') },
    { value: 'term_vs_term', label: t('preschoolGovernanceDiffPage.modes.termVsTerm') },
    { value: 'report_period_vs_report_period', label: t('preschoolGovernanceDiffPage.modes.reportPeriodVsReportPeriod') },
    { value: 'class_vs_class', label: t('preschoolGovernanceDiffPage.modes.classVsClass') },
    { value: 'student_progression', label: t('preschoolGovernanceDiffPage.modes.studentProgression') },
    { value: 'report_export_vs_report_export', label: t('preschoolGovernanceDiffPage.modes.reportExportVsReportExport') },
    { value: 'snapshot_version_vs_version', label: t('preschoolGovernanceDiffPage.modes.snapshotVersionVsVersion') },
  ]

  return modes.filter((mode) => available.size === 0 || available.has(mode.value))
})

const contextTypeOptions = computed(() => [
  { label: t('preschoolGovernanceDiffPage.contextTypes.snapshot'), value: 'snapshot' },
  { label: t('preschoolGovernanceDiffPage.contextTypes.export'), value: 'export' },
  { label: t('preschoolGovernanceDiffPage.contextTypes.reconstruction'), value: 'reconstruction' },
  { label: t('preschoolGovernanceDiffPage.contextTypes.academicYear'), value: 'academic_year' },
  { label: t('preschoolGovernanceDiffPage.contextTypes.term'), value: 'term' },
  { label: t('preschoolGovernanceDiffPage.contextTypes.reportPeriod'), value: 'report_period' },
  { label: t('preschoolGovernanceDiffPage.contextTypes.class'), value: 'class' },
  { label: t('preschoolGovernanceDiffPage.contextTypes.student'), value: 'student' },
  { label: t('preschoolGovernanceDiffPage.contextTypes.system'), value: 'system' },
])

const academicYearOptions = computed(() => [
  { label: t('preschoolGovernanceDiffPage.filters.allAcademicYears'), value: '' },
  ...academicYears.value.map((year) => ({
    label: year.label || year.code || `#${year.id}`,
    value: String(year.id || ''),
  })),
])

const termOptions = computed(() => [
  { label: t('preschoolGovernanceDiffPage.filters.allTerms'), value: '' },
  ...terms.value.map((term) => ({
    label: term.name || term.code || `#${term.id}`,
    value: String(term.id || ''),
  })),
])

const reportPeriodOptionsList = computed(() => [
  { label: t('preschoolGovernanceDiffPage.filters.allReportPeriods'), value: '' },
  ...reportPeriodOptions.value.map((period) => ({
    label: period.label,
    value: String(period.value),
  })),
])

const classOptionsList = computed(() => [
  { label: t('preschoolGovernanceDiffPage.filters.allClasses'), value: '' },
  ...classOptions.value.map((item) => ({
    label: item.label,
    value: String(item.value),
  })),
])

const studentOptionsList = computed(() => [
  { label: t('preschoolGovernanceDiffPage.filters.allStudents'), value: '' },
  ...studentOptions.value.map((item) => ({
    label: item.label,
    value: String(item.value),
  })),
])

const summaryCards = computed(() => [
  {
    title: t('preschoolGovernanceDiffPage.summary.totalSnapshots'),
    value: summary.value.overview?.totalSnapshots ?? 0,
    caption: t('preschoolGovernanceDiffPage.summary.totalSnapshotsCaption'),
  },
  {
    title: t('preschoolGovernanceDiffPage.summary.totalExports'),
    value: summary.value.overview?.totalExports ?? 0,
    caption: t('preschoolGovernanceDiffPage.summary.totalExportsCaption'),
  },
  {
    title: t('preschoolGovernanceDiffPage.summary.totalAudits'),
    value: summary.value.overview?.totalAudits ?? 0,
    caption: t('preschoolGovernanceDiffPage.summary.totalAuditsCaption'),
  },
  {
    title: t('preschoolGovernanceDiffPage.summary.blockedWrites'),
    value: summary.value.overview?.blockedWrites ?? 0,
    caption: t('preschoolGovernanceDiffPage.summary.blockedWritesCaption'),
  },
])

const diffCards = computed(() => {
  const metrics = comparison.value.summary || {}

  return [
    {
      title: t('preschoolGovernanceDiffPage.cards.totalFieldsChanged'),
      value: metrics.totalFieldsChanged ?? 0,
      caption: t('preschoolGovernanceDiffPage.cards.totalFieldsChangedCaption'),
    },
    {
      title: t('preschoolGovernanceDiffPage.cards.criticalChanges'),
      value: metrics.criticalChanges ?? 0,
      caption: t('preschoolGovernanceDiffPage.cards.criticalChangesCaption'),
    },
    {
      title: t('preschoolGovernanceDiffPage.cards.governanceSensitiveChanges'),
      value: metrics.governanceSensitiveChanges ?? 0,
      caption: t('preschoolGovernanceDiffPage.cards.governanceSensitiveChangesCaption'),
    },
    {
      title: t('preschoolGovernanceDiffPage.cards.integrityWarnings'),
      value: metrics.integrityWarnings ?? 0,
      caption: t('preschoolGovernanceDiffPage.cards.integrityWarningsCaption'),
    },
    {
      title: t('preschoolGovernanceDiffPage.cards.unchangedSections'),
      value: metrics.unchangedSections ?? 0,
      caption: t('preschoolGovernanceDiffPage.cards.unchangedSectionsCaption'),
    },
    {
      title: t('preschoolGovernanceDiffPage.cards.riskScore'),
      value: metrics.riskScore ?? comparison.value.riskScore ?? 0,
      caption: `${t('preschoolGovernanceDiffPage.cards.riskScoreCaption')} ${metrics.riskLevel || comparison.value.riskLevel || '-'}`,
    },
  ]
})

const overviewCards = computed(() => [
  {
    title: t('preschoolGovernanceDiffPage.integrityOverview.totalEvents'),
    value: integrityReview.value.overview?.totalEvents ?? 0,
    caption: t('preschoolGovernanceDiffPage.integrityOverview.totalEventsCaption'),
  },
  {
    title: t('preschoolGovernanceDiffPage.integrityOverview.blockedWrites'),
    value: integrityReview.value.overview?.blockedWrites ?? 0,
    caption: t('preschoolGovernanceDiffPage.integrityOverview.blockedWritesCaption'),
  },
  {
    title: t('preschoolGovernanceDiffPage.integrityOverview.overrideApprovals'),
    value: integrityReview.value.overview?.overrideApprovals ?? 0,
    caption: t('preschoolGovernanceDiffPage.integrityOverview.overrideApprovalsCaption'),
  },
  {
    title: t('preschoolGovernanceDiffPage.integrityOverview.snapshotCount'),
    value: integrityReview.value.overview?.snapshotCount ?? 0,
    caption: t('preschoolGovernanceDiffPage.integrityOverview.snapshotCountCaption'),
  },
])

const comparisonRows = computed(() => (comparison.value.rows || []).map((row) => ({
  ...row,
  severityLabel: severityLabel(row.severity),
})))

const mismatchItems = computed(() => (comparison.value.mismatches || []).map((row) => ({
  ...row,
  severityLabel: severityLabel(row.severity),
})))

const warningItems = computed(() => (integrityReview.value.warnings || []).map((row) => ({
  ...row,
  severityLabel: severityLabel(row.severity),
})))

const timelineItems = computed(() => {
  const timeline = [
    ...(integrityReview.value.timeline || []),
    ...(integrityReview.value.reviewTrail || []),
    ...(comparison.value.timeline || []),
    ...(comparison.value.reviewTrail || []),
  ]

  return timeline
    .filter((item) => item && item.recordedAt)
    .sort((left, right) => String(right.recordedAt).localeCompare(String(left.recordedAt)))
})

const activeReviewKey = computed(() => comparison.value.reviewKey || integrityReview.value.reviewKey || '')
const activeReviewStatus = computed(() => comparison.value.reviewStatus || integrityReview.value.reviewStatus || 'open')

function severityLabel(severity) {
  switch (String(severity || 'LOW').toUpperCase()) {
    case 'CRITICAL':
      return t('preschoolGovernanceDiffPage.severity.critical')
    case 'HIGH':
      return t('preschoolGovernanceDiffPage.severity.high')
    case 'MEDIUM':
      return t('preschoolGovernanceDiffPage.severity.medium')
    case 'MODERATE':
      return t('preschoolGovernanceDiffPage.severity.moderate')
    default:
      return t('preschoolGovernanceDiffPage.severity.low')
  }
}

function defaultSnapshotLabel(item) {
  const parts = [
    item.contextLabel || item.snapshotType || t('preschoolGovernanceDiffPage.selectors.snapshotFallback'),
    item.lifecycleState ? `(${item.lifecycleState})` : '',
    item.generatedAt ? `· ${item.generatedAt}` : '',
  ].filter(Boolean)

  return parts.join(' ')
}

function defaultExportLabel(item) {
  const parts = [
    item.contextLabel || item.exportType || t('preschoolGovernanceDiffPage.selectors.exportFallback'),
    item.exportFormat ? `(${item.exportFormat})` : '',
    item.exportedAt ? `· ${item.exportedAt}` : '',
  ].filter(Boolean)

  return parts.join(' ')
}

function buildSnapshotOptions(items) {
  return items.map((item) => ({
    label: defaultSnapshotLabel(item),
    value: item.id,
    raw: item,
  }))
}

function buildExportOptions(items) {
  return items.map((item) => ({
    label: defaultExportLabel(item),
    value: item.id,
    raw: item,
  }))
}

function buildContextPayload(context) {
  return {
    contextType: context.contextType || '',
    snapshotId: context.snapshotId || '',
    exportRecordId: context.exportRecordId || '',
    academicYearId: context.academicYearId || '',
    termId: context.termId || '',
    reportPeriodId: context.reportPeriodId || '',
    classId: context.classId || '',
    studentId: context.studentId || '',
    search: context.search || '',
  }
}

function updateReviewNote(value) {
  reviewNote.value = value
}

async function loadLookupOptions() {
  optionsLoading.value = true

  try {
    const [classesResponse, studentsResponse, reportPeriodsResponse, snapshotsResponse, exportsResponse] = await Promise.all([
      fetchPreschoolClasses({ page: 1, perPage: 100 }),
      fetchPreschoolStudents({ page: 1, perPage: 100 }),
      fetchReportPeriods(),
      fetchSnapshotArchive({ page: 1, perPage: 100 }),
      fetchExportGovernanceHistory({ page: 1, perPage: 100 }),
    ])

    classOptions.value = (classesResponse.items || []).map((item) => ({
      label: item.name || item.code || `#${item.id}`,
      value: item.id,
      raw: item,
    }))

    studentOptions.value = (studentsResponse.items || []).map((item) => ({
      label: `${item.fullName || item.name}${item.studentCode ? ` (${item.studentCode})` : ''}`,
      value: item.id,
      raw: item,
    }))

    reportPeriodOptions.value = (reportPeriodsResponse || []).map((period) => ({
      label: `${period.label || period.periodLabel || period.period_label}${period.status ? ` (${period.status})` : ''}`,
      value: period.id,
      raw: period,
    }))

    snapshotOptions.value = buildSnapshotOptions(snapshotsResponse.items || [])
    exportOptions.value = buildExportOptions(exportsResponse.items || [])

    bootstrapDefaultContexts()
  } catch {
    classOptions.value = []
    studentOptions.value = []
    reportPeriodOptions.value = []
    snapshotOptions.value = []
    exportOptions.value = []
  } finally {
    optionsLoading.value = false
  }
}

function bootstrapDefaultContexts() {
  if (snapshotOptions.value.length >= 2 && !leftContext.value.snapshotId && !rightContext.value.snapshotId) {
    comparisonMode.value = 'snapshot_vs_snapshot'
    leftContext.value = {
      ...leftContext.value,
      contextType: 'snapshot',
      snapshotId: String(snapshotOptions.value[0]?.value || ''),
    }
    rightContext.value = {
      ...rightContext.value,
      contextType: 'snapshot',
      snapshotId: String(snapshotOptions.value[1]?.value || snapshotOptions.value[0]?.value || ''),
    }
    return
  }

  if (exportOptions.value.length >= 2 && !leftContext.value.exportRecordId && !rightContext.value.exportRecordId) {
    comparisonMode.value = 'report_export_vs_report_export'
    leftContext.value = {
      ...leftContext.value,
      contextType: 'export',
      exportRecordId: String(exportOptions.value[0]?.value || ''),
    }
    rightContext.value = {
      ...rightContext.value,
      contextType: 'export',
      exportRecordId: String(exportOptions.value[1]?.value || exportOptions.value[0]?.value || ''),
    }
  }
}

async function loadSummary() {
  summaryLoading.value = true
  summaryError.value = ''

  try {
    summary.value = await fetchGovernanceDiffSummary()

    if (comparisonModeCatalog.value.length && !comparisonModeCatalog.value.some((mode) => mode.value === comparisonMode.value)) {
      comparisonMode.value = comparisonModeCatalog.value[0].value
    }
  } catch (error) {
    summary.value = {
      overview: {},
      comparisonModes: [],
      severityBands: [],
      reviewActions: [],
      retentionReview: {},
      filters: {},
    }
    summaryError.value = error?.message || t('preschoolGovernanceDiffPage.errors.summary')
  } finally {
    summaryLoading.value = false
  }
}

async function loadIntegrityReview() {
  integrityLoading.value = true
  integrityError.value = ''

  try {
    integrityReview.value = await fetchIntegrityReview()
  } catch (error) {
    integrityReview.value = {
      overview: {},
      warnings: [],
      mismatches: [],
      integrityWarnings: [],
      riskScore: 0,
      riskLevel: '',
      timeline: [],
      retentionReview: {},
      reviewKey: '',
      reviewStatus: 'open',
      reviewTrail: [],
    }
    integrityError.value = error?.message || t('preschoolGovernanceDiffPage.errors.integrity')
  } finally {
    integrityLoading.value = false
  }
}

async function runComparison() {
  comparisonLoading.value = true
  comparisonError.value = ''

  try {
    comparison.value = await compareGovernanceDiffContexts({
      comparisonMode: comparisonMode.value,
      leftContext: buildContextPayload(leftContext.value),
      rightContext: buildContextPayload(rightContext.value),
    })

    reviewNote.value = ''
  } catch (error) {
    comparison.value = {
      comparisonMode: comparisonMode.value,
      reviewKey: '',
      left: {},
      right: {},
      summary: {},
      rows: [],
      warnings: [],
      mismatches: [],
      integrityWarnings: [],
      riskScore: 0,
      riskLevel: '',
      timeline: [],
      auditEvidence: {},
      reviewStatus: 'open',
      reviewTrail: [],
    }
    comparisonError.value = error?.message || t('preschoolGovernanceDiffPage.errors.comparison')
  } finally {
    comparisonLoading.value = false
  }
}

async function refreshIntegrityReview() {
  await loadIntegrityReview()
}

async function refreshAll() {
  await Promise.all([
    loadSummary(),
    loadIntegrityReview(),
    runComparison(),
  ])
}

async function submitReviewAction(reviewAction) {
  if (!activeReviewKey.value) {
    return
  }

  actionLoading.value = true
  actionError.value = ''

  try {
    await submitIntegrityReviewAction(activeReviewKey.value, {
      reviewAction,
      reviewNote: reviewNote.value,
      severity: comparison.value.riskLevel || integrityReview.value.riskLevel || '',
    })

    await Promise.all([
      loadIntegrityReview(),
      runComparison(),
    ])
  } catch (error) {
    actionError.value = error?.message || t('preschoolGovernanceDiffPage.errors.reviewAction')
  } finally {
    actionLoading.value = false
  }
}

function goToSnapshotArchive() {
  router.push({ name: 'dashboard-preschool-admin-report-snapshots' })
}

function goToExportGovernance() {
  router.push({ name: 'dashboard-preschool-admin-export-governance' })
}

function goToGovernanceReview() {
  router.push({ name: 'dashboard-preschool-admin-governance-review' })
}

function goToReconstruction() {
  router.push({ name: 'dashboard-preschool-admin-reconstruction' })
}

function goToGovernanceCases() {
  router.push({ name: 'dashboard-preschool-admin-governance-cases' })
}

onMounted(async () => {
  await loadAcademicLifecycle()
  await loadLookupOptions()
  await loadSummary()
  await loadIntegrityReview()
  await runComparison()
})
</script>

<template>
  <MainLayout>
    <section class="space-y-4">
      <HeaderSection
        :title="t('preschoolGovernanceDiffPage.title')"
        :subtitle="t('preschoolGovernanceDiffPage.subtitle')"
      />

      <div class="flex flex-wrap gap-2">
        <Button type="button" variant="ghost" size="md" rounded="xl" @click="goToSnapshotArchive">
          {{ t('preschoolGovernanceDiffPage.actions.openSnapshotArchive') }}
        </Button>
        <Button type="button" variant="ghost" size="md" rounded="xl" @click="goToExportGovernance">
          {{ t('preschoolGovernanceDiffPage.actions.openExportGovernance') }}
        </Button>
        <Button type="button" variant="ghost" size="md" rounded="xl" @click="goToGovernanceReview">
          {{ t('preschoolGovernanceDiffPage.actions.openGovernanceReview') }}
        </Button>
        <Button type="button" variant="ghost" size="md" rounded="xl" @click="goToReconstruction">
          {{ t('preschoolGovernanceDiffPage.actions.openReconstruction') }}
        </Button>
        <Button type="button" variant="ghost" size="md" rounded="xl" @click="goToGovernanceCases">
          {{ t('preschoolGovernanceCasesPage.actions.openGovernanceCases') }}
        </Button>
        <Button type="button" variant="secondary" size="md" rounded="xl" :loading="summaryLoading || integrityLoading || comparisonLoading || optionsLoading" @click="refreshAll">
          {{ t('preschoolGovernanceDiffPage.actions.refresh') }}
        </Button>
      </div>

      <div v-if="summaryError" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ summaryError }}
      </div>
      <div v-if="comparisonError" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ comparisonError }}
      </div>
      <div v-if="integrityError" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ integrityError }}
      </div>
      <div v-if="actionError" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ actionError }}
      </div>

      <GovernanceAnalyticsCards :cards="summaryCards" />

      <GovernanceAnalyticsCards :cards="overviewCards" />

      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="space-y-1">
            <h3 class="text-sm font-semibold text-slate-900">{{ t('preschoolGovernanceDiffPage.comparisonMode.title') }}</h3>
            <p class="text-sm text-slate-500">{{ t('preschoolGovernanceDiffPage.comparisonMode.subtitle') }}</p>
          </div>
          <div class="w-full max-w-md">
            <Select
              v-model="comparisonMode"
              :options="comparisonModeCatalog"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <div class="grid gap-4 xl:grid-cols-2">
        <SnapshotDiffSelector
          v-model="leftContext"
          :title="t('preschoolGovernanceDiffPage.selectors.sourceTitle')"
          :subtitle="t('preschoolGovernanceDiffPage.selectors.sourceSubtitle')"
          :labels="{
            contextType: t('preschoolGovernanceDiffPage.selectors.contextType'),
            snapshot: t('preschoolGovernanceDiffPage.selectors.snapshot'),
            export: t('preschoolGovernanceDiffPage.selectors.export'),
            academicYear: t('preschoolGovernanceDiffPage.selectors.academicYear'),
            term: t('preschoolGovernanceDiffPage.selectors.term'),
            reportPeriod: t('preschoolGovernanceDiffPage.selectors.reportPeriod'),
            class: t('preschoolGovernanceDiffPage.selectors.class'),
            student: t('preschoolGovernanceDiffPage.selectors.student'),
            search: t('preschoolGovernanceDiffPage.selectors.search'),
            searchPlaceholder: t('preschoolGovernanceDiffPage.selectors.searchPlaceholder'),
          }"
          :context-type-options="contextTypeOptions"
          :snapshot-options="snapshotOptions"
          :export-options="exportOptions"
          :academic-year-options="academicYearOptions"
          :term-options="termOptions"
          :report-period-options="reportPeriodOptionsList"
          :class-options="classOptionsList"
          :student-options="studentOptionsList"
        />

        <SnapshotDiffSelector
          v-model="rightContext"
          :title="t('preschoolGovernanceDiffPage.selectors.targetTitle')"
          :subtitle="t('preschoolGovernanceDiffPage.selectors.targetSubtitle')"
          :labels="{
            contextType: t('preschoolGovernanceDiffPage.selectors.contextType'),
            snapshot: t('preschoolGovernanceDiffPage.selectors.snapshot'),
            export: t('preschoolGovernanceDiffPage.selectors.export'),
            academicYear: t('preschoolGovernanceDiffPage.selectors.academicYear'),
            term: t('preschoolGovernanceDiffPage.selectors.term'),
            reportPeriod: t('preschoolGovernanceDiffPage.selectors.reportPeriod'),
            class: t('preschoolGovernanceDiffPage.selectors.class'),
            student: t('preschoolGovernanceDiffPage.selectors.student'),
            search: t('preschoolGovernanceDiffPage.selectors.search'),
            searchPlaceholder: t('preschoolGovernanceDiffPage.selectors.searchPlaceholder'),
          }"
          :context-type-options="contextTypeOptions"
          :snapshot-options="snapshotOptions"
          :export-options="exportOptions"
          :academic-year-options="academicYearOptions"
          :term-options="termOptions"
          :report-period-options="reportPeriodOptionsList"
          :class-options="classOptionsList"
          :student-options="studentOptionsList"
        />
      </div>

      <div class="flex flex-wrap items-center justify-end gap-2">
        <Button
          type="button"
          variant="primary"
          size="md"
          rounded="xl"
          :loading="comparisonLoading || summaryLoading || optionsLoading"
          @click="runComparison"
        >
          {{ t('preschoolGovernanceDiffPage.actions.runComparison') }}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="md"
          rounded="xl"
          :loading="integrityLoading"
          @click="refreshIntegrityReview"
        >
          {{ t('preschoolGovernanceDiffPage.actions.refreshIntegrity') }}
        </Button>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="space-y-1">
            <h3 class="text-sm font-semibold text-slate-900">{{ t('preschoolGovernanceDiffPage.review.summaryTitle') }}</h3>
            <p class="text-sm text-slate-500">{{ t('preschoolGovernanceDiffPage.review.summarySubtitle') }}</p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <ChangeSeverityBadge :severity="comparison.riskLevel || integrityReview.riskLevel || 'LOW'" :label="severityLabel(comparison.riskLevel || integrityReview.riskLevel || 'LOW')" />
            <span class="text-sm text-slate-500">
              {{ t('preschoolGovernanceDiffPage.review.reviewKey') }}: {{ activeReviewKey || '-' }}
            </span>
            <span class="text-sm text-slate-500">
              {{ t('preschoolGovernanceDiffPage.review.reviewStatus') }}: {{ activeReviewStatus || 'open' }}
            </span>
          </div>
        </div>
      </div>

      <DiffSummaryCards :cards="diffCards" />

      <div class="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <GovernanceDiffTable
          :title="t('preschoolGovernanceDiffPage.table.title')"
          :subtitle="t('preschoolGovernanceDiffPage.table.subtitle')"
          :rows="comparisonRows"
          :loading="comparisonLoading"
          :empty-label="t('preschoolGovernanceDiffPage.table.empty')"
          :columns="{
            section: t('preschoolGovernanceDiffPage.table.columns.section'),
            entity: t('preschoolGovernanceDiffPage.table.columns.entity'),
            field: t('preschoolGovernanceDiffPage.table.columns.field'),
            previousValue: t('preschoolGovernanceDiffPage.table.columns.previousValue'),
            currentValue: t('preschoolGovernanceDiffPage.table.columns.currentValue'),
            differenceType: t('preschoolGovernanceDiffPage.table.columns.differenceType'),
            severity: t('preschoolGovernanceDiffPage.table.columns.severity'),
            governanceImpact: t('preschoolGovernanceDiffPage.table.columns.governanceImpact'),
            reviewStatus: t('preschoolGovernanceDiffPage.table.columns.reviewStatus'),
          }"
        />

        <div class="space-y-4">
          <IntegrityWarningPanel
            :title="t('preschoolGovernanceDiffPage.integrity.title')"
            :subtitle="t('preschoolGovernanceDiffPage.integrity.subtitle')"
            :warnings="warningItems"
            :empty-label="t('preschoolGovernanceDiffPage.integrity.empty')"
            :source-label="t('preschoolGovernanceDiffPage.integrity.sourceLabel')"
            :status-label="t('preschoolGovernanceDiffPage.integrity.statusLabel')"
            :detected-label="t('preschoolGovernanceDiffPage.integrity.detectedLabel')"
          />

          <InstitutionalMismatchPanel
            :title="t('preschoolGovernanceDiffPage.mismatches.title')"
            :subtitle="t('preschoolGovernanceDiffPage.mismatches.subtitle')"
            :mismatches="mismatchItems"
            :empty-label="t('preschoolGovernanceDiffPage.mismatches.empty')"
            :source-label="t('preschoolGovernanceDiffPage.mismatches.sourceLabel')"
            :status-label="t('preschoolGovernanceDiffPage.mismatches.statusLabel')"
            :detected-label="t('preschoolGovernanceDiffPage.mismatches.detectedLabel')"
          />
        </div>
      </div>

      <DiffReviewActions
        :review-key="activeReviewKey"
        :review-status="activeReviewStatus"
        :review-note="reviewNote"
        :loading="actionLoading"
        :disabled="!activeReviewKey"
        :labels="{
          title: t('preschoolGovernanceDiffPage.review.actionsTitle'),
          subtitle: t('preschoolGovernanceDiffPage.review.actionsSubtitle'),
          reviewKey: t('preschoolGovernanceDiffPage.review.reviewKey'),
          status: t('preschoolGovernanceDiffPage.review.reviewStatus'),
          note: t('preschoolGovernanceDiffPage.review.note'),
          notePlaceholder: t('preschoolGovernanceDiffPage.review.notePlaceholder'),
          markReviewed: t('preschoolGovernanceDiffPage.review.markReviewed'),
          flag: t('preschoolGovernanceDiffPage.review.flag'),
          escalate: t('preschoolGovernanceDiffPage.review.escalate'),
          resolve: t('preschoolGovernanceDiffPage.review.resolve'),
        }"
        @update:reviewNote="updateReviewNote"
        @mark-reviewed="submitReviewAction('marked_reviewed')"
        @flag="submitReviewAction('flagged')"
        @escalate="submitReviewAction('escalated')"
        @resolve="submitReviewAction('resolved')"
      />

      <InstitutionalReplayTimeline
        :title="t('preschoolGovernanceDiffPage.timeline.title')"
        :subtitle="t('preschoolGovernanceDiffPage.timeline.subtitle')"
        :items="timelineItems"
        :loading="comparisonLoading || integrityLoading"
        :empty-label="t('preschoolGovernanceDiffPage.timeline.empty')"
      />
    </section>
  </MainLayout>
</template>

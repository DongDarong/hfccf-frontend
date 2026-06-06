<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'
import FormManagementHero from '@/modules/preschool/admin/components/form-management/FormManagementHero.vue'
import FormManagementSection from '@/modules/preschool/admin/components/form-management/FormManagementSection.vue'
import { assessmentSubmissionApi } from '@/modules/assessment/services/assessmentSubmissionApi'
import { assessmentReportApi } from '@/modules/assessment/services/assessmentReportApi'
import { groupFormManagementActionCards } from './formManagementData'

defineOptions({
  name: 'PreschoolAdminFormManagementReviewPage',
})

const { t, te } = useLanguage()
const router = useRouter()
const { review } = groupFormManagementActionCards()
const submissions = ref([])
const reportStats = ref({})
const riskDistribution = ref([])
const loading = ref(true)
const exporting = ref(false)
const loadWarning = ref(false)

function safeText(key, fallback) {
  return te(key) ? t(key) : fallback
}

const heroSummary = computed(() =>
  safeText(
    'preschoolScaffold.formManagement.pages.review.description',
    'Review submission and reporting outputs.',
  ),
)

const statusCounts = computed(() =>
  submissions.value.reduce(
    (counts, submission) => {
      counts.total += 1
      if (Object.hasOwn(counts, submission.status)) counts[submission.status] += 1
      return counts
    },
    {
      total: 0,
      draft: 0,
      submitted: 0,
      under_review: 0,
      approved: 0,
      rejected: 0,
    },
  ),
)

const pendingSubmissions = computed(() =>
  submissions.value
    .filter((submission) => ['submitted', 'under_review'].includes(submission.status))
    .sort((a, b) => dateValue(a.submitted_at ?? a.updated_at) - dateValue(b.submitted_at ?? b.updated_at))
    .slice(0, 6),
)

const recentSubmissions = computed(() =>
  [...submissions.value]
    .sort((a, b) => dateValue(b.submitted_at ?? b.updated_at) - dateValue(a.submitted_at ?? a.updated_at))
    .slice(0, 6),
)

const summaryCards = computed(() => [
  {
    key: 'total',
    icon: 'pi pi-inbox',
    value: reportStats.value.total_assessments ?? reportStats.value.totalAssessments ?? statusCounts.value.total,
    label: safeText('formsModuleDashboard.reviewWorkspace.totalSubmissions', 'Total submissions'),
  },
  {
    key: 'pending',
    icon: 'pi pi-clock',
    value: reportStats.value.pending_review
      ?? reportStats.value.pendingReview
      ?? statusCounts.value.submitted + statusCounts.value.under_review,
    label: safeText('formsModuleDashboard.reviewWorkspace.pendingReview', 'Pending review'),
  },
  {
    key: 'approved',
    icon: 'pi pi-check-circle',
    value: statusCounts.value.approved,
    label: safeText('formsModuleDashboard.reviewWorkspace.approved', 'Approved'),
  },
  {
    key: 'completion',
    icon: 'pi pi-chart-line',
    value: formatPercentage(reportStats.value.completion_rate ?? reportStats.value.completionRate),
    label: safeText('formsModuleDashboard.reviewWorkspace.completionRate', 'Completion rate'),
  },
])

const quickLinks = computed(() => [
  {
    label: safeText('breadcrumb.forms', 'Forms'),
    action: () => router.push({ name: 'dashboard-preschool-admin-forms' }),
    icon: 'pi pi-arrow-left',
  },
  {
    label: safeText('formsModuleDashboard.reviewWorkspace.startAssessment', 'Start assessment'),
    action: () => router.push({ name: 'assessment-wizard' }),
    icon: 'pi pi-plus',
  },
  {
    label: safeText('formsModuleDashboard.reviewWorkspace.openReports', 'Open reports'),
    action: () => router.push({ name: 'assessment-reports' }),
    icon: 'pi pi-chart-pie',
  },
])

function dateValue(value) {
  const time = new Date(value ?? 0).getTime()
  return Number.isNaN(time) ? 0 : time
}

function formatDate(value) {
  if (!value) return safeText('common.notAvailable', 'Not available')
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
}

function formatPercentage(value) {
  if (value === null || value === undefined || value === '') return '—'
  const normalized = String(value).replace('%', '')
  return `${normalized}%`
}

function statusText(status) {
  return safeText(`submissions.statuses.${status}`, status?.replaceAll('_', ' ') ?? '—')
}

function studentName(submission) {
  return submission.student?.full_name
    ?? submission.student?.name
    ?? safeText('formsModuleDashboard.reviewWorkspace.unknownStudent', 'Unknown student')
}

function formName(submission) {
  return submission.form_template?.name
    ?? submission.form?.name
    ?? safeText('formsModuleDashboard.reviewWorkspace.unknownForm', 'Unknown form')
}

function openSubmission(submission) {
  router.push({ name: 'assessment-submission-detail', params: { id: submission.id } })
}

async function exportReport() {
  exporting.value = true
  try {
    const response = await assessmentReportApi.export({ format: 'xlsx', module: 'preschool' })
    const blob = response.data instanceof Blob
      ? response.data
      : new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `preschool-assessments-${new Date().toISOString().slice(0, 10)}.xlsx`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch {
    loadWarning.value = true
  } finally {
    exporting.value = false
  }
}

async function loadWorkspace() {
  loading.value = true
  loadWarning.value = false

  const [submissionsResult, dashboardResult, riskResult] = await Promise.allSettled([
    assessmentSubmissionApi.list({ module: 'preschool', per_page: 100 }),
    assessmentReportApi.dashboard({ module: 'preschool' }),
    assessmentReportApi.riskDistribution({ module: 'preschool' }),
  ])

  if (submissionsResult.status === 'fulfilled') {
    submissions.value = submissionsResult.value.data?.data ?? []
  } else {
    loadWarning.value = true
  }

  if (dashboardResult.status === 'fulfilled') {
    const dashboard = dashboardResult.value.data?.data ?? {}
    reportStats.value = dashboard.stats ?? {}
    if (!submissions.value.length && Array.isArray(dashboard.recent_submissions)) {
      submissions.value = dashboard.recent_submissions
    }
  } else {
    loadWarning.value = true
  }

  if (riskResult.status === 'fulfilled') {
    riskDistribution.value = riskResult.value.data?.data ?? []
  } else {
    loadWarning.value = true
  }

  loading.value = false
}

onMounted(loadWorkspace)
</script>

<template>
  <MainLayout>
    <section class="preschool-form-management-page">
      <HeaderSection
        :title="safeText('preschoolScaffold.formManagement.pages.review.title', 'Review Forms')"
        :subtitle="safeText('preschoolScaffold.formManagement.pages.review.subtitle', 'Review submission and reporting outputs.')"
      />

      <FormManagementHero
        :eyebrow="safeText('preschoolScaffold.formManagement.pages.review.eyebrow', 'Form review')"
        :title="safeText('preschoolScaffold.formManagement.pages.review.title', 'Review Forms')"
        :description="safeText('preschoolScaffold.formManagement.pages.review.description', 'Review submission and reporting outputs.')"
        :meta-label="safeText('preschoolScaffold.formManagement.hero.metricForms', 'Workspace')"
        :meta-note="heroSummary"
        :quick-links="quickLinks"
      />

      <FormManagementSection
        :eyebrow="safeText('preschoolScaffold.formManagement.pages.review.eyebrow', 'Form review')"
        :title="safeText('preschoolScaffold.formManagement.pages.review.title', 'Review Forms')"
        :badge="safeText('preschoolScaffold.formManagement.hero.openLabel', 'Open')"
        grid-class="preschool-form-management-section__grid--three"
        card-class="preschool-form-management-card__surface--review"
        :cards="review"
      />

      <div v-if="loadWarning" class="review-workspace__warning" role="status">
        <i class="pi pi-exclamation-circle" aria-hidden="true" />
        {{ safeText('formsModuleDashboard.reviewWorkspace.partialData', 'Some review data could not be loaded. Available actions remain usable.') }}
      </div>

      <section class="review-workspace__summary" :aria-busy="loading">
        <article v-for="item in summaryCards" :key="item.key" class="review-workspace__metric">
          <span class="review-workspace__metric-icon"><i :class="item.icon" aria-hidden="true" /></span>
          <div>
            <strong>{{ loading ? '—' : item.value }}</strong>
            <span>{{ item.label }}</span>
          </div>
        </article>
      </section>

      <div class="review-workspace__main">
        <section class="review-workspace__panel">
          <header class="review-workspace__panel-header">
            <div>
              <span>{{ safeText('formsModuleDashboard.reviewWorkspace.priority', 'Priority queue') }}</span>
              <h3>{{ safeText('formsModuleDashboard.reviewWorkspace.pendingQueue', 'Pending review') }}</h3>
            </div>
            <button type="button" @click="router.push({ name: 'assessment-submission-list' })">
              {{ safeText('formsModuleDashboard.reviewWorkspace.viewAll', 'View all') }}
              <i class="pi pi-arrow-right" aria-hidden="true" />
            </button>
          </header>

          <div v-if="loading" class="review-workspace__empty">
            {{ safeText('common.loading', 'Loading...') }}
          </div>
          <div v-else-if="!pendingSubmissions.length" class="review-workspace__empty review-workspace__empty--success">
            <i class="pi pi-check-circle" aria-hidden="true" />
            {{ safeText('formsModuleDashboard.reviewWorkspace.queueClear', 'The review queue is clear.') }}
          </div>
          <button
            v-for="submission in pendingSubmissions"
            v-else
            :key="submission.id"
            type="button"
            class="review-workspace__submission"
            @click="openSubmission(submission)"
          >
            <span class="review-workspace__avatar">{{ studentName(submission).slice(0, 1).toUpperCase() }}</span>
            <span class="review-workspace__submission-copy">
              <strong>{{ studentName(submission) }}</strong>
              <small>{{ formName(submission) }} · {{ formatDate(submission.submitted_at ?? submission.updated_at) }}</small>
            </span>
            <span :class="['review-workspace__status', `review-workspace__status--${submission.status}`]">
              {{ statusText(submission.status) }}
            </span>
            <i class="pi pi-chevron-right review-workspace__arrow" aria-hidden="true" />
          </button>
        </section>

        <section class="review-workspace__panel">
          <header class="review-workspace__panel-header">
            <div>
              <span>{{ safeText('formsModuleDashboard.reviewWorkspace.riskOverview', 'Risk overview') }}</span>
              <h3>{{ safeText('assessmentReports.riskDistribution', 'Risk distribution') }}</h3>
            </div>
            <button type="button" @click="router.push({ name: 'assessment-reports' })">
              {{ safeText('formsModuleDashboard.reviewWorkspace.details', 'Details') }}
              <i class="pi pi-arrow-right" aria-hidden="true" />
            </button>
          </header>

          <div v-if="loading" class="review-workspace__empty">
            {{ safeText('common.loading', 'Loading...') }}
          </div>
          <div v-else-if="!riskDistribution.length" class="review-workspace__empty">
            {{ safeText('assessmentReports.noData', 'No report data is available.') }}
          </div>
          <div v-else class="review-workspace__risk-list">
            <div v-for="risk in riskDistribution" :key="risk.level ?? risk.level_name">
              <span class="review-workspace__risk-dot" :style="{ backgroundColor: risk.color || '#94a3b8' }" />
              <span>{{ risk.level_name ?? risk.level }}</span>
              <strong>{{ risk.count ?? 0 }}</strong>
            </div>
          </div>

          <div class="review-workspace__report-actions">
            <button type="button" @click="router.push({ name: 'assessment-reports' })">
              <i class="pi pi-chart-bar" aria-hidden="true" />
              <span>
                <strong>{{ safeText('formsModuleDashboard.reviewWorkspace.analytics', 'Reports & analytics') }}</strong>
                <small>{{ safeText('formsModuleDashboard.reviewWorkspace.analyticsHelp', 'Explore scores, trends, and risk indicators.') }}</small>
              </span>
            </button>
            <button type="button" :disabled="exporting" @click="exportReport">
              <i :class="exporting ? 'pi pi-spin pi-spinner' : 'pi pi-download'" aria-hidden="true" />
              <span>
                <strong>{{ safeText('formsModuleDashboard.reviewWorkspace.export', 'Export assessment data') }}</strong>
                <small>{{ safeText('formsModuleDashboard.reviewWorkspace.exportHelp', 'Download the current assessment report as Excel.') }}</small>
              </span>
            </button>
          </div>
        </section>
      </div>

      <section class="review-workspace__panel">
        <header class="review-workspace__panel-header">
          <div>
            <span>{{ safeText('formsModuleDashboard.reviewWorkspace.activity', 'Assessment activity') }}</span>
            <h3>{{ safeText('formsModuleDashboard.reviewWorkspace.recentSubmissions', 'Recent submissions') }}</h3>
          </div>
          <button class="review-workspace__start" type="button" @click="router.push({ name: 'assessment-wizard' })">
            <i class="pi pi-plus" aria-hidden="true" />
            {{ safeText('formsModuleDashboard.reviewWorkspace.startAssessment', 'Start assessment') }}
          </button>
        </header>

        <div v-if="loading" class="review-workspace__empty">
          {{ safeText('common.loading', 'Loading...') }}
        </div>
        <div v-else-if="!recentSubmissions.length" class="review-workspace__empty">
          {{ safeText('formsModuleDashboard.reviewWorkspace.noSubmissions', 'No assessment submissions were found.') }}
        </div>
        <button
          v-for="submission in recentSubmissions"
          v-else
          :key="submission.id"
          type="button"
          class="review-workspace__submission"
          @click="openSubmission(submission)"
        >
          <span class="review-workspace__avatar">{{ studentName(submission).slice(0, 1).toUpperCase() }}</span>
          <span class="review-workspace__submission-copy">
            <strong>{{ studentName(submission) }}</strong>
            <small>{{ formName(submission) }} · {{ formatDate(submission.submitted_at ?? submission.updated_at) }}</small>
          </span>
          <span v-if="submission.total_score !== null && submission.total_score !== undefined" class="review-workspace__score">
            {{ submission.total_score }}
          </span>
          <span :class="['review-workspace__status', `review-workspace__status--${submission.status}`]">
            {{ statusText(submission.status) }}
          </span>
          <i class="pi pi-arrow-right review-workspace__arrow" aria-hidden="true" />
        </button>
      </section>
    </section>
  </MainLayout>
</template>

<style scoped>
.preschool-form-management-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-workspace__warning {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1rem;
  border: 1px solid #fde68a;
  border-radius: 0.9rem;
  background: #fffbeb;
  color: #92400e;
  font-size: 0.85rem;
}

.review-workspace__summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
}

.review-workspace__metric {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 1.15rem;
  background: #fff;
  box-shadow: 0 16px 36px -30px rgba(15, 23, 42, 0.4);
}

.review-workspace__metric-icon {
  display: inline-flex;
  width: 2.6rem;
  height: 2.6rem;
  align-items: center;
  justify-content: center;
  flex: none;
  border-radius: 0.8rem;
  background: #f5f3ff;
  color: #7c3aed;
}

.review-workspace__metric div {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.review-workspace__metric strong {
  color: #0f172a;
  font-size: 1.35rem;
  line-height: 1;
}

.review-workspace__metric span:last-child {
  margin-top: 0.3rem;
  color: #64748b;
  font-size: 0.78rem;
}

.review-workspace__main {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(19rem, 0.8fr);
  gap: 1rem;
}

.review-workspace__panel {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 1.25rem;
  background: #fff;
  box-shadow: 0 20px 45px -36px rgba(15, 23, 42, 0.4);
}

.review-workspace__panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.1rem;
  border-bottom: 1px solid #f1f5f9;
}

.review-workspace__panel-header > div > span {
  color: #7c3aed;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.review-workspace__panel-header h3 {
  margin: 0.15rem 0 0;
  color: #0f172a;
  font-size: 1rem;
}

.review-workspace__panel-header button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: 0;
  background: transparent;
  color: #7c3aed;
  cursor: pointer;
  font-size: 0.76rem;
  font-weight: 800;
}

.review-workspace__submission {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.1rem;
  border: 0;
  border-bottom: 1px solid #f1f5f9;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease;
}

.review-workspace__submission:hover,
.review-workspace__submission:focus-visible {
  background: #fafafa;
}

.review-workspace__avatar {
  display: inline-flex;
  width: 2.2rem;
  height: 2.2rem;
  align-items: center;
  justify-content: center;
  flex: none;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #ede9fe, #ddd6fe);
  color: #6d28d9;
  font-size: 0.8rem;
  font-weight: 900;
}

.review-workspace__submission-copy {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 0.15rem;
}

.review-workspace__submission-copy strong {
  overflow: hidden;
  color: #1e293b;
  font-size: 0.84rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.review-workspace__submission-copy small {
  overflow: hidden;
  color: #94a3b8;
  font-size: 0.72rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.review-workspace__status {
  padding: 0.28rem 0.55rem;
  border-radius: 999px;
  background: #f1f5f9;
  color: #475569;
  font-size: 0.64rem;
  font-weight: 800;
  text-transform: capitalize;
  white-space: nowrap;
}

.review-workspace__status--submitted {
  background: #dbeafe;
  color: #1d4ed8;
}

.review-workspace__status--under_review {
  background: #fef3c7;
  color: #92400e;
}

.review-workspace__status--approved {
  background: #dcfce7;
  color: #15803d;
}

.review-workspace__status--rejected {
  background: #fee2e2;
  color: #b91c1c;
}

.review-workspace__score {
  color: #475569;
  font-size: 0.78rem;
  font-weight: 900;
}

.review-workspace__arrow {
  color: #cbd5e1;
  font-size: 0.7rem;
}

.review-workspace__empty {
  display: flex;
  min-height: 8rem;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem 1.1rem;
  color: #94a3b8;
  font-size: 0.84rem;
  text-align: center;
}

.review-workspace__empty--success {
  color: #15803d;
}

.review-workspace__risk-list {
  display: grid;
  gap: 0.6rem;
  padding: 1rem 1.1rem;
}

.review-workspace__risk-list > div {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.65rem;
  color: #475569;
  font-size: 0.8rem;
}

.review-workspace__risk-dot {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 999px;
}

.review-workspace__risk-list strong {
  color: #0f172a;
}

.review-workspace__report-actions {
  display: grid;
  gap: 0.65rem;
  padding: 0 1rem 1rem;
}

.review-workspace__report-actions button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem;
  border: 1px solid #ede9fe;
  border-radius: 0.9rem;
  background: #fafafa;
  color: #7c3aed;
  cursor: pointer;
  text-align: left;
}

.review-workspace__report-actions button:disabled {
  cursor: wait;
  opacity: 0.65;
}

.review-workspace__report-actions span {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.review-workspace__report-actions strong {
  color: #1e293b;
  font-size: 0.78rem;
}

.review-workspace__report-actions small {
  color: #94a3b8;
  font-size: 0.7rem;
}

.review-workspace__start {
  padding: 0.55rem 0.75rem;
  border: 1px solid #ddd6fe !important;
  border-radius: 0.75rem;
  background: #f5f3ff !important;
}

@media (max-width: 1050px) {
  .review-workspace__summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .review-workspace__main {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .review-workspace__summary {
    grid-template-columns: 1fr;
  }

  .review-workspace__status,
  .review-workspace__score {
    display: none;
  }
}
</style>

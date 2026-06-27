<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import PreschoolDashboardSummary from '@/modules/preschool/admin/components/dashboard/PreschoolDashboardSummary.vue'
import PreschoolDashboardSpotlight from '@/modules/preschool/admin/components/dashboard/PreschoolDashboardSpotlight.vue'
import PreschoolDashboardActionList from '@/modules/preschool/admin/components/dashboard/PreschoolDashboardActionList.vue'
import PreschoolDashboardActivity from '@/modules/preschool/admin/components/dashboard/PreschoolDashboardActivity.vue'
import { useLanguage } from '@/composables/useLanguage'
import { fetchPreschoolDashboard } from '@/modules/preschool/services/preschoolApi'
import { fetchReportsDashboard } from '@/modules/preschool/services/api/preschoolReportingApi'

defineOptions({
  name: 'PreschoolDashboardPage',
})

const { t } = useLanguage()
const router = useRouter()

const defaultDashboard = {
  summary: {
    students: 0,
    classes: 0,
    teachers: 0,
    attendanceToday: 0,
    pendingPayments: 0,
    overduePayments: 0,
    pendingEnrollments: 0,
    outstandingPayments: 0,
    healthAlerts: 0,
    guardianIssues: 0,
    attendanceExceptions: 0,
  },
  recentAttendance: [],
  upcomingClasses: [],
  paymentSummary: {
    paid: 0,
    pending: 0,
    overdue: 0,
    cancelled: 0,
  },
}

const defaultReportsDashboard = {
  kpis: {},
  modules: {},
  cards: [],
  risk: {},
}

const dashboard = ref(defaultDashboard)
const reportsDashboard = ref(defaultReportsDashboard)
const loading = ref(false)
const errorMessage = ref('')

function formatCount(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

function formatPercent(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '0%'
  return `${number}%`
}

function formatMoney(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '0'
  return number.toLocaleString()
}

function joinParts(parts) {
  return parts.filter(Boolean).join(' \u2022 ')
}

function getFirstValue(source, paths = []) {
  for (const path of paths) {
    const value = path.split('.').reduce((carry, key) => carry?.[key], source)
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return value
    }
  }

  return ''
}

function buildAction(labelKey, detail, value, tone = 'info') {
  if (!value) return null

  return {
    label: t(labelKey),
    detail,
    value: formatCount(value),
    tone,
  }
}

async function loadDashboard() {
  loading.value = true
  errorMessage.value = ''

  const [dashboardResult, reportsResult] = await Promise.allSettled([
    fetchPreschoolDashboard(),
    fetchReportsDashboard(),
  ])

  const errors = []

  if (dashboardResult.status === 'fulfilled') {
    dashboard.value = {
      ...defaultDashboard,
      ...dashboardResult.value,
      summary: {
        ...defaultDashboard.summary,
        ...dashboardResult.value?.summary,
      },
      paymentSummary: {
        ...defaultDashboard.paymentSummary,
        ...dashboardResult.value?.paymentSummary,
      },
    }
  } else {
    errors.push(dashboardResult.reason?.message || t('preschoolDashboardPage.errors.coreLoadFailed'))
  }

  if (reportsResult.status === 'fulfilled') {
    reportsDashboard.value = reportsResult.value?.dashboard || defaultReportsDashboard
  } else {
    errors.push(reportsResult.reason?.message || t('preschoolDashboardPage.errors.reportsLoadFailed'))
  }

  errorMessage.value = errors.join(' \u2022 ')
  loading.value = false
}

const academicContext = computed(() => {
  const year = getFirstValue(dashboard.value, [
    'academicYear.currentAcademicYear',
    'academicYearLabel',
    'currentAcademicYear',
    'summary.academicYear',
    'academicYear',
  ])
  const term = getFirstValue(dashboard.value, [
    'term.currentTerm',
    'termLabel',
    'currentTerm',
    'summary.term',
    'term',
  ])

  return joinParts([year, term])
})

const spotlightTitle = computed(() => {
  const nextClass = dashboard.value.upcomingClasses?.[0]
  if (!nextClass) {
    return t('preschoolDashboardPage.spotlight.noUpcomingClasses')
  }

  return `${nextClass.name || t('preschoolDashboardPage.spotlight.nextClassFallback')} ${t('preschoolDashboardPage.spotlight.nextClassSuffix')}`
})

const spotlightText = computed(() => {
  const nextClass = dashboard.value.upcomingClasses?.[0]
  if (!nextClass) {
    return t('preschoolDashboardPage.spotlight.fallback')
  }

  const teacher = nextClass.teacherDisplayName || nextClass.teacherName || t('preschoolDashboardPage.spotlight.assignedTeacher')
  const students = formatCount(nextClass.studentsCount ?? nextClass.studentCount ?? 0)
  const time = nextClass.scheduledTime || nextClass.schedule || ''

  return joinParts([
    t('preschoolDashboardPage.spotlight.nextClassText', { teacher, students }),
    time,
  ])
})

const summaryCards = computed(() => [
  {
    title: t('preschoolDashboardPage.summary.activeStudents.title'),
    value: formatCount(dashboard.value.summary.students),
    label: t('preschoolDashboardPage.summary.activeStudents.label'),
    status: 'success',
  },
  {
    title: t('preschoolDashboardPage.summary.attendanceToday.title'),
    value: formatCount(dashboard.value.summary.attendanceToday),
    label: t('preschoolDashboardPage.summary.attendanceToday.label'),
    status: 'info',
  },
  {
    title: t('preschoolDashboardPage.summary.healthAlerts.title'),
    value: formatCount(reportsDashboard.value.kpis?.openHealthAlerts ?? dashboard.value.summary.healthAlerts),
    label: t('preschoolDashboardPage.summary.healthAlerts.label'),
    status: 'error',
  },
  {
    title: t('preschoolDashboardPage.summary.pendingEnrollments.title'),
    value: formatCount(dashboard.value.summary.pendingEnrollments ?? reportsDashboard.value.kpis?.newEnrollments),
    label: t('preschoolDashboardPage.summary.pendingEnrollments.label'),
    status: 'warning',
  },
  {
    title: t('preschoolDashboardPage.summary.outstandingPayments.title'),
    value: formatCount(dashboard.value.summary.outstandingPayments ?? reportsDashboard.value.kpis?.overdueInvoices),
    label: t('preschoolDashboardPage.summary.outstandingPayments.label'),
    status: 'info',
  },
])

const priorityItems = computed(() => [
  buildAction(
    'preschoolDashboardPage.priority.health',
    t('preschoolDashboardPage.priority.healthDetail'),
    reportsDashboard.value.kpis?.openHealthAlerts ?? dashboard.value.summary.healthAlerts,
    'error',
  ),
  buildAction(
    'preschoolDashboardPage.priority.enrollment',
    t('preschoolDashboardPage.priority.enrollmentDetail'),
    dashboard.value.summary.pendingEnrollments ?? reportsDashboard.value.kpis?.newEnrollments,
    'warning',
  ),
  buildAction(
    'preschoolDashboardPage.priority.guardians',
    t('preschoolDashboardPage.priority.guardiansDetail'),
    reportsDashboard.value.kpis?.openGuardianIssues ?? dashboard.value.summary.guardianIssues,
    'warning',
  ),
  buildAction(
    'preschoolDashboardPage.priority.payments',
    t('preschoolDashboardPage.priority.paymentsDetail'),
    dashboard.value.summary.overduePayments ?? reportsDashboard.value.kpis?.overdueInvoices,
    'error',
  ),
  buildAction(
    'preschoolDashboardPage.priority.attendance',
    t('preschoolDashboardPage.priority.attendanceDetail'),
    dashboard.value.summary.attendanceExceptions ?? reportsDashboard.value.kpis?.lateRate,
    'info',
  ),
].filter(Boolean))

const insightCards = computed(() => [
  {
    title: t('preschoolDashboardPage.insights.attendance.title'),
    value: formatPercent(reportsDashboard.value.kpis?.attendanceRate),
    label: t('preschoolDashboardPage.insights.attendance.label'),
    note: t('preschoolDashboardPage.insights.attendance.note', {
      absence: formatPercent(reportsDashboard.value.kpis?.absenceRate),
      late: formatPercent(reportsDashboard.value.kpis?.lateRate),
    }),
    metrics: [
      { label: t('preschoolDashboardPage.insights.attendance.metrics.present'), value: formatCount(dashboard.value.summary.attendanceToday) },
      { label: t('preschoolDashboardPage.insights.attendance.metrics.absent'), value: formatPercent(reportsDashboard.value.kpis?.absenceRate) },
    ],
  },
  {
    title: t('preschoolDashboardPage.insights.enrollment.title'),
    value: formatCount(reportsDashboard.value.kpis?.newEnrollments),
    label: t('preschoolDashboardPage.insights.enrollment.label'),
    note: t('preschoolDashboardPage.insights.enrollment.note', {
      active: formatCount(reportsDashboard.value.kpis?.activeStudents ?? dashboard.value.summary.students),
    }),
    metrics: [
      { label: t('preschoolDashboardPage.insights.enrollment.metrics.active'), value: formatCount(reportsDashboard.value.kpis?.activeStudents ?? dashboard.value.summary.students) },
      { label: t('preschoolDashboardPage.insights.enrollment.metrics.students'), value: formatCount(reportsDashboard.value.kpis?.totalStudents ?? dashboard.value.summary.students) },
    ],
  },
  {
    title: t('preschoolDashboardPage.insights.assessment.title'),
    value: formatPercent(reportsDashboard.value.kpis?.assessmentCompletion),
    label: t('preschoolDashboardPage.insights.assessment.label'),
    note: t('preschoolDashboardPage.insights.assessment.note', {
      risk: formatCount(reportsDashboard.value.kpis?.atRiskStudents),
    }),
    metrics: [
      { label: t('preschoolDashboardPage.insights.assessment.metrics.risk'), value: formatCount(reportsDashboard.value.kpis?.atRiskStudents) },
      { label: t('preschoolDashboardPage.insights.assessment.metrics.score'), value: reportsDashboard.value.kpis?.averageScore ?? 0 },
    ],
  },
  {
    title: t('preschoolDashboardPage.insights.payments.title'),
    value: formatMoney(reportsDashboard.value.kpis?.revenue),
    label: t('preschoolDashboardPage.insights.payments.label'),
    note: t('preschoolDashboardPage.insights.payments.note', {
      overdue: formatCount(reportsDashboard.value.kpis?.overdueInvoices ?? dashboard.value.summary.overduePayments),
    }),
    metrics: [
      { label: t('preschoolDashboardPage.insights.payments.metrics.outstanding'), value: formatCount(reportsDashboard.value.kpis?.outstandingBalances) },
      { label: t('preschoolDashboardPage.insights.payments.metrics.overdue'), value: formatCount(reportsDashboard.value.kpis?.overdueInvoices ?? dashboard.value.summary.overduePayments) },
    ],
  },
])

const recentActivityItems = computed(() =>
  (dashboard.value.recentAttendance || []).slice(0, 5).map((item) => ({
    title: item.studentName || t('preschoolDashboardPage.operations.recentActivityFallback'),
    text: joinParts([
      item.className || t('preschoolDashboardPage.operations.classFallback'),
      item.attendanceDate || '-',
      item.status || '-',
    ]),
  })),
)

const upcomingClasses = computed(() =>
  (dashboard.value.upcomingClasses || []).slice(0, 4).map((item) => ({
    title: item.name || t('preschoolDashboardPage.operations.classFallback'),
    text: joinParts([
      item.teacherDisplayName || item.teacherName || t('preschoolDashboardPage.spotlight.assignedTeacher'),
      item.scheduledTime || item.schedule || '-',
    ]),
    students: formatCount(item.studentsCount ?? item.studentCount ?? 0),
  })),
)

const classroomSummaryItems = computed(() => [
  { label: t('preschoolDashboardPage.operations.classroomSummary.students'), value: formatCount(dashboard.value.summary.students) },
  { label: t('preschoolDashboardPage.operations.classroomSummary.classes'), value: formatCount(dashboard.value.summary.classes) },
  { label: t('preschoolDashboardPage.operations.classroomSummary.teachers'), value: formatCount(dashboard.value.summary.teachers) },
  { label: t('preschoolDashboardPage.operations.classroomSummary.attendance'), value: formatCount(dashboard.value.summary.attendanceToday) },
])

const shortcutActions = computed(() => [
  { label: t('preschoolDashboardPage.operations.shortcuts.schedule'), click: () => router.push({ name: 'dashboard-preschool-admin-schedules' }) },
  { label: t('preschoolDashboardPage.operations.shortcuts.reports'), click: () => router.push({ name: 'dashboard-preschool-admin-reports' }) },
  { label: t('preschoolDashboardPage.operations.shortcuts.settings'), click: () => router.push({ name: 'dashboard-preschool-admin-settings' }) },
  { label: t('preschoolDashboardPage.operations.shortcuts.enrollments'), click: () => router.push({ name: 'dashboard-preschool-admin-enrollments' }) },
])

function goToScheduleManagement() {
  router.push({ name: 'dashboard-preschool-admin-schedules' })
}

function goToReportsCenter() {
  router.push({ name: 'dashboard-preschool-admin-reports' })
}

onMounted(() => {
  loadDashboard()
})
</script>

<template>
  <MainLayout>
    <section class="preschool-dashboard-page">
      <HeaderSection
        :title="t('preschoolDashboardPage.title')"
        :subtitle="t('preschoolDashboardPage.subtitle')"
      >
        <template #actions>
          <div class="preschool-dashboard-page__actions">
            <span v-if="academicContext" class="preschool-dashboard-page__context-pill">
              {{ academicContext }}
            </span>
            <Button
              type="button"
              variant="secondary"
              size="md"
              rounded="xl"
              @click="goToReportsCenter"
            >
              {{ t('preschoolDashboardPage.header.openReports') }}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              rounded="xl"
              @click="goToScheduleManagement"
            >
              {{ t('preschoolDashboardPage.header.scheduleManagement') }}
            </Button>
          </div>
        </template>
      </HeaderSection>

      <div
        v-if="errorMessage"
        class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
      >
        {{ errorMessage }}
      </div>

      <div
        v-if="loading"
        class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500"
        data-testid="dashboard-loading"
      >
        {{ t('preschoolDashboardPage.loading') }}
      </div>

      <PreschoolDashboardSpotlight
        :title="spotlightTitle"
        :text="spotlightText"
      />

      <PreschoolDashboardSummary :cards="summaryCards" />

      <section class="preschool-dashboard-page__section">
        <div class="preschool-dashboard-page__section-header">
          <div>
            <h2 class="preschool-dashboard-page__section-title">{{ t('preschoolDashboardPage.priority.title') }}</h2>
            <p class="preschool-dashboard-page__section-subtitle">{{ t('preschoolDashboardPage.priority.subtitle') }}</p>
          </div>
        </div>
        <PreschoolDashboardActionList
          :title="t('preschoolDashboardPage.priority.cardTitle')"
          :items="priorityItems"
          :empty-text="t('preschoolDashboardPage.priority.empty')"
        />
      </section>

      <section class="preschool-dashboard-page__section">
        <div class="preschool-dashboard-page__section-header">
          <div>
            <h2 class="preschool-dashboard-page__section-title">{{ t('preschoolDashboardPage.insights.title') }}</h2>
            <p class="preschool-dashboard-page__section-subtitle">{{ t('preschoolDashboardPage.insights.subtitle') }}</p>
          </div>
        </div>
        <div class="preschool-dashboard-page__insight-grid">
          <article
            v-for="card in insightCards"
            :key="card.title"
            class="preschool-dashboard-page__insight-card"
          >
            <p class="preschool-dashboard-page__insight-title">{{ card.title }}</p>
            <p class="preschool-dashboard-page__insight-value">{{ card.value }}</p>
            <p class="preschool-dashboard-page__insight-label">{{ card.label }}</p>
            <p class="preschool-dashboard-page__insight-note">{{ card.note }}</p>
            <ul class="preschool-dashboard-page__insight-list">
              <li v-for="metric in card.metrics" :key="metric.label">
                <span>{{ metric.label }}</span>
                <strong>{{ metric.value }}</strong>
              </li>
            </ul>
          </article>
        </div>
      </section>

      <section class="preschool-dashboard-page__section">
        <div class="preschool-dashboard-page__section-header">
          <div>
            <h2 class="preschool-dashboard-page__section-title">{{ t('preschoolDashboardPage.operations.title') }}</h2>
            <p class="preschool-dashboard-page__section-subtitle">{{ t('preschoolDashboardPage.operations.subtitle') }}</p>
          </div>
        </div>
        <div class="preschool-dashboard-page__operations-grid">
          <PreschoolDashboardActivity
            :items="recentActivityItems"
            :empty-text="t('preschoolDashboardPage.operations.recentActivityEmpty')"
          />

          <article class="preschool-dashboard-page__panel">
            <div class="preschool-dashboard-page__panel-header">
              <h3 class="preschool-dashboard-page__panel-title">{{ t('preschoolDashboardPage.operations.upcomingSchedules') }}</h3>
              <span class="preschool-dashboard-page__panel-count">{{ upcomingClasses.length }}</span>
            </div>
            <div v-if="upcomingClasses.length === 0" class="preschool-dashboard-page__empty">
              {{ t('preschoolDashboardPage.operations.upcomingEmpty') }}
            </div>
            <div v-else class="preschool-dashboard-page__class-list">
              <article
                v-for="item in upcomingClasses"
                :key="item.title"
                class="preschool-dashboard-page__class-item"
              >
                <div>
                  <p class="preschool-dashboard-page__class-title">{{ item.title }}</p>
                  <p class="preschool-dashboard-page__class-text">{{ item.text }}</p>
                </div>
                <span class="preschool-dashboard-page__class-count">{{ item.students }}</span>
              </article>
            </div>
          </article>

          <article class="preschool-dashboard-page__panel">
            <div class="preschool-dashboard-page__panel-header">
              <h3 class="preschool-dashboard-page__panel-title">{{ t('preschoolDashboardPage.operations.classroomSummary.title') }}</h3>
            </div>
            <div class="preschool-dashboard-page__summary-grid">
              <article
                v-for="item in classroomSummaryItems"
                :key="item.label"
                class="preschool-dashboard-page__summary-item"
              >
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
              </article>
            </div>
          </article>

          <article class="preschool-dashboard-page__panel">
            <div class="preschool-dashboard-page__panel-header">
              <h3 class="preschool-dashboard-page__panel-title">{{ t('preschoolDashboardPage.operations.shortcuts.title') }}</h3>
            </div>
            <div class="preschool-dashboard-page__shortcut-grid">
              <Button
                v-for="shortcut in shortcutActions"
                :key="shortcut.label"
                type="button"
                variant="secondary"
                size="md"
                rounded="xl"
                @click="shortcut.click"
              >
                {{ shortcut.label }}
              </Button>
            </div>
          </article>
        </div>
      </section>
    </section>
  </MainLayout>
</template>

<style scoped>
.preschool-dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.preschool-dashboard-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: flex-end;
}

.preschool-dashboard-page__context-pill {
  display: inline-flex;
  align-items: center;
  min-height: 2.5rem;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  border: 1px solid #dbe6f2;
  background: #f8fbff;
  color: #0f172a;
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap;
}

.preschool-dashboard-page__section {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.preschool-dashboard-page__section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
}

.preschool-dashboard-page__section-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
}

.preschool-dashboard-page__section-subtitle {
  margin: 0.35rem 0 0;
  color: #64748b;
  font-size: 0.92rem;
  line-height: 1.55;
}

.preschool-dashboard-page__insight-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.preschool-dashboard-page__insight-card,
.preschool-dashboard-page__panel {
  border: 1px solid #dbe6f2;
  border-radius: 1.35rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 18px 45px -36px rgba(15, 23, 42, 0.45);
}

.preschool-dashboard-page__insight-card {
  padding: 1.25rem;
}

.preschool-dashboard-page__insight-title {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
}

.preschool-dashboard-page__insight-value {
  margin: 0.6rem 0 0;
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
}

.preschool-dashboard-page__insight-label {
  margin: 0.35rem 0 0;
  font-size: 0.92rem;
  font-weight: 700;
  color: #2563eb;
}

.preschool-dashboard-page__insight-note {
  margin: 0.5rem 0 0;
  color: #475569;
  line-height: 1.55;
  font-size: 0.92rem;
}

.preschool-dashboard-page__insight-list {
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.65rem;
}

.preschool-dashboard-page__insight-list li,
.preschool-dashboard-page__summary-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.preschool-dashboard-page__insight-list span,
.preschool-dashboard-page__summary-item span {
  color: #64748b;
}

.preschool-dashboard-page__insight-list strong,
.preschool-dashboard-page__summary-item strong {
  color: #0f172a;
  font-size: 0.95rem;
}

.preschool-dashboard-page__operations-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.preschool-dashboard-page__panel {
  padding: 1.25rem;
}

.preschool-dashboard-page__panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.preschool-dashboard-page__panel-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
}

.preschool-dashboard-page__panel-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  min-height: 2rem;
  padding: 0 0.6rem;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.85rem;
  font-weight: 800;
}

.preschool-dashboard-page__empty {
  color: #64748b;
  font-size: 0.92rem;
  padding: 1.25rem 0;
}

.preschool-dashboard-page__class-list {
  display: grid;
  gap: 0.8rem;
}

.preschool-dashboard-page__class-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 0.9rem;
  border-radius: 1rem;
  background: #fff;
  border: 1px solid #e2e8f0;
}

.preschool-dashboard-page__class-title {
  margin: 0;
  font-size: 0.94rem;
  font-weight: 700;
  color: #0f172a;
}

.preschool-dashboard-page__class-text {
  margin: 0.25rem 0 0;
  font-size: 0.86rem;
  color: #64748b;
  line-height: 1.45;
}

.preschool-dashboard-page__class-count {
  flex-shrink: 0;
  border-radius: 999px;
  background: #f8fafc;
  color: #2563eb;
  font-size: 0.85rem;
  font-weight: 800;
  padding: 0.4rem 0.7rem;
}

.preschool-dashboard-page__summary-grid {
  display: grid;
  gap: 0.75rem;
}

.preschool-dashboard-page__shortcut-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

@media (max-width: 1100px) {
  .preschool-dashboard-page__insight-grid,
  .preschool-dashboard-page__operations-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .preschool-dashboard-page__actions {
    justify-content: flex-start;
  }

  .preschool-dashboard-page__insight-grid,
  .preschool-dashboard-page__operations-grid,
  .preschool-dashboard-page__shortcut-grid {
    grid-template-columns: 1fr;
  }

  .preschool-dashboard-page__section-header {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .preschool-dashboard-page__insight-value {
    font-size: 1.7rem;
  }

  .preschool-dashboard-page__class-item {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

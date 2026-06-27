<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import StatusBadge from '@/components/badges/StatusBadge.vue'
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
  trend: [],
  performance: [],
  completion: [],
}

const dashboard = ref(defaultDashboard)
const reportsDashboard = ref(defaultReportsDashboard)
const loading = ref(false)
const errorMessage = ref('')

function formatCount(value) {
  const number = Number(value)
  return Number.isFinite(number) ? Math.round(number).toLocaleString() : '0'
}

function formatPercent(value) {
  const number = Number(value)
  return Number.isFinite(number) ? `${Math.round(number)}%` : '0%'
}

function formatCurrency(value) {
  const number = Number(value)
  return Number.isFinite(number) ? `$${Math.round(number).toLocaleString()}` : '$0'
}

function joinParts(parts) {
  return parts.filter(Boolean).join(' • ')
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

function getFirstNumber(source, paths = []) {
  for (const path of paths) {
    const value = path.split('.').reduce((carry, key) => carry?.[key], source)
    const number = Number(value)
    if (Number.isFinite(number)) {
      return number
    }
  }

  return null
}

function getSeriesDelta(series = []) {
  if (!Array.isArray(series) || series.length < 2) {
    return null
  }

  const values = series
    .map(item => Number(item?.value))
    .filter(value => Number.isFinite(value))

  if (values.length < 2) {
    return null
  }

  const last = values[values.length - 1]
  const previous = values[values.length - 2]

  if (last === previous) {
    return 0
  }

  return last - previous
}

function buildTrendState({ delta, series, valueFormatter, positiveKey, negativeKey, neutralText }) {
  const resolvedDelta = Number.isFinite(Number(delta)) ? Number(delta) : getSeriesDelta(series)

  if (Number.isFinite(resolvedDelta) && resolvedDelta !== 0) {
    const direction = resolvedDelta > 0 ? 'up' : 'down'
    const key = direction === 'up' ? positiveKey : negativeKey

    return {
      direction,
      label: t(key, { value: valueFormatter(Math.abs(resolvedDelta)) }),
    }
  }

  return {
    direction: 'neutral',
    label: neutralText,
  }
}

function buildSparkline(series = []) {
  const values = (Array.isArray(series) ? series : [])
    .map(item => Number(item?.value))
    .filter(value => Number.isFinite(value))
    .slice(-5)

  if (values.length === 0) {
    return []
  }

  const max = Math.max(...values, 1)

  return values.map((value, index) => ({
    id: `${index}-${value}`,
    height: Math.max(18, Math.round((value / max) * 100)),
  }))
}

function resolvePriorityTone(priority) {
  const normalized = String(priority || '').trim().toLowerCase()
  if (normalized === 'critical') return 'error'
  if (normalized === 'high') return 'warning'
  if (normalized === 'medium') return 'info'
  return 'info'
}

function translateExecutiveStatus(status) {
  const normalized = String(status || 'neutral').trim().toLowerCase()
  const key = normalized === 'warning' ? 'watch' : normalized

  return t(`preschoolDashboardPage.executiveHealth.statuses.${key}`)
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
    reportsDashboard.value = {
      ...defaultReportsDashboard,
      ...(reportsResult.value?.dashboard || defaultReportsDashboard),
    }
  } else {
    errors.push(reportsResult.reason?.message || t('preschoolDashboardPage.errors.reportsLoadFailed'))
  }

  errorMessage.value = errors.join(' • ')
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

const summaryCards = computed(() => {
  const activeStudents = getFirstNumber(dashboard.value, [
    'summary.students',
    'summary.activeStudents',
    'summary.active_student_count',
    'summary.totalStudents',
    'summary.total_students',
    'kpis.activeStudents',
    'kpis.totalStudents',
  ]) ?? 0
  const attendanceToday = getFirstNumber(dashboard.value, [
    'summary.attendanceToday',
    'summary.attendance_today',
    'kpis.attendanceToday',
    'kpis.presentStudents',
    'kpis.present_students',
  ]) ?? 0
  const openHealthAlerts = getFirstNumber({
    ...dashboard.value,
    kpis: reportsDashboard.value.kpis,
  }, [
    'kpis.openHealthAlerts',
    'summary.healthAlerts',
    'summary.openHealthAlerts',
  ]) ?? 0
  const pendingEnrollments = getFirstNumber({
    ...dashboard.value,
    kpis: reportsDashboard.value.kpis,
  }, [
    'summary.pendingEnrollments',
    'kpis.newEnrollments',
  ]) ?? 0
  const outstandingPayments = getFirstNumber({
    ...dashboard.value,
    kpis: reportsDashboard.value.kpis,
  }, [
    'kpis.outstandingBalances',
    'summary.outstandingPayments',
  ]) ?? 0

  const activeStudentsTrend = buildTrendState({
    delta: getFirstNumber(dashboard.value, [
      'summary.studentsDelta',
      'summary.activeStudentsDelta',
      'kpis.activeStudentsDelta',
      'kpis.studentsDelta',
    ]),
    series: reportsDashboard.value.performance,
    valueFormatter: formatCount,
    positiveKey: 'preschoolDashboardPage.summary.trend.upCount',
    negativeKey: 'preschoolDashboardPage.summary.trend.downCount',
    neutralText: t('preschoolDashboardPage.summary.noComparisonYet'),
  })

  const attendanceTrend = buildTrendState({
    delta: getFirstNumber(dashboard.value, [
      'summary.attendanceTodayDelta',
      'summary.attendanceDelta',
      'kpis.attendanceRateDelta',
      'kpis.attendanceDelta',
    ]),
    series: reportsDashboard.value.trend,
    valueFormatter: formatPercent,
    positiveKey: 'preschoolDashboardPage.summary.trend.upPercent',
    negativeKey: 'preschoolDashboardPage.summary.trend.downPercent',
    neutralText: t('preschoolDashboardPage.summary.noComparisonYet'),
  })

  return [
    {
      title: t('preschoolDashboardPage.summary.activeStudents.title'),
      value: formatCount(activeStudents),
      label: t('preschoolDashboardPage.summary.activeStudents.label'),
      comparison: activeStudentsTrend.label,
      trend: activeStudentsTrend,
      status: 'success',
    },
    {
      title: t('preschoolDashboardPage.summary.attendanceToday.title'),
      value: formatCount(attendanceToday),
      label: t('preschoolDashboardPage.summary.attendanceToday.label'),
      comparison: attendanceTrend.label,
      trend: attendanceTrend,
      status: 'info',
    },
    {
      title: t('preschoolDashboardPage.summary.healthAlerts.title'),
      value: formatCount(openHealthAlerts),
      label: t('preschoolDashboardPage.summary.healthAlerts.label'),
      comparison: openHealthAlerts > 0
        ? t('preschoolDashboardPage.summary.healthAlertsComparison', { count: formatCount(openHealthAlerts) })
        : t('preschoolDashboardPage.summary.noComparisonYet'),
      trend: {
        direction: 'neutral',
        label: t('preschoolDashboardPage.summary.noComparisonYet'),
      },
      status: 'error',
    },
    {
      title: t('preschoolDashboardPage.summary.pendingEnrollments.title'),
      value: formatCount(pendingEnrollments),
      label: t('preschoolDashboardPage.summary.pendingEnrollments.label'),
      comparison: pendingEnrollments > 0
        ? t('preschoolDashboardPage.summary.pendingEnrollmentsComparison', { count: formatCount(pendingEnrollments) })
        : t('preschoolDashboardPage.summary.noComparisonYet'),
      trend: {
        direction: 'neutral',
        label: t('preschoolDashboardPage.summary.noComparisonYet'),
      },
      status: 'warning',
    },
    {
      title: t('preschoolDashboardPage.summary.outstandingPayments.title'),
      value: formatCurrency(outstandingPayments),
      label: t('preschoolDashboardPage.summary.outstandingPayments.label'),
      comparison: outstandingPayments > 0
        ? t('preschoolDashboardPage.summary.outstandingPaymentsComparison', { amount: formatCurrency(outstandingPayments) })
        : t('preschoolDashboardPage.summary.noComparisonYet'),
      trend: {
        direction: 'neutral',
        label: t('preschoolDashboardPage.summary.noComparisonYet'),
      },
      status: 'info',
    },
  ]
})

const systemHealthItems = computed(() => {
  const openHealthAlerts = getFirstNumber({
    ...dashboard.value,
    kpis: reportsDashboard.value.kpis,
  }, ['kpis.openHealthAlerts', 'summary.healthAlerts']) ?? null
  const criticalHealthAlerts = getFirstNumber({
    ...dashboard.value,
    kpis: reportsDashboard.value.kpis,
  }, ['kpis.criticalHealthAlerts']) ?? 0
  const pendingEnrollments = getFirstNumber({
    ...dashboard.value,
    kpis: reportsDashboard.value.kpis,
  }, ['summary.pendingEnrollments', 'kpis.newEnrollments']) ?? null
  const attendanceExceptions = getFirstNumber({
    ...dashboard.value,
    kpis: reportsDashboard.value.kpis,
  }, ['summary.attendanceExceptions', 'kpis.lateRate']) ?? null
  const attendanceRate = getFirstNumber({
    ...dashboard.value,
    kpis: reportsDashboard.value.kpis,
  }, ['kpis.attendanceRate']) ?? null
  const outstandingPayments = getFirstNumber({
    ...dashboard.value,
    kpis: reportsDashboard.value.kpis,
  }, ['kpis.outstandingBalances', 'summary.outstandingPayments', 'kpis.overdueInvoices']) ?? null
  const assessmentCompletion = getFirstNumber({
    ...dashboard.value,
    kpis: reportsDashboard.value.kpis,
  }, ['kpis.assessmentCompletion']) ?? null
  const atRiskStudents = getFirstNumber({
    ...dashboard.value,
    kpis: reportsDashboard.value.kpis,
  }, ['kpis.atRiskStudents']) ?? null
  const guardianIssues = getFirstNumber({
    ...dashboard.value,
    kpis: reportsDashboard.value.kpis,
  }, ['summary.guardianIssues', 'kpis.openGuardianIssues', 'kpis.escalatedCases']) ?? null

  const enrollmentStatus = pendingEnrollments === null
    ? 'neutral'
    : pendingEnrollments > 0
      ? 'warning'
      : 'healthy'

  const attendanceStatus = attendanceRate === null
    ? (attendanceExceptions === null ? 'neutral' : Number(attendanceExceptions) > 0 ? 'warning' : 'neutral')
    : Number(attendanceRate) < 80
      ? 'critical'
      : Number(attendanceExceptions) > 0 || Number(attendanceRate) < 90
        ? 'warning'
        : 'healthy'

  const billingStatus = outstandingPayments === null
    ? 'neutral'
    : Number(outstandingPayments) > 0
      ? 'warning'
      : 'healthy'

  const assessmentStatus = assessmentCompletion === null
    ? 'neutral'
    : Number(assessmentCompletion) < 70 || Number(atRiskStudents) > 4
      ? 'critical'
      : Number(assessmentCompletion) < 85 || Number(atRiskStudents) > 0
        ? 'warning'
        : 'healthy'

  const healthStatus = openHealthAlerts === null
    ? 'neutral'
    : Number(criticalHealthAlerts) > 0 || Number(openHealthAlerts) > 3
      ? 'critical'
      : Number(openHealthAlerts) > 0
        ? 'warning'
        : 'healthy'

  const guardianStatus = guardianIssues === null
    ? 'neutral'
    : Number(guardianIssues) > 2
      ? 'critical'
      : Number(guardianIssues) > 0
        ? 'warning'
        : 'healthy'

  return [
    {
      label: t('preschoolDashboardPage.executiveHealth.modules.enrollment'),
      status: enrollmentStatus,
      statusLabel: translateExecutiveStatus(enrollmentStatus),
      detail: pendingEnrollments === null
        ? t('preschoolDashboardPage.executiveHealth.noData')
        : pendingEnrollments > 0
          ? t('preschoolDashboardPage.executiveHealth.details.pendingEnrollments', { count: formatCount(pendingEnrollments) })
          : t('preschoolDashboardPage.executiveHealth.details.healthy'),
    },
    {
      label: t('preschoolDashboardPage.executiveHealth.modules.attendance'),
      status: attendanceStatus,
      statusLabel: translateExecutiveStatus(attendanceStatus),
      detail: attendanceExceptions === null
        ? t('preschoolDashboardPage.executiveHealth.noData')
        : Number(attendanceExceptions) > 0
          ? t('preschoolDashboardPage.executiveHealth.details.attendanceExceptions', { count: formatCount(attendanceExceptions) })
          : t('preschoolDashboardPage.executiveHealth.details.healthy'),
    },
    {
      label: t('preschoolDashboardPage.executiveHealth.modules.billing'),
      status: billingStatus,
      statusLabel: translateExecutiveStatus(billingStatus),
      detail: outstandingPayments === null
        ? t('preschoolDashboardPage.executiveHealth.noData')
        : Number(outstandingPayments) > 0
          ? t('preschoolDashboardPage.executiveHealth.details.outstandingPayments', { amount: formatCurrency(outstandingPayments) })
          : t('preschoolDashboardPage.executiveHealth.details.healthy'),
    },
    {
      label: t('preschoolDashboardPage.executiveHealth.modules.assessment'),
      status: assessmentStatus,
      statusLabel: translateExecutiveStatus(assessmentStatus),
      detail: assessmentCompletion === null
        ? t('preschoolDashboardPage.executiveHealth.noData')
        : Number(atRiskStudents) > 0
          ? t('preschoolDashboardPage.executiveHealth.details.assessmentRisk', { count: formatCount(atRiskStudents) })
          : t('preschoolDashboardPage.executiveHealth.details.healthy'),
    },
    {
      label: t('preschoolDashboardPage.executiveHealth.modules.health'),
      status: healthStatus,
      statusLabel: translateExecutiveStatus(healthStatus),
      detail: openHealthAlerts === null
        ? t('preschoolDashboardPage.executiveHealth.noData')
        : Number(openHealthAlerts) > 0
          ? t('preschoolDashboardPage.executiveHealth.details.openHealthAlerts', { count: formatCount(openHealthAlerts) })
          : t('preschoolDashboardPage.executiveHealth.details.healthy'),
    },
    {
      label: t('preschoolDashboardPage.executiveHealth.modules.guardians'),
      status: guardianStatus,
      statusLabel: translateExecutiveStatus(guardianStatus),
      detail: guardianIssues === null
        ? t('preschoolDashboardPage.executiveHealth.noData')
        : Number(guardianIssues) > 0
          ? t('preschoolDashboardPage.executiveHealth.details.guardianIssues', { count: formatCount(guardianIssues) })
          : t('preschoolDashboardPage.executiveHealth.details.healthy'),
    },
  ]
})

const priorityItems = computed(() => {
  const items = []

  const healthAlerts = getFirstNumber({
    ...dashboard.value,
    kpis: reportsDashboard.value.kpis,
  }, ['kpis.openHealthAlerts', 'summary.healthAlerts']) ?? 0
  const criticalHealthAlerts = getFirstNumber({
    ...dashboard.value,
    kpis: reportsDashboard.value.kpis,
  }, ['kpis.criticalHealthAlerts']) ?? 0
  const guardianIssues = getFirstNumber({
    ...dashboard.value,
    kpis: reportsDashboard.value.kpis,
  }, ['summary.guardianIssues', 'kpis.openGuardianIssues', 'kpis.escalatedCases']) ?? 0
  const pendingEnrollments = getFirstNumber({
    ...dashboard.value,
    kpis: reportsDashboard.value.kpis,
  }, ['summary.pendingEnrollments', 'kpis.newEnrollments']) ?? 0
  const overduePayments = getFirstNumber({
    ...dashboard.value,
    kpis: reportsDashboard.value.kpis,
  }, ['summary.overduePayments', 'kpis.overdueInvoices']) ?? 0
  const attendanceExceptions = getFirstNumber({
    ...dashboard.value,
    kpis: reportsDashboard.value.kpis,
  }, ['summary.attendanceExceptions', 'kpis.lateRate']) ?? 0
  const atRiskStudents = getFirstNumber({
    ...dashboard.value,
    kpis: reportsDashboard.value.kpis,
  }, ['kpis.atRiskStudents']) ?? 0
  const upcomingClass = dashboard.value.upcomingClasses?.[0]

  if (criticalHealthAlerts > 0 || healthAlerts > 0) {
    items.push({
      title: t('preschoolDashboardPage.priority.health.title'),
      detail: t('preschoolDashboardPage.priority.health.detail', { count: formatCount(Math.max(healthAlerts, criticalHealthAlerts)) }),
      value: formatCount(Math.max(healthAlerts, criticalHealthAlerts)),
      priority: criticalHealthAlerts > 0 ? 'critical' : 'high',
      priorityLabel: t(`preschoolDashboardPage.priority.levels.${criticalHealthAlerts > 0 ? 'critical' : 'high'}`),
      tone: resolvePriorityTone(criticalHealthAlerts > 0 ? 'critical' : 'high'),
      actionLabel: t('preschoolDashboardPage.priority.review'),
      actionTo: { name: 'dashboard-preschool-admin-health' },
    })
  }

  if (guardianIssues > 0) {
    items.push({
      title: t('preschoolDashboardPage.priority.guardians.title'),
      detail: t('preschoolDashboardPage.priority.guardians.detail', { count: formatCount(guardianIssues) }),
      value: formatCount(guardianIssues),
      priority: guardianIssues > 2 ? 'critical' : 'high',
      priorityLabel: t(`preschoolDashboardPage.priority.levels.${guardianIssues > 2 ? 'critical' : 'high'}`),
      tone: resolvePriorityTone(guardianIssues > 2 ? 'critical' : 'high'),
      actionLabel: t('preschoolDashboardPage.priority.review'),
      actionTo: { name: 'dashboard-preschool-admin-guardian-communications' },
    })
  }

  if (pendingEnrollments > 0) {
    items.push({
      title: t('preschoolDashboardPage.priority.enrollment.title'),
      detail: t('preschoolDashboardPage.priority.enrollment.detail', { count: formatCount(pendingEnrollments) }),
      value: formatCount(pendingEnrollments),
      priority: 'high',
      priorityLabel: t('preschoolDashboardPage.priority.levels.high'),
      tone: resolvePriorityTone('high'),
      actionLabel: t('preschoolDashboardPage.priority.review'),
      actionTo: { name: 'dashboard-preschool-admin-enrollments' },
    })
  }

  if (overduePayments > 0) {
    const paymentAmount = getFirstNumber({
      ...dashboard.value,
      kpis: reportsDashboard.value.kpis,
    }, ['kpis.outstandingBalances', 'summary.outstandingPayments']) ?? overduePayments

    items.push({
      title: t('preschoolDashboardPage.priority.payments.title'),
      detail: t('preschoolDashboardPage.priority.payments.detail', { amount: formatCurrency(paymentAmount) }),
      value: formatCurrency(paymentAmount),
      priority: 'high',
      priorityLabel: t('preschoolDashboardPage.priority.levels.high'),
      tone: resolvePriorityTone('high'),
      actionLabel: t('preschoolDashboardPage.priority.review'),
      actionTo: { name: 'dashboard-preschool-admin-payment' },
    })
  }

  if (attendanceExceptions > 0) {
    items.push({
      title: t('preschoolDashboardPage.priority.attendance.title'),
      detail: t('preschoolDashboardPage.priority.attendance.detail', { count: formatCount(attendanceExceptions) }),
      value: formatCount(attendanceExceptions),
      priority: 'medium',
      priorityLabel: t('preschoolDashboardPage.priority.levels.medium'),
      tone: resolvePriorityTone('medium'),
      actionLabel: t('preschoolDashboardPage.priority.review'),
      actionTo: { name: 'dashboard-preschool-admin-attendance-history' },
    })
  }

  if (atRiskStudents > 0) {
    items.push({
      title: t('preschoolDashboardPage.priority.assessment.title'),
      detail: t('preschoolDashboardPage.priority.assessment.detail', { count: formatCount(atRiskStudents) }),
      value: formatCount(atRiskStudents),
      priority: 'medium',
      priorityLabel: t('preschoolDashboardPage.priority.levels.medium'),
      tone: resolvePriorityTone('medium'),
      actionLabel: t('preschoolDashboardPage.priority.review'),
      actionTo: { name: 'dashboard-preschool-admin-reports-assessments' },
    })
  }

  if (items.length === 0 && upcomingClass) {
    items.push({
      title: t('preschoolDashboardPage.priority.upcoming.title'),
      detail: joinParts([
        upcomingClass.name || t('preschoolDashboardPage.operations.classFallback'),
        upcomingClass.scheduledTime || upcomingClass.schedule || '',
      ]),
      value: formatCount(upcomingClass.studentsCount ?? upcomingClass.studentCount ?? 0),
      priority: 'info',
      priorityLabel: t('preschoolDashboardPage.priority.levels.info'),
      tone: resolvePriorityTone('info'),
      actionLabel: t('preschoolDashboardPage.priority.openSchedule'),
      actionTo: { name: 'dashboard-preschool-admin-schedules' },
    })
  }

  return items
    .sort((left, right) => {
      const order = { critical: 0, high: 1, medium: 2, info: 3 }
      return (order[left.priority] ?? 99) - (order[right.priority] ?? 99)
    })
    .slice(0, 6)
})

const insightCards = computed(() => {
  const attendanceSeries = buildSparkline(reportsDashboard.value.trend)
  const enrollmentSeries = buildSparkline(reportsDashboard.value.performance)
  const assessmentSeries = buildSparkline(reportsDashboard.value.completion)

  const attendanceRate = getFirstNumber(reportsDashboard.value, ['kpis.attendanceRate']) ?? 0
  const absenceRate = getFirstNumber(reportsDashboard.value, ['kpis.absenceRate']) ?? 0
  const lateRate = getFirstNumber(reportsDashboard.value, ['kpis.lateRate']) ?? 0
  const newEnrollments = getFirstNumber(reportsDashboard.value, ['kpis.newEnrollments']) ?? 0
  const activeStudents = getFirstNumber(reportsDashboard.value, ['kpis.activeStudents']) ?? getFirstNumber(dashboard.value, ['summary.students']) ?? 0
  const totalStudents = getFirstNumber(reportsDashboard.value, ['kpis.totalStudents']) ?? getFirstNumber(dashboard.value, ['summary.students']) ?? 0
  const assessmentCompletion = getFirstNumber(reportsDashboard.value, ['kpis.assessmentCompletion']) ?? 0
  const atRiskStudents = getFirstNumber(reportsDashboard.value, ['kpis.atRiskStudents']) ?? 0
  const revenue = getFirstNumber(reportsDashboard.value, ['kpis.revenue']) ?? 0
  const outstandingBalances = getFirstNumber(reportsDashboard.value, ['kpis.outstandingBalances']) ?? 0
  const overdueInvoices = getFirstNumber(reportsDashboard.value, ['kpis.overdueInvoices']) ?? 0

  return [
    {
      title: t('preschoolDashboardPage.insights.attendance.title'),
      value: formatPercent(attendanceRate),
      label: t('preschoolDashboardPage.insights.attendance.label'),
      note: t('preschoolDashboardPage.insights.attendance.note', {
        absence: formatPercent(absenceRate),
        late: formatPercent(lateRate),
      }),
      metrics: [
        { label: t('preschoolDashboardPage.insights.attendance.metrics.present'), value: formatCount(dashboard.value.summary.attendanceToday) },
        { label: t('preschoolDashboardPage.insights.attendance.metrics.absent'), value: formatPercent(absenceRate) },
      ],
      sparkline: attendanceSeries,
      sparklineFallback: t('preschoolDashboardPage.insights.sparklineFallback'),
    },
    {
      title: t('preschoolDashboardPage.insights.enrollment.title'),
      value: formatCount(newEnrollments),
      label: t('preschoolDashboardPage.insights.enrollment.label'),
      note: t('preschoolDashboardPage.insights.enrollment.note', {
        active: formatCount(activeStudents),
      }),
      metrics: [
        { label: t('preschoolDashboardPage.insights.enrollment.metrics.active'), value: formatCount(activeStudents) },
        { label: t('preschoolDashboardPage.insights.enrollment.metrics.students'), value: formatCount(totalStudents) },
      ],
      sparkline: enrollmentSeries,
      sparklineFallback: t('preschoolDashboardPage.insights.sparklineFallback'),
    },
    {
      title: t('preschoolDashboardPage.insights.assessment.title'),
      value: formatPercent(assessmentCompletion),
      label: t('preschoolDashboardPage.insights.assessment.label'),
      note: t('preschoolDashboardPage.insights.assessment.note', {
        risk: formatCount(atRiskStudents),
      }),
      metrics: [
        { label: t('preschoolDashboardPage.insights.assessment.metrics.risk'), value: formatCount(atRiskStudents) },
        { label: t('preschoolDashboardPage.insights.assessment.metrics.score'), value: reportsDashboard.value.kpis?.averageScore ?? 0 },
      ],
      sparkline: assessmentSeries,
      sparklineFallback: t('preschoolDashboardPage.insights.sparklineFallback'),
    },
    {
      title: t('preschoolDashboardPage.insights.payments.title'),
      value: formatCurrency(revenue),
      label: t('preschoolDashboardPage.insights.payments.label'),
      note: t('preschoolDashboardPage.insights.payments.note', {
        overdue: formatCount(overdueInvoices || dashboard.value.summary.overduePayments),
      }),
      metrics: [
        { label: t('preschoolDashboardPage.insights.payments.metrics.outstanding'), value: formatCurrency(outstandingBalances) },
        { label: t('preschoolDashboardPage.insights.payments.metrics.overdue'), value: formatCount(overdueInvoices || dashboard.value.summary.overduePayments) },
      ],
      sparkline: buildSparkline(reportsDashboard.value.cards),
      sparklineFallback: t('preschoolDashboardPage.insights.sparklineFallback'),
    },
  ]
})

const recentActivityItems = computed(() =>
  (dashboard.value.recentAttendance || []).slice(0, 4).map((item) => ({
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

      <section class="preschool-dashboard-page__section preschool-dashboard-page__section--health">
        <div class="preschool-dashboard-page__section-header">
          <div>
            <h2 class="preschool-dashboard-page__section-title">{{ t('preschoolDashboardPage.executiveHealth.title') }}</h2>
            <p class="preschool-dashboard-page__section-subtitle">{{ t('preschoolDashboardPage.executiveHealth.subtitle') }}</p>
          </div>
        </div>
        <div class="preschool-dashboard-page__health-grid">
          <article
            v-for="item in systemHealthItems"
            :key="item.label"
            class="preschool-dashboard-page__health-item"
            :data-status="item.status"
          >
            <div class="preschool-dashboard-page__health-head">
              <p class="preschool-dashboard-page__health-label">{{ item.label }}</p>
              <StatusBadge
                :status="item.status"
                :label="item.statusLabel"
                :translate-label="false"
                size="sm"
              />
            </div>
            <p class="preschool-dashboard-page__health-detail">{{ item.detail }}</p>
          </article>
        </div>
      </section>

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
            <div class="preschool-dashboard-page__insight-topline">
              <p class="preschool-dashboard-page__insight-title">{{ card.title }}</p>
              <div v-if="card.sparkline.length > 0" class="preschool-dashboard-page__sparkline" aria-hidden="true">
                <span
                  v-for="point in card.sparkline"
                  :key="point.id"
                  class="preschool-dashboard-page__sparkline-bar"
                  :style="{ height: `${point.height}%` }"
                />
              </div>
              <p v-else class="preschool-dashboard-page__sparkline-fallback">{{ card.sparklineFallback }}</p>
            </div>
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
            :max-items="4"
            :view-all-text="t('preschoolDashboardPage.operations.viewAll')"
            :view-all-to="{ name: 'dashboard-preschool-admin-attendance-history' }"
          />

          <article class="preschool-dashboard-page__panel">
            <div class="preschool-dashboard-page__panel-header">
              <div>
                <h3 class="preschool-dashboard-page__panel-title">{{ t('preschoolDashboardPage.operations.upcomingSchedules') }}</h3>
                <p class="preschool-dashboard-page__panel-subtitle">{{ t('preschoolDashboardPage.operations.upcomingSchedulesSubtitle') }}</p>
              </div>
              <RouterLink
                :to="{ name: 'dashboard-preschool-admin-schedules' }"
                class="preschool-dashboard-page__panel-link"
              >
                {{ t('preschoolDashboardPage.operations.viewAll') }}
              </RouterLink>
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
              <div>
                <h3 class="preschool-dashboard-page__panel-title">{{ t('preschoolDashboardPage.operations.classroomSummary.title') }}</h3>
                <p class="preschool-dashboard-page__panel-subtitle">{{ t('preschoolDashboardPage.operations.classroomSummary.subtitle') }}</p>
              </div>
              <RouterLink
                :to="{ name: 'dashboard-preschool-admin-classes' }"
                class="preschool-dashboard-page__panel-link"
              >
                {{ t('preschoolDashboardPage.operations.viewAll') }}
              </RouterLink>
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
              <div>
                <h3 class="preschool-dashboard-page__panel-title">{{ t('preschoolDashboardPage.operations.shortcuts.title') }}</h3>
                <p class="preschool-dashboard-page__panel-subtitle">{{ t('preschoolDashboardPage.operations.shortcuts.subtitle') }}</p>
              </div>
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

.preschool-dashboard-page__section--health {
  gap: 0.75rem;
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

.preschool-dashboard-page__health-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.8rem;
}

.preschool-dashboard-page__health-item {
  padding: 0.95rem 1rem;
  border-radius: 1.15rem;
  border: 1px solid #dbe6f2;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 18px 45px -36px rgba(15, 23, 42, 0.45);
}

.preschool-dashboard-page__health-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.preschool-dashboard-page__health-label {
  margin: 0;
  color: #0f172a;
  font-size: 0.9rem;
  font-weight: 800;
}

.preschool-dashboard-page__health-detail {
  margin: 0.55rem 0 0;
  color: #64748b;
  font-size: 0.88rem;
  line-height: 1.5;
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
  padding: 1.15rem;
}

.preschool-dashboard-page__insight-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.preschool-dashboard-page__insight-title {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
}

.preschool-dashboard-page__sparkline,
.preschool-dashboard-page__sparkline-fallback {
  flex-shrink: 0;
}

.preschool-dashboard-page__sparkline {
  display: flex;
  align-items: end;
  gap: 0.18rem;
  width: 3.8rem;
  height: 1.8rem;
  padding-top: 0.15rem;
}

.preschool-dashboard-page__sparkline-bar {
  width: 100%;
  min-width: 0.35rem;
  border-radius: 999px 999px 0 0;
  background: linear-gradient(180deg, #60a5fa 0%, #2563eb 100%);
}

.preschool-dashboard-page__sparkline-fallback {
  margin: 0;
  font-size: 0.78rem;
  color: #94a3b8;
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
  margin-bottom: 0.95rem;
}

.preschool-dashboard-page__panel-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
}

.preschool-dashboard-page__panel-subtitle {
  margin: 0.25rem 0 0;
  color: #64748b;
  font-size: 0.86rem;
  line-height: 1.45;
}

.preschool-dashboard-page__panel-link {
  color: #1d4ed8;
  font-size: 0.86rem;
  font-weight: 800;
  text-decoration: none;
  white-space: nowrap;
}

.preschool-dashboard-page__panel-link:hover {
  text-decoration: underline;
}

.preschool-dashboard-page__empty {
  color: #64748b;
  font-size: 0.92rem;
  padding: 0.9rem 0 0.25rem;
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

@media (max-width: 1200px) {
  .preschool-dashboard-page__health-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
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

  .preschool-dashboard-page__health-grid,
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

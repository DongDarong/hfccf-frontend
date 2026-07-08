<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import AppStatusChip from '@/components/ui/AppStatusChip.vue'
import { useLanguage } from '@/composables/useLanguage'
import { fetchPreschoolAttendance, fetchPreschoolClasses } from '@/modules/preschool/services/preschoolApi'
import {
  fetchMissingAttendanceSessions,
  fetchTodayAttendanceSessions,
  openAttendanceSession,
} from '@/modules/preschool/services/api/preschoolAttendanceSessionApi'
import { fetchPreschoolAttendanceAlertSummary } from '@/modules/preschool/services/api/preschoolAttendanceAlertApi'
import {
  getSessionActionTone,
  getSessionStatusKey,
  getSessionStatusTone,
  normalizeSessionStatus,
} from '@/modules/preschool/admin/pages/attendance/sessionUi'

defineOptions({ name: 'PreschoolAdminAttendanceDashboardPage' })

const { t } = useLanguage()
const router = useRouter()

const records = ref([])
const classOptions = ref([])
const attendanceSessions = ref([])
const missingSessions = ref([])
const alertSummary = ref({
  summary: {
    total: 0,
    open: 0,
    acknowledged: 0,
    overdue: 0,
    byClass: [],
    bySeverity: [],
  },
  recentAlerts: [],
})
const loading = ref(false)
const errorMessage = ref('')

const today = new Date()
const firstOfMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`
const todayIso = today.toISOString().slice(0, 10)
const filters = ref({
  classId: '',
  dateFrom: firstOfMonth,
  dateTo: todayIso,
})

const stats = computed(() => {
  const total = records.value.length
  const present = records.value.filter((r) => r.status === 'present').length
  const absent = records.value.filter((r) => r.status === 'absent').length
  const late = records.value.filter((r) => r.status === 'late').length
  const excused = records.value.filter((r) => r.status === 'excused').length
  const rate = total ? Math.round((present / total) * 100) : 0
  return { total, present, absent, late, excused, rate }
})

const visibleMissingSessions = computed(() =>
  filters.value.classId
    ? missingSessions.value.filter((session) => String(session.classId || '') === String(filters.value.classId))
    : missingSessions.value,
)

const sessionCards = computed(() => {
  const actualSessions = attendanceSessions.value.map((session) => ({
    ...session,
    displayStatus: normalizeSessionStatus(session.status),
    isMissing: false,
  }))

  const missingCards = visibleMissingSessions.value.map((session) => ({
    ...session,
    displayStatus: 'missing',
    isMissing: true,
  }))

  return [...actualSessions, ...missingCards]
})

const sessionCounts = computed(() => sessionCards.value.reduce((counts, session) => {
  const status = normalizeSessionStatus(session.displayStatus || session.status)
  counts.total += 1
  if (status === 'scheduled') counts.scheduled += 1
  else if (status === 'open') counts.open += 1
  else if (status === 'completed') counts.completed += 1
  else if (status === 'locked') counts.locked += 1
  else if (status === 'cancelled') counts.cancelled += 1
  else if (session.isMissing || status === 'missing') counts.missing += 1
  return counts
}, {
  total: 0,
  scheduled: 0,
  open: 0,
  completed: 0,
  locked: 0,
  cancelled: 0,
  missing: 0,
}))

const classSummary = computed(() => {
  const map = {}
  for (const r of records.value) {
    const key = r.classId || 'unknown'
    if (!map[key]) map[key] = { name: r.className || key, total: 0, present: 0, absent: 0, late: 0, excused: 0 }
    map[key].total++
    if (r.status === 'present') map[key].present++
    else if (r.status === 'absent') map[key].absent++
    else if (r.status === 'late') map[key].late++
    else if (r.status === 'excused') map[key].excused++
  }
  return Object.values(map)
    .map((c) => ({ ...c, rate: c.total ? Math.round((c.present / c.total) * 100) : 0 }))
    .sort((a, b) => b.total - a.total)
})

const statCards = computed(() => [
  { label: t('preschoolAttendanceDashboardPage.cards.rate'), value: `${stats.value.rate}%`, caption: t('preschoolAttendanceDashboardPage.cards.rateCaption'), color: 'text-violet-700', bg: 'bg-violet-50' },
  { label: t('preschoolAttendanceDashboardPage.cards.total'), value: stats.value.total, caption: t('preschoolAttendanceDashboardPage.cards.totalCaption'), color: 'text-slate-700', bg: 'bg-slate-50' },
  { label: t('preschoolAttendanceDashboardPage.cards.present'), value: stats.value.present, caption: t('preschoolAttendanceDashboardPage.cards.presentCaption'), color: 'text-emerald-700', bg: 'bg-emerald-50' },
  { label: t('preschoolAttendanceDashboardPage.cards.absent'), value: stats.value.absent, caption: t('preschoolAttendanceDashboardPage.cards.absentCaption'), color: 'text-rose-700', bg: 'bg-rose-50' },
  { label: t('preschoolAttendanceDashboardPage.cards.late'), value: stats.value.late, caption: t('preschoolAttendanceDashboardPage.cards.lateCaption'), color: 'text-amber-700', bg: 'bg-amber-50' },
  { label: t('preschoolAttendanceDashboardPage.cards.excused'), value: stats.value.excused, caption: t('preschoolAttendanceDashboardPage.cards.excusedCaption'), color: 'text-sky-700', bg: 'bg-sky-50' },
])

const operationalSummaryCards = computed(() => [
  { label: t('preschoolAttendanceDashboardPage.operationalSummary.todaySessions'), value: sessionCounts.value.total, caption: t('preschoolAttendanceDashboardPage.operationalSummary.todaySessionsCaption'), color: 'text-slate-700', bg: 'bg-slate-50' },
  { label: t('preschoolAttendanceDashboardPage.operationalSummary.scheduled'), value: sessionCounts.value.scheduled, caption: t('preschoolAttendanceSessionsPage.statuses.scheduled'), color: 'text-sky-700', bg: 'bg-sky-50' },
  { label: t('preschoolAttendanceDashboardPage.operationalSummary.open'), value: sessionCounts.value.open, caption: t('preschoolAttendanceSessionsPage.statuses.open'), color: 'text-amber-700', bg: 'bg-amber-50' },
  { label: t('preschoolAttendanceDashboardPage.operationalSummary.completed'), value: sessionCounts.value.completed, caption: t('preschoolAttendanceSessionsPage.statuses.completed'), color: 'text-emerald-700', bg: 'bg-emerald-50' },
  { label: t('preschoolAttendanceDashboardPage.operationalSummary.locked'), value: sessionCounts.value.locked, caption: t('preschoolAttendanceSessionsPage.statuses.locked'), color: 'text-slate-700', bg: 'bg-slate-50' },
  { label: t('preschoolAttendanceDashboardPage.operationalSummary.cancelled'), value: sessionCounts.value.cancelled, caption: t('preschoolAttendanceSessionsPage.statuses.cancelled'), color: 'text-rose-700', bg: 'bg-rose-50' },
  { label: t('preschoolAttendanceDashboardPage.operationalSummary.missing'), value: sessionCounts.value.missing, caption: t('preschoolAttendanceSessionsPage.missingAttendance'), color: 'text-rose-700', bg: 'bg-rose-50' },
])

const alertCards = computed(() => ([
  { key: 'total', label: t('preschoolAttendanceAlertsPage.labels.absenceAlert'), value: alertSummary.value.summary.total || 0 },
  { key: 'open', label: t('preschoolAttendanceAlertsPage.labels.openAlerts'), value: alertSummary.value.summary.open || 0 },
  { key: 'acknowledged', label: t('preschoolAttendanceAlertsPage.labels.acknowledgedAlerts'), value: alertSummary.value.summary.acknowledged || 0 },
  { key: 'overdue', label: t('preschoolAttendanceAlertsPage.labels.overdueAlerts'), value: alertSummary.value.summary.overdue || 0 },
]))

const recentAlerts = computed(() => (alertSummary.value.recentAlerts || []).slice(0, 4))

function rateColor(rate) {
  if (rate >= 90) return 'text-emerald-600'
  if (rate >= 75) return 'text-amber-600'
  return 'text-rose-600'
}

async function loadClasses() {
  try {
    const res = await fetchPreschoolClasses({ page: 1, perPage: 100 })
    classOptions.value = (res.items || []).map((c) => ({ label: c.name, value: c.id }))
  } catch {
    classOptions.value = []
  }
}

async function loadData() {
  loading.value = true
  errorMessage.value = ''
  try {
    const [attendanceResponse, sessionResponse, missingResponse, alertResponse] = await Promise.all([
      fetchPreschoolAttendance({
        classId: filters.value.classId,
        dateFrom: filters.value.dateFrom,
        dateTo: filters.value.dateTo,
        page: 1,
        perPage: 500,
      }),
      fetchTodayAttendanceSessions({ classId: filters.value.classId })
        .catch(() => ({
          items: [],
          summary: { open: 0, closed: 0, cancelled: 0, missing: 0 },
        })),
      fetchMissingAttendanceSessions({
        startDate: filters.value.dateTo,
        endDate: filters.value.dateTo,
      }).catch(() => ({
        items: [],
        count: 0,
      })),
      fetchPreschoolAttendanceAlertSummary({
        classId: filters.value.classId || undefined,
        dateFrom: filters.value.dateFrom || undefined,
        dateTo: filters.value.dateTo || undefined,
        page: 1,
        perPage: 4,
      })
        .catch(() => ({
          summary: {
            total: 0,
            open: 0,
            acknowledged: 0,
            overdue: 0,
            byClass: [],
            bySeverity: [],
          },
          recentAlerts: [],
        })),
    ])

    attendanceSessions.value = sessionResponse.items || []
    missingSessions.value = missingResponse.items || []
    alertSummary.value = alertResponse
    records.value = attendanceResponse.items || []
  } catch (e) {
    errorMessage.value = e?.message || t('preschoolAttendanceDashboardPage.messages.loadFailed')
  } finally {
    loading.value = false
  }
}

async function takeAttendance(session) {
  const status = normalizeSessionStatus(session.status)
  const sessionId = String(session.id || session.sessionKey || '').trim()

  if (!sessionId || session.isMissing) {
    return
  }

  try {
    if (status === 'scheduled') {
      const openedSession = await openAttendanceSession(sessionId)
      await router.push({
        name: 'dashboard-preschool-admin-attendance-students',
        query: {
          classId: openedSession?.classId || session.classId || '',
          date: openedSession?.attendanceDate || session.attendanceDate || filters.value.dateTo,
          attendance_session_id: openedSession?.id || sessionId,
          sessionId: openedSession?.id || sessionId,
        },
      })
      return
    }

    if (status === 'open') {
      await router.push({
        name: 'dashboard-preschool-admin-attendance-students',
        query: {
          classId: session.classId || '',
          date: session.attendanceDate || filters.value.dateTo,
          attendance_session_id: sessionId,
          sessionId,
        },
      })
      return
    }

    await router.push({
      name: 'dashboard-preschool-admin-attendance-session-details',
      params: { id: sessionId },
    })
  } catch (error) {
    errorMessage.value = error?.message || t('preschoolAttendanceDashboardPage.messages.loadFailed')
  }
}

function statusLabel(status) {
  return t(`preschoolAttendanceSessionsPage.statuses.${getSessionStatusKey(status)}`) || String(status || '—')
}

function actionLabel(session) {
  const status = normalizeSessionStatus(session.status)
  if (session.isMissing || !String(session.id || '').trim()) {
    return ''
  }

  if (status === 'scheduled' && session.id) return t('preschoolAttendanceSessionsPage.openSession')
  if (status === 'open') return t('preschoolAttendanceSessionsPage.actions.continueAttendance')
  if (status === 'completed') return t('preschoolAttendanceSessionsPage.actions.viewSession')
  if (status === 'locked') return t('preschoolAttendanceSessionsPage.actions.view')
  if (status === 'cancelled') return t('preschoolAttendanceSessionsPage.actions.viewDetails')
  return t('preschoolAttendanceSessionsPage.actions.viewSession')
}

function alertTone(status) {
  const normalized = String(status || '').toLowerCase()
  if (['open', 'queued', 'pending'].includes(normalized)) return 'warning'
  if (['acknowledged', 'sent', 'completed'].includes(normalized)) return 'success'
  if (['overdue', 'failed'].includes(normalized)) return 'danger'
  return 'neutral'
}

onMounted(async () => {
  await loadClasses()
  await loadData()
})
</script>

<template>
  <MainLayout>
    <section class="space-y-4">
      <HeaderSection
        :title="t('preschoolAttendanceDashboardPage.title')"
        :subtitle="t('preschoolAttendanceDashboardPage.subtitle')"
      />

      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex flex-wrap items-end gap-3">
          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('preschoolAttendanceDashboardPage.filters.class') }}</span>
            <select v-model="filters.classId" class="h-10 min-w-[180px] rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300">
              <option value="">{{ t('preschoolAttendanceDashboardPage.filters.allClasses') }}</option>
              <option v-for="c in classOptions" :key="c.value" :value="c.value">{{ c.label }}</option>
            </select>
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('preschoolAttendanceDashboardPage.filters.dateFrom') }}</span>
            <input v-model="filters.dateFrom" type="date" class="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300">
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('preschoolAttendanceDashboardPage.filters.dateTo') }}</span>
            <input v-model="filters.dateTo" type="date" class="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300">
          </label>
          <Button type="button" variant="primary" size="md" rounded="xl" :loading="loading" @click="loadData">
            {{ t('preschoolAttendanceDashboardPage.actions.apply') }}
          </Button>
          <Button type="button" variant="ghost" size="md" rounded="xl" @click="router.push({ name: 'dashboard-preschool-admin-attendance' })">
            {{ t('preschoolAttendanceDashboardPage.actions.back') }}
          </Button>
        </div>
      </div>

      <div v-if="errorMessage" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{{ errorMessage }}</div>

      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-100 px-4 py-3">
          <h3 class="text-sm font-semibold text-slate-900">{{ t('preschoolAttendanceDashboardPage.operationalSummary.title') }}</h3>
        </div>
        <div v-if="loading" class="px-4 py-8 text-center text-sm text-slate-400">{{ t('preschoolAttendanceDashboardPage.messages.loadFailed') }}</div>
        <div v-else class="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <article v-for="card in operationalSummaryCards" :key="card.label" class="rounded-2xl border border-slate-200 p-4 shadow-sm" :class="card.bg">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ card.label }}</p>
            <p class="mt-2 text-3xl font-bold" :class="card.color">{{ card.value }}</p>
            <p class="mt-1 text-xs text-slate-500">{{ card.caption }}</p>
          </article>
        </div>
      </div>

      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div>
            <h3 class="text-sm font-semibold text-slate-900">{{ t('preschoolAttendanceSessionsPage.today') }}</h3>
            <p class="text-xs text-slate-500">{{ t('preschoolAttendanceSessionsPage.title') }}</p>
          </div>
          <div class="text-xs text-slate-500">
            {{ t('preschoolAttendanceSessionsPage.summary', { open: sessionCounts.open, closed: sessionCounts.completed, missing: sessionCounts.missing }) }}
          </div>
        </div>
        <div v-if="loading" class="px-4 py-8 text-center text-sm text-slate-400">{{ t('preschoolAttendanceDashboardPage.messages.loadFailed') }}</div>
        <div v-else-if="!sessionCards.length" class="px-4 py-8 text-center text-sm text-slate-400">{{ t('preschoolAttendanceSessionsPage.noSessionsToday') }}</div>
        <div v-else class="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="session in sessionCards"
            :key="session.sessionKey || session.id || `${session.classId}-${session.attendanceDate}`"
            class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {{ session.classCode || t('preschoolAttendanceSessionsPage.sessionDate') }}
                </p>
                <h4 class="mt-1 truncate font-semibold text-slate-900">{{ session.className || '—' }}</h4>
                <p class="mt-1 text-xs text-slate-500">
                  {{ session.attendanceDate || '—' }}
                  <span v-if="session.startTime || session.endTime">
                    · {{ session.startTime || '--:--' }} - {{ session.endTime || '--:--' }}
                  </span>
                </p>
              </div>
              <AppStatusChip
                :status="getSessionStatusTone(session.displayStatus || session.status)"
                :label="session.isMissing ? t('preschoolAttendanceSessionsPage.missingAttendance') : statusLabel(session.displayStatus || session.status)"
                :translate-label="false"
                size="xs"
              />
            </div>
            <div class="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
              <div>
                <p class="uppercase tracking-wide text-slate-400">{{ t('preschoolAttendanceDashboardPage.operationalSummary.teacher') }}</p>
                <p class="mt-0.5 truncate text-slate-700">{{ session.teacherName || '—' }}</p>
              </div>
              <div>
                <p class="uppercase tracking-wide text-slate-400">{{ t('preschoolAttendanceDashboardPage.operationalSummary.room') }}</p>
                <p class="mt-0.5 truncate text-slate-700">{{ session.roomName || '—' }}</p>
              </div>
              <div>
                <p class="uppercase tracking-wide text-slate-400">{{ t('preschoolAttendanceDashboardPage.operationalSummary.studentCount') }}</p>
                <p class="mt-0.5 text-slate-700">{{ session.studentCount ?? session.recordsCount ?? '—' }}</p>
              </div>
              <div>
                <p class="uppercase tracking-wide text-slate-400">{{ t('preschoolAttendanceSessionsPage.sessionStatus') }}</p>
                <p class="mt-0.5 truncate text-slate-700">{{ session.generatedFromSchedule ? t('preschoolAttendanceSessionsPage.generatedFromSchedule') : t('preschoolAttendanceSessionsPage.manualSession') }}</p>
              </div>
            </div>
            <div class="mt-3 flex items-center justify-between gap-2">
              <p class="text-xs text-slate-500">
                {{ session.generatedFromSchedule ? t('preschoolAttendanceSessionsPage.generatedFromSchedule') : t('preschoolAttendanceSessionsPage.manualSession') }}
              </p>
              <Button
                v-if="!session.isMissing"
                type="button"
                :variant="getSessionActionTone(session.displayStatus || session.status) === 'danger' ? 'ghost' : 'primary'"
                size="sm"
                rounded="xl"
                @click="takeAttendance(session)"
              >
                {{ actionLabel(session) }}
              </Button>
            </div>
          </article>
        </div>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div v-for="card in statCards" :key="card.label" class="rounded-2xl border border-slate-200 p-4 shadow-sm" :class="card.bg">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ card.label }}</p>
          <p class="mt-2 text-3xl font-bold" :class="card.color">{{ card.value }}</p>
          <p class="mt-1 text-xs text-slate-500">{{ card.caption }}</p>
        </div>
      </div>

      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-100 px-4 py-3">
          <h3 class="text-sm font-semibold text-slate-900">{{ t('preschoolAttendanceDashboardPage.breakdown.title') }}</h3>
        </div>
        <div v-if="loading" class="px-4 py-8 text-center text-sm text-slate-400">{{ t('preschoolAttendanceDashboardPage.messages.loadFailed') }}</div>
        <div v-else-if="!classSummary.length" class="px-4 py-8 text-center text-sm text-slate-400">{{ t('preschoolAttendanceDashboardPage.breakdown.empty') }}</div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-100 text-sm">
            <thead class="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th class="px-4 py-3 font-semibold">{{ t('preschoolAttendanceDashboardPage.breakdown.columns.class') }}</th>
                <th class="px-4 py-3 text-right font-semibold">{{ t('preschoolAttendanceDashboardPage.breakdown.columns.total') }}</th>
                <th class="px-4 py-3 text-right font-semibold">{{ t('preschoolAttendanceDashboardPage.breakdown.columns.present') }}</th>
                <th class="px-4 py-3 text-right font-semibold">{{ t('preschoolAttendanceDashboardPage.breakdown.columns.absent') }}</th>
                <th class="px-4 py-3 text-right font-semibold">{{ t('preschoolAttendanceDashboardPage.breakdown.columns.late') }}</th>
                <th class="px-4 py-3 text-right font-semibold">{{ t('preschoolAttendanceDashboardPage.breakdown.columns.rate') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="row in classSummary" :key="row.name">
                <td class="px-4 py-3 font-medium text-slate-900">{{ row.name }}</td>
                <td class="px-4 py-3 text-right text-slate-600">{{ row.total }}</td>
                <td class="px-4 py-3 text-right text-emerald-600">{{ row.present }}</td>
                <td class="px-4 py-3 text-right text-rose-600">{{ row.absent }}</td>
                <td class="px-4 py-3 text-right text-amber-600">{{ row.late }}</td>
                <td class="px-4 py-3 text-right font-semibold" :class="rateColor(row.rate)">{{ row.rate }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div>
            <h3 class="text-sm font-semibold text-slate-900">{{ t('preschoolAttendanceDashboardPage.alertSummary.title') }}</h3>
            <p class="text-xs text-slate-500">{{ t('preschoolAttendanceDashboardPage.alertSummary.subtitle') }}</p>
          </div>
          <Button type="button" variant="ghost" size="sm" rounded="xl" @click="router.push({ name: 'dashboard-preschool-admin-attendance-alerts' })">
            {{ t('preschoolAttendanceDashboardPage.alertSummary.viewAllAttendanceAlerts') }}
          </Button>
        </div>
        <div class="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-4">
          <article v-for="card in alertCards" :key="card.key" class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ card.label }}</p>
            <p class="mt-2 text-3xl font-bold text-slate-900">{{ card.value }}</p>
          </article>
        </div>
        <div v-if="!recentAlerts.length" class="px-4 pb-6 text-sm text-slate-400">
          {{ t('preschoolAttendanceDashboardPage.alertSummary.noRepeatedAbsenceAlerts') }}
        </div>
        <div v-else class="border-t border-slate-100 px-4 py-4">
          <h4 class="text-xs font-semibold uppercase tracking-wide text-slate-400">{{ t('preschoolAttendanceDashboardPage.alertSummary.recentRepeatedAbsences') }}</h4>
          <div class="mt-3 space-y-2">
            <div v-for="alert in recentAlerts" :key="alert.id" class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div class="min-w-0">
                <p class="font-medium text-slate-900">{{ alert.studentName || '—' }}</p>
                <p class="text-xs text-slate-500">{{ alert.className || '—' }} · {{ alert.guardianName || '—' }}</p>
              </div>
              <div class="flex items-center gap-2">
                <AppStatusChip
                  :status="alertTone(alert.followUpStatus || alert.status)"
                  :label="alert.alertLabel || t('preschoolAttendanceDashboardPage.alertSummary.latestAttendanceAlert')"
                  :translate-label="false"
                  size="xs"
                />
                <span class="text-xs text-slate-500">{{ alert.createdAt || '—' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

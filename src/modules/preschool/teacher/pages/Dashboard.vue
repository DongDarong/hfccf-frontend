<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import AppStatusChip from '@/components/ui/AppStatusChip.vue'
import PreschoolDashboardSummary from '@/modules/preschool/admin/components/dashboard/PreschoolDashboardSummary.vue'
import PreschoolDashboardSpotlight from '@/modules/preschool/admin/components/dashboard/PreschoolDashboardSpotlight.vue'
import PreschoolDashboardActionList from '@/modules/preschool/admin/components/dashboard/PreschoolDashboardActionList.vue'
import PreschoolDashboardActivity from '@/modules/preschool/admin/components/dashboard/PreschoolDashboardActivity.vue'
import { useLanguage } from '@/composables/useLanguage'
import { fetchPreschoolDashboard } from '@/modules/preschool/services/preschoolApi'
import { fetchTodayAttendanceSessions, openAttendanceSession } from '@/modules/preschool/services/api/preschoolAttendanceSessionApi'
import {
  getSessionStatusKey,
  getSessionStatusTone,
  normalizeSessionStatus,
} from '@/modules/preschool/admin/pages/attendance/sessionUi'

defineOptions({
  name: 'TeacherPreschoolDashboard',
})

const { t } = useLanguage()
const router = useRouter()

const dashboard = ref({
  summary: {
    students: 0,
    classes: 0,
    teachers: 0,
    attendanceToday: 0,
    pendingPayments: 0,
    overduePayments: 0,
  },
  recentAttendance: [],
  upcomingClasses: [],
  paymentSummary: {
    paid: 0,
    pending: 0,
    overdue: 0,
    cancelled: 0,
  },
})
const attendanceSessions = ref([])
const loading = ref(false)
const errorMessage = ref('')

async function loadDashboard() {
  loading.value = true
  errorMessage.value = ''

  try {
    dashboard.value = await fetchPreschoolDashboard()
    const sessionPayload = await fetchTodayAttendanceSessions()
      .catch(() => ({ items: [] }))
    attendanceSessions.value = sessionPayload.items || []
  } catch (error) {
    errorMessage.value = error?.message || t('preschoolTeacherDashboardPage.errors.loadFailed')
  } finally {
    loading.value = false
  }
}

const cards = computed(() => [
  {
    title: t('preschoolTeacherDashboardPage.cards.students.title'),
    value: dashboard.value.summary.students || 0,
    label: t('preschoolTeacherDashboardPage.cards.students.label'),
    status: 'success',
  },
  {
    title: t('preschoolTeacherDashboardPage.cards.classes.title'),
    value: dashboard.value.summary.classes || 0,
    label: t('preschoolTeacherDashboardPage.cards.classes.label'),
    status: 'info',
  },
  {
    title: t('preschoolTeacherDashboardPage.cards.attendance.title'),
    value: dashboard.value.summary.attendanceToday || 0,
    label: t('preschoolTeacherDashboardPage.cards.attendance.label'),
    status: 'warning',
  },
  {
    title: t('preschoolTeacherDashboardPage.cards.payments.title'),
    value: dashboard.value.summary.pendingPayments || 0,
    label: t('preschoolTeacherDashboardPage.cards.payments.label'),
    status: 'error',
  },
])

const actions = computed(() => [
  t('preschoolTeacherDashboardPage.actions.upcomingClasses', { count: dashboard.value.upcomingClasses.length || 0 }),
  t('preschoolTeacherDashboardPage.actions.overduePayments', { count: dashboard.value.summary.overduePayments || 0 }),
  t('preschoolTeacherDashboardPage.actions.paidPayments', { count: dashboard.value.paymentSummary?.paid || 0 }),
])

const notes = computed(() =>
  (dashboard.value.recentAttendance || []).slice(0, 5).map((item) => ({
    title: `${item.studentName || t('preschoolTeacherDashboardPage.cards.students.title')} - ${item.className || t('preschoolTeacherDashboardPage.cards.classes.title')}`,
    text: `${item.attendanceDate || '-'} • ${item.status || '-'}`,
  })),
)

const spotlightTitle = computed(() =>
  dashboard.value.upcomingClasses[0]
    ? `${dashboard.value.upcomingClasses[0].name} ${t('preschoolTeacherDashboardPage.spotlight.nextSuffix')}`
    : t('preschoolTeacherDashboardPage.spotlight.noUpcomingClasses'),
)

const spotlightText = computed(() =>
  dashboard.value.upcomingClasses[0]
    ? `${dashboard.value.upcomingClasses[0].teacherDisplayName || t('preschoolTeacherDashboardPage.spotlight.assignedTeacher')} has ${dashboard.value.upcomingClasses[0].studentsCount || 0} enrolled students.`
    : t('preschoolTeacherDashboardPage.spotlight.fallback'),
)

const todaySessions = computed(() => attendanceSessions.value.slice(0, 4))

function goToMySchedule() {
  router.push({ name: 'dashboard-preschool-teacher-schedule' })
}

function sessionStatusLabel(status) {
  return t(`preschoolAttendanceSessionsPage.statuses.${getSessionStatusKey(status)}`) || String(status || '—')
}

async function takeAttendance(session) {
  const status = normalizeSessionStatus(session.status)
  const sessionId = String(session.id || session.sessionKey || '').trim()

  if (!sessionId) return

  try {
    if (status === 'scheduled') {
      const openedSession = await openAttendanceSession(sessionId)
      await router.push({
        name: 'dashboard-preschool-teacher-attendance',
        query: {
          classId: openedSession?.classId || session.classId || '',
          date: openedSession?.attendanceDate || session.attendanceDate || new Date().toISOString().slice(0, 10),
          attendance_session_id: openedSession?.id || sessionId,
          sessionId: openedSession?.id || sessionId,
        },
      })
      return
    }

    if (status === 'open') {
      await router.push({
        name: 'dashboard-preschool-teacher-attendance',
        query: {
          classId: session.classId || '',
          date: session.attendanceDate || new Date().toISOString().slice(0, 10),
          attendance_session_id: sessionId,
          sessionId,
        },
      })
      return
    }

    await router.push({
      name: 'dashboard-preschool-teacher-attendance-session-details',
      params: { id: sessionId },
    })
  } catch (error) {
    errorMessage.value = error?.message || t('preschoolTeacherDashboardPage.errors.loadFailed')
  }
}

function actionLabel(session) {
  const status = normalizeSessionStatus(session.status)

  if (status === 'scheduled') return t('preschoolAttendanceSessionsPage.takeAttendance')
  if (status === 'open') return t('preschoolAttendanceSessionsPage.actions.continueAttendance')
  return t('preschoolAttendanceSessionsPage.actions.viewSession')
}

onMounted(() => {
  loadDashboard()
})
</script>

<template>
  <MainLayout>
    <section class="preschool-dashboard-page">
      <HeaderSection
        :title="t('preschoolTeacherDashboardPage.title')"
        :subtitle="t('preschoolTeacherDashboardPage.subtitle')"
      />

      <div class="flex flex-wrap items-center gap-2">
        <Button type="button" variant="primary" size="md" rounded="xl" @click="goToMySchedule">
          {{ t('preschoolTeacherDashboardPage.actions.mySchedule') }}
        </Button>
      </div>

      <div
        v-if="errorMessage"
        class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
      >
        {{ errorMessage }}
      </div>

      <div
        v-if="loading"
        class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500"
      >
        {{ t('preschoolTeacherDashboardPage.loading') }}
      </div>

      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div>
            <h3 class="text-sm font-semibold text-slate-900">{{ t('preschoolAttendanceSessionsPage.title') }}</h3>
            <p class="text-xs text-slate-500">{{ t('preschoolAttendanceSessionsPage.today') }}</p>
          </div>
          <p class="text-xs text-slate-500">
            {{ todaySessions.length }} {{ t('preschoolAttendanceSessionsPage.sessionStatus') }}
          </p>
        </div>
        <div v-if="!todaySessions.length" class="px-4 py-8 text-center text-sm text-slate-400">
          {{ t('preschoolAttendanceSessionsPage.noSessionsToday') }}
        </div>
        <div v-else class="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="session in todaySessions"
            :key="session.sessionKey || session.id"
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
                :status="getSessionStatusTone(session.status)"
                :label="sessionStatusLabel(session.status)"
                :translate-label="false"
                size="xs"
              />
            </div>
            <div class="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
              <div>
                <p class="uppercase tracking-wide text-slate-400">{{ t('preschoolAttendanceDashboardPage.operationalSummary.room') }}</p>
                <p class="mt-0.5 truncate text-slate-700">{{ session.roomName || '—' }}</p>
              </div>
              <div>
                <p class="uppercase tracking-wide text-slate-400">{{ t('preschoolAttendanceDashboardPage.operationalSummary.studentCount') }}</p>
                <p class="mt-0.5 text-slate-700">{{ session.studentCount ?? session.recordsCount ?? '—' }}</p>
              </div>
            </div>
            <div class="mt-3 flex items-center justify-between gap-2">
              <p class="text-xs text-slate-500">
                {{ session.generatedFromSchedule ? t('preschoolAttendanceSessionsPage.generatedFromSchedule') : t('preschoolAttendanceSessionsPage.manualSession') }}
              </p>
              <Button type="button" variant="primary" size="sm" rounded="xl" @click="takeAttendance(session)">
                {{ actionLabel(session) }}
              </Button>
            </div>
          </article>
        </div>
      </div>

      <PreschoolDashboardSummary :cards="cards" />

      <div class="preschool-dashboard-page__grid">
        <PreschoolDashboardSpotlight
          :title="spotlightTitle"
          :text="spotlightText"
        />
        <PreschoolDashboardActionList :title="t('preschoolTeacherDashboardPage.quickStats')" :items="actions" />
      </div>

      <PreschoolDashboardActivity :items="notes" />
    </section>
  </MainLayout>
</template>

<style scoped>
.preschool-dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.preschool-dashboard-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.9fr);
  gap: 1rem;
  align-items: start;
}

@media (max-width: 980px) {
  .preschool-dashboard-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>

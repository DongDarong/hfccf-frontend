<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import PreschoolDashboardSummary from '@/modules/preschool/admin/components/dashboard/PreschoolDashboardSummary.vue'
import PreschoolDashboardActivity from '@/modules/preschool/admin/components/dashboard/PreschoolDashboardActivity.vue'
import { useLanguage } from '@/composables/useLanguage'
import { formatDate } from '@/utils/date'
import { fetchPreschoolDashboard, fetchMyPreschoolClasses } from '@/modules/preschool/services/preschoolApi'

defineOptions({ name: 'TeacherPreschoolDashboard' })

const { t } = useLanguage()
const router = useRouter()

const dashboard = ref({
  summary: { students: 0, classes: 0, attendanceToday: 0 },
  recentAttendance: [],
  upcomingClasses: [],
})
const myClasses = ref([])
const loading = ref(false)
const errorMessage = ref('')

async function loadAll() {
  loading.value = true
  errorMessage.value = ''
  try {
    const [dashData, classesData] = await Promise.all([
      fetchPreschoolDashboard(),
      fetchMyPreschoolClasses({ page: 1, perPage: 50 }),
    ])
    dashboard.value = dashData
    myClasses.value = classesData.items || []
  } catch (e) {
    errorMessage.value = e?.message || t('preschoolTeacherDashboardPage.errors.loadFailed')
  } finally {
    loading.value = false
  }
}

const cards = computed(() => [
  {
    title: t('preschoolTeacherDashboardPage.cards.students.title'),
    value: dashboard.value.summary?.students || 0,
    label: t('preschoolTeacherDashboardPage.cards.students.label'),
    status: 'success',
  },
  {
    title: t('preschoolTeacherDashboardPage.cards.classes.title'),
    value: myClasses.value.length || dashboard.value.summary?.classes || 0,
    label: t('preschoolTeacherDashboardPage.cards.classes.label'),
    status: 'info',
  },
  {
    title: t('preschoolTeacherDashboardPage.cards.attendance.title'),
    value: dashboard.value.summary?.attendanceToday || 0,
    label: t('preschoolTeacherDashboardPage.cards.attendance.label'),
    status: 'warning',
  },
])

const spotlightClass = computed(() => dashboard.value.upcomingClasses?.[0] || null)

const recentActivity = computed(() =>
  (dashboard.value.recentAttendance || []).slice(0, 6).map((item) => ({
    title: `${item.studentName || '—'} — ${item.className || '—'}`,
    text: `${formatDate(item.attendanceDate) || item.attendanceDate || '-'} · ${item.status || '-'}`,
  })),
)

const today = new Date().toISOString().slice(0, 10)

function goToStudents(classId) {
  router.push({ name: 'dashboard-preschool-teacher-students', query: classId ? { classId } : {} })
}

function goToAttendance(classId) {
  router.push({
    name: 'dashboard-preschool-teacher-attendance',
    query: classId ? { classId, date: today } : {},
  })
}

function goToSchedule() {
  router.push({ name: 'dashboard-preschool-teacher-schedule' })
}

function goToReports() {
  router.push({ name: 'dashboard-preschool-teacher-report' })
}

onMounted(loadAll)
</script>

<template>
  <MainLayout>
    <section class="teacher-dashboard">
      <HeaderSection
        :title="t('preschoolTeacherDashboardPage.title')"
        :subtitle="t('preschoolTeacherDashboardPage.subtitle')"
      />

      <!-- ── Error / loading ─────────────────────────────────────────── -->
      <div
        v-if="errorMessage"
        class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
      >
        {{ errorMessage }}
      </div>
      <div
        v-if="loading && !myClasses.length"
        class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500"
      >
        {{ t('preschoolTeacherDashboardPage.loading') }}
      </div>

      <!-- ── Summary cards ───────────────────────────────────────────── -->
      <PreschoolDashboardSummary :cards="cards" />

      <!-- ── Main content grid ───────────────────────────────────────── -->
      <div class="teacher-dashboard__grid">

        <!-- ── My Classes ────────────────────────────────────────────── -->
        <section class="teacher-dashboard__panel">
          <div class="teacher-dashboard__panel-header">
            <div>
              <h2 class="teacher-dashboard__panel-title">
                {{ t('preschoolTeacherDashboardPage.classes.title') }}
              </h2>
              <p class="teacher-dashboard__panel-sub">
                {{ t('preschoolTeacherDashboardPage.classes.subtitle') }}
              </p>
            </div>
          </div>

          <!-- Empty -->
          <p v-if="!loading && !myClasses.length" class="teacher-dashboard__empty">
            {{ t('preschoolTeacherDashboardPage.classes.noClasses') }}
          </p>

          <!-- Loading shimmer -->
          <div v-else-if="loading" class="space-y-3">
            <div
              v-for="n in 2"
              :key="n"
              class="h-24 animate-pulse rounded-xl bg-slate-100"
            />
          </div>

          <!-- Class cards -->
          <div v-else class="space-y-3">
            <div
              v-for="cls in myClasses"
              :key="cls.id"
              class="teacher-dashboard__class-card"
            >
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-slate-900">{{ cls.name }}</p>
                <div class="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500">
                  <span v-if="cls.level">
                    {{ t('preschoolTeacherDashboardPage.classes.level') }}: {{ cls.level }}
                  </span>
                  <span v-if="cls.room">
                    {{ t('preschoolTeacherDashboardPage.classes.room') }}: {{ cls.room }}
                  </span>
                  <span v-if="cls.schedule">{{ cls.schedule }}</span>
                </div>
              </div>
              <div class="flex flex-shrink-0 flex-col items-end gap-2">
                <span class="teacher-dashboard__student-badge">
                  {{ t('preschoolTeacherDashboardPage.classes.studentsCount', { count: cls.studentsCount || 0 }) }}
                </span>
                <div class="flex gap-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    rounded="xl"
                    @click="goToStudents(cls.id)"
                  >
                    {{ t('preschoolTeacherDashboardPage.classes.viewStudents') }}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    rounded="xl"
                    @click="goToAttendance(cls.id)"
                  >
                    {{ t('preschoolTeacherDashboardPage.classes.viewAttendance') }}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ── Right column ──────────────────────────────────────────── -->
        <div class="space-y-4">

          <!-- Spotlight: next upcoming class -->
          <section v-if="spotlightClass" class="teacher-dashboard__panel">
            <p class="teacher-dashboard__eyebrow">
              {{ t('preschoolTeacherDashboardPage.spotlight.nextSuffix') }}
            </p>
            <p class="mt-1 text-base font-bold text-slate-900">{{ spotlightClass.name }}</p>
            <p class="mt-1 text-sm text-slate-500">
              {{ t('preschoolTeacherDashboardPage.spotlight.studentsEnrolled', { count: spotlightClass.studentsCount || 0 }) }}
            </p>
          </section>

          <!-- Quick navigation -->
          <section class="teacher-dashboard__panel">
            <h2 class="teacher-dashboard__panel-title mb-3">
              {{ t('preschoolTeacherDashboardPage.quickNav.title') }}
            </h2>
            <div class="flex flex-col gap-2">
              <Button
                type="button"
                variant="secondary"
                size="md"
                rounded="xl"
                class="w-full justify-start"
                @click="goToSchedule"
              >
                {{ t('preschoolTeacherDashboardPage.quickNav.schedule') }}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="md"
                rounded="xl"
                class="w-full justify-start"
                @click="goToStudents(null)"
              >
                {{ t('preschoolTeacherDashboardPage.quickNav.students') }}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="md"
                rounded="xl"
                class="w-full justify-start"
                @click="goToAttendance(null)"
              >
                {{ t('preschoolTeacherDashboardPage.quickNav.attendance') }}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="md"
                rounded="xl"
                class="w-full justify-start"
                @click="goToReports"
              >
                {{ t('preschoolTeacherDashboardPage.quickNav.reports') }}
              </Button>
            </div>
          </section>
        </div>
      </div>

      <!-- ── Recent attendance activity ─────────────────────────────── -->
      <PreschoolDashboardActivity
        v-if="recentActivity.length"
        :items="recentActivity"
      />
    </section>
  </MainLayout>
</template>

<style scoped>
.teacher-dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.teacher-dashboard__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(260px, 0.85fr);
  gap: 1rem;
  align-items: start;
}

.teacher-dashboard__panel {
  padding: 1.25rem;
  border-radius: 1.25rem;
  border: 1px solid #dbe6f2;
  background:
    radial-gradient(circle at top left, rgba(186, 230, 253, 0.12), transparent 30%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.97) 0%, rgba(248, 250, 252, 0.96) 100%);
  box-shadow: 0 18px 45px -38px rgba(15, 23, 42, 0.45);
}

.teacher-dashboard__panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.teacher-dashboard__panel-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.teacher-dashboard__panel-sub {
  font-size: 0.82rem;
  color: #64748b;
  margin: 0.2rem 0 0;
}

.teacher-dashboard__eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #6366f1;
}

.teacher-dashboard__empty {
  font-size: 0.875rem;
  color: #94a3b8;
  font-style: italic;
  padding: 1.5rem 0;
  text-align: center;
}

.teacher-dashboard__class-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  background: #fff;
  transition: border-color 0.15s;
}

.teacher-dashboard__class-card:hover {
  border-color: #c7d2fe;
}

.teacher-dashboard__student-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.6rem;
  border-radius: 99px;
  font-size: 0.72rem;
  font-weight: 600;
  background: #ede9fe;
  color: #4338ca;
  border: 1px solid #c4b5fd;
}

@media (max-width: 980px) {
  .teacher-dashboard__grid {
    grid-template-columns: 1fr;
  }
}
</style>

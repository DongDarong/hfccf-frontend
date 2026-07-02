<script setup>
import { computed, onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useAnalyticsFilters } from './composables/useAnalyticsFilters'
import { useAnalyticsActions } from './composables/useAnalyticsActions'
import { useAnalyticsData } from './composables/useAnalyticsData'
import AnalyticsHeaderSection from './sections/AnalyticsHeaderSection.vue'
import AnalyticsFilterBar from './components/AnalyticsFilterBar.vue'
import AnalyticsOverviewSection from './sections/AnalyticsOverviewSection.vue'
import AttendanceAnalyticsSection from './sections/AttendanceAnalyticsSection.vue'
import SessionAnalyticsSection from './sections/SessionAnalyticsSection.vue'
import ScheduleAnalyticsSection from './sections/ScheduleAnalyticsSection.vue'
import AlertAnalyticsSection from './sections/AlertAnalyticsSection.vue'
import GuardianAnalyticsSection from './sections/GuardianAnalyticsSection.vue'
import StudentAnalyticsSection from './sections/StudentAnalyticsSection.vue'
import TeacherAnalyticsSection from './sections/TeacherAnalyticsSection.vue'
import ReportLauncherSection from './sections/ReportLauncherSection.vue'

defineOptions({
  name: 'PreschoolAnalyticsDashboardPage',
})

const { t } = useLanguage()
const { filters, resetFilters } = useAnalyticsFilters()
const {
  loading,
  errorMessage,
  filterOptions,
  dashboard,
  attendance,
  sessions,
  schedules,
  alerts,
  students,
  teachers,
  guardianContacts,
  loadAnalytics,
  hasAnalyticsData,
} = useAnalyticsData()
const { openReportDataset } = useAnalyticsActions()

const filterLabels = computed(() => ({
  title: t('preschoolAnalyticsPage.filters.title'),
  subtitle: '',
  dateRange: t('preschoolAnalyticsPage.filters.dateRange'),
  academicYear: t('preschoolAnalyticsPage.filters.academicYear'),
  class: t('preschoolAnalyticsPage.filters.class'),
  teacher: t('preschoolAnalyticsPage.filters.teacher'),
  status: t('preschoolAnalyticsPage.filters.status'),
  apply: t('preschoolAnalyticsPage.filters.apply'),
  reset: t('preschoolAnalyticsPage.filters.reset'),
}))

const reportLaunchers = computed(() => [
  {
    key: 'attendance',
    label: t('preschoolAnalyticsPage.attendanceReport'),
    description: t('preschoolAnalyticsPage.reportDataset'),
    action: t('common.actions.viewAll'),
  },
  {
    key: 'sessions',
    label: t('preschoolAnalyticsPage.sessionReport'),
    description: t('preschoolAnalyticsPage.reportDataset'),
    action: t('common.actions.viewAll'),
  },
  {
    key: 'schedules',
    label: t('preschoolAnalyticsPage.scheduleReport'),
    description: t('preschoolAnalyticsPage.reportDataset'),
    action: t('common.actions.viewAll'),
  },
])

const detailLinks = computed(() => ({
  attendance: {
    name: 'dashboard-preschool-admin-analytics-attendance',
    query: { ...filters.value },
  },
  sessions: {
    name: 'dashboard-preschool-admin-analytics-sessions',
    query: { ...filters.value },
  },
  alerts: {
    name: 'dashboard-preschool-admin-analytics-alerts',
    query: { ...filters.value },
  },
  students: {
    name: 'dashboard-preschool-admin-analytics-students',
    query: { ...filters.value },
  },
  teachers: {
    name: 'dashboard-preschool-admin-analytics-teachers',
    query: { ...filters.value },
  },
  guardianContacts: {
    name: 'dashboard-preschool-admin-analytics-guardian-contacts',
    query: { ...filters.value },
  },
}))

async function refreshAnalytics() {
  await loadAnalytics(filters.value)
}

function resetAndRefresh() {
  resetFilters()
  return loadAnalytics(filters.value)
}

onMounted(() => {
  refreshAnalytics()
})
</script>

<template>
  <MainLayout>
    <section class="space-y-6">
      <HeaderSection
        :title="t('preschoolAnalyticsPage.title')"
        :subtitle="t('preschoolAnalyticsPage.subtitle')"
      />

      <AnalyticsHeaderSection
        :title="t('preschoolAnalyticsPage.title')"
        :subtitle="t('preschoolAnalyticsPage.subtitle')"
        :generated-at="dashboard.generatedAt ? `${t('preschoolAnalyticsPage.generatedAt')}: ${dashboard.generatedAt}` : ''"
        :loading="loading"
        :refresh-label="t('preschoolAnalyticsPage.refresh')"
        @refresh="refreshAnalytics"
      />

      <AnalyticsFilterBar
        v-model="filters"
        :options="filterOptions"
        :labels="filterLabels"
        :loading="loading"
        @apply="refreshAnalytics"
        @reset="resetAndRefresh"
      />

      <div v-if="errorMessage" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ errorMessage }}
      </div>

      <AnalyticsOverviewSection
        :analytics="dashboard"
        :title="t('preschoolAnalyticsPage.overview')"
        :subtitle="t('preschoolAnalyticsPage.subtitle')"
        :details-to="detailLinks"
        :empty-text="t('preschoolAnalyticsPage.noAnalyticsData')"
      />

      <AttendanceAnalyticsSection
        :analytics="attendance"
        :title="t('preschoolAnalyticsPage.attendanceAnalytics')"
        :subtitle="t('preschoolAnalyticsPage.sections.attendance.subtitle')"
        :details-to="detailLinks"
        :empty-text="t('preschoolAnalyticsPage.noAnalyticsData')"
      />

      <SessionAnalyticsSection
        :analytics="sessions"
        :title="t('preschoolAnalyticsPage.sessionAnalytics')"
        :subtitle="t('preschoolAnalyticsPage.sections.sessions.subtitle')"
        :details-to="detailLinks"
        :empty-text="t('preschoolAnalyticsPage.noAnalyticsData')"
      />

      <ScheduleAnalyticsSection
        :analytics="schedules"
        :title="t('preschoolAnalyticsPage.scheduleAnalytics')"
        :subtitle="t('preschoolAnalyticsPage.sections.schedules.subtitle')"
        :details-to="detailLinks"
        :empty-text="t('preschoolAnalyticsPage.noAnalyticsData')"
      />

      <AlertAnalyticsSection
        :analytics="alerts"
        :title="t('preschoolAnalyticsPage.alertAnalytics')"
        :subtitle="t('preschoolAnalyticsPage.sections.alerts.subtitle')"
        :details-to="detailLinks"
        :empty-text="t('preschoolAnalyticsPage.noAnalyticsData')"
      />

      <GuardianAnalyticsSection
        :analytics="guardianContacts"
        :title="t('preschoolAnalyticsPage.guardianAnalytics')"
        :subtitle="t('preschoolAnalyticsPage.sections.guardians.subtitle')"
        :details-to="detailLinks"
        :empty-text="t('preschoolAnalyticsPage.noAnalyticsData')"
      />

      <StudentAnalyticsSection
        :analytics="students"
        :title="t('preschoolAnalyticsPage.studentAnalytics')"
        :subtitle="t('preschoolAnalyticsPage.sections.students.subtitle')"
        :details-to="detailLinks"
        :empty-text="t('preschoolAnalyticsPage.noAnalyticsData')"
      />

      <TeacherAnalyticsSection
        :analytics="teachers"
        :title="t('preschoolAnalyticsPage.teacherAnalytics')"
        :subtitle="t('preschoolAnalyticsPage.sections.teachers.subtitle')"
        :details-to="detailLinks"
        :empty-text="t('preschoolAnalyticsPage.noAnalyticsData')"
      />

      <ReportLauncherSection
        :items="reportLaunchers"
        :title="t('preschoolAnalyticsPage.reportLauncher')"
        :subtitle="t('preschoolAnalyticsPage.subtitle')"
        @open="openReportDataset"
      />

      <div v-if="!loading && !hasAnalyticsData" class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-sm text-slate-500">
        {{ t('preschoolAnalyticsPage.noAnalyticsData') }}
      </div>
    </section>
  </MainLayout>
</template>

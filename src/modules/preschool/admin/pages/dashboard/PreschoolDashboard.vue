<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import AppStatusChip from '@/components/ui/AppStatusChip.vue'
import { useLanguage } from '@/composables/useLanguage'
import DashboardHeroSection from '@/modules/preschool/admin/pages/dashboard/sections/DashboardHeroSection.vue'
import DashboardSummarySection from '@/modules/preschool/admin/pages/dashboard/sections/DashboardSummarySection.vue'
import DashboardPrioritySection from '@/modules/preschool/admin/pages/dashboard/sections/DashboardPrioritySection.vue'
import { useDashboardData } from '@/modules/preschool/admin/pages/dashboard/composables/useDashboardData'
import { useDashboardActions } from '@/modules/preschool/admin/pages/dashboard/composables/useDashboardActions'
import './preschool-dashboard.css'

defineOptions({
  name: 'PreschoolDashboardPage',
})

const { t } = useLanguage()
const {
  academicYear,
  academicTerm,
  lastUpdated,
  spotlightTitle,
  spotlightText,
  summaryCards,
  attendanceAlertSummaryCards,
  recentAttendanceAlertItems,
  operationalSummaryCards,
  todayScheduleItemsForView,
  todayAttendanceSessionItems,
  attendanceProgressCards,
  todayMissingSessionCount,
  priorityItems,
  loading,
  errorMessage,
  loadDashboard,
} = useDashboardData()

const { toolbarMenuItems, goToScheduleManagement } = useDashboardActions()

onMounted(loadDashboard)
</script>

<template>
  <MainLayout>
    <section class="preschool-dashboard-page">
      <DashboardHeroSection
        :title="t('preschoolDashboardPage.title')"
        :subtitle="t('preschoolDashboardPage.subtitle')"
        :academic-year="academicYear"
        :academic-term="academicTerm"
        :last-updated="lastUpdated"
        :spotlight-title="spotlightTitle"
        :spotlight-text="spotlightText"
        :loading="loading"
        :primary-label="t('preschoolDashboardPage.header.scheduleManagement')"
        :menu-label="t('common.actions.menu')"
        :refresh-label="t('preschoolDashboardPage.header.refresh')"
        :menu-items="toolbarMenuItems"
        @refresh="loadDashboard"
        @primary="goToScheduleManagement"
      />

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

      <DashboardSummarySection :cards="summaryCards" />

      <section class="preschool-dashboard-page__section">
        <div class="preschool-dashboard-page__section-header">
          <div>
            <h2 class="preschool-dashboard-page__section-title">
              {{ t('preschoolDashboardPage.operationalSummary.title') }}
            </h2>
            <p class="preschool-dashboard-page__section-subtitle">
              {{ t('preschoolDashboardPage.operationalSummary.subtitle') }}
            </p>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="card in operationalSummaryCards"
            :key="card.title"
            class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {{ card.title }}
            </p>
            <p class="mt-2 text-3xl font-bold text-slate-900">
              {{ card.value }}
            </p>
            <p class="mt-1 text-xs text-slate-500">
              {{ card.label }}
            </p>
          </article>
        </div>

        <div class="mt-4 grid gap-4 xl:grid-cols-2">
          <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-sm font-semibold text-slate-900">
                  {{ t('preschoolDashboardPage.operationalSummary.todaySchedule.title') }}
                </h3>
                <p class="text-sm text-slate-500">
                  {{ t('preschoolDashboardPage.operationalSummary.todaySchedule.subtitle') }}
                </p>
              </div>
              <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {{ todayMissingSessionCount }}
              </span>
            </div>

            <div v-if="todayScheduleItemsForView.length === 0" class="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
              {{ t('preschoolDashboardPage.operationalSummary.noSessionsToday') }}
            </div>

            <div v-else class="mt-4 space-y-3">
              <article
                v-for="item in todayScheduleItemsForView"
                :key="item.id"
                class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-slate-900">
                      {{ item.title }}
                    </p>
                    <p class="mt-1 text-sm text-slate-500">
                      {{ item.text || t('preschoolDashboardPage.operationalSummary.noSessionGenerated') }}
                    </p>
                  </div>
                  <AppStatusChip
                    :status="item.hasSession ? item.status : 'warning'"
                    :label="item.hasSession ? item.statusLabel : t('preschoolDashboardPage.operationalSummary.noSessionGenerated')"
                    :translate-label="false"
                    size="xs"
                  />
                </div>
              </article>
            </div>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-sm font-semibold text-slate-900">
                  {{ t('preschoolDashboardPage.operationalSummary.todaySessions.title') }}
                </h3>
                <p class="text-sm text-slate-500">
                  {{ t('preschoolDashboardPage.operationalSummary.todaySessions.subtitle') }}
                </p>
              </div>
              <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {{ todayAttendanceSessionItems.length }}
              </span>
            </div>

            <div v-if="todayAttendanceSessionItems.length === 0" class="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
              {{ t('preschoolDashboardPage.operationalSummary.noSessionsToday') }}
            </div>

            <div v-else class="mt-4 space-y-3">
              <article
                v-for="item in todayAttendanceSessionItems"
                :key="item.id"
                class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <RouterLink
                      :to="{ name: 'dashboard-preschool-admin-attendance-session-details', params: { id: item.id } }"
                      class="truncate text-sm font-semibold text-slate-900 hover:text-violet-700"
                    >
                      {{ item.title }}
                    </RouterLink>
                    <p class="mt-1 text-sm text-slate-500">
                      {{ item.text || t('preschoolDashboardPage.operationalSummary.noSessionGenerated') }}
                    </p>
                  </div>
                  <AppStatusChip
                    :status="item.status"
                    :label="item.statusLabel"
                    :translate-label="false"
                    size="xs"
                  />
                </div>
              </article>
            </div>
          </article>
        </div>

        <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="card in attendanceProgressCards"
            :key="card.label"
            class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {{ card.label }}
            </p>
            <p class="mt-2 text-2xl font-bold text-slate-900">
              {{ card.value }}
            </p>
          </article>
        </div>
      </section>

      <section class="preschool-dashboard-page__section">
        <div class="preschool-dashboard-page__section-header">
          <div>
            <h2 class="preschool-dashboard-page__section-title">
              {{ t('preschoolAttendanceDashboardPage.alertSummary.title') }}
            </h2>
            <p class="preschool-dashboard-page__section-subtitle">
              {{ t('preschoolAttendanceDashboardPage.alertSummary.subtitle') }}
            </p>
          </div>
          <RouterLink
            :to="{ name: 'dashboard-preschool-admin-attendance-alerts' }"
            class="preschool-dashboard-page__panel-link"
          >
            {{ t('preschoolAttendanceDashboardPage.alertSummary.viewAllAttendanceAlerts') }}
          </RouterLink>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article
            v-for="card in attendanceAlertSummaryCards"
            :key="card.title"
            class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {{ card.title }}
            </p>
            <p class="mt-2 text-3xl font-bold text-slate-900">
              {{ card.value }}
            </p>
            <p class="mt-1 text-xs text-slate-500">
              {{ card.caption }}
            </p>
          </article>
        </div>

        <div class="mt-4 grid gap-3 lg:grid-cols-2">
          <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div class="flex items-center justify-between gap-3">
              <div>
                <h3 class="text-sm font-semibold text-slate-900">
                  {{ t('preschoolAttendanceDashboardPage.alertSummary.recentRepeatedAbsences') }}
                </h3>
                <p class="text-sm text-slate-500">
                  {{ t('preschoolAttendanceDashboardPage.alertSummary.recentRepeatedAbsencesSubtitle') }}
                </p>
              </div>
              <span class="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                {{ recentAttendanceAlertItems.length }}
              </span>
            </div>

            <div v-if="recentAttendanceAlertItems.length === 0" class="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
              {{ t('preschoolAttendanceDashboardPage.alertSummary.noRepeatedAbsenceAlerts') }}
            </div>

            <div v-else class="mt-4 space-y-3">
              <article
                v-for="item in recentAttendanceAlertItems"
                :key="`${item.label}-${item.title}`"
                class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-sm font-semibold text-slate-900">
                      {{ item.title }}
                    </p>
                    <p class="mt-1 text-sm text-slate-500">
                      {{ item.text || t('preschoolAttendanceDashboardPage.alertSummary.latestAttendanceAlert') }}
                    </p>
                  </div>
                  <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                    {{ item.label }}
                  </span>
                </div>
              </article>
            </div>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 class="text-sm font-semibold text-slate-900">
              {{ t('preschoolAttendanceDashboardPage.alertSummary.latestAttendanceAlert') }}
            </h3>
            <p class="mt-1 text-sm text-slate-500">
              {{ recentAttendanceAlertItems[0]?.text || t('preschoolAttendanceDashboardPage.alertSummary.noRepeatedAbsenceAlerts') }}
            </p>
          </article>
        </div>
      </section>

      <DashboardPrioritySection
        :title="t('preschoolDashboardPage.priority.title')"
        :subtitle="t('preschoolDashboardPage.priority.subtitle')"
        :card-title="t('preschoolDashboardPage.priority.cardTitle')"
        :items="priorityItems"
        :empty-text="t('preschoolDashboardPage.priority.empty')"
      />
    </section>
  </MainLayout>
</template>

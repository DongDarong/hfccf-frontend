<script setup>
import { onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useLanguage } from '@/composables/useLanguage'
import DashboardHeroSection from '@/modules/preschool/admin/pages/dashboard/sections/DashboardHeroSection.vue'
import DashboardSummarySection from '@/modules/preschool/admin/pages/dashboard/sections/DashboardSummarySection.vue'
import DashboardPrioritySection from '@/modules/preschool/admin/pages/dashboard/sections/DashboardPrioritySection.vue'
import DashboardHealthSection from '@/modules/preschool/admin/pages/dashboard/sections/DashboardHealthSection.vue'
import DashboardInsightsSection from '@/modules/preschool/admin/pages/dashboard/sections/DashboardInsightsSection.vue'
import DashboardOperationsSection from '@/modules/preschool/admin/pages/dashboard/sections/DashboardOperationsSection.vue'
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
  systemHealthItems,
  priorityItems,
  insightCards,
  recentActivityItems,
  upcomingClasses,
  classroomSummaryItems,
  loading,
  errorMessage,
  loadDashboard,
} = useDashboardData()

const { toolbarMenuItems, shortcutActions, goToScheduleManagement } = useDashboardActions()

const recentActivityViewAllTo = { name: 'dashboard-preschool-admin-attendance-history' }
const upcomingSchedulesViewAllTo = { name: 'dashboard-preschool-admin-schedules' }
const classroomSummaryViewAllTo = { name: 'dashboard-preschool-admin-classes' }

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

      <DashboardPrioritySection
        :title="t('preschoolDashboardPage.priority.title')"
        :subtitle="t('preschoolDashboardPage.priority.subtitle')"
        :card-title="t('preschoolDashboardPage.priority.cardTitle')"
        :items="priorityItems"
        :empty-text="t('preschoolDashboardPage.priority.empty')"
      />

      <DashboardHealthSection
        :title="t('preschoolDashboardPage.executiveHealth.title')"
        :subtitle="t('preschoolDashboardPage.executiveHealth.subtitle')"
        :items="systemHealthItems"
      />

      <DashboardInsightsSection
        :title="t('preschoolDashboardPage.insights.title')"
        :subtitle="t('preschoolDashboardPage.insights.subtitle')"
        :cards="insightCards"
      />

      <DashboardOperationsSection
        :title="t('preschoolDashboardPage.operations.title')"
        :subtitle="t('preschoolDashboardPage.operations.subtitle')"
        :recent-activity-items="recentActivityItems"
        :recent-activity-empty-text="t('preschoolDashboardPage.operations.recentActivityEmpty')"
        :recent-activity-view-all-text="t('preschoolDashboardPage.operations.viewAll')"
        :recent-activity-view-all-to="recentActivityViewAllTo"
        :upcoming-schedules-title="t('preschoolDashboardPage.operations.upcomingSchedules')"
        :upcoming-schedules-subtitle="t('preschoolDashboardPage.operations.upcomingSchedulesSubtitle')"
        :upcoming-schedules-empty-text="t('preschoolDashboardPage.operations.upcomingEmpty')"
        :upcoming-schedules-view-all-text="t('preschoolDashboardPage.operations.viewAll')"
        :upcoming-schedules-view-all-to="upcomingSchedulesViewAllTo"
        :classroom-summary-title="t('preschoolDashboardPage.operations.classroomSummary.title')"
        :classroom-summary-subtitle="t('preschoolDashboardPage.operations.classroomSummary.subtitle')"
        :classroom-summary-view-all-text="t('preschoolDashboardPage.operations.viewAll')"
        :classroom-summary-view-all-to="classroomSummaryViewAllTo"
        :shortcuts-title="t('preschoolDashboardPage.operations.shortcuts.title')"
        :shortcuts-subtitle="t('preschoolDashboardPage.operations.shortcuts.subtitle')"
        :upcoming-classes="upcomingClasses"
        :classroom-summary-items="classroomSummaryItems"
        :shortcut-actions="shortcutActions"
      />
    </section>
  </MainLayout>
</template>

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'

export function useDashboardActions() {
  const router = useRouter()
  const { t } = useLanguage()

  const toolbarMenuItems = computed(() => [
    {
      label: t('preschoolDashboardPage.header.scheduleManagement'),
      icon: 'pi pi-calendar-plus',
      command: () => goToScheduleManagement(),
    },
    {
      label: t('preschoolDashboardPage.header.openReports'),
      icon: 'pi pi-chart-bar',
      command: () => goToReportsCenter(),
    },
  ])

  const shortcutActions = computed(() => [
    {
      label: t('preschoolDashboardPage.operations.shortcuts.schedule'),
      description: t('preschoolDashboardPage.operations.shortcuts.scheduleDescription'),
      actionLabel: t('preschoolDashboardPage.operations.shortcuts.scheduleAction'),
      iconClass: 'pi pi-calendar-plus',
      click: () => goToScheduleManagement(),
    },
    {
      label: t('preschoolDashboardPage.operations.shortcuts.reports'),
      description: t('preschoolDashboardPage.operations.shortcuts.reportsDescription'),
      actionLabel: t('preschoolDashboardPage.operations.shortcuts.reportsAction'),
      iconClass: 'pi pi-chart-bar',
      click: () => goToReportsCenter(),
    },
    {
      label: t('preschoolDashboardPage.operations.shortcuts.settings'),
      description: t('preschoolDashboardPage.operations.shortcuts.settingsDescription'),
      actionLabel: t('preschoolDashboardPage.operations.shortcuts.settingsAction'),
      iconClass: 'pi pi-cog',
      click: () => router.push({ name: 'dashboard-preschool-admin-settings' }),
    },
    {
      label: t('preschoolDashboardPage.operations.shortcuts.enrollments'),
      description: t('preschoolDashboardPage.operations.shortcuts.enrollmentsDescription'),
      actionLabel: t('preschoolDashboardPage.operations.shortcuts.enrollmentsAction'),
      iconClass: 'pi pi-users',
      click: () => router.push({ name: 'dashboard-preschool-admin-enrollments' }),
    },
  ])

  function goToScheduleManagement() {
    router.push({ name: 'dashboard-preschool-admin-schedules' })
  }

  function goToReportsCenter() {
    router.push({ name: 'dashboard-preschool-admin-reports' })
  }

  return {
    toolbarMenuItems,
    shortcutActions,
    goToScheduleManagement,
    goToReportsCenter,
  }
}

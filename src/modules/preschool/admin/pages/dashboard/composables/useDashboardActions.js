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
      click: () => goToScheduleManagement(),
    },
    {
      label: t('preschoolDashboardPage.operations.shortcuts.reports'),
      click: () => goToReportsCenter(),
    },
    {
      label: t('preschoolDashboardPage.operations.shortcuts.settings'),
      click: () => router.push({ name: 'dashboard-preschool-admin-settings' }),
    },
    {
      label: t('preschoolDashboardPage.operations.shortcuts.enrollments'),
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

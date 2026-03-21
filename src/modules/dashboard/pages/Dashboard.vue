<script setup>
import { computed } from 'vue'
import { getCurrentUser, hasPermission } from '@/services/auth'
import SuperAdminDashboard from '@/modules/super-admin/pages/Dashboard.vue'
import PreschoolAdminDashboard from '@/modules/preschool/admin/pages/Dashboard.vue'
import ScholarshipAdminDashboard from '@/modules/scholarship/admin/pages/Dashboard.vue'
import EnglishAdminDashboard from '@/modules/english/admin/pages/Dashboard.vue'
import SportAdminDashboard from '@/modules/sport/admin/pages/Dashboard.vue'
import TeacherDashboard from '@/modules/english/teacher/pages/Dashboard.vue'
import CoachDashboard from '@/modules/sport/coach/pages/Dashboard.vue'
import OperationsDashboard from '@/shared/components/dashboards/OperationsDashboard.vue'
import DeliveryDashboard from '@/shared/components/dashboards/DeliveryDashboard.vue'
import ProgramsDashboard from '@/shared/components/dashboards/ProgramsDashboard.vue'
import BasicDashboard from '@/shared/components/dashboards/BasicDashboard.vue'

defineOptions({
  name: 'DashboardPage',
})

const currentUser = computed(() => getCurrentUser() || {})
const normalizedRole = computed(() =>
  String(currentUser.value?.role || '')
    .trim()
    .toLowerCase(),
)

function resolveDashboardKey() {
  if (hasPermission('all:*', currentUser.value)) return 'superadmin'
  if (normalizedRole.value === 'adminpreschool') return 'adminpreschool'
  if (normalizedRole.value === 'adminscholaship') return 'adminscholaship'
  if (normalizedRole.value === 'adminenglish') return 'adminenglish'
  if (normalizedRole.value === 'adminsport') return 'adminsport'
  if (normalizedRole.value === 'teacher' && hasPermission('tasks:write', currentUser.value))
    return 'teacher'
  if (normalizedRole.value === 'coach' && hasPermission('training:write', currentUser.value))
    return 'coach'
  if (hasPermission('users:write', currentUser.value)) return 'operations'
  if (hasPermission('tasks:write', currentUser.value)) return 'delivery'
  if (hasPermission('programs:write', currentUser.value)) return 'programs'
  return 'basic'
}

const dashboardComponentByKey = {
  superadmin: SuperAdminDashboard,
  adminpreschool: PreschoolAdminDashboard,
  adminscholaship: ScholarshipAdminDashboard,
  adminenglish: EnglishAdminDashboard,
  adminsport: SportAdminDashboard,
  teacher: TeacherDashboard,
  coach: CoachDashboard,
  operations: OperationsDashboard,
  delivery: DeliveryDashboard,
  programs: ProgramsDashboard,
  basic: BasicDashboard,
}

const activeDashboardComponent = computed(
  () => dashboardComponentByKey[resolveDashboardKey()] || dashboardComponentByKey.basic,
)
</script>

<template>
  <component :is="activeDashboardComponent" />
</template>





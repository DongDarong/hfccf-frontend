<script setup>
import { computed } from 'vue'
import { getCurrentUser, hasPermission } from '@/services/auth'
import SuperAdminDashboard from '@/pages/module/super-admin/SuperAdminDashboard.vue'
import PreschoolAdminDashboard from '@/pages/module/preschool-admin/PreschoolAdminDashboard.vue'
import ScholarshipAdminDashboard from '@/pages/module/scholarship-admin/ScholarshipAdminDashboard.vue'
import EnglishAdminDashboard from '@/pages/module/english-admin/EnglishAdminDashboard.vue'
import SportAdminDashboard from '@/pages/module/sport-admin/SportAdminDashboard.vue'
import TeacherDashboard from '@/pages/module/teachers-coaches/teacher-english/TeacherDashboard.vue'
import CoachDashboard from '@/pages/module/teachers-coaches/coach/CoachDashboard.vue'
import OperationsDashboard from '@/pages/module/roles/OperationsDashboard.vue'
import DeliveryDashboard from '@/pages/module/roles/DeliveryDashboard.vue'
import ProgramsDashboard from '@/pages/module/roles/ProgramsDashboard.vue'
import BasicDashboard from '@/pages/module/roles/BasicDashboard.vue'

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

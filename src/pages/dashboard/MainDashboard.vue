<script setup>
import { computed } from 'vue'
import { getCurrentUser, hasPermission } from '@/services/auth'
import SuperAdminDashboard from '@/pages/dashboard/SuperAdmin/SuperAdminDashboard.vue'
import PreschoolAdminDashboard from '@/pages/dashboard/PreschoolAdmin/PreschoolAdminDashboard.vue'
import ScholarshipAdminDashboard from '@/pages/dashboard/ScholarshipAdmin/ScholarshipAdminDashboard.vue'
import EnglishAdminDashboard from '@/pages/dashboard/EnglishAdmin/EnglishAdminDashboard.vue'
import SportAdminDashboard from '@/pages/dashboard/SportAdmin/SportAdminDashboard.vue'
import TeacherDashboard from '@/pages/dashboard/EnglishAdmin/TeacherEnglish/TeacherDashboard.vue'
import CoachDashboard from '@/pages/dashboard/SportAdmin/Coach/CoachDashboard.vue'
import OperationsDashboard from '@/pages/dashboard/roles/OperationsDashboard.vue'
import DeliveryDashboard from '@/pages/dashboard/roles/DeliveryDashboard.vue'
import ProgramsDashboard from '@/pages/dashboard/roles/ProgramsDashboard.vue'
import BasicDashboard from '@/pages/dashboard/roles/BasicDashboard.vue'

defineOptions({
  name: 'DashboardPage',
})

const currentUser = computed(() => getCurrentUser() || {})
const normalizedRole = computed(() => String(currentUser.value?.role || '').trim().toLowerCase())

function resolveDashboardKey() {
  if (hasPermission('all:*', currentUser.value)) return 'superadmin'
  if (normalizedRole.value === 'adminpreschool') return 'adminpreschool'
  if (normalizedRole.value === 'adminscholaship') return 'adminscholaship'
  if (normalizedRole.value === 'adminenglish') return 'adminenglish'
  if (normalizedRole.value === 'adminsport') return 'adminsport'
  if (normalizedRole.value === 'teacher' && hasPermission('tasks:write', currentUser.value)) return 'teacher'
  if (normalizedRole.value === 'coach' && hasPermission('training:write', currentUser.value)) return 'coach'
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

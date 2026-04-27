<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import { getCurrentUser, hasPermission } from '@/services/auth'
import SuperAdminDashboard from '@/modules/super-admin/pages/Dashboard.vue'
import PreschoolAdminDashboard from '@/modules/preschool/admin/pages/PreschoolDashboard.vue'
import ScholarshipAdminDashboard from '@/modules/scholarship/admin/pages/Dashboard.vue'
import EnglishAdminDashboard from '@/modules/english/admin/pages/Dashboard.vue'
import SportAdminDashboard from '@/modules/sport/admin/pages/Dashboard.vue'
import TeacherEnglishDashboard from '@/modules/english/teacher/pages/Dashboard.vue'
import CoachDashboard from '@/modules/sport/coach/pages/Dashboard.vue'
import PreschoolTeacherDashboard from '@/modules/preschool/teacher/pages/Dashboard.vue'
import ScholarshipTeacherDashboard from '@/modules/scholarship/teacher/pages/Dashboard.vue'
import OperationsDashboard from '@/shared/components/dashboards/OperationsDashboard.vue'
import DeliveryDashboard from '@/shared/components/dashboards/DeliveryDashboard.vue'
import ProgramsDashboard from '@/shared/components/dashboards/ProgramsDashboard.vue'
import BasicDashboard from '@/shared/components/dashboards/BasicDashboard.vue'
import { ROLES, isTeacherRole, normalizeRole } from '@/constants/roles'

defineOptions({
  name: 'DashboardPage',
})

const router = useRouter()
const currentUser = computed(() => getCurrentUser() || {})
const normalizedRole = computed(() => normalizeRole(currentUser.value?.role))

const dashboardByRole = Object.freeze({
  [ROLES.SUPER_ADMIN]: SuperAdminDashboard,
  [ROLES.ADMIN_ENGLISH]: EnglishAdminDashboard,
  [ROLES.ADMIN_PRESCHOOL]: PreschoolAdminDashboard,
  [ROLES.ADMIN_SCHOLARSHIP]: ScholarshipAdminDashboard,
  [ROLES.ADMIN_SPORT]: SportAdminDashboard,
  [ROLES.COACH]: CoachDashboard,
  [ROLES.TEACHER_ENGLISH]: TeacherEnglishDashboard,
  [ROLES.TEACHER_PRESCHOOL]: PreschoolTeacherDashboard,
  [ROLES.TEACHER_SCHOLARSHIP]: ScholarshipTeacherDashboard,
})

const dashboardLabels = Object.freeze({
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ADMIN_ENGLISH]: 'English Admin',
  [ROLES.ADMIN_PRESCHOOL]: 'Preschool Admin',
  [ROLES.ADMIN_SCHOLARSHIP]: 'Scholarship Admin',
  [ROLES.ADMIN_SPORT]: 'Sport Admin',
  [ROLES.COACH]: 'Coach',
  [ROLES.TEACHER_ENGLISH]: 'Teacher',
  [ROLES.TEACHER_PRESCHOOL]: 'Preschool Teacher',
  [ROLES.TEACHER_SCHOLARSHIP]: 'Scholarship Teacher',
})

const dashboardSeverities = Object.freeze({
  [ROLES.SUPER_ADMIN]: 'contrast',
  [ROLES.ADMIN_ENGLISH]: 'info',
  [ROLES.ADMIN_PRESCHOOL]: 'success',
  [ROLES.ADMIN_SCHOLARSHIP]: 'warn',
  [ROLES.ADMIN_SPORT]: 'danger',
  [ROLES.COACH]: 'danger',
  [ROLES.TEACHER_ENGLISH]: 'success',
  [ROLES.TEACHER_PRESCHOOL]: 'success',
  [ROLES.TEACHER_SCHOLARSHIP]: 'success',
})

function canUseRoleDashboard(role) {
  if (role === ROLES.SUPER_ADMIN) return true
  if (isTeacherRole(role)) return hasPermission('tasks:write', currentUser.value)
  if (role === ROLES.COACH) return hasPermission('training:write', currentUser.value)
  return Boolean(dashboardByRole[role])
}

const dashboardRegistry = {
  operations: {
    component: OperationsDashboard,
    label: 'Operations',
    severity: 'secondary',
  },
  delivery: {
    component: DeliveryDashboard,
    label: 'Delivery',
    severity: 'secondary',
  },
  programs: {
    component: ProgramsDashboard,
    label: 'Programs',
    severity: 'secondary',
  },
  basic: {
    component: BasicDashboard,
    label: 'Basic Access',
    severity: 'secondary',
  },
}

const roleDashboardConfig = computed(() => {
  const role = hasPermission('all:*', currentUser.value) ? ROLES.SUPER_ADMIN : normalizedRole.value
  if (!canUseRoleDashboard(role)) return null

  return {
    component: dashboardByRole[role],
    label: dashboardLabels[role] || role,
    severity: dashboardSeverities[role] || 'secondary',
  }
})
const fallbackDashboardKey = computed(() => {
  if (hasPermission('users:write', currentUser.value)) return 'operations'
  if (hasPermission('tasks:write', currentUser.value)) return 'delivery'
  if (hasPermission('programs:write', currentUser.value)) return 'programs'
  return 'basic'
})
const activeDashboardConfig = computed(() => roleDashboardConfig.value || dashboardRegistry[fallbackDashboardKey.value])
const activeDashboardComponent = computed(() => activeDashboardConfig.value.component)
const currentRoleLabel = computed(
  () => activeDashboardConfig.value.label || normalizedRole.value || 'User',
)

function goToLogin() {
  router.push({ name: 'login' })
}
</script>

<template>
  <component v-if="activeDashboardComponent" :is="activeDashboardComponent" />

  <div v-else class="dashboard-fallback">
    <Card class="dashboard-fallback__card">
      <template #title>Dashboard unavailable</template>
      <template #subtitle>
        The system could not resolve a dashboard for the current session.
      </template>
      <template #content>
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <span class="text-sm font-semibold text-slate-600">Resolved access</span>
            <Tag :value="currentRoleLabel" :severity="activeDashboardConfig.severity" rounded />
          </div>
          <p class="text-sm leading-6 text-slate-600">
            Sign in again or contact a Super Admin if your role permissions were changed.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <Button label="Back to login" icon="pi pi-sign-in" @click="goToLogin" />
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.dashboard-fallback {
  min-height: calc(100vh - 5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

:deep(.dashboard-fallback__card.p-card) {
  width: min(100%, 36rem);
  border-radius: 1.25rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.45);
}
</style>

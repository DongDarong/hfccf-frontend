<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
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

const router = useRouter()
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

const dashboardRegistry = {
  superadmin: {
    component: SuperAdminDashboard,
    label: 'Super Admin',
    severity: 'contrast',
  },
  adminpreschool: {
    component: PreschoolAdminDashboard,
    label: 'Preschool Admin',
    severity: 'success',
  },
  adminscholaship: {
    component: ScholarshipAdminDashboard,
    label: 'Scholarship Admin',
    severity: 'warn',
  },
  adminenglish: {
    component: EnglishAdminDashboard,
    label: 'English Admin',
    severity: 'info',
  },
  adminsport: {
    component: SportAdminDashboard,
    label: 'Sport Admin',
    severity: 'danger',
  },
  teacher: {
    component: TeacherDashboard,
    label: 'Teacher',
    severity: 'success',
  },
  coach: {
    component: CoachDashboard,
    label: 'Coach',
    severity: 'danger',
  },
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

const activeDashboardKey = computed(() => resolveDashboardKey())
const activeDashboardConfig = computed(
  () => dashboardRegistry[activeDashboardKey.value] || dashboardRegistry.basic,
)
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

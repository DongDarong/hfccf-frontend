<script setup>
/**
 * DashboardPage
 * --------------------------------------------------------------------------
 * Dashboard resolver page.
 *
 * Features:
 * - Resolves role-specific dashboards
 * - Falls back to permission-based dashboards
 * - Lazy-loads dashboard modules
 * - Provides safe unavailable fallback UI
 * --------------------------------------------------------------------------
 */

import { computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import { hasPermission } from '@/services/auth'
import { ROLES, isTeacherRole, normalizeRole } from '@/constants/roles'
import { useUserStore } from '@/store/userStore'

defineOptions({
  name: 'DashboardPage',
})

const router = useRouter()
const userStore = useUserStore()

const currentUser = computed(() => userStore.currentUser || {})
const normalizedRole = computed(() => normalizeRole(currentUser.value?.role))

/**
 * Role-specific dashboard components.
 */
const dashboardByRole = Object.freeze({
  [ROLES.SUPER_ADMIN]: defineAsyncComponent(() => import('@/modules/super-admin/pages/Dashboard.vue')),
  [ROLES.ADMIN_ENGLISH]: defineAsyncComponent(() => import('@/modules/english/admin/pages/Dashboard.vue')),
  [ROLES.ADMIN_PRESCHOOL]: defineAsyncComponent(() => import('@/modules/preschool/admin/pages/PreschoolDashboard.vue')),
  [ROLES.ADMIN_SCHOLARSHIP]: defineAsyncComponent(() => import('@/modules/scholarship/admin/pages/Dashboard.vue')),
  [ROLES.ADMIN_SPORT]: defineAsyncComponent(() => import('@/modules/sport/admin/pages/Dashboard.vue')),
  [ROLES.COACH]: defineAsyncComponent(() => import('@/modules/sport/coach/pages/Dashboard.vue')),
  [ROLES.TEACHER_ENGLISH]: defineAsyncComponent(() => import('@/modules/english/teacher/pages/Dashboard.vue')),
  [ROLES.TEACHER_PRESCHOOL]: defineAsyncComponent(() => import('@/modules/preschool/teacher/pages/Dashboard.vue')),
  [ROLES.TEACHER_SCHOLARSHIP]: defineAsyncComponent(() => import('@/modules/scholarship/teacher/pages/Dashboard.vue')),
})

/**
 * Human-readable dashboard labels.
 */
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

/**
 * PrimeVue tag severity by role.
 */
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

/**
 * Permission-based fallback dashboards.
 */
const dashboardRegistry = Object.freeze({
  operations: {
    component: defineAsyncComponent(() => import('@/shared/components/dashboards/OperationsDashboard.vue')),
    label: 'Operations',
    severity: 'secondary',
  },
  delivery: {
    component: defineAsyncComponent(() => import('@/shared/components/dashboards/DeliveryDashboard.vue')),
    label: 'Delivery',
    severity: 'secondary',
  },
  programs: {
    component: defineAsyncComponent(() => import('@/shared/components/dashboards/ProgramsDashboard.vue')),
    label: 'Programs',
    severity: 'secondary',
  },
  basic: {
    component: defineAsyncComponent(() => import('@/shared/components/dashboards/BasicDashboard.vue')),
    label: 'Basic Access',
    severity: 'secondary',
  },
})

/**
 * Check whether current user can use a role-specific dashboard.
 */
function canUseRoleDashboard(role) {
  if (!dashboardByRole[role]) return false
  if (role === ROLES.SUPER_ADMIN) return true
  if (isTeacherRole(role)) return hasPermission('tasks:write', currentUser.value)
  if (role === ROLES.COACH) return hasPermission('training:write', currentUser.value)

  return true
}

/**
 * Resolve effective role.
 */
const effectiveRole = computed(() =>
  hasPermission('all:*', currentUser.value)
    ? ROLES.SUPER_ADMIN
    : normalizedRole.value,
)

/**
 * Role-specific dashboard config.
 */
const roleDashboardConfig = computed(() => {
  const role = effectiveRole.value

  if (!canUseRoleDashboard(role)) {
    return null
  }

  return {
    component: dashboardByRole[role],
    label: dashboardLabels[role] || role,
    severity: dashboardSeverities[role] || 'secondary',
  }
})

/**
 * Resolve fallback dashboard key from permissions.
 */
const fallbackDashboardKey = computed(() => {
  if (hasPermission('users:write', currentUser.value)) return 'operations'
  if (hasPermission('tasks:write', currentUser.value)) return 'delivery'
  if (hasPermission('programs:write', currentUser.value)) return 'programs'

  return 'basic'
})

/**
 * Final dashboard config.
 */
const activeDashboardConfig = computed(() =>
  roleDashboardConfig.value || dashboardRegistry[fallbackDashboardKey.value] || null,
)

const activeDashboardComponent = computed(() =>
  activeDashboardConfig.value?.component || null,
)

const currentRoleLabel = computed(() =>
  activeDashboardConfig.value?.label || normalizedRole.value || 'User',
)

const currentSeverity = computed(() =>
  activeDashboardConfig.value?.severity || 'secondary',
)

/**
 * Navigate user back to login page.
 */
function goToLogin() {
  router.push({ name: 'login' })
}
</script>

<template>
  <component
    v-if="activeDashboardComponent"
    :is="activeDashboardComponent"
  />

  <div
    v-else
    class="dashboard-fallback"
  >
    <Card class="dashboard-fallback__card">
      <template #title>
        Dashboard unavailable
      </template>

      <template #subtitle>
        The system could not resolve a dashboard for the current session.
      </template>

      <template #content>
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <span class="text-sm font-semibold text-slate-600">
              Resolved access
            </span>

            <Tag
              :value="currentRoleLabel"
              :severity="currentSeverity"
              rounded
            />
          </div>

          <p class="text-sm leading-6 text-slate-600">
            Sign in again or contact a Super Admin if your role permissions were changed.
          </p>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end">
          <Button
            label="Back to login"
            icon="pi pi-sign-in"
            @click="goToLogin"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
/**
 * Fallback page wrapper.
 */
.dashboard-fallback {
  display: flex;
  min-height: calc(100vh - 5rem);
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

/**
 * Fallback card styling.
 */
:deep(.dashboard-fallback__card.p-card) {
  width: min(100%, 36rem);
  border: 1px solid #e2e8f0;
  border-radius: 1.25rem;
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.45);
}
</style>

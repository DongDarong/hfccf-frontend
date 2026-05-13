import { defineAsyncComponent } from 'vue'
import { ROLES } from '@/constants/roles'

/**
 * Role-specific dashboard component registry.
 * Keep this map static so dashboard resolution stays predictable.
 */
export const dashboardByRole = Object.freeze({
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
 * Human-readable labels for the resolved role dashboards.
 */
export const dashboardLabels = Object.freeze({
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
 * PrimeVue severity values for the role-specific dashboard tags.
 */
export const dashboardSeverities = Object.freeze({
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

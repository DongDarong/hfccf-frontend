import SportAdminDashboard from '@/modules/sport/admin/pages/Dashboard.vue'
import SportCoachManagement from '@/modules/sport/admin/pages/CoachManagement.vue'
import CoachDashboard from '@/modules/sport/coach/pages/Dashboard.vue'
import { ROLES } from '@/constants/roles'

export const sportRoutes = [
  {
    path: '/module/sport-admin/dashboard',
    name: 'dashboard-sport-admin',
    component: SportAdminDashboard,
    meta: { requiresAuth: true, allowedRoles: [ROLES.ADMIN_SPORT] },
  },
  {
    path: '/module/sport-admin/users',
    name: 'dashboard-sport-admin-users',
    component: SportCoachManagement,
    meta: { requiresAuth: true, allowedRoles: [ROLES.ADMIN_SPORT] },
  },
  {
    path: '/module/sport-admin/coach',
    name: 'dashboard-sport-coach',
    component: CoachDashboard,
    meta: { requiresAuth: true, allowedRoles: [ROLES.COACH] },
  },
]

import ScholarshipAdminDashboard from '@/modules/scholarship/admin/pages/Dashboard.vue'
import ScholarshipApplicationsPage from '@/modules/scholarship/admin/pages/ScholarshipApplications.vue'
import { ROLES } from '@/constants/roles'

export const scholarshipRoutes = [
  {
    path: '/module/scholarship-admin/dashboard',
    name: 'dashboard-scholarship-admin',
    component: ScholarshipAdminDashboard,
    meta: { requiresAuth: true, allowedRoles: [ROLES.ADMIN_SCHOLARSHIP] },
  },
  {
    path: '/module/scholarship-admin/users',
    name: 'dashboard-scholarship-admin-users',
    component: ScholarshipApplicationsPage,
    meta: { requiresAuth: true, allowedRoles: [ROLES.ADMIN_SCHOLARSHIP] },
  },
]

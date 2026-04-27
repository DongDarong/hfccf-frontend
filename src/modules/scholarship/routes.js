import { ACCESS_SCOPES, DOMAINS } from '@/constants/access'
import { defineAppRoute } from '@/router/defineAppRoute'
import ScholarshipAdminDashboard from '@/modules/scholarship/admin/pages/Dashboard.vue'
import ScholarshipApplicationsPage from '@/modules/scholarship/admin/pages/ScholarshipApplications.vue'

export const scholarshipRoutes = [
  defineAppRoute({
    path: '/module/scholarship-admin/dashboard',
    name: 'dashboard-scholarship-admin',
    component: ScholarshipAdminDashboard,
    access: {
      domains: [DOMAINS.SCHOLARSHIP],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/scholarship-admin/users',
    name: 'dashboard-scholarship-admin-users',
    component: ScholarshipApplicationsPage,
    access: {
      domains: [DOMAINS.SCHOLARSHIP],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
]

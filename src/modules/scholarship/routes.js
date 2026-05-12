import { ACCESS_SCOPES, DOMAINS } from '@/constants/access'
import { defineAppRoute } from '@/router/defineAppRoute'

export const scholarshipRoutes = [
  defineAppRoute({
    path: '/module/scholarship-admin/dashboard',
    name: 'dashboard-scholarship-admin',
    component: () => import('@/modules/scholarship/admin/pages/Dashboard.vue'),
    access: {
      domains: [DOMAINS.SCHOLARSHIP],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/scholarship-admin/users',
    name: 'dashboard-scholarship-admin-users',
    component: () => import('@/modules/scholarship/admin/pages/ScholarshipApplications.vue'),
    access: {
      domains: [DOMAINS.SCHOLARSHIP],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
]

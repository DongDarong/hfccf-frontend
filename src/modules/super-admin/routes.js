import { ACCESS_SCOPES, DOMAINS } from '@/constants/access'
import { defineAppRoute } from '@/router/defineAppRoute'
import SuperAdminDashboard from '@/modules/super-admin/pages/Dashboard.vue'
import AddAdminPage from '@/modules/super-admin/pages/AddAdmin.vue'
import ManageAdminsPage from '@/modules/super-admin/pages/ManageAdmins.vue'

export const superAdminRoutes = [
  defineAppRoute({
    path: '/module/super-admin/dashboard',
    name: 'dashboard-super-admin',
    component: SuperAdminDashboard,
    access: {
      domains: [DOMAINS.GLOBAL],
      scopes: [ACCESS_SCOPES.SUPER_ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/super-admin/users/manage',
    name: 'dashboard-super-admin-users-manage',
    component: ManageAdminsPage,
    access: {
      domains: [DOMAINS.GLOBAL],
      scopes: [ACCESS_SCOPES.SUPER_ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/super-admin/users/add',
    name: 'dashboard-super-admin-users-add',
    component: AddAdminPage,
    access: {
      domains: [DOMAINS.GLOBAL],
      scopes: [ACCESS_SCOPES.SUPER_ADMIN],
    },
  }),
]

import SuperAdminDashboard from '@/modules/super-admin/pages/Dashboard.vue'
import AddAdminPage from '@/modules/super-admin/pages/AddAdmin.vue'
import ManageAdminsPage from '@/modules/super-admin/pages/ManageAdmins.vue'

export const superAdminRoutes = [
  {
    path: '/module/super-admin/dashboard',
    name: 'dashboard-super-admin',
    component: SuperAdminDashboard,
    meta: { requiresAuth: true, superAdminOnly: true },
  },
  {
    path: '/module/super-admin/users/manage',
    name: 'users',
    component: ManageAdminsPage,
    meta: { requiresAuth: true, superAdminOnly: true },
  },
  {
    path: '/module/super-admin/users/add',
    name: 'add-user',
    component: AddAdminPage,
    meta: { requiresAuth: true, superAdminOnly: true },
  },
]

import PreschoolAdminDashboard from '@/modules/preschool/admin/pages/Dashboard.vue'
import PreschoolTeacherManagement from '@/modules/preschool/admin/pages/TeacherManagement.vue'
import { ROLES } from '@/constants/roles'

export const preschoolRoutes = [
  {
    path: '/module/preschool-admin/dashboard',
    name: 'dashboard-preschool-admin',
    component: PreschoolAdminDashboard,
    meta: { requiresAuth: true, allowedRoles: [ROLES.ADMIN_PRESCHOOL] },
  },
  {
    path: '/module/preschool-admin/users',
    name: 'dashboard-preschool-admin-users',
    component: PreschoolTeacherManagement,
    meta: { requiresAuth: true, allowedRoles: [ROLES.ADMIN_PRESCHOOL] },
  },
]

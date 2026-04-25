import PreschoolAdminDashboard from '@/modules/preschool/admin/pages/PreschoolDashboard.vue'
import PreschoolAddTeacher from '@/modules/preschool/admin/pages/AddTeacher.vue'
import PreschoolClassesManagement from '@/modules/preschool/admin/pages/ClassesManagement.vue'
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
  {
    path: '/module/preschool-admin/users/add',
    name: 'dashboard-preschool-admin-users-add',
    component: PreschoolAddTeacher,
    meta: { requiresAuth: true, allowedRoles: [ROLES.ADMIN_PRESCHOOL] },
  },
  {
    path: '/module/preschool-admin/classes',
    name: 'dashboard-preschool-admin-classes',
    component: PreschoolClassesManagement,
    meta: { requiresAuth: true, allowedRoles: [ROLES.ADMIN_PRESCHOOL] },
  },
]

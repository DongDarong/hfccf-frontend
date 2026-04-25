import EnglishAdminDashboard from '@/modules/english/admin/pages/Dashboard.vue'
import EnglishTeacherDashboard from '@/modules/english/teacher/pages/Dashboard.vue'
import { ROLES } from '@/constants/roles'

export const englishRoutes = [
  {
    path: '/module/english-admin/dashboard',
    name: 'dashboard-english-admin',
    component: EnglishAdminDashboard,
    meta: { requiresAuth: true, allowedRoles: [ROLES.ADMIN_ENGLISH] },
  },
  {
    path: '/module/english-admin/teacher',
    name: 'dashboard-english-teacher',
    component: EnglishTeacherDashboard,
    meta: { requiresAuth: true, allowedRoles: [ROLES.TEACHER_ENGLISH] },
  },
]

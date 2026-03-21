import EnglishAdminDashboard from '@/modules/english/admin/pages/Dashboard.vue'
import EnglishTeacherManagement from '@/modules/english/admin/pages/TeacherManagement.vue'
import EnglishTeacherDashboard from '@/modules/english/teacher/pages/Dashboard.vue'

export const englishRoutes = [
  {
    path: '/module/english-admin/dashboard',
    name: 'dashboard-english-admin',
    component: EnglishAdminDashboard,
    meta: { requiresAuth: true, allowedRoles: ['adminenglish'] },
  },
  {
    path: '/module/english-admin/users',
    name: 'dashboard-english-admin-users',
    component: EnglishTeacherManagement,
    meta: { requiresAuth: true, allowedRoles: ['adminenglish'] },
  },
  {
    path: '/module/english-admin/teacher',
    name: 'dashboard-english-teacher',
    component: EnglishTeacherDashboard,
    meta: { requiresAuth: true, allowedRoles: ['teacher'] },
  },
]

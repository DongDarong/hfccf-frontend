import { ACCESS_SCOPES, DOMAINS } from '@/constants/access'
import { defineAppRoute } from '@/router/defineAppRoute'
import EnglishAdminDashboard from '@/modules/english/admin/pages/Dashboard.vue'
import EnglishTeacherManagement from '@/modules/english/admin/pages/TeacherManagement.vue'
import EnglishTeacherDashboard from '@/modules/english/teacher/pages/Dashboard.vue'

export const englishRoutes = [
  defineAppRoute({
    path: '/module/english-admin/dashboard',
    name: 'dashboard-english-admin',
    component: EnglishAdminDashboard,
    access: {
      domains: [DOMAINS.ENGLISH],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/english-admin/users',
    name: 'dashboard-english-admin-users',
    component: EnglishTeacherManagement,
    access: {
      domains: [DOMAINS.ENGLISH],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/english-admin/teacher',
    name: 'dashboard-english-teacher',
    component: EnglishTeacherDashboard,
    access: {
      domains: [DOMAINS.ENGLISH],
      scopes: [ACCESS_SCOPES.STAFF],
    },
  }),
]

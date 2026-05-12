import { ACCESS_SCOPES, DOMAINS } from '@/constants/access'
import { defineAppRoute } from '@/router/defineAppRoute'

export const englishRoutes = [
  defineAppRoute({
    path: '/module/english-admin/dashboard',
    name: 'dashboard-english-admin',
    component: () => import('@/modules/english/admin/pages/Dashboard.vue'),
    access: {
      domains: [DOMAINS.ENGLISH],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/english-admin/users',
    name: 'dashboard-english-admin-users',
    component: () => import('@/modules/english/admin/pages/TeacherManagement.vue'),
    access: {
      domains: [DOMAINS.ENGLISH],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/english-admin/teacher',
    name: 'dashboard-english-teacher',
    component: () => import('@/modules/english/teacher/pages/Dashboard.vue'),
    access: {
      domains: [DOMAINS.ENGLISH],
      scopes: [ACCESS_SCOPES.STAFF],
    },
  }),
]

// Module-specific dashboards and their nested user lists.
import SuperAdminDashboard from '@/pages/module/super-admin/SuperAdminDashboard.vue'
import PreschoolAdminDashboard from '@/pages/module/preschool-admin/PreschoolAdminDashboard.vue'
import PreschoolAdminUsersView from '@/pages/module/preschool-admin/UsersPreschool.vue'
import ScholarshipAdminDashboard from '@/pages/module/scholarship-admin/ScholarshipAdminDashboard.vue'
import ScholarshipAdminUsersView from '@/pages/module/scholarship-admin/UserScholarship.vue'
import EnglishAdminDashboard from '@/pages/module/english-admin/EnglishAdminDashboard.vue'
import EnglishAdminUsersView from '@/pages/module/english-admin/UsersEnglish.vue'
import SportAdminDashboard from '@/pages/module/sport-admin/SportAdminDashboard.vue'
import SportAdminUsersView from '@/pages/module/sport-admin/UsersCoaches.vue'

export const moduleRoutes = [
  {
    path: '/module/super-admin/dashboard',
    name: 'dashboard-super-admin',
    component: SuperAdminDashboard,
    meta: { requiresAuth: true, superAdminOnly: true },
  },
  {
    path: '/module/preschool-admin/dashboard',
    name: 'dashboard-preschool-admin',
    component: PreschoolAdminDashboard,
    meta: { requiresAuth: true, allowedRoles: ['adminpreschool'] },
  },
  {
    path: '/module/preschool-admin/users',
    name: 'dashboard-preschool-admin-users',
    component: PreschoolAdminUsersView,
    meta: { requiresAuth: true, allowedRoles: ['adminpreschool'] },
  },
  {
    path: '/module/scholarship-admin/dashboard',
    name: 'dashboard-scholarship-admin',
    component: ScholarshipAdminDashboard,
    meta: { requiresAuth: true, allowedRoles: ['adminscholaship'] },
  },
  {
    path: '/module/scholarship-admin/users',
    name: 'dashboard-scholarship-admin-users',
    component: ScholarshipAdminUsersView,
    meta: { requiresAuth: true, allowedRoles: ['adminscholaship'] },
  },
  {
    path: '/module/english-admin/dashboard',
    name: 'dashboard-english-admin',
    component: EnglishAdminDashboard,
    meta: { requiresAuth: true, allowedRoles: ['adminenglish'] },
  },
  {
    path: '/module/english-admin/users',
    name: 'dashboard-english-admin-users',
    component: EnglishAdminUsersView,
    meta: { requiresAuth: true, allowedRoles: ['adminenglish'] },
  },
  {
    path: '/module/sport-admin/dashboard',
    name: 'dashboard-sport-admin',
    component: SportAdminDashboard,
    meta: { requiresAuth: true, allowedRoles: ['adminsport'] },
  },
  {
    path: '/module/sport-admin/users',
    name: 'dashboard-sport-admin-users',
    component: SportAdminUsersView,
    meta: { requiresAuth: true, allowedRoles: ['adminsport'] },
  },
]

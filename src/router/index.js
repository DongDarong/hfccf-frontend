import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/pages/module/MainDashboard.vue'
import LoginView from '@/pages/auth/Login.vue'
import UsersView from '@/pages/module/super-admin/Users.vue'
import AddUserView from '@/pages/module/super-admin/AddUser.vue'
import { ensureSessionIsValid, getCurrentUser, isSuperAdmin, touchActivity } from '@/services/auth'
import SuperAdminDashboard from '@/pages/module/super-admin/SuperAdminDashboard.vue'
import PreschoolAdminDashboard from '@/pages/module/preschool-admin/PreschoolAdminDashboard.vue'
import PreschoolAdminUsersView from '@/pages/module/preschool-admin/UsersPreschool.vue'
import ScholarshipAdminDashboard from '@/pages/module/scholarship-admin/ScholarshipAdminDashboard.vue'
import ScholarshipAdminUsersView from '@/pages/module/scholarship-admin/UserScholarship.vue'
import EnglishAdminDashboard from '@/pages/module/english-admin/EnglishAdminDashboard.vue'
import EnglishAdminUsersView from '@/pages/module/english-admin/UsersEnglish.vue'
import SportAdminDashboard from '@/pages/module/sport-admin/SportAdminDashboard.vue'
import SportAdminUsersView from '@/pages/module/sport-admin/UsersCoaches.vue'
import TeacherDashboard from '@/pages/module/teachers-coaches/teacher-english/TeacherDashboard.vue'
import CoachDashboard from '@/pages/module/teachers-coaches/coach/CoachDashboard.vue'

function normalizeRole(role) {
  return String(role || '')
    .trim()
    .toLowerCase()
}

function hasAllowedRole(user, allowedRoles = []) {
  if (!Array.isArray(allowedRoles) || !allowedRoles.length) return true
  const role = normalizeRole(user?.role)
  return allowedRoles.map((item) => normalizeRole(item)).includes(role)
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard/super-admin',
      name: 'dashboard-super-admin',
      component: SuperAdminDashboard,
      meta: { requiresAuth: true, superAdminOnly: true },
    },
    {
      path: '/dashboard/preschool-admin',
      name: 'dashboard-preschool-admin',
      component: PreschoolAdminDashboard,
      meta: { requiresAuth: true, allowedRoles: ['adminpreschool'] },
    },
    {
      path: '/dashboard/preschool-admin/users',
      name: 'dashboard-preschool-admin-users',
      component: PreschoolAdminUsersView,
      meta: { requiresAuth: true, allowedRoles: ['adminpreschool'] },
    },
    {
      path: '/dashboard/scholarship-admin',
      name: 'dashboard-scholarship-admin',
      component: ScholarshipAdminDashboard,
      meta: { requiresAuth: true, allowedRoles: ['adminscholaship'] },
    },
    {
      path: '/dashboard/scholarship-admin/users',
      name: 'dashboard-scholarship-admin-users',
      component: ScholarshipAdminUsersView,
      meta: { requiresAuth: true, allowedRoles: ['adminscholaship'] },
    },
    {
      path: '/dashboard/english-admin',
      name: 'dashboard-english-admin',
      component: EnglishAdminDashboard,
      meta: { requiresAuth: true, allowedRoles: ['adminenglish'] },
    },
        {
      path: '/dashboard/english-admin/users',
      name: 'dashboard-english-admin-users',
      component: EnglishAdminUsersView,
      meta: { requiresAuth: true, allowedRoles: ['adminenglish'] },
    },
    {
      path: '/dashboard/sport-admin',
      name: 'dashboard-sport-admin',
      component: SportAdminDashboard,
      meta: { requiresAuth: true, allowedRoles: ['adminsport'] },
    },
    {
      path: '/dashboard/sport-admin/users',
      name: 'dashboard-sport-admin-users',
      component: SportAdminUsersView,
      meta: { requiresAuth: true, allowedRoles: ['adminsport'] },
    },
    {
      path: '/dashboard/english-admin/teacher',
      name: 'dashboard-english-teacher',
      component: TeacherDashboard,
      meta: { requiresAuth: true, allowedRoles: ['teacher'] },
    },
    {
      path: '/dashboard/sport-admin/coach',
      name: 'dashboard-sport-coach',
      component: CoachDashboard,
      meta: { requiresAuth: true, allowedRoles: ['coach'] },
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
      meta: { requiresAuth: true, superAdminOnly: true },
    },
    {
      path: '/users/add',
      name: 'add-user',
      component: AddUserView,
      meta: { requiresAuth: true, superAdminOnly: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard',
    },
  ],
})

router.beforeEach((to) => {
  const sessionValid = ensureSessionIsValid()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const guestOnly = to.matched.some((record) => record.meta.guestOnly)
  const superAdminOnly = to.matched.some((record) => record.meta.superAdminOnly)
  const allowedRoles = to.matched.flatMap((record) => record.meta.allowedRoles || [])
  const currentUser = getCurrentUser()

  if (requiresAuth && !sessionValid) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  if (guestOnly && sessionValid) {
    return { name: 'dashboard' }
  }

  if (sessionValid && superAdminOnly && !isSuperAdmin(currentUser)) {
    return { name: 'dashboard' }
  }

  if (sessionValid && allowedRoles.length && !isSuperAdmin(currentUser) && !hasAllowedRole(currentUser, allowedRoles)) {
    return { name: 'dashboard' }
  }

  if (sessionValid) {
    touchActivity()
  }

  return true
})

export default router
















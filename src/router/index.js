import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/pages/dashboard/MainDashboard.vue'
import LoginView from '@/pages/auth/Login.vue'
import UsersView from '@/pages/dashboard/SuperAdmin/users/Users.vue'
import AddUserView from '@/pages/dashboard/SuperAdmin/users/AddUser.vue'
import { ensureSessionIsValid, getCurrentUser, isSuperAdmin, touchActivity } from '@/services/auth'
import SuperAdminDashboard from '@/pages/dashboard/SuperAdmin/SuperAdminDashboard.vue'
import PreschoolAdminDashboard from '@/pages/dashboard/PreschoolAdmin/PreschoolAdminDashboard.vue'
import ScholarshipAdminDashboard from '@/pages/dashboard/ScholarshipAdmin/ScholarshipAdminDashboard.vue'
import EnglishAdminDashboard from '@/pages/dashboard/EnglishAdmin/EnglishAdminDashboard.vue'
import SportAdminDashboard from '@/pages/dashboard/SportAdmin/SportAdminDashboard.vue'
import TeacherDashboard from '@/pages/dashboard/EnglishAdmin/TeacherEnglish/TeacherDashboard.vue'
import CoachDashboard from '@/pages/dashboard/SportAdmin/Coach/CoachDashboard.vue'

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
      path: '/dashboard/scholarship-admin',
      name: 'dashboard-scholarship-admin',
      component: ScholarshipAdminDashboard,
      meta: { requiresAuth: true, allowedRoles: ['adminscholaship'] },
    },
    {
      path: '/dashboard/english-admin',
      name: 'dashboard-english-admin',
      component: EnglishAdminDashboard,
      meta: { requiresAuth: true, allowedRoles: ['adminenglish'] },
    },
    {
      path: '/dashboard/sport-admin',
      name: 'dashboard-sport-admin',
      component: SportAdminDashboard,
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

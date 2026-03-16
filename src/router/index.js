import { createRouter, createWebHistory } from 'vue-router'
import { ensureSessionIsValid, getCurrentUser, isSuperAdmin, touchActivity } from '@/services/auth'
import { authRoutes } from '@/modules/auth/routes'
import { userRoutes } from '@/modules/users/routes'

const routes = [
  ...authRoutes,
  ...userRoutes,
  {
    path: '/:pathMatch(.*)*',
    redirect: '/module/dashboard',
  },
]

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
  routes,
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

  if (
    sessionValid &&
    allowedRoles.length &&
    !isSuperAdmin(currentUser) &&
    !hasAllowedRole(currentUser, allowedRoles)
  ) {
    return { name: 'dashboard' }
  }

  if (sessionValid) {
    touchActivity()
  }

  return true
})

export default router




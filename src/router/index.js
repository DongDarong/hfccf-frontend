import { createRouter, createWebHistory } from 'vue-router'
import {
  ensureSessionIsValid,
  getCurrentUser,
  hasPermission,
  isSuperAdmin,
  touchActivity,
} from '@/services/auth'
import { authRoutes } from '@/modules/auth/routes'
import { dashboardRoutes } from '@/modules/dashboard/routes'
import { superAdminRoutes } from '@/modules/super-admin/routes'
import { englishRoutes } from '@/modules/english/routes'
import { preschoolRoutes } from '@/modules/preschool/routes'
import { scholarshipRoutes } from '@/modules/scholarship/routes'
import { sportRoutes } from '@/modules/sport/routes'
import { normalizeRole } from '@/constants/roles'

const routes = [
  ...authRoutes,
  ...dashboardRoutes,
  ...superAdminRoutes,
  ...englishRoutes,
  ...preschoolRoutes,
  ...scholarshipRoutes,
  ...sportRoutes,
  {
    path: '/:pathMatch(.*)*',
    redirect: '/module/dashboard',
  },
]

function hasAllowedRole(user, allowedRoles = []) {
  if (!Array.isArray(allowedRoles) || !allowedRoles.length) return true
  const role = normalizeRole(user?.role)
  return allowedRoles.map((item) => normalizeRole(item)).includes(role)
}

function routeMetaMatches(to, key) {
  return to.matched.some((record) => record.meta[key])
}

function routeMetaList(to, key) {
  return to.matched.flatMap((record) => record.meta[key] || [])
}

function requiresAuth(to) {
  return routeMetaMatches(to, 'requiresAuth')
}

function isGuestOnly(to) {
  return routeMetaMatches(to, 'guestOnly')
}

function hasValidSession() {
  return ensureSessionIsValid()
}

function isSuperAdminAllowed(to, user) {
  if (!routeMetaMatches(to, 'superAdminOnly')) return true
  return isSuperAdmin(user)
}

function isRoleAllowed(to, user) {
  const allowedRoles = routeMetaList(to, 'allowedRoles')
  if (!allowedRoles.length || isSuperAdmin(user)) return true
  return hasAllowedRole(user, allowedRoles)
}

function isPermissionAllowed(to, user) {
  const requiredPermissions = routeMetaList(to, 'requiredPermissions')
  if (!requiredPermissions.length || isSuperAdmin(user)) return true
  return requiredPermissions.every((permission) => hasPermission(permission, user))
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const sessionValid = hasValidSession()
  const currentUser = getCurrentUser()

  if (requiresAuth(to) && !sessionValid) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  if (isGuestOnly(to) && sessionValid) {
    return { name: 'dashboard' }
  }

  if (sessionValid && !isSuperAdminAllowed(to, currentUser)) {
    return { name: 'dashboard' }
  }

  if (sessionValid && !isRoleAllowed(to, currentUser)) {
    return { name: 'dashboard' }
  }

  if (sessionValid && !isPermissionAllowed(to, currentUser)) {
    return { name: 'dashboard' }
  }

  if (sessionValid) {
    touchActivity()
  }

  return true
})

export default router

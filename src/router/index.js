import { createRouter, createWebHistory } from 'vue-router'
import { ROLES, normalizeRole } from '@/constants/roles'
import { ensureSessionIsValid, getCurrentUser, touchActivity } from '@/services/auth'
import { canAccessRoute } from '@/services/accessControl'
import { authRoutes } from '@/modules/auth/routes'
import { dashboardRoutes } from '@/modules/dashboard/routes'
import { guardianPortalRoutes } from '@/modules/guardian-portal/routes'
import { notificationsRoutes } from '@/modules/notifications/routes'
import { reportsRoutes } from '@/modules/reports/routes'
import { superAdminRoutes } from '@/modules/super-admin/routes'
import { englishRoutes } from '@/modules/english/routes'
import { preschoolRoutes } from '@/modules/preschool/routes'
import { scholarshipRoutes } from '@/modules/scholarship/routes'
import { sportRoutes } from '@/modules/sport/routes'
import { settingsRoutes } from '@/modules/settings/routes'
import { validateRouteConfig } from '@/router/routeValidator'

const routes = [
  ...authRoutes,
  ...dashboardRoutes,
  ...guardianPortalRoutes,
  ...notificationsRoutes,
  ...reportsRoutes,
  ...superAdminRoutes,
  ...englishRoutes,
  ...preschoolRoutes,
  ...scholarshipRoutes,
  ...sportRoutes,
  ...settingsRoutes,
  {
    path: '/:pathMatch(.*)*',
    redirect: '/module/dashboard',
  },
]

validateRouteConfig(routes)

function routeMetaMatches(to, key) {
  return to.matched.some((record) => record.meta[key])
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

function isGuardianPortalRoute(to) {
  const routeName = String(to?.name || '')

  return routeName.startsWith('guardian-portal-')
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const sessionValid = await hasValidSession()
  const currentUser = getCurrentUser()

  if (requiresAuth(to) && !sessionValid) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  if (isGuestOnly(to) && sessionValid) {
    return normalizeRole(currentUser?.role) === ROLES.GUARDIAN
      ? { name: 'guardian-portal-dashboard' }
      : { name: 'dashboard' }
  }

  if (sessionValid && normalizeRole(currentUser?.role) === ROLES.GUARDIAN && !isGuardianPortalRoute(to)) {
    return { name: 'guardian-portal-dashboard' }
  }

  if (sessionValid && !canAccessRoute(currentUser, to)) {
    return normalizeRole(currentUser?.role) === ROLES.GUARDIAN
      ? { name: 'guardian-portal-dashboard' }
      : { name: 'dashboard' }
  }

  if (sessionValid) {
    touchActivity()
  }

  return true
})

export default router

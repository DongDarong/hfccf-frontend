import { normalizeAccessRule } from '@/services/accessControl'

export function defineAppRoute(route) {
  const access = normalizeAccessRule(route.access)
  const meta = {
    ...route.meta,
    requiresAuth: access.requiresAuth,
    access,
  }

  return {
    ...route,
    meta,
  }
}


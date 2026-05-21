import { describe, expect, it } from 'vitest'
import { guardianPortalRoutes } from '@/modules/guardian-portal/routes'

// Keep route registration covered so guardian portal screens never drift away
// from the route names used by login redirects and read-only child links.
describe('guardian portal routes', () => {
  it('registers the public activation route and the read-only portal routes', () => {
    const names = guardianPortalRoutes.map((route) => route.name)

    expect(names).toContain('guardian-portal-activate')
    expect(names).toContain('guardian-portal-dashboard')
    expect(names).toContain('guardian-portal-students')
    expect(names).toContain('guardian-portal-student-profile')
    expect(names).toContain('guardian-portal-student-attendance')
    expect(names).toContain('guardian-portal-student-schedule')
    expect(names).toContain('guardian-portal-student-progress')
    expect(names).toContain('guardian-portal-student-reports')

    const activationRoute = guardianPortalRoutes.find((route) => route.name === 'guardian-portal-activate')
    expect(activationRoute.meta.access.requiresAuth).toBe(false)
  })
})

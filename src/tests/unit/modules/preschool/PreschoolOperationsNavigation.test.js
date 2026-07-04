import { describe, expect, it } from 'vitest'
import router from '@/router'
import { buildSidebarSections } from '@/components/navigation/sidebarNavigation'
import mainSidebar from '@/data/sidebar/main.json'
import preschoolSidebar from '@/data/sidebar/preschool.json'
import { preschoolRoutes } from '@/modules/preschool/routes'
import { makeAdminPreschool, makeTeacherPreschool } from '@/tests/helpers/factories'

const t = (key) => key
const sidebarConfig = {
  sections: [...mainSidebar.sections, ...preschoolSidebar.sections],
}

function buildFor(user) {
  return buildSidebarSections({ config: sidebarConfig, router, user, t })
}

describe('preschool operations navigation', () => {
  it('registers the operations route and shows it for Preschool admins only', () => {
    expect(
      preschoolRoutes.some((route) => route.name === 'dashboard-preschool-admin-operations' && route.path === '/preschool/operations'),
    ).toBe(true)

    const notificationsRoute = preschoolRoutes.find(
      (route) => route.name === 'dashboard-preschool-admin-notifications' && route.path === '/module/preschool-admin/notifications',
    )

    expect(Boolean(notificationsRoute?.redirect)).toBe(true)
    expect(notificationsRoute.redirect({ query: { from: 'operations' } })).toEqual({
      name: 'dashboard-notifications',
      query: {
        from: 'operations',
        tab: 'tasks',
      },
    })

    const adminSections = buildFor(makeAdminPreschool())
    const adminRouteNames = adminSections.flatMap((section) => section.items.map((item) => item.routeName))
    expect(adminRouteNames).toContain('dashboard-preschool-admin-operations')
    expect(adminRouteNames).toContain('dashboard-notifications')

    const teacherSections = buildFor(makeTeacherPreschool())
    const teacherRouteNames = teacherSections.flatMap((section) => section.items.map((item) => item.routeName))
    expect(teacherRouteNames).not.toContain('dashboard-preschool-admin-operations')
    expect(teacherRouteNames).not.toContain('dashboard-notifications')
  })
})

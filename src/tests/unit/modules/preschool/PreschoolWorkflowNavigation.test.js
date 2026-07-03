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

describe('preschool workflow navigation', () => {
  it('registers the workflow routes and shows the sidebar entry for admins only', () => {
    expect(
      preschoolRoutes.some(
        (route) => route.name === 'dashboard-preschool-admin-workflows' && route.path === '/module/preschool-admin/workflows',
      ),
    ).toBe(true)

    expect(
      preschoolRoutes.some(
        (route) => route.name === 'dashboard-preschool-admin-workflow-details' && route.path === '/module/preschool-admin/workflows/:id',
      ),
    ).toBe(true)

    const adminSections = buildFor(makeAdminPreschool())
    const adminRouteNames = adminSections.flatMap((section) => section.items.map((item) => item.routeName))
    expect(adminRouteNames).toContain('dashboard-preschool-admin-workflows')

    const teacherSections = buildFor(makeTeacherPreschool())
    const teacherRouteNames = teacherSections.flatMap((section) => section.items.map((item) => item.routeName))
    expect(teacherRouteNames).not.toContain('dashboard-preschool-admin-workflows')
  })
})

import { describe, expect, it } from 'vitest'
import router from '@/router'
import { buildSidebarSections } from '@/components/navigation/sidebarNavigation'
import mainSidebar from '@/data/sidebar/main.json'
import preschoolSidebar from '@/data/sidebar/preschool.json'
import { makeAdminPreschool, makeSuperAdmin, makeTeacherPreschool } from '@/tests/helpers/factories'

// Keep Preschool sidebar coverage focused on the new guardian routes so the
// navigation layer does not drift back to broken or hidden route targets.
const t = (key) => key
const sidebarConfig = {
  sections: [...mainSidebar.sections, ...preschoolSidebar.sections],
}

function buildFor(user) {
  return buildSidebarSections({ config: sidebarConfig, router, user, t })
}

describe('preschool guardian sidebar', () => {
  it('shows guardian routes for Preschool admins', () => {
    const sections = buildFor(makeAdminPreschool())
    const routeNames = sections.flatMap((section) => section.items.map((item) => item.routeName))

    expect(routeNames).toContain('dashboard-preschool-admin-guardians')
    expect(routeNames).toContain('dashboard-preschool-admin-guardian-integrity')
    expect(routeNames).toContain('dashboard-preschool-admin-student-guardians')
    expect(routeNames).toContain('dashboard-preschool-admin-guardian-portal-accounts')
    expect(routeNames).toContain('dashboard-preschool-admin-guardian-portal-invite')
    expect(routeNames.every((routeName) => !String(routeName || '').includes(':'))).toBe(true)
  })

  it('shows the emergency-contact route for Preschool teachers', () => {
    const sections = buildFor(makeTeacherPreschool())
    const routeNames = sections.flatMap((section) => section.items.map((item) => item.routeName))

    expect(routeNames).toContain('dashboard-preschool-teacher-emergency-contacts')
    expect(routeNames).not.toContain('dashboard-preschool-admin-guardians')
  })

  it('shows guardian management in the super-admin Preschool section', () => {
    const sections = buildFor(makeSuperAdmin())
    const preschoolSection = sections.find((section) => section.id === 'preschool')
    const routeNames = preschoolSection.items.map((item) => item.routeName)

    expect(routeNames).toContain('dashboard-preschool-admin-guardians')
    expect(routeNames).toContain('dashboard-preschool-admin-guardian-integrity')
    expect(routeNames).toContain('dashboard-preschool-admin-student-guardians')
    expect(routeNames).toContain('dashboard-preschool-admin-guardian-portal-accounts')
    expect(routeNames).toContain('dashboard-preschool-admin-guardian-portal-invite')
  })
})

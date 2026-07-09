import { describe, it, expect } from 'vitest'
import router from '@/router'
import { buildSidebarSections } from '@/components/navigation/sidebarNavigation'
import mainSidebar from '@/data/sidebar/main.json'
import sportSidebar from '@/data/sidebar/sport.json'
import {
  makeAdminSport,
  makeCoach,
} from '../../helpers/factories'

const t = (key) => key

const sidebarConfig = {
  sections: [...mainSidebar.sections, ...sportSidebar.sections],
}

function getResolvedRoutes(user) {
  return buildSidebarSections({ config: sidebarConfig, router, user, t })
}

describe('sidebar route targets', () => {
  it('exposes the sport admin sidebar section for adminsport', () => {
    const sections = getResolvedRoutes(makeAdminSport())
    const sportSection = sections.find((section) => section.id === 'sport')

    expect(sportSection).toBeDefined()
    expect(sportSection.items.map((item) => item.id)).toEqual(expect.arrayContaining([
      'sport-dashboard',
      'sport-attendance',
      'sport-coaches',
      'sport-teams',
      'sport-players',
      'sport-matches',
      'sport-tournaments',
      'sport-coach-team-assignments',
      'sport-pending-player-approvals',
      'sport-pending-match-approvals',
      'sport-player-lifecycle',
    ]))
  })

  it('does not expose the sport admin sidebar section for coach', () => {
    const sections = getResolvedRoutes(makeCoach())
    const sportSection = sections.find((section) => section.id === 'sport')

    expect(sportSection).toBeUndefined()
  })

  it('does not expose parametric sidebar routes for sport admin', () => {
    const sections = getResolvedRoutes(makeAdminSport())
    const routePaths = sections.flatMap((section) => section.items.map((item) => item.routePath))
    const routeNames = sections.flatMap((section) => section.items.map((item) => item.routeName))

    expect(routePaths.every((path) => !path.includes(':'))).toBe(true)
    expect(routeNames).not.toContain('dashboard-sport-admin-match-squad-review')
  })

  it('does not expose parametric sidebar routes for sport coach', () => {
    const sections = getResolvedRoutes(makeCoach())
    const routePaths = sections.flatMap((section) => section.items.map((item) => item.routePath))
    const routeNames = sections.flatMap((section) => section.items.map((item) => item.routeName))

    expect(routePaths.every((path) => !path.includes(':'))).toBe(true)
    expect(routeNames).not.toContain('dashboard-sport-coach-match-squad-selection')
  })
})

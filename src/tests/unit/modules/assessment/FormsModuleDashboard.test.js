import { describe, expect, it } from 'vitest'
import { assessmentRoutes } from '@/modules/assessment/routes/assessment.routes'
import { FM_HUB_SECTIONS } from '@/modules/preschool/admin/pages/forms/formManagementData'

describe('Forms Module Dashboard', () => {
  it('organizes the ten dashboard cards into three workflow stages', () => {
    expect(FM_HUB_SECTIONS.map((section) => section.id)).toEqual([
      'manage',
      'build',
      'review',
    ])

    expect(FM_HUB_SECTIONS.flatMap((section) => section.cards)).toHaveLength(10)
  })

  it('routes related cards into the three preschool workflow workspaces', () => {
    const expectedRouteNames = [
      'dashboard-preschool-admin-forms-manage',
      'dashboard-preschool-admin-forms-build',
      'dashboard-preschool-admin-forms-review',
    ]

    const dashboardRouteNames = [
      ...new Set(
        FM_HUB_SECTIONS.flatMap((section) =>
          section.cards.map((card) => card.route.name),
        ),
      ),
    ]

    expect(dashboardRouteNames).toEqual(expectedRouteNames)
    expect(assessmentRoutes).toBeDefined()
  })
})

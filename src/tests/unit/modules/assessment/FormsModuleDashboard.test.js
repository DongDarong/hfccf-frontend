import { describe, expect, it } from 'vitest'
import { assessmentRoutes } from '@/modules/assessment/routes/assessment.routes'
import { FM_HUB_SECTIONS } from '@/modules/preschool/admin/pages/forms/formManagementData'

describe('Forms Module Dashboard', () => {
  it('exposes the ten required dashboard cards in the expected groups', () => {
    expect(FM_HUB_SECTIONS.map((section) => section.id)).toEqual([
      'design',
      'operations',
      'reporting',
      'admin',
    ])

    expect(FM_HUB_SECTIONS.flatMap((section) => section.cards)).toHaveLength(10)
  })

  it('registers every dashboard destination under the forms route prefix', () => {
    const expectedPaths = [
      '/forms/templates',
      '/forms/questions',
      '/forms/exercises',
      '/forms/scoring',
      '/forms/sessions',
      '/forms/review',
      '/forms/print-templates',
      '/forms/exports',
      '/forms/reports',
      '/forms/logs',
    ]

    const registeredPaths = assessmentRoutes.map((route) => route.path)

    expect(registeredPaths).toEqual(expect.arrayContaining(expectedPaths))
  })
})

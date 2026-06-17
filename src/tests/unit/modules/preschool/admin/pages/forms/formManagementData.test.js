import { describe, expect, it } from 'vitest'
import { FORM_MANAGEMENT_ACTION_CARDS, groupFormManagementActionCards } from '@/modules/preschool/admin/pages/forms/formManagementData'
import { preschoolRoutes } from '@/modules/preschool/routes'

describe('preschool form management route targets', () => {
  it('points new form actions to the active preschool build route', () => {
    const buildCards = groupFormManagementActionCards().build
    const newFormCard = FORM_MANAGEMENT_ACTION_CARDS.find((card) => card.key === 'new-form')

    expect(newFormCard?.to?.name).toBe('dashboard-preschool-admin-forms-build')
    expect(buildCards.every((card) => card.to?.name === 'dashboard-preschool-admin-forms-build')).toBe(true)
    expect(preschoolRoutes.some((route) => route.name === 'dashboard-preschool-admin-forms-build')).toBe(true)
  })
})

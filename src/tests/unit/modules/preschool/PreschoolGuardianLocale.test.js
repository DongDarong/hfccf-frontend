import { describe, expect, it } from 'vitest'
import enPreschool from '@/i18n/en/preschool'
import khPreschool from '@/i18n/kh/preschool'

// Keep guardian locale parity covered so the new Preschool relationship pages
// do not regress into missing-key warnings or double-nested locale exports.
function expectString(source, path) {
  const value = path.split('.').reduce((carry, key) => carry?.[key], source)
  expect(typeof value).toBe('string')
  expect(value).not.toContain('<')
  expect(value).not.toMatch(/[\u00e2\u00e1\u017e\u00c3\uFFFD]/u)
}

describe('preschool guardian locale parity', () => {
  it('keeps guardian page keys aligned in EN and KH', () => {
    const keys = [
      'preschoolGuardianShared.loading',
      'preschoolGuardianShared.emptyGuardians',
      'preschoolGuardianShared.labels.noDetails',
      'preschoolGuardianShared.statusLabels.active',
      'preschoolGuardianShared.statusLabels.inactive',
      'preschoolGuardianShared.statusLabels.archived',
      'preschoolGuardianShared.relationshipTypes.guardian',
      'preschoolGuardianShared.pickupPermission.allowed',
      'preschoolGuardianShared.primaryGuardian.primary',
      'preschoolGuardiansPage.title',
      'preschoolGuardiansPage.actions.addGuardian',
      'preschoolGuardiansPage.actions.viewDetails',
      'preschoolGuardiansPage.fields.fullName',
      'preschoolGuardiansPage.errors.loadFailed',
      'preschoolStudentGuardiansPage.title',
      'preschoolStudentGuardiansPage.actions.linkGuardian',
      'preschoolStudentGuardiansPage.actions.setPrimary',
      'preschoolStudentGuardiansPage.actions.restore',
      'preschoolStudentGuardiansPage.fields.guardian',
      'preschoolStudentGuardiansPage.errors.loadLookup',
      'preschoolEmergencyContactsPage.title',
      'preschoolEmergencyContactsPage.actions.refresh',
      'preschoolEmergencyContactsPage.errors.loadContacts',
      'preschoolGuardianDetailsPage.title',
      'preschoolGuardianDetailsPage.actions.back',
      'preschoolGuardianDetailsPage.actions.manageRelationships',
      'preschoolGuardianDetailsPage.labels.relationshipsCount',
      'preschoolGuardianDetailsPage.errors.load',
    ]

    keys.forEach((key) => {
      expectString(enPreschool, key)
      expectString(khPreschool, key)
    })
  })

  it('keeps the Preschool locale export flat at the module boundary', () => {
    expect(Object.prototype.hasOwnProperty.call(enPreschool, 'preschool')).toBe(false)
    expect(Object.prototype.hasOwnProperty.call(khPreschool, 'preschool')).toBe(false)
  })
})

import { describe, expect, it } from 'vitest'
import enPreschool from '@/i18n/en/preschool'
import khPreschool from '@/i18n/kh/preschool'

// Keep integrity locale parity covered so the new staff review screen does not
// regress into raw keys or double-nested Preschool guardian locale exports.
function expectString(source, path) {
  const value = path.split('.').reduce((carry, key) => carry?.[key], source)
  expect(typeof value).toBe('string')
  expect(value).not.toContain('<')
  expect(value).not.toMatch(/[\u00e2\u00e1\u017e\u00c3\uFFFD]/u)
}

describe('preschool guardian integrity locale parity', () => {
  it('keeps EN and KH integrity keys aligned', () => {
    const keys = [
      'preschoolGuardianShared.integritySeverityLabels.info',
      'preschoolGuardianShared.integritySeverityLabels.warning',
      'preschoolGuardianShared.integritySeverityLabels.critical',
      'preschoolGuardianShared.errors.loadIntegrity',
      'preschoolGuardianIntegrityPage.title',
      'preschoolGuardianIntegrityPage.subtitle',
      'preschoolGuardianIntegrityPage.actions.refresh',
      'preschoolGuardianIntegrityPage.empty',
      'preschoolGuardianIntegrityPage.sections.summary',
      'preschoolGuardianIntegrityPage.sections.duplicates',
      'preschoolGuardianIntegrityPage.sections.issues',
      'preschoolGuardianIntegrityPage.summary.duplicateGroups',
      'preschoolGuardianIntegrityPage.summary.pickupPermissionIssues',
      'preschoolGuardianIntegrityPage.duplicateGroup.title',
      'preschoolGuardianIntegrityPage.signalLabels.samePhone',
      'preschoolGuardianIntegrityPage.issueTypes.studentNoActiveGuardian',
      'preschoolGuardianIntegrityPage.issueTypes.pickupPermissionIssue',
      'preschoolGuardianIntegrityPage.issueDescriptions.legacyGuardianMismatch',
      'preschoolGuardianIntegrityPage.issueDescriptions.pickupPermissionIssue',
      'preschoolGuardianIntegrityPage.guardianSources.normalized',
      'preschoolGuardianIntegrityPage.legacyDifferenceLabels.guardianPhone',
    ]

    keys.forEach((key) => {
      expectString(enPreschool, key)
      expectString(khPreschool, key)
    })
  })

  it('keeps the Preschool guardian integrity export flat at the module boundary', () => {
    expect(Object.prototype.hasOwnProperty.call(enPreschool, 'preschool')).toBe(false)
    expect(Object.prototype.hasOwnProperty.call(khPreschool, 'preschool')).toBe(false)
  })
})

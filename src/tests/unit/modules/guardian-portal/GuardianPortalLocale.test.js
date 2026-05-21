import { describe, expect, it } from 'vitest'
import enGuardianPortal from '@/i18n/en/guardian-portal'
import khGuardianPortal from '@/i18n/kh/guardian-portal'

// Keep portal copy parity covered so the login screen and read-only views do
// not fall back to raw keys or accidentally double-nest the locale module.
function expectString(source, path) {
  const value = path.split('.').reduce((carry, key) => carry?.[key], source)
  expect(typeof value).toBe('string')
  expect(value).not.toContain('<')
  expect(value).not.toMatch(/[\u00e2\u00e1\u017e\u00c3\uFFFD]/u)
}

describe('guardian portal locale parity', () => {
  it('keeps EN and KH portal keys aligned', () => {
    const keys = [
      'guardianPortal.common.guardianOption',
      'guardianPortal.common.readOnlyNotice',
      'guardianPortal.common.loading',
      'guardianPortal.common.refresh',
      'guardianPortal.common.viewChild',
      'guardianPortal.common.emptyValue',
      'guardianPortal.common.emptySummary',
      'guardianPortal.common.emptyStudents',
      'guardianPortal.common.unableToLoad',
      'guardianPortal.common.statusLabels.active',
      'guardianPortal.login.pageTitle',
      'guardianPortal.login.portalEyebrow',
      'guardianPortal.layout.title',
      'guardianPortal.dashboard.title',
      'guardianPortal.dashboard.openChildren',
      'guardianPortal.students.total',
      'guardianPortal.studentProfile.attendanceTitle',
      'guardianPortal.attendance.total',
      'guardianPortal.schedule.title',
      'guardianPortal.progress.title',
      'guardianPortal.reports.title',
      'guardianPortal.admin.accountsTitle',
      'guardianPortal.admin.inviteTitle',
      'guardianPortal.admin.guardianIdRequired',
      'guardianPortal.activation.submit',
    ]

    keys.forEach((key) => {
      expectString(enGuardianPortal, key)
      expectString(khGuardianPortal, key)
    })
  })

  it('keeps the locale module nested under guardianPortal only once', () => {
    expect(Object.prototype.hasOwnProperty.call(enGuardianPortal, 'guardianPortal')).toBe(true)
    expect(Object.prototype.hasOwnProperty.call(khGuardianPortal, 'guardianPortal')).toBe(true)
    expect(Object.prototype.hasOwnProperty.call(enGuardianPortal.guardianPortal, 'guardianPortal')).toBe(false)
    expect(Object.prototype.hasOwnProperty.call(khGuardianPortal.guardianPortal, 'guardianPortal')).toBe(false)
  })
})

import { describe, expect, it } from 'vitest'
import enPreschool from '@/i18n/en/preschool'
import khPreschool from '@/i18n/kh/preschool'

// Keep Preschool locale parity covered so the real pages do not regress back to
// missing-key warnings or accidental double nesting when the module evolves.
function expectString(source, path) {
  const value = path.split('.').reduce((carry, key) => carry?.[key], source)
  expect(typeof value).toBe('string')
  expect(value).not.toContain('<')
}

describe('preschool locale parity', () => {
  it('keeps real Preschool page keys aligned in EN and KH', () => {
    const keys = [
      'preschoolDashboardPage.title',
      'preschoolDashboardPage.loading',
      'preschoolStudentInfoPage.alerts.deleteFallback',
      'preschoolTeacherAttendancePage.messages.noResults',
      'preschoolPaymentManagementPage.alerts.deleteFallback',
      'preschoolClassesManagement.alerts.deleteTitle',
      'preschoolAddClass.statusLabels.success',
      'preschoolScaffold.reportManagement.title',
    ]

    keys.forEach((key) => {
      expectString(enPreschool, key)
      expectString(khPreschool, key)
    })
  })

  it('keeps Preschool locale exports flat at the module boundary', () => {
    expect(Object.prototype.hasOwnProperty.call(enPreschool, 'preschool')).toBe(false)
    expect(Object.prototype.hasOwnProperty.call(khPreschool, 'preschool')).toBe(false)
  })
})

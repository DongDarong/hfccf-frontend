import { describe, expect, it } from 'vitest'
import enPreschool from '@/i18n/en/preschool/settings.js'
import khPreschool from '@/i18n/kh/preschool/settings.js'

// Keep Preschool settings locale parity covered so the new configuration page
// does not drift into missing keys or mixed EN/KH nesting.
function expectString(source, path) {
  const value = path.split('.').reduce((carry, key) => carry?.[key], source)
  expect(typeof value).toBe('string')
  expect(value).not.toContain('<')
  expect(value).not.toMatch(/[\u00e2\u00e1\u017e\u00c3\uFFFD]/u)
}

describe('preschool settings locale parity', () => {
  it('keeps the settings labels aligned in EN and KH', () => {
    const keys = [
      'preschoolSettingsPage.pageTitle',
      'preschoolSettingsPage.pageSubtitle',
      'preschoolSettingsPage.dashboard.pageTitle',
      'preschoolSettingsPage.dashboard.pageSubtitle',
      'preschoolSettingsPage.dashboard.emptyDashboard',
      'preschoolSettingsPage.dashboard.actions.backToDashboard',
      'preschoolSettingsPage.dashboard.messages.loadFailed',
      'preschoolSettingsPage.dashboard.statuses.configured',
      'preschoolSettingsPage.dashboard.fields.activeAcademicYear',
      'preschoolSettingsPage.dashboard.fields.activeAcademicYearDateRange',
      'preschoolSettingsPage.dashboard.fields.currentAttendanceRules',
      'preschoolSettingsPage.dashboard.fields.activeTermDateRange',
      'preschoolSettingsPage.dashboard.fields.organizationName',
      'preschoolSettingsPage.dashboard.emptyStates.academicYear',
      'preschoolSettingsPage.dashboard.emptyStates.currency',
      'preschoolSettingsPage.dashboard.sections.academic.title',
      'preschoolSettingsPage.dashboard.sections.attendance.title',
      'preschoolSettingsPage.dashboard.sections.payments.title',
      'preschoolSettingsPage.dashboard.sections.assessments.title',
      'preschoolSettingsPage.dashboard.sections.health.title',
      'preschoolSettingsPage.dashboard.sections.preferences.title',
      'preschoolSettingsPage.sections.summary.title',
      'preschoolSettingsPage.sections.academicYear.title',
      'preschoolSettingsPage.sections.terms.title',
      'preschoolSettingsPage.sections.classConfiguration.title',
      'preschoolSettingsPage.sections.attendance.title',
      'preschoolSettingsPage.sections.payment.title',
      'preschoolSettingsPage.fields.currentAcademicYear',
      'preschoolSettingsPage.fields.defaultTuitionFee',
      'preschoolSettingsPage.actions.saveChanges',
      'preschoolSettingsPage.actions.reset',
      'preschoolSettingsPage.validation.required',
      'preschoolSettingsPage.validation.range',
      'preschoolSettingsPage.operationalStates.saved',
      'preschoolAcademicSettingsPage.pageTitle',
      'preschoolAcademicSettingsPage.pageSubtitle',
      'preschoolAcademicSettingsPage.activeCards.academicYear.title',
      'preschoolAcademicSettingsPage.activeCards.term.title',
      'preschoolAcademicSettingsPage.statuses.current',
      'preschoolAcademicSettingsPage.statuses.archived',
      'preschoolAcademicSettingsPage.fields.code',
      'preschoolAcademicSettingsPage.fields.isCurrent',
      'preschoolAcademicSettingsPage.actions.archive',
      'preschoolAcademicSettingsPage.dialogs.academicYear.createTitle',
      'preschoolAcademicSettingsPage.dialogs.term.editTitle',
      'preschoolAcademicSettingsPage.emptyStates.noAcademicYears',
      'preschoolAcademicSettingsPage.validation.outsideYear',
    ]

    keys.forEach((key) => {
      expectString(enPreschool, key)
      expectString(khPreschool, key)
    })
  })

  it('keeps the Preschool module export flat', () => {
    expect(Object.prototype.hasOwnProperty.call(enPreschool, 'preschool')).toBe(false)
    expect(Object.prototype.hasOwnProperty.call(khPreschool, 'preschool')).toBe(false)
  })
})

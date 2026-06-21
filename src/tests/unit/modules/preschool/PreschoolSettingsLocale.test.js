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
      'preschoolSettingsPage.dashboard.fields.lateThresholdMinutes',
      'preschoolSettingsPage.dashboard.fields.absenceAlertDays',
      'preschoolSettingsPage.dashboard.fields.schoolWeek',
      'preschoolSettingsPage.dashboard.fields.calendarEventsCount',
      'preschoolSettingsPage.dashboard.fields.activeTermDateRange',
      'preschoolSettingsPage.dashboard.fields.organizationName',
      'preschoolSettingsPage.dashboard.emptyStates.academicYear',
      'preschoolSettingsPage.dashboard.emptyStates.currency',
      'preschoolSettingsPage.dashboard.emptyStates.lateThresholdMinutes',
      'preschoolSettingsPage.dashboard.emptyStates.absenceAlertDays',
      'preschoolSettingsPage.dashboard.emptyStates.schoolWeek',
      'preschoolSettingsPage.dashboard.emptyStates.calendarEventsCount',
      'preschoolSettingsPage.dashboard.sections.academic.title',
      'preschoolSettingsPage.dashboard.sections.attendance.title',
      'preschoolSettingsPage.dashboard.sections.payments.title',
      'preschoolSettingsPage.dashboard.sections.assessments.title',
      'preschoolSettingsPage.dashboard.sections.health.title',
      'preschoolSettingsPage.dashboard.sections.preferences.title',
      'preschoolAttendanceSettingsPage.pageTitle',
      'preschoolAttendanceSettingsPage.pageSubtitle',
      'preschoolAttendanceSettingsPage.sections.thresholds.title',
      'preschoolAttendanceSettingsPage.sections.alerts.title',
      'preschoolAttendanceSettingsPage.sections.schoolWeek.title',
      'preschoolAttendanceSettingsPage.sections.calendar.title',
      'preschoolAttendanceSettingsPage.fields.lateThresholdMinutes',
      'preschoolAttendanceSettingsPage.fields.halfDayThresholdMinutes',
      'preschoolAttendanceSettingsPage.fields.absenceAlertDays',
      'preschoolAttendanceSettingsPage.fields.guardianAlerts',
      'preschoolAttendanceSettingsPage.fields.teacherAlerts',
      'preschoolAttendanceSettingsPage.fields.adminAlerts',
      'preschoolAttendanceSettingsPage.fields.academicYearId',
      'preschoolAttendanceSettingsPage.fields.description',
      'preschoolAttendanceSettingsPage.calendar.types.holiday',
      'preschoolAttendanceSettingsPage.calendar.types.closure',
      'preschoolAttendanceSettingsPage.calendar.types.teacherTraining',
      'preschoolAttendanceSettingsPage.calendar.types.examination',
      'preschoolAttendanceSettingsPage.calendar.types.specialEvent',
      'preschoolAttendanceSettingsPage.calendar.statuses.archived',
      'preschoolAttendanceSettingsPage.actions.createEvent',
      'preschoolAttendanceSettingsPage.actions.updateEvent',
      'preschoolAttendanceSettingsPage.actions.resetEvent',
      'preschoolAttendanceSettingsPage.actions.saveSettings',
      'preschoolAttendanceSettingsPage.actions.archive',
      'preschoolAttendanceSettingsPage.messages.eventCreated',
      'preschoolAttendanceSettingsPage.messages.eventUpdated',
      'preschoolAttendanceSettingsPage.messages.eventArchived',
      'preschoolAttendanceSettingsPage.messages.settingsSaved',
      'preschoolAttendanceSettingsPage.validation.range',
      'preschoolAttendanceSettingsPage.validation.positive',
      'preschoolAcademicSettingsPage.pageTitle',
      'preschoolAcademicSettingsPage.pageSubtitle',
      'preschoolAcademicSettingsPage.activeCards.academicYear.title',
      'preschoolAcademicSettingsPage.activeCards.term.title',
      'preschoolAcademicSettingsPage.statuses.current',
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

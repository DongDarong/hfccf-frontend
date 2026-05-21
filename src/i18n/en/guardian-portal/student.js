// Keep per-child summary labels isolated so each read-only summary page can
// reuse the same contract without introducing nested page-specific copies.
export default {
  studentProfile: {
    title: 'Child profile',
    subtitle: 'Linked child details',
    attendanceTitle: 'Attendance summary',
    attendanceSubtitle: 'Read-only attendance snapshot for the selected child.',
    scheduleTitle: 'Schedule summary',
    scheduleSubtitle: 'Weekly timetable snapshot for the selected child.',
    progressTitle: 'Progress summary',
    progressSubtitle: 'Finalized assessment progress for the selected child.',
    reportsTitle: 'Report summary',
    reportsSubtitle: 'Finalized Preschool report data for the selected child.',
    openAttendance: 'Open attendance',
    openSchedule: 'Open schedule',
    openProgress: 'Open progress',
    openReports: 'Open reports',
  },
}

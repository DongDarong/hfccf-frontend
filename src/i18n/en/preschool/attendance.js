// Keep attendance copy separate so teacher attendance can be tested without
// relying on placeholders or hardcoded strings in the page template.
export default {
  preschoolTeacherAttendancePage: {
    title: 'Preschool Attendance',
    subtitle: 'Track attendance for your assigned preschool classes.',
    searchPlaceholder: 'Search attendance',
    filters: {
      allStatus: 'All status',
    },
    columns: {
      no: 'No.',
      student: 'Student',
      class: 'Class',
      date: 'Date',
      status: 'Status',
      note: 'Note',
    },
    options: {
      present: 'Present',
      absent: 'Absent',
      late: 'Late',
      excused: 'Excused',
    },
    messages: {
      loadFailed: 'Failed to load attendance.',
      noResults: 'No attendance records found.',
    },
  },
  preschoolAdminAttendancePage: {
    title: 'Attendance Management',
    subtitle: 'Mark and review daily attendance for a class.',
    filters: {
      class: 'Class',
      date: 'Date',
    },
    placeholders: {
      class: 'Select a class',
      status: 'Status',
      note: 'Note (optional)',
    },
    columns: {
      student: 'Student',
      status: 'Status',
      note: 'Note',
    },
    status: {
      present: 'Present',
      absent: 'Absent',
      late: 'Late',
      excused: 'Excused',
      presentShort: 'P',
      absentShort: 'A',
      lateShort: 'L',
      excusedShort: 'E',
    },
    actions: {
      markAllPresent: 'Mark All Present',
      markAllAbsent: 'Mark All Absent',
      clearAll: 'Clear All',
      save: 'Save Attendance',
      saving: 'Saving…',
      prevDay: 'Previous Day',
      nextDay: 'Next Day',
    },
    summary: '{marked} of {total} students marked',
    messages: {
      selectClass: 'Select a class and date to begin marking attendance.',
      noStudents: 'No students are enrolled in this class.',
      loadFailed: 'Failed to load attendance data.',
      saved: 'Attendance saved.',
      saveFailed: 'Some records could not be saved. Please try again.',
      skippedNote: 'Students with no status selected will be skipped.',
    },
  },
}

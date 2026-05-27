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
}

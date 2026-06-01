// Keep attendance copy separate so teacher attendance can be tested without
// relying on placeholders or hardcoded strings in the page template.
export default {
  // ── Admin hub ──────────────────────────────────────────────────────────────
  preschoolAttendanceHubPage: {
    title: 'Attendance Management',
    subtitle: 'Record and review attendance for students and teachers.',
    cards: {
      students: {
        title: 'Daily Student Attendance',
        description: 'Mark attendance for students in a class on a selected date.',
      },
      teachers: {
        title: 'Daily Teacher Attendance',
        description: 'Record attendance for teaching staff on a selected date.',
      },
      history: {
        title: 'Attendance History',
        description: 'Browse all past attendance records with date and status filters.',
      },
    },
  },
  // ── Admin teacher attendance ───────────────────────────────────────────────
  preschoolAdminTeacherAttendancePage: {
    title: 'Teacher Attendance',
    subtitle: 'Record daily attendance for teaching staff.',
    filters: {
      date: 'Date',
    },
    columns: {
      teacher: 'Teacher',
      status: 'Status',
      note: 'Note',
    },
    placeholders: {
      note: 'Note (optional)',
    },
    actions: {
      markAllPresent: 'Mark All Present',
      markAllAbsent: 'Mark All Absent',
      clearAll: 'Clear All',
      save: 'Save Attendance',
      saving: 'Saving…',
      prevDay: 'Previous Day',
      nextDay: 'Next Day',
      back: 'Back',
    },
    summary: '{marked} of {total} teachers marked',
    messages: {
      noTeachers: 'No teachers found.',
      loadFailed: 'Failed to load teacher data.',
      saved: 'Teacher attendance saved.',
      saveFailed: 'Some records could not be saved. Please try again.',
      skippedNote: 'Teachers with no status selected will be skipped.',
    },
  },
  // ── Admin attendance history ───────────────────────────────────────────────
  preschoolAdminAttendanceHistoryPage: {
    title: 'Attendance History',
    subtitle: 'Browse and filter all past attendance records.',
    filters: {
      search: 'Search',
      class: 'Class',
      status: 'Status',
      date: 'Date',
      allStatuses: 'All Statuses',
      allClasses: 'All Classes',
    },
    placeholders: {
      search: 'Search by student or teacher name…',
    },
    columns: {
      no: 'No.',
      student: 'Student',
      class: 'Class',
      date: 'Date',
      status: 'Status',
      note: 'Note',
      recordedBy: 'Recorded By',
    },
    actions: {
      apply: 'Apply Filters',
      back: 'Back',
    },
    messages: {
      empty: 'No attendance records found.',
      loadFailed: 'Failed to load attendance records.',
    },
    pagination: {
      previous: 'Previous',
      next: 'Next',
      summary: 'Page {page} of {lastPage} · {total} records',
    },
  },
  // ── Teacher hub ────────────────────────────────────────────────────────────
  preschoolTeacherAttendanceHubPage: {
    title: 'Attendance',
    subtitle: 'Mark attendance for your students or record your own.',
    cards: {
      students: {
        title: 'My Students\' Attendance',
        description: 'Mark daily attendance for students in your assigned classes.',
      },
      self: {
        title: 'My Attendance',
        description: 'Record your own attendance for today.',
      },
    },
  },
  // ── Teacher → my students attendance ──────────────────────────────────────
  preschoolTeacherStudentAttendancePage: {
    title: 'My Students\' Attendance',
    subtitle: 'Mark attendance for students in your classes.',
    actions: {
      back: 'Back',
    },
  },
  // ── Teacher self-attendance ────────────────────────────────────────────────
  preschoolTeacherSelfAttendancePage: {
    title: 'My Attendance',
    subtitle: 'Record your own attendance for a selected date.',
    fields: {
      date: 'Date',
      status: 'Status',
      note: 'Note',
    },
    placeholders: {
      note: 'Add a note (optional)',
      status: 'Select status',
    },
    actions: {
      save: 'Save',
      saving: 'Saving…',
      back: 'Back',
    },
    messages: {
      saved: 'Your attendance has been recorded.',
      saveFailed: 'Failed to record attendance. Please try again.',
      selectStatus: 'Please select a status before saving.',
    },
  },
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
      back: 'Back',
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

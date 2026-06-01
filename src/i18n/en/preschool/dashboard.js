// Keep teacher and admin dashboard copy in a dedicated module so the pages can
// stay template-driven and do not drift back to hardcoded English labels.
export default {
  preschoolDashboardPage: {
    title: 'Preschool Operations Board',
    subtitle: 'Enrollment readiness, attendance, and classroom resourcing.',
    loading: 'Loading preschool dashboard...',
    cards: {
      students: {
        title: 'Total Students',
        label: 'Active student records',
      },
      classes: {
        title: 'Active Classes',
        label: 'Live classroom groups',
      },
      teachers: {
        title: 'Teachers',
        label: 'Preschool teachers',
      },
      attendance: {
        title: 'Attendance Today',
        label: 'Recorded today',
      },
    },
    actions: {
      queueTitle: 'Action Queue',
      pendingPayments: 'Pending payments: {count}',
      overduePayments: 'Overdue payments: {count}',
      paidPayments: 'Paid payments: {count}',
      upcomingClasses: 'Upcoming classes: {count}',
      scheduleManagement: 'Manage schedules',
    },
    notesTitle: 'Operational Notes',
    spotlightEyebrow: 'Priority Focus',
    noUpcomingClasses: 'No upcoming classes',
    nextClassSuffix: 'is next',
    assignedTeacher: 'Assigned teacher',
    populateText: 'Create classes and assign teachers to populate this board.',
    errors: {
      loadFailed: 'Failed to load preschool dashboard.',
    },
  },
  preschoolTeacherDashboardPage: {
    title: 'Preschool Teaching Workspace',
    subtitle: 'Daily class support, student care, and activity planning.',
    loading: 'Loading teacher dashboard...',
    quickStats: 'Quick Stats',
    cards: {
      students: {
        title: 'My Students',
        label: 'Students in your classes',
      },
      classes: {
        title: 'My Classes',
        label: 'Assigned classes',
      },
      attendance: {
        title: 'Attendance Today',
        label: 'Records for today',
      },
      payments: {
        title: 'Pending Payments',
        label: 'Tuition follow-up',
      },
    },
    actions: {
      upcomingClasses: 'Upcoming classes: {count}',
      overduePayments: 'Overdue payments: {count}',
      paidPayments: 'Paid payments: {count}',
      mySchedule: 'My schedule',
    },
    spotlight: {
      nextSuffix: 'is next',
      noUpcomingClasses: 'No upcoming classes',
      assignedTeacher: 'Assigned teacher',
      fallback: 'Your assigned classes will appear here once they are created.',
      studentsEnrolled: '{count} students enrolled',
    },
    activity: {
      title: 'Recent activity',
      fallback: 'Attendance entries will appear here once they are recorded.',
    },
    classes: {
      title: 'My Classes',
      subtitle: 'Classes assigned to you this term.',
      noClasses: 'No classes are assigned to you yet.',
      studentsCount: '{count} students',
      level: 'Level',
      room: 'Room',
      viewStudents: 'Students',
      viewAttendance: 'Attendance',
    },
    quickNav: {
      title: 'Quick Access',
      schedule: 'My Schedule',
      students: 'My Students',
      attendance: 'Attendance Records',
      reports: 'Student Reports',
    },
    errors: {
      loadFailed: 'Failed to load teacher dashboard.',
    },
  },
}

// Keep teacher and admin dashboard copy in a dedicated module so the pages can
// stay template-driven and do not drift back to hardcoded English labels.
export default {
  preschoolDashboardPage: {
    title: 'Preschool Operations Board',
    subtitle: 'Enrollment readiness, attendance, health, and classroom oversight at a glance.',
    loading: 'Loading preschool dashboard...',
    header: {
      scheduleManagement: 'Manage schedules',
      openReports: 'Open reports center',
    },
    summary: {
      activeStudents: {
        title: 'Active Students',
        label: 'Live student records',
      },
      attendanceToday: {
        title: 'Attendance Today',
        label: 'Records marked today',
      },
      healthAlerts: {
        title: 'Open Health Alerts',
        label: 'Needs follow-up',
      },
      pendingEnrollments: {
        title: 'Pending Enrollments',
        label: 'Applications awaiting review',
      },
      outstandingPayments: {
        title: 'Outstanding Payments',
        label: 'Unpaid invoices',
      },
    },
    priority: {
      title: 'Today / Action Required',
      subtitle: 'Only the items that need attention right now.',
      cardTitle: 'Priority Queue',
      empty: 'No urgent items right now.',
      health: 'Urgent health alerts',
      healthDetail: 'Needs medical follow-up',
      enrollment: 'Pending enrollment decisions',
      enrollmentDetail: 'Review new applications',
      guardians: 'Unresolved guardian issues',
      guardiansDetail: 'Follow up with families',
      payments: 'Overdue payments',
      paymentsDetail: 'Invoices past due',
      attendance: 'Attendance exceptions',
      attendanceDetail: 'Late or missing check-ins',
    },
    insights: {
      title: 'Main Insights',
      subtitle: 'Summary analytics for the current day and reporting cycle.',
      attendance: {
        title: 'Attendance Overview',
        label: 'Attendance rate',
        note: 'Absence rate {absence}, late rate {late}.',
        metrics: {
          present: 'Recorded today',
          absent: 'Absence rate',
        },
      },
      enrollment: {
        title: 'Enrollment Trend',
        label: 'New enrollments',
        note: '{active} active students currently enrolled.',
        metrics: {
          active: 'Active students',
          students: 'Total students',
        },
      },
      assessment: {
        title: 'Assessment Snapshot',
        label: 'Completion rate',
        note: '{risk} students are currently at risk.',
        metrics: {
          risk: 'At-risk students',
          score: 'Average score',
        },
      },
      payments: {
        title: 'Payment Snapshot',
        label: 'Revenue',
        note: '{overdue} invoices still need follow-up.',
        metrics: {
          outstanding: 'Outstanding balance',
          overdue: 'Overdue invoices',
        },
      },
    },
    operations: {
      title: 'Operational Sections',
      subtitle: 'Secondary information, schedules, and shortcuts stay below the fold.',
      recentActivityEmpty: 'No attendance activity has been recorded yet.',
      upcomingSchedules: 'Upcoming Schedules',
      upcomingEmpty: 'No upcoming classes are scheduled.',
      recentActivityFallback: 'Student activity',
      classFallback: 'Class',
      classroomSummary: {
        title: 'Classroom Summary',
        students: 'Students',
        classes: 'Classes',
        teachers: 'Teachers',
        attendance: 'Attendance today',
      },
      shortcuts: {
        title: 'Shortcuts',
        schedule: 'Manage schedules',
        reports: 'Open reports center',
        settings: 'Open settings',
        enrollments: 'Open enrollments',
      },
    },
    spotlight: {
      eyebrow: 'Current Academic Context',
      noUpcomingClasses: 'No upcoming classes',
      nextClassSuffix: 'is next',
      assignedTeacher: 'Assigned teacher',
      fallback: 'Create classes and assign teachers to populate this section.',
      nextClassFallback: 'Upcoming class',
      nextClassText: '{teacher} teaches {students} students',
    },
    errors: {
      coreLoadFailed: 'Failed to load preschool dashboard.',
      reportsLoadFailed: 'Failed to load reporting dashboard.',
      loadFailed: 'Failed to load preschool dashboard.',
    },
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
      reports: {
        title: 'Reports',
        subtitle: 'Cross-module reporting overview',
        action: 'Open Reports Center',
        label: 'Attendance rate',
        revenue: 'Revenue',
        revenueLabel: 'Billing performance',
        health: 'Open health alerts',
        healthLabel: 'Health risk',
        assessments: 'Assessment completion',
        assessmentsLabel: 'Learning progress',
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
  },
  preschoolDashboardActivity: {
    title: 'Recent Activity',
  },
  preschoolDashboardSpotlight: {
    eyebrow: 'Current Academic Context',
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
    },
    activity: {
      title: 'Recent activity',
      fallback: 'Attendance entries will appear here once they are recorded.',
    },
    errors: {
      loadFailed: 'Failed to load teacher dashboard.',
    },
  },
}

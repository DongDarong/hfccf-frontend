export default {
  preschoolClassesManagement: {
    title: 'Preschool Classes',
    subtitle: 'Manage class groups, assigned teachers, and schedule coverage for early learning.',
    addButton: 'Add Class',
    searchPlaceholder: 'Search classes, teachers, levels, or schedules',
    tableEmpty: 'No preschool classes found.',
    toolbarEyebrow: 'Class directory',
    toolbarSummary: '{count} classes in view',
    visibleRange: 'Showing {start}-{end} of {total} classes',
    noResults: 'No classes match the current filters.',
    spotlightLabel: 'Active classes',
    highlights: {
      visibleClasses: 'Visible classes',
      visibleStudents: 'Visible students',
      avgStudents: 'Avg. students',
    },
    summary: {
      total: {
        title: 'Total classes',
        badge: '{count} groups',
        caption: 'Total preschool class groups currently managed in the program.',
      },
      active: {
        title: 'Active classes',
        badge: '{rate} operational',
        caption: 'Classes currently running with assigned teachers and active student rosters.',
      },
      pending: {
        title: 'Pending setup',
        badge: 'Needs review',
        badgeClear: 'No pending',
        caption: 'Classes waiting for schedule confirmation or teacher assignment.',
      },
      students: {
        title: 'Total students',
        badge: 'Enrolled',
        caption: 'Total number of students across all preschool class levels.',
      },
    },
    table: {
      code: 'Code',
      class: 'Class',
      teacher: 'Teacher',
      level: 'Level',
      schedule: 'Schedule',
      students: 'Students',
    },
  },
}

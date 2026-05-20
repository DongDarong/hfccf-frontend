// Keep report shared labels separate so the student and classroom pages can
// reuse the same loading, empty, and observation copy without duplication.
export default {
  preschoolReportsShared: {
    loading: 'Loading report data...',
    emptyReport: 'Choose a student or class and a reporting period to view the report.',
    emptyOverview: 'No finalized report periods are available yet.',
    periodHint: 'Reports are built only from finalized assessments.',
    summary: {
      finalized: 'Finalized Assessments',
      finalizedCaption: 'Locked report records',
      average: 'Average Score',
      averageCaption: 'Average finalized score',
      observations: 'Observations',
      observationsCaption: 'Teacher notes and comments',
      latest: 'Latest Assessment',
      latestCaption: 'Most recent finalized record',
      students: 'Students',
      studentsCaption: 'Students tracked in the classroom',
    },
    attendanceTitle: 'Attendance Summary',
    attendanceSubtext: 'Attendance records within the selected reporting period.',
    attendance: {
      total: 'Attendance Records',
      present: 'Present',
      late: 'Late',
      absent: 'Absent',
      excused: 'Excused',
      latest: 'Latest attendance: {date}',
      totalShort: '{count} records',
    },
    observationsTitle: 'Teacher Observations',
    emptyObservations: 'No teacher observations were recorded for this period.',
    assessmentsTitle: 'Finalized Assessments',
    emptyAssessments: 'No finalized assessments were found for this period.',
    labels: {
      studentFallback: 'Selected student',
      categoryFallback: 'Category',
      score: 'Score: {score}',
    },
    actions: {
      refresh: 'Refresh Report',
    },
  },
}

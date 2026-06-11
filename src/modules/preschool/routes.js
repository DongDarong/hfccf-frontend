import { ACCESS_SCOPES, DOMAINS } from '@/constants/access'
import { defineAppRoute } from '@/router/defineAppRoute'

// Preserve stable Preschool route names while moving legacy filenames toward
// clearer component names and explicit scaffold states.
export const preschoolRoutes = [
  defineAppRoute({
    path: '/module/preschool-admin/dashboard',
    name: 'dashboard-preschool-admin',
    component: () => import('@/modules/preschool/admin/pages/PreschoolDashboard.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/students',
    name: 'dashboard-preschool-admin-students',
    component: () => import('@/modules/preschool/admin/pages/StudentInfo.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/students/add',
    name: 'dashboard-preschool-admin-students-add',
    component: () => import('@/modules/preschool/admin/pages/StudentForm.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/students/:id/edit',
    name: 'dashboard-preschool-admin-students-edit',
    component: () => import('@/modules/preschool/admin/pages/StudentForm.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/students/:id/profile',
    name: 'dashboard-preschool-admin-student-profile',
    component: () => import('@/modules/preschool/admin/pages/StudentProfile.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/users',
    name: 'dashboard-preschool-admin-users',
    component: () => import('@/modules/preschool/admin/pages/TeacherManagement.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/users/add',
    name: 'dashboard-preschool-admin-users-add',
    component: () => import('@/modules/preschool/admin/pages/AddTeacher.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/users/:id',
    name: 'dashboard-preschool-admin-teacher-view',
    component: () => import('@/modules/preschool/admin/pages/TeacherView.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/classes',
    name: 'dashboard-preschool-admin-classes',
    component: () => import('@/modules/preschool/admin/pages/ClassesManagement.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/classes/add',
    name: 'dashboard-preschool-admin-classes-add',
    component: () => import('@/modules/preschool/admin/pages/AddClass.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/payment',
    name: 'dashboard-preschool-admin-payment',
    component: () => import('@/modules/preschool/admin/pages/PaymentManagement.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/attendance',
    name: 'dashboard-preschool-admin-attendance',
    component: () => import('@/modules/preschool/admin/pages/AttendanceManagement.vue'),
    access: { domains: [DOMAINS.PRESCHOOL], scopes: [ACCESS_SCOPES.ADMIN] },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/attendance/students',
    name: 'dashboard-preschool-admin-attendance-students',
    component: () => import('@/modules/preschool/admin/pages/AttendanceStudents.vue'),
    access: { domains: [DOMAINS.PRESCHOOL], scopes: [ACCESS_SCOPES.ADMIN] },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/attendance/history',
    name: 'dashboard-preschool-admin-attendance-history',
    component: () => import('@/modules/preschool/admin/pages/AttendanceHistory.vue'),
    access: { domains: [DOMAINS.PRESCHOOL], scopes: [ACCESS_SCOPES.ADMIN] },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/attendance/dashboard',
    name: 'dashboard-preschool-admin-attendance-dashboard',
    component: () => import('@/modules/preschool/admin/pages/AttendanceDashboard.vue'),
    access: { domains: [DOMAINS.PRESCHOOL], scopes: [ACCESS_SCOPES.ADMIN] },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/attendance/alerts',
    name: 'dashboard-preschool-admin-attendance-alerts',
    component: () => import('@/modules/preschool/admin/pages/AttendanceAlerts.vue'),
    access: { domains: [DOMAINS.PRESCHOOL], scopes: [ACCESS_SCOPES.ADMIN] },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/attendance/calendar',
    name: 'dashboard-preschool-admin-attendance-calendar',
    component: () => import('@/modules/preschool/admin/pages/AttendanceCalendar.vue'),
    access: { domains: [DOMAINS.PRESCHOOL], scopes: [ACCESS_SCOPES.ADMIN] },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/attendance/profile',
    name: 'dashboard-preschool-admin-attendance-profile',
    component: () => import('@/modules/preschool/admin/pages/AttendanceProfile.vue'),
    access: { domains: [DOMAINS.PRESCHOOL], scopes: [ACCESS_SCOPES.ADMIN] },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/attendance/id-card',
    name: 'dashboard-preschool-admin-attendance-id-card',
    component: () => import('@/modules/preschool/admin/pages/AttendanceIdCard/AttendanceIdCard.vue'),
    access: { domains: [DOMAINS.PRESCHOOL], scopes: [ACCESS_SCOPES.ADMIN] },
  }),
  // Settings stays in the admin Preschool route tree so the configuration
  // surface remains discoverable without creating a second dashboard shell.
  defineAppRoute({
    path: '/module/preschool-admin/settings',
    name: 'dashboard-preschool-admin-settings',
    component: () => import('@/modules/preschool/admin/pages/PreschoolSettings/PreschoolSettings.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  // Assignment workflow stays admin-only so student/class, teacher/class, and
  // schedule ownership can be managed without exposing teacher setup controls
  // to staff users.
  defineAppRoute({
    path: '/module/preschool-admin/assignments',
    name: 'dashboard-preschool-admin-assignments',
    component: () => import('@/modules/preschool/admin/pages/PreschoolAssignments/PreschoolAssignments.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  // Assessment routes are shared by Preschool admins and teachers so the UI
  // can grow into reporting later without splitting the same workflow twice.
  defineAppRoute({
    path: '/module/preschool-admin/assessments',
    name: 'dashboard-preschool-assessments',
    component: () => import('@/modules/preschool/admin/pages/StudentAssessments.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN, ACCESS_SCOPES.STAFF],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/assessments/add',
    name: 'dashboard-preschool-assessments-add',
    component: () => import('@/modules/preschool/admin/pages/AddAssessment.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN, ACCESS_SCOPES.STAFF],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/assessments/summary',
    name: 'dashboard-preschool-progress-summary',
    component: () => import('@/modules/preschool/admin/pages/ProgressSummary.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN, ACCESS_SCOPES.STAFF],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/reports',
    name: 'dashboard-preschool-admin-reports',
    component: () => import('@/modules/preschool/admin/pages/ReportManagement.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/reports/audit',
    name: 'dashboard-preschool-admin-lifecycle-audit',
    component: () => import('@/modules/preschool/admin/pages/LifecycleAudit.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  // Snapshot archive is admin-only because it exposes immutable historical
  // report output for browsing, comparison, and export rather than editing.
  defineAppRoute({
    path: '/module/preschool-admin/reports/snapshots',
    name: 'dashboard-preschool-admin-report-snapshots',
    component: () => import('@/modules/preschool/admin/pages/ReportSnapshotArchive.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  // Export governance stays admin-only so institutional exports and historical
  // comparisons remain read-only review surfaces rather than a teacher tool.
  defineAppRoute({
    path: '/module/preschool-admin/reports/export-governance',
    name: 'dashboard-preschool-admin-export-governance',
    component: () => import('@/modules/preschool/admin/pages/ReportExportGovernance.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  // Governance review stays admin-only so institutional reconstruction and
  // historical anomaly review never create a write surface for staff users.
  defineAppRoute({
    path: '/module/preschool-admin/governance/review',
    name: 'dashboard-preschool-admin-governance-review',
    component: () => import('@/modules/preschool/admin/pages/GovernanceReview/GovernanceReview.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  // Institutional reconstruction stays admin-only so historical state can be
  // replayed from immutable records without mutating live operational data.
  defineAppRoute({
    path: '/module/preschool-admin/governance/reconstruction',
    name: 'dashboard-preschool-admin-reconstruction',
    component: () => import('@/modules/preschool/admin/pages/InstitutionalReconstruction.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  // Governance diff analysis stays admin-only so institutional comparisons
  // remain snapshot-first, review-focused, and separate from operational CRUD.
  defineAppRoute({
    path: '/module/preschool-admin/governance/diff',
    name: 'dashboard-preschool-admin-governance-diff',
    component: () => import('@/modules/preschool/admin/pages/GovernanceDiffAnalysis.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  // Governance cases keep diff and integrity findings in a review workflow so
  // administrators can assign, escalate, and resolve institutional risk.
  defineAppRoute({
    path: '/module/preschool-admin/governance/cases',
    name: 'dashboard-preschool-admin-governance-cases',
    component: () => import('@/modules/preschool/admin/pages/GovernanceCases.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  // Reports stay split into overview, student, and classroom routes so the UI
  // can navigate to real finalized data without exposing placeholder screens.
  defineAppRoute({
    path: '/module/preschool-admin/reports/students',
    name: 'dashboard-preschool-admin-student-reports',
    component: () => import('@/modules/preschool/admin/pages/StudentReports.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN, ACCESS_SCOPES.STAFF],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/reports/classes',
    name: 'dashboard-preschool-admin-classroom-reports',
    component: () => import('@/modules/preschool/admin/pages/ClassroomReports.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN, ACCESS_SCOPES.STAFF],
    },
  }),
  // Weekly schedules stay separate from reports so timetable management can
  // evolve without coupling it to assessments or attendance history.
  defineAppRoute({
    path: '/module/preschool-admin/schedules',
    name: 'dashboard-preschool-admin-schedules',
    component: () => import('@/modules/preschool/admin/pages/ScheduleManagement.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/schedules/classes',
    name: 'dashboard-preschool-admin-class-schedule',
    component: () => import('@/modules/preschool/admin/pages/ClassSchedule.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN, ACCESS_SCOPES.STAFF],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/schedules/teachers',
    name: 'dashboard-preschool-admin-teacher-schedule',
    component: () => import('@/modules/preschool/admin/pages/TeacherSchedule.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN, ACCESS_SCOPES.STAFF],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/forms',
    name: 'dashboard-preschool-admin-forms',
    component: () => import('@/modules/preschool/admin/pages/FormManagement.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/classroom-resources',
    name: 'dashboard-preschool-admin-classroom-resources',
    component: () => import('@/modules/preschool/admin/pages/ClassroomResources.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/enrollments',
    name: 'dashboard-preschool-admin-enrollments',
    component: () => import('@/modules/preschool/admin/pages/EnrollmentManagement.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/teacher',
    name: 'dashboard-preschool-teacher',
    component: () => import('@/modules/preschool/teacher/pages/Dashboard.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.STAFF],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/teacher/students',
    name: 'dashboard-preschool-teacher-students',
    component: () => import('@/modules/preschool/teacher/pages/MyStudents.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.STAFF],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/teacher/schedule',
    name: 'dashboard-preschool-teacher-schedule',
    component: () => import('@/modules/preschool/teacher/pages/MySchedule.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.STAFF],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/teacher/report',
    name: 'dashboard-preschool-teacher-report',
    component: () => import('@/modules/preschool/admin/pages/StudentReports.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.STAFF],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/teacher/classroomresources',
    name: 'dashboard-preschool-teacher-classroomresources',
    component: () => import('@/modules/preschool/teacher/pages/TeacherClassroomResources.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.STAFF],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/teacher/healthy',
    name: 'dashboard-preschool-teacher-healthy',
    component: () => import('@/modules/preschool/teacher/pages/Healthy.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.STAFF],
    },
  }),
]

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
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  // Settings stays in the admin Preschool route tree so the configuration
  // surface remains discoverable without creating a second dashboard shell.
  defineAppRoute({
    path: '/module/preschool-admin/settings',
    name: 'dashboard-preschool-admin-settings',
    component: () => import('@/modules/preschool/admin/pages/PreschoolSettings.vue'),
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
  // Guardian data stays separate from student records so Preschool can reuse
  // the same contacts across siblings without pretending guardians are users.
  defineAppRoute({
    path: '/module/preschool-admin/guardians',
    name: 'dashboard-preschool-admin-guardians',
    component: () => import('@/modules/preschool/admin/pages/GuardianManagement.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  // Integrity reporting stays alongside guardian management so staff can
  // review duplicate and consistency drift without leaving the Preschool area.
  defineAppRoute({
    path: '/module/preschool-admin/guardians/integrity-report',
    name: 'dashboard-preschool-admin-guardian-integrity',
    component: () => import('@/modules/preschool/admin/pages/GuardianConsistencyReport.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  // Guardian detail stays read-only so staff can inspect the master record
  // without exposing any login or portal behavior.
  defineAppRoute({
    path: '/module/preschool-admin/guardians/:guardianId',
    name: 'dashboard-preschool-admin-guardian-details',
    component: () => import('@/modules/preschool/admin/pages/GuardianDetails.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/guardians/students',
    name: 'dashboard-preschool-admin-student-guardians',
    component: () => import('@/modules/preschool/admin/pages/StudentGuardians.vue'),
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
    path: '/module/preschool-admin/teacher/attendance',
    name: 'dashboard-preschool-teacher-attendance',
    component: () => import('@/modules/preschool/teacher/pages/Attendance.vue'),
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
    path: '/module/preschool-admin/teacher/emergency-contacts',
    name: 'dashboard-preschool-teacher-emergency-contacts',
    component: () => import('@/modules/preschool/teacher/pages/EmergencyContacts.vue'),
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

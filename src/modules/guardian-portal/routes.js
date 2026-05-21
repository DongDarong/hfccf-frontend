import { ACCESS_SCOPES, DOMAINS } from '@/constants/access'
import { defineAppRoute } from '@/router/defineAppRoute'

// Keep guardian portal routing isolated so read-only child views can evolve
// without mixing them into staff or Preschool admin route trees.
export const guardianPortalRoutes = [
  defineAppRoute({
    path: '/guardian-portal/activate',
    name: 'guardian-portal-activate',
    component: () => import('@/modules/guardian-portal/pages/GuardianPortalActivate.vue'),
    access: {
      requiresAuth: false,
    },
  }),
  defineAppRoute({
    path: '/guardian-portal/dashboard',
    name: 'guardian-portal-dashboard',
    component: () => import('@/modules/guardian-portal/pages/GuardianPortalDashboard.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.PORTAL],
    },
  }),
  defineAppRoute({
    path: '/guardian-portal/students',
    name: 'guardian-portal-students',
    component: () => import('@/modules/guardian-portal/pages/GuardianPortalStudents.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.PORTAL],
    },
  }),
  defineAppRoute({
    path: '/guardian-portal/students/:studentId',
    name: 'guardian-portal-student-profile',
    component: () => import('@/modules/guardian-portal/pages/GuardianStudentProfile.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.PORTAL],
    },
  }),
  defineAppRoute({
    path: '/guardian-portal/students/:studentId/attendance',
    name: 'guardian-portal-student-attendance',
    component: () => import('@/modules/guardian-portal/pages/GuardianAttendanceSummary.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.PORTAL],
    },
  }),
  defineAppRoute({
    path: '/guardian-portal/students/:studentId/schedule',
    name: 'guardian-portal-student-schedule',
    component: () => import('@/modules/guardian-portal/pages/GuardianScheduleSummary.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.PORTAL],
    },
  }),
  defineAppRoute({
    path: '/guardian-portal/students/:studentId/progress',
    name: 'guardian-portal-student-progress',
    component: () => import('@/modules/guardian-portal/pages/GuardianProgressReports.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.PORTAL],
    },
  }),
  defineAppRoute({
    path: '/guardian-portal/students/:studentId/reports',
    name: 'guardian-portal-student-reports',
    component: () => import('@/modules/guardian-portal/pages/GuardianReportsSummary.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.PORTAL],
    },
  }),
]

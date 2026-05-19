import { ACCESS_SCOPES, DOMAINS } from '@/constants/access'
import { defineAppRoute } from '@/router/defineAppRoute'

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
    component: () => import('@/modules/preschool/admin/pages/AttendentManagement.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
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
    path: '/module/preschool-admin/teacher/report',
    name: 'dashboard-preschool-teacher-report',
    component: () => import('@/modules/preschool/teacher/pages/Report.vue'),
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.STAFF],
    },
  }),
    defineAppRoute({
    path: '/module/preschool-admin/teacher/classroomresources',
    name: 'dashboard-preschool-teacher-classroomresources',
    component: () => import('@/modules/preschool/teacher/pages/Classroomresources.vue'),
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
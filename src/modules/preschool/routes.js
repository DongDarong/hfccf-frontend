import { ACCESS_SCOPES, DOMAINS } from '@/constants/access'
import { defineAppRoute } from '@/router/defineAppRoute'
import PreschoolAdminDashboard from '@/modules/preschool/admin/pages/PreschoolDashboard.vue'
import PreschoolAddTeacher from '@/modules/preschool/admin/pages/AddTeacher.vue'
import PreschoolAddClass from '@/modules/preschool/admin/pages/AddClass.vue'
import PreschoolPaymentManagement from '@/modules/preschool/admin/pages/PaymentManagement.vue'
import PreschoolClassesManagement from '@/modules/preschool/admin/pages/ClassesManagement.vue'
import PreschoolTeacherManagement from '@/modules/preschool/admin/pages/TeacherManagement.vue'
import PreschoolStudentInfo from '@/modules/preschool/admin/pages/StudentInfo.vue'
import PreschoolTeacherDashboard from '@/modules/preschool/teacher/pages/Dashboard.vue'
import PreschoolTeacherAttendance from '@/modules/preschool/teacher/pages/Attendance.vue'
import PreschoolTeacherMyStudents from '@/modules/preschool/teacher/pages/MyStudents.vue'

export const preschoolRoutes = [
  defineAppRoute({
    path: '/module/preschool-admin/dashboard',
    name: 'dashboard-preschool-admin',
    component: PreschoolAdminDashboard,
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/students',
    name: 'dashboard-preschool-admin-students',
    component: PreschoolStudentInfo,
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/users',
    name: 'dashboard-preschool-admin-users',
    component: PreschoolTeacherManagement,
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/users/add',
    name: 'dashboard-preschool-admin-users-add',
    component: PreschoolAddTeacher,
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/classes',
    name: 'dashboard-preschool-admin-classes',
    component: PreschoolClassesManagement,
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/classes/add',
    name: 'dashboard-preschool-admin-classes-add',
    component: PreschoolAddClass,
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/payment',
    name: 'dashboard-preschool-admin-payment',
    component: PreschoolPaymentManagement,
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/teacher',
    name: 'dashboard-preschool-teacher',
    component: PreschoolTeacherDashboard,
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.STAFF],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/teacher/students',
    name: 'dashboard-preschool-teacher-students',
    component: PreschoolTeacherMyStudents,
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.STAFF],
    },
  }),
  defineAppRoute({
    path: '/module/preschool-admin/teacher/attendance',
    name: 'dashboard-preschool-teacher-attendance',
    component: PreschoolTeacherAttendance,
    access: {
      domains: [DOMAINS.PRESCHOOL],
      scopes: [ACCESS_SCOPES.STAFF],
    },
  }),
]

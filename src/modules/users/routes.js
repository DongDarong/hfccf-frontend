import DashboardPage from '@/modules/users/pages/Dashboard.vue'
import SuperAdminDashboard from '@/modules/users/superadmins/pages/Dashboard.vue'
import AddAdminPage from '@/modules/users/superadmins/pages/AddAdmin.vue'
import ManageAdminsPage from '@/modules/users/superadmins/pages/ManageAdmins.vue'
import PreschoolAdminDashboard from '@/modules/users/admins/preschool-admin/pages/Dashboard.vue'
import PreschoolStudentManagement from '@/modules/users/admins/preschool-admin/pages/StudentManagement.vue'
import ScholarshipAdminDashboard from '@/modules/users/admins/scholarship-admin/pages/Dashboard.vue'
import ScholarshipApplicationsPage from '@/modules/users/admins/scholarship-admin/pages/ScholarshipApplications.vue'
import EnglishAdminDashboard from '@/modules/users/admins/english-admin/pages/Dashboard.vue'
import EnglishTeacherManagement from '@/modules/users/admins/english-admin/pages/TeacherManagement.vue'
import SportAdminDashboard from '@/modules/users/admins/sport-admin/pages/Dashboard.vue'
import SportCoachManagement from '@/modules/users/admins/sport-admin/pages/CoachManagement.vue'
import EnglishTeacherDashboard from '@/modules/users/teachers/english_teacher/pages/Dashboard.vue'
import CoachDashboard from '@/modules/users/coaches/pages/Dashboard.vue'

export const userRoutes = [
  {
    path: '/',
    redirect: '/module/dashboard',
  },
  {
    path: '/module/dashboard',
    name: 'dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/module/super-admin/dashboard',
    name: 'dashboard-super-admin',
    component: SuperAdminDashboard,
    meta: { requiresAuth: true, superAdminOnly: true },
  },
  {
    path: '/module/super-admin/users/manage',
    name: 'users',
    component: ManageAdminsPage,
    meta: { requiresAuth: true, superAdminOnly: true },
  },
  {
    path: '/module/super-admin/users/add',
    name: 'add-user',
    component: AddAdminPage,
    meta: { requiresAuth: true, superAdminOnly: true },
  },
  {
    path: '/module/preschool-admin/dashboard',
    name: 'dashboard-preschool-admin',
    component: PreschoolAdminDashboard,
    meta: { requiresAuth: true, allowedRoles: ['adminpreschool'] },
  },
  {
    path: '/module/preschool-admin/users',
    name: 'dashboard-preschool-admin-users',
    component: PreschoolStudentManagement,
    meta: { requiresAuth: true, allowedRoles: ['adminpreschool'] },
  },
  {
    path: '/module/scholarship-admin/dashboard',
    name: 'dashboard-scholarship-admin',
    component: ScholarshipAdminDashboard,
    meta: { requiresAuth: true, allowedRoles: ['adminscholaship'] },
  },
  {
    path: '/module/scholarship-admin/users',
    name: 'dashboard-scholarship-admin-users',
    component: ScholarshipApplicationsPage,
    meta: { requiresAuth: true, allowedRoles: ['adminscholaship'] },
  },
  {
    path: '/module/english-admin/dashboard',
    name: 'dashboard-english-admin',
    component: EnglishAdminDashboard,
    meta: { requiresAuth: true, allowedRoles: ['adminenglish'] },
  },
  {
    path: '/module/english-admin/users',
    name: 'dashboard-english-admin-users',
    component: EnglishTeacherManagement,
    meta: { requiresAuth: true, allowedRoles: ['adminenglish'] },
  },
  {
    path: '/module/sport-admin/dashboard',
    name: 'dashboard-sport-admin',
    component: SportAdminDashboard,
    meta: { requiresAuth: true, allowedRoles: ['adminsport'] },
  },
  {
    path: '/module/sport-admin/users',
    name: 'dashboard-sport-admin-users',
    component: SportCoachManagement,
    meta: { requiresAuth: true, allowedRoles: ['adminsport'] },
  },
  {
    path: '/module/english-admin/teacher',
    name: 'dashboard-english-teacher',
    component: EnglishTeacherDashboard,
    meta: { requiresAuth: true, allowedRoles: ['teacher'] },
  },
  {
    path: '/module/sport-admin/coach',
    name: 'dashboard-sport-coach',
    component: CoachDashboard,
    meta: { requiresAuth: true, allowedRoles: ['coach'] },
  },
]




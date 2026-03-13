// Routes for teachers and coaches who need workspace views.
import TeacherDashboard from '@/pages/module/teachers-coaches/teacher-english/TeacherDashboard.vue'
import CoachDashboard from '@/pages/module/teachers-coaches/coach/CoachDashboard.vue'

export const teacherRoutes = [
  {
    path: '/module/english-admin/teacher',
    name: 'dashboard-english-teacher',
    component: TeacherDashboard,
    meta: { requiresAuth: true, allowedRoles: ['teacher'] },
  },
  {
    path: '/module/sport-admin/coach',
    name: 'dashboard-sport-coach',
    component: CoachDashboard,
    meta: { requiresAuth: true, allowedRoles: ['coach'] },
  },
]


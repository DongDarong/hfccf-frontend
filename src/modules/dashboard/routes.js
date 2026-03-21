import DashboardPage from '@/modules/dashboard/pages/Dashboard.vue'

export const dashboardRoutes = [
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
]

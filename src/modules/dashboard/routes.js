import { defineAppRoute } from '@/router/defineAppRoute'
import DashboardPage from '@/modules/dashboard/pages/Dashboard.vue'

export const dashboardRoutes = [
  {
    path: '/',
    redirect: '/module/dashboard',
  },
  defineAppRoute({
    path: '/module/dashboard',
    name: 'dashboard',
    component: DashboardPage,
    access: {},
  }),
]

// Base routes that are shared across all visitors.
import DashboardView from '@/pages/module/MainDashboard.vue'
import LoginView from '@/pages/auth/Login.vue'

export const baseRoutes = [
  // Redirect the bare domain to the dashboard landing screen.
  {
    path: '/',
    redirect: '/module/dashboard',
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guestOnly: true },
  },
  {
    path: '/module/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    // Fallback that always brings the user back to the dashboard.
    path: '/:pathMatch(.*)*',
    redirect: '/module/dashboard',
  },
]


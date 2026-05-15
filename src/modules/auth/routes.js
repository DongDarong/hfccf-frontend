import LoginPage from '@/modules/auth/pages/Login.vue'
import ForgotPasswordPage from '@/modules/auth/pages/ForgotPassword.vue'

export const authRoutes = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { guestOnly: true },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordPage,
    meta: { guestOnly: true },
  },
]



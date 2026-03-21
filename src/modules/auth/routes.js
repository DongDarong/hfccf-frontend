import LoginPage from '@/modules/auth/pages/Login.vue'
import RegisterPage from '@/modules/auth/pages/Register.vue'
import ForgotPasswordPage from '@/modules/auth/pages/ForgotPassword.vue'

export const authRoutes = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: { guestOnly: true },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordPage,
    meta: { guestOnly: true },
  },
]




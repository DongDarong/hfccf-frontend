export const authRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/modules/auth/pages/Login.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/modules/auth/pages/ForgotPassword.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/change-password',
    name: 'force-password-change',
    component: () => import('@/modules/auth/pages/ForcePasswordChange.vue'),
    meta: {
      requiresAuth: true,
      access: {
        requiresAuth: true,
        allowSuperAdmin: true,
      },
    },
  },
]

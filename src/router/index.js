import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/pages/Dashboard.vue'
import LoginView from '@/pages/Login.vue'
import UsersView from '@/pages/Users.vue'
import AddUserView from '@/pages/AddUser.vue'
import { ensureSessionIsValid, touchActivity } from '@/services/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
      meta: { requiresAuth: true },
    },
    {
      path: '/users/add',
      name: 'add-user',
      component: AddUserView,
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard',
    },
  ],
})

router.beforeEach((to) => {
  const sessionValid = ensureSessionIsValid()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const guestOnly = to.matched.some((record) => record.meta.guestOnly)

  if (requiresAuth && !sessionValid) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  if (guestOnly && sessionValid) {
    return { name: 'dashboard' }
  }

  if (sessionValid) {
    touchActivity()
  }

  return true
})

export default router

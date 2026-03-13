// Super-admin user management routes with higher permissions.
import UsersView from '@/pages/module/super-admin/Users.vue'
import AddUserView from '@/pages/module/super-admin/AddUser.vue'

export const userRoutes = [
  {
    path: '/module/super-admin/users/manage',
    name: 'users',
    component: UsersView,
    meta: { requiresAuth: true, superAdminOnly: true },
  },
  {
    path: '/module/super-admin/users/add',
    name: 'add-user',
    component: AddUserView,
    meta: { requiresAuth: true, superAdminOnly: true },
  },
]


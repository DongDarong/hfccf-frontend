import { defineAppRoute } from '@/router/defineAppRoute'
import ProfileSettingsPage from '@/modules/settings/pages/ProfileSettings.vue'

export const settingsRoutes = [
  defineAppRoute({
    path: '/module/settings/profile',
    name: 'profile-settings',
    component: ProfileSettingsPage,
    access: {},
  }),
]

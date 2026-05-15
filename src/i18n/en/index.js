import localLanguage from '../local-language'
import common from './common'
import auth from './auth'
import dashboard from './dashboard'
import dashboardNav from './dashboard/nav'
import users from './users'
import notifications from './notifications'
import sport from './sport'
import preschool from './preschool'
import english from './english'

export default {
  ...localLanguage.en,
  common,
  nav: dashboardNav,
  auth,
  ...dashboard,
  dashboard: {
    nav: {
      logoutCaption: dashboardNav.logoutCaption,
    },
  },
  users,
  notifications,
  ...english,
  ...sport,
  ...preschool,
}

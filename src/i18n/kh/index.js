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
import reports from './reports'

export default {
  ...localLanguage.kh,
  ...dashboard,
  common,
  nav: dashboardNav,
  auth,
  dashboard: {
    nav: {
      logoutCaption: dashboardNav.logoutCaption,
    },
  },
  users,
  notifications,
  ...reports,
  ...english,
  ...sport,
  ...preschool,
}
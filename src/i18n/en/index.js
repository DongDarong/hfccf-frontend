import localLanguage from '../local-language'
import common from './common'
import auth from './auth'
import dashboard from './dashboard'
import dashboardNav from './dashboard/nav'
import users from './users'
import notifications from './notifications'
import sport from './sport'
import preschool from './preschool'
import guardianPortal from './guardian-portal'
import english from './english'
import reports from './reports/index.js'

export default {
  // Keep locale merges explicit so reports stays nested under `reports.*`
  // and Vue I18n resolves audit log keys without accidental flattening.
  ...localLanguage.en,
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
  reports,
  guardianPortal,
  ...english,
  ...sport,
  ...preschool,
}

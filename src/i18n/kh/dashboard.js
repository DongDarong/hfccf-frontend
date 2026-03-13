import common from './dashboard/common'
import app from './dashboard/app'
import nav from './dashboard/nav'
import pages from './dashboard/pages'
import users from './users'
import sportAdminDashboard from './sport/admin-dashboard'

export default {
  common,
  app,
  nav,
  pages,
  users,
  ...sportAdminDashboard,
}

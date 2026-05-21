import common from './common'
import login from './login'
import layout from './layout'
import dashboard from './dashboard'
import students from './students'
import student from './student'
import attendance from './attendance'
import schedule from './schedule'
import progress from './progress'
import reports from './reports'
import admin from './admin'
import activation from './activation'

export default {
  // Keep guardian portal keys nested under `guardianPortal.*` so EN/KH stay
  // aligned and the portal never falls back to raw translation keys.
  guardianPortal: {
    ...common,
    ...login,
    ...layout,
    ...dashboard,
    ...students,
    ...student,
    ...attendance,
    ...schedule,
    ...progress,
    ...reports,
    ...admin,
    ...activation,
  },
}

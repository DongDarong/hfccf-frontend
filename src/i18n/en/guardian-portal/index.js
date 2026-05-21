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
  // Keep guardian portal locale keys grouped under `guardianPortal.*` so
  // login, portal pages, and admin invite screens stay on the same contract.
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

import dashboard from './dashboard'
import classes from './classes'
import students from './students'
import attendance from './attendance'
import payments from './payments'
import adminDashboard from './admin-dashboard'

export default {
  ...dashboard,
  ...classes,
  ...students,
  ...attendance,
  ...payments,
  ...adminDashboard,
}

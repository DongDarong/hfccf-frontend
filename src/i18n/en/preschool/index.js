import dashboard from './dashboard'
import classes from './classes'
import students from './students'
import attendance from './attendance'
import payments from './payments'
import scaffold from './scaffold'
import adminDashboard from './admin-dashboard'

export default {
  // Keep Preschool copy split by concern so real pages can resolve stable keys
  // and scaffold-only routes can stay explicit without pretending they are built.
  ...dashboard,
  ...classes,
  ...students,
  ...attendance,
  ...payments,
  ...scaffold,
  ...adminDashboard,
}

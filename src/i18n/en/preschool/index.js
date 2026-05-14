import dashboard from './dashboard'
import classes from './classes'
import students from './students'
import attendance from './attendance'
import payments from './payments'

export default {
  ...dashboard,
  ...classes,
  ...students,
  ...attendance,
  ...payments,
}

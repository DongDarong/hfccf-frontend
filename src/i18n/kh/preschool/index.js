import dashboard from './dashboard'
import classes from './classes'
import students from './students'
import attendance from './attendance'
import payments from './payments'
import classesManagement from './classes-management'
import addClass from './add-class'

export default {
  ...dashboard,
  ...classes,
  ...students,
  ...attendance,
  ...payments,
  ...classesManagement,
  ...addClass,
}

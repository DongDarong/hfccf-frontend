import dashboard from './dashboard'
import teams from './teams'
import players from './players'
import matches from './matches'
import results from './results'
import coachManagement from './admin/sport-coach-management'
import addCoach from './admin/sport-add-coach'
import coachTrainingSchedule from './coach-training-schedule'

export default {
  ...dashboard,
  ...teams,
  ...players,
  ...matches,
  ...results,
  ...coachManagement,
  ...addCoach,
  ...coachTrainingSchedule,
}

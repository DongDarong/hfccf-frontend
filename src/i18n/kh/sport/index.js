import dashboard from './dashboard'
import teams from './teams'
import players from './players'
import matches from './matches'
import results from './results'
import tournament from './tournament'
import coachManagement from './admin/sport-coach-management'
import addCoach from './admin/sport-add-coach'
import coachTrainingSchedule from './coach-training-schedule'
import coachDashboard from './coach-dashboard'
import coachTeamManagement from './coach-team-management'

export default {
  ...dashboard,
  ...teams,
  ...players,
  ...matches,
  ...results,
  ...tournament,
  ...coachManagement,
  ...addCoach,
  ...coachTrainingSchedule,
  ...coachDashboard,
  ...coachTeamManagement,
}

import HomeIcon from '@/assets/icons/Home.vue'
import CalendarIcon from '@/assets/icons/Calendar.vue'
import AttendanceIcon from '@/assets/icons/Attendance.vue'
import ClassIcon from '@/assets/icons/Class.vue'
import EnrollmentsIcon from '@/assets/icons/Enrollments.vue'
import FormsIcon from '@/assets/icons/Forms.vue'
import GovernanceIcon from '@/assets/icons/Governance.vue'
import HealthIcon from '@/assets/icons/Health.vue'
import InventoryIcon from '@/assets/icons/Inventory.vue'
import PaymentsIcon from '@/assets/icons/Payments.vue'
import PerformanceIcon from '@/assets/icons/Performance.vue'
import NotificationIcon from '@/assets/icons/Notification.vue'
import UsersIcon from '@/assets/icons/Users.vue'
import ReportsIcon from '@/assets/icons/Reports.vue'
import SettingsIcon from '@/assets/icons/Settings.vue'
import TournamentsIcon from '@/assets/icons/Tournaments.vue'
import BallIcon from '@/assets/icons/Ball.vue'
import TeamIcon from '@/assets/icons/Team.vue'
import PlayersIcon from '@/assets/icons/Players.vue'
import {
  IconCalendarTime,
  IconCalendarCheck,
  IconClipboardCheck,
  IconClipboardList,
  IconFileDescription,
  IconHomeBolt,
  IconLayoutDashboard,
  IconScoreboard,
  IconShirtSport,
  IconTimelineEvent,
  IconTrophy,
  IconUserCheck,
  IconUserCog,
  IconUserShare,
  IconUsersGroup,
} from '@tabler/icons-vue'

export const sidebarIconByName = {
  home: HomeIcon,
  calendar: CalendarIcon,
  attendance: AttendanceIcon,
  ball: BallIcon,
  class: ClassIcon,
  enrollments: EnrollmentsIcon,
  forms: FormsIcon,
  governance: GovernanceIcon,
  health: HealthIcon,
  inventory: InventoryIcon,
  payments: PaymentsIcon,
  performance: PerformanceIcon,
  notification: NotificationIcon,
  info: UsersIcon,
  users: UsersIcon,
  reports: ReportsIcon,
  settings: SettingsIcon,
  tournaments: TournamentsIcon,
  team: TeamIcon,
  players: PlayersIcon,
  'sport-dashboard': IconLayoutDashboard,
  'sport-attendance': IconClipboardCheck,
  'sport-coach': IconUserCog,
  'sport-team': IconUsersGroup,
  'sport-player': IconShirtSport,
  'sport-assignment': IconUserShare,
  'sport-match': IconScoreboard,
  'sport-tournament': IconTrophy,
  'sport-player-approval': IconUserCheck,
  'sport-match-approval': IconCalendarCheck,
  'sport-lifecycle': IconTimelineEvent,
  'sport-coach-dashboard': IconHomeBolt,
  'sport-coach-training': IconCalendarTime,
  'sport-coach-teams': IconUsersGroup,
  'sport-coach-roster': IconClipboardList,
  'sport-coach-requests': IconFileDescription,
}

export function resolveSidebarIconComponent(iconKey) {
  return sidebarIconByName[iconKey] || null
}

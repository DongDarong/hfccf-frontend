import { ACCESS_SCOPES, DOMAINS } from '@/constants/access'
import { defineAppRoute } from '@/router/defineAppRoute'
import { tournamentRoutes } from '@/modules/sport/tournament/routes'

export const sportRoutes = [
  ...tournamentRoutes,
  defineAppRoute({
    path: '/module/sport-admin/dashboard',
    name: 'dashboard-sport-admin',
    component: () => import('@/modules/sport/admin/pages/Dashboard.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/sport-admin/users',
    name: 'dashboard-sport-admin-users',
    component: () => import('@/modules/sport/admin/pages/CoachManagement.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/sport-admin/users/add',
    name: 'dashboard-sport-admin-users-add',
    component: () => import('@/modules/sport/admin/pages/AddCoach.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/sport-admin/teams',
    name: 'dashboard-sport-admin-teams',
    component: () => import('@/modules/sport/admin/pages/TeamsManagement.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/sport-admin/teams/add',
    name: 'dashboard-sport-admin-teams-add',
    component: () => import('@/modules/sport/admin/pages/AddTeam.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/sport-admin/players',
    name: 'dashboard-sport-admin-players',
    component: () => import('@/modules/sport/admin/pages/ManagesPlayerInfor.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/sport-admin/players/add',
    name: 'dashboard-sport-admin-players-add',
    component: () => import('@/modules/sport/admin/pages/AddPlayer.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/sport-admin/matches',
    name: 'dashboard-sport-admin-matches',
    component: () => import('@/modules/sport/admin/pages/ManageMatches.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/sport-admin/matches/add',
    name: 'dashboard-sport-admin-matches-add',
    component: () => import('@/modules/sport/admin/pages/AddMatch.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/sport-admin/matches/:id/edit',
    name: 'dashboard-sport-admin-matches-edit',
    component: () => import('@/modules/sport/admin/pages/AddMatch.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/sport-admin/matches/:id/results',
    name: 'dashboard-sport-admin-matches-results',
    component: () => import('@/modules/sport/admin/pages/MatchesResultEntry.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/sport-admin/training-schedule',
    name: 'dashboard-sport-admin-training',
    component: () => import('@/modules/sport/admin/pages/TrainingSchedule.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/sport-admin/coach',
    name: 'dashboard-sport-coach',
    component: () => import('@/modules/sport/coach/pages/Dashboard.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.STAFF],
    },
  }),
  defineAppRoute({
    path: '/module/sport-coach/teams',
    name: 'dashboard-sport-coach-teams',
    component: () => import('@/modules/sport/coach/pages/MyTeams.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.STAFF],
    },
  }),
  defineAppRoute({
    path: '/module/sport-coach/roster',
    name: 'dashboard-sport-coach-roster',
    component: () => import('@/modules/sport/coach/pages/TeamRoster.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.STAFF],
    },
  }),
  defineAppRoute({
    path: '/module/sport-coach/teams/:teamId',
    name: 'dashboard-sport-coach-team-players',
    component: () => import('@/modules/sport/coach/pages/TeamPlayers.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.STAFF],
    },
  }),
  defineAppRoute({
    path: '/module/sport-coach/matches/:matchId/squad',
    name: 'dashboard-sport-coach-match-squad-selection',
    component: () => import('@/modules/sport/coach/pages/MatchSquadSelection.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.STAFF],
    },
  }),
  defineAppRoute({
    path: '/module/sport-coach/players/request',
    name: 'dashboard-sport-coach-player-request',
    component: () => import('@/modules/sport/coach/pages/AddPlayerRequest.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.STAFF],
    },
  }),
  defineAppRoute({
    path: '/module/sport-coach/matches/request',
    name: 'dashboard-sport-coach-match-request',
    component: () => import('@/modules/sport/coach/pages/MatchRequest.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.STAFF],
    },
  }),
  defineAppRoute({
    path: '/module/sport-coach/requests',
    name: 'dashboard-sport-coach-requests',
    component: () => import('@/modules/sport/coach/pages/MyRequests.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.STAFF],
    },
  }),
  defineAppRoute({
    path: '/module/sport-coach/training-schedule',
    name: 'dashboard-sport-coach-training',
    component: () => import('@/modules/sport/coach/pages/TrainingScheduleCoach.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.STAFF],
    },
  }),
  defineAppRoute({
    path: '/module/sport-admin/coach-team-assignments',
    name: 'dashboard-sport-admin-coach-team-assignments',
    component: () => import('@/modules/sport/admin/pages/CoachTeamAssignments.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/sport-admin/pending-player-approvals',
    name: 'dashboard-sport-admin-pending-player-approvals',
    component: () => import('@/modules/sport/admin/pages/PendingPlayerApprovals.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/sport-admin/pending-match-approvals',
    name: 'dashboard-sport-admin-pending-match-approvals',
    component: () => import('@/modules/sport/admin/pages/PendingMatchApprovals.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/sport-admin/player-lifecycle',
    name: 'dashboard-sport-admin-player-lifecycle',
    component: () => import('@/modules/sport/admin/pages/PlayerLifecycleManagement.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
  defineAppRoute({
    path: '/module/sport-admin/matches/:matchId/squad',
    name: 'dashboard-sport-admin-match-squad-review',
    component: () => import('@/modules/sport/admin/pages/MatchSquadReview.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.ADMIN],
    },
  }),
]

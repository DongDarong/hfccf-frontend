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
    path: '/module/sport-coach/training-schedule',
    name: 'dashboard-sport-coach-training',
    component: () => import('@/modules/sport/coach/pages/TrainingScheduleCoach.vue'),
    access: {
      domains: [DOMAINS.SPORT],
      scopes: [ACCESS_SCOPES.STAFF],
    },
  }),
]

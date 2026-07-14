import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import { mountWithPlugins } from '@/tests/helpers/mount'
import MyTeams from '@/modules/sport/coach/pages/MyTeams.vue'
import MyRequests from '@/modules/sport/coach/pages/MyRequests.vue'
import MatchRequest from '@/modules/sport/coach/pages/MatchRequest.vue'
import CoachTeamAssignments from '@/modules/sport/admin/pages/approval/CoachTeamAssignments.vue'

const {
  loadTeams,
  loadRequests,
  fetchSportCoaches,
  fetchSportTeams,
  fetchCoachOpponentTeams,
  listCoachTeamAssignments,
  saveCoachTeamAssignment,
  deactivateCoachTeamAssignment,
} = vi.hoisted(() => ({
  loadTeams: vi.fn(),
  loadRequests: vi.fn(),
  fetchSportCoaches: vi.fn(),
  fetchSportTeams: vi.fn(),
  fetchCoachOpponentTeams: vi.fn(),
  listCoachTeamAssignments: vi.fn(),
  saveCoachTeamAssignment: vi.fn(),
  deactivateCoachTeamAssignment: vi.fn(),
}))

vi.mock('@/modules/sport/coach/composables/useCoachTeams', () => ({
  useCoachTeams: () => ({
    items: ref([{ id: 'team-1', name: 'Assigned FC', division: 'A', playersCount: 12, status: 'active' }]),
    loading: ref(false),
    error: ref(''),
    hasTeams: ref(true),
    selectedTeam: ref(null),
    loadTeams,
    loadTeam: vi.fn(),
  }),
}))

vi.mock('@/modules/sport/coach/composables/useCoachRequests', () => ({
  useCoachRequests: () => ({
    playerRequests: ref([{ id: 'request-1', name: 'Player Request', team: { name: 'Assigned FC' }, approvalStatus: 'pending' }]),
    matchRequests: ref([{ id: 'request-2', homeTeam: 'Assigned FC', awayTeam: 'Opponent FC', approvalStatus: 'pending' }]),
    summary: ref({ playerRequests: 1, matchRequests: 1, total: 2 }),
    loading: ref(false),
    error: ref(''),
    loadRequests,
  }),
}))

vi.mock('@/modules/sport/services/sportApi', () => ({
  fetchSportCoaches,
  fetchSportTeams,
}))

vi.mock('@/modules/sport/services/api/sportCoachTeamsApi', () => ({
  fetchCoachOpponentTeams,
}))

vi.mock('@/modules/sport/admin/composables/useSportApprovals', () => ({
  useSportApprovals: () => ({
    loading: ref(false),
    error: ref(''),
    loadPendingPlayers: vi.fn(),
    loadPendingMatches: vi.fn(),
    listCoachTeamAssignments,
    saveCoachTeamAssignment,
    deactivateCoachTeamAssignment,
    approvePendingPlayer: vi.fn(),
    rejectPendingPlayer: vi.fn(),
    approvePendingMatch: vi.fn(),
    rejectPendingMatch: vi.fn(),
  }),
}))

beforeEach(() => {
  vi.clearAllMocks()
  fetchSportCoaches.mockResolvedValue({
    items: [{ id: 'coach-1', fullName: 'Alex Coach' }],
    pagination: { page: 1, perPage: 100, total: 1, totalPages: 1 },
  })
  fetchSportTeams.mockResolvedValue({
    items: [{ id: 'team-1', name: 'Lions FC' }],
    pagination: { page: 1, perPage: 100, total: 1, totalPages: 1 },
  })
  if (typeof window !== 'undefined' && !window.matchMedia) {
    window.matchMedia = () => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })
  }
})

describe('sport coach pages', () => {
  it('renders the my teams page with assigned teams actions', async () => {
    const wrapper = mountWithPlugins(MyTeams, {
      messages: {
        en: {
          sportCoachTeamManagement: {
            myTeams: { title: 'My Teams', subtitle: 'Assigned teams', panelTitle: 'Assigned teams', panelText: 'Only active assignments are shown here.' },
          },
        },
      },
      routes: [
        { path: '/dashboard', name: 'dashboard', component: { template: '<div />' } },
        { path: '/profile-settings', name: 'profile-settings', component: { template: '<div />' } },
      ],
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
          MainLayout: { template: '<div><slot /></div>' },
          HeaderSection: { props: ['title', 'subtitle'], template: '<div><h1>{{ title }}</h1><p>{{ subtitle }}</p></div>' },
          Card: { template: '<div><slot name="title" /><slot name="content" /><slot /></div>' },
          DataTable: { template: '<div><slot /></div>' },
          Column: { template: '<div><slot /></div>' },
          Button: { template: '<button><slot /></button>' },
          StatusBadge: { template: '<span><slot /></span>' },
        },
        mocks: {
          $primevue: { config: {} },
        },
      },
    })
    expect(wrapper.text()).toContain('Assigned teams')
    expect(loadTeams).toHaveBeenCalled()
  })

  it('renders the my requests page with coach-safe data', async () => {
    const wrapper = mountWithPlugins(MyRequests, {
      messages: {
        en: {
          sportCoachTeamManagement: {
            common: {
              player: 'Player',
              team: 'Team',
              homeTeam: 'Home team',
              awayTeam: 'Away team',
              status: 'Status',
            },
            requests: {
              title: 'My Requests',
              subtitle: 'Track pending player and match requests you created.',
              playersTitle: 'Player requests',
              matchesTitle: 'Match requests',
              emptyPlayers: 'No player requests have been submitted yet.',
              emptyMatches: 'No match requests have been submitted yet.',
            },
          },
        },
      },
      routes: [
        { path: '/dashboard', name: 'dashboard', component: { template: '<div />' } },
        { path: '/profile-settings', name: 'profile-settings', component: { template: '<div />' } },
      ],
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
          MainLayout: { template: '<div><slot /></div>' },
          HeaderSection: { props: ['title', 'subtitle'], template: '<div><h1>{{ title }}</h1><p>{{ subtitle }}</p></div>' },
          Card: { template: '<div><slot name="title" /><slot name="content" /><slot /></div>' },
          DataTable: { props: ['value'], template: '<div><slot />{{ value?.[0]?.name || "" }}</div>' },
          Column: { template: '<div><slot /></div>' },
          Button: { template: '<button><slot /></button>' },
          StatusBadge: { template: '<span><slot /></span>' },
        },
        mocks: {
          $primevue: { config: {} },
        },
      },
    })

    await flushPromises()
    expect(wrapper.text()).toContain('Player requests')
    expect(loadRequests).toHaveBeenCalled()
  })

  it('renders the match request page using coach opponent lookups', async () => {
    fetchCoachOpponentTeams.mockResolvedValueOnce({
      items: [{ id: 'team-2', name: 'Opponent FC' }],
      pagination: { page: 1, perPage: 10, total: 1, totalPages: 1 },
    })

    mountWithPlugins(MatchRequest, {
      messages: {
        en: {
          sportCoachTeamManagement: {
            common: {
              selectTeam: 'Select a team',
              selectOpponent: 'Select an opponent',
              matchType: 'Match type',
              trainingMatch: 'Training match',
              friendlyMatch: 'Friendly match',
              scheduledAt: 'Scheduled time',
              notes: 'Notes',
              venue: 'Venue',
              loadError: 'Unable to load data right now.',
            },
            matchRequest: {
              title: 'Training / Friendly Match Request',
              subtitle: 'Request a training or friendly match for one of your assigned teams.',
              panelTitle: 'New match request',
            },
          },
        },
      },
      routes: [
        { path: '/dashboard', name: 'dashboard', component: { template: '<div />' } },
        { path: '/profile-settings', name: 'profile-settings', component: { template: '<div />' } },
      ],
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
          MainLayout: { template: '<div><slot /></div>' },
          HeaderSection: { props: ['title', 'subtitle'], template: '<div><h1>{{ title }}</h1><p>{{ subtitle }}</p></div>' },
          Card: { template: '<div><slot name="title" /><slot name="content" /><slot /></div>' },
          Button: { template: '<button><slot /></button>' },
          Select: { template: '<div />' },
          InputText: { template: '<div />' },
          Textarea: { template: '<div />' },
        },
        mocks: {
          $primevue: { config: {} },
        },
      },
    })

    await flushPromises()
    expect(fetchCoachOpponentTeams).toHaveBeenCalled()
  })

  it('renders the coach assignments page shell', async () => {
    listCoachTeamAssignments.mockResolvedValueOnce({
      items: [
        {
          id: 'assignment-1',
          status: 'active',
          coach: {
            firstName: 'Alex',
            lastName: 'Coach',
            username: 'Alex Coach',
            email: 'alex.coach@hfccf.org',
          },
          team: {
            name: 'Lions FC',
          },
        },
      ],
      pagination: { page: 1, perPage: 100, total: 1, totalPages: 1 },
    })
    const wrapper = mountWithPlugins(CoachTeamAssignments, {
      messages: {
        en: {
          sportCoachTeamManagement: {
            assignments: {
              title: 'Coach Team Assignments',
              subtitle: 'Assign teams to coaches.',
              formTitle: 'New assignment',
              listTitle: 'Current assignments',
            },
          },
        },
      },
      routes: [
        { path: '/dashboard', name: 'dashboard', component: { template: '<div />' } },
        { path: '/profile-settings', name: 'profile-settings', component: { template: '<div />' } },
      ],
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
          MainLayout: { template: '<div><slot /></div>' },
          HeaderSection: { props: ['title', 'subtitle'], template: '<div><h1>{{ title }}</h1><p>{{ subtitle }}</p></div>' },
          Card: { template: '<div><slot name="title" /><slot name="content" /><slot /></div>' },
          Button: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
          Select: { template: '<div />' },
          StatusBadge: { template: '<span><slot /></span>' },
        },
        mocks: {
          $primevue: { config: {} },
        },
      },
    })
    await flushPromises()
    expect(wrapper.text()).toContain('Current assignments')
    expect(saveCoachTeamAssignment).toBeDefined()
    expect(deactivateCoachTeamAssignment).toBeDefined()
  })

  it('patches an existing assignment when editing and can reactivate it', async () => {
    listCoachTeamAssignments.mockResolvedValueOnce({
      items: [
        {
          id: 'assignment-1',
          status: 'inactive',
          coachUserId: 'coach-1',
          teamId: 'team-1',
          coach: {
            id: 'coach-1',
            firstName: 'Alex',
            lastName: 'Coach',
          },
          team: {
            id: 'team-1',
            name: 'Lions FC',
          },
        },
      ],
      pagination: { page: 1, perPage: 100, total: 1, totalPages: 1 },
    })

    const wrapper = mountWithPlugins(CoachTeamAssignments, {
      messages: {
        en: {
          common: { edit: 'Edit' },
          sportCoachTeamManagement: {
            assignments: {
              title: 'Coach Team Assignments',
              subtitle: 'Assign teams to coaches.',
              formTitle: 'New assignment',
              listTitle: 'Current assignments',
            },
            common: {
              active: 'Active',
              inactive: 'Inactive',
              coach: 'Coach',
              team: 'Team',
            },
          },
        },
      },
      routes: [
        { path: '/dashboard', name: 'dashboard', component: { template: '<div />' } },
        { path: '/profile-settings', name: 'profile-settings', component: { template: '<div />' } },
      ],
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
          MainLayout: { template: '<div><slot /></div>' },
          HeaderSection: { props: ['title', 'subtitle'], template: '<div><h1>{{ title }}</h1><p>{{ subtitle }}</p></div>' },
          Card: { template: '<div><slot name="title" /><slot name="content" /><slot /></div>' },
          Button: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
          Select: { template: '<div />' },
          StatusBadge: { template: '<span><slot /></span>' },
        },
        mocks: {
          $primevue: { config: {} },
        },
      },
    })

    await flushPromises()
    wrapper.vm.startEdit({
      id: 'assignment-1',
      status: 'inactive',
      coach: { id: 'coach-1', firstName: 'Alex', lastName: 'Coach' },
      team: { id: 'team-1', name: 'Lions FC' },
    })
    wrapper.vm.form.status = 'active'

    saveCoachTeamAssignment.mockResolvedValueOnce({ assignment: { id: 'assignment-1' } })

    await wrapper.vm.submit()
    await flushPromises()

    expect(saveCoachTeamAssignment).toHaveBeenCalledWith({
      id: 'assignment-1',
      coach_user_id: 'coach-1',
      team_id: 'team-1',
      status: 'active',
    })
  })

  it('blocks creating a duplicate active assignment', async () => {
    listCoachTeamAssignments.mockResolvedValueOnce({
      items: [
        {
          id: 'assignment-1',
          status: 'active',
          coachUserId: 'coach-1',
          teamId: 'team-1',
          coach: { id: 'coach-1', firstName: 'Alex', lastName: 'Coach' },
          team: { id: 'team-1', name: 'Lions FC' },
        },
      ],
      pagination: { page: 1, perPage: 100, total: 1, totalPages: 1 },
    })

    const wrapper = mountWithPlugins(CoachTeamAssignments, {
      messages: {
        en: {
          common: { edit: 'Edit' },
          sportCoachTeamManagement: {
            assignments: {
              title: 'Coach Team Assignments',
              subtitle: 'Assign teams to coaches.',
              formTitle: 'New assignment',
              listTitle: 'Current assignments',
            },
          },
        },
      },
      routes: [
        { path: '/dashboard', name: 'dashboard', component: { template: '<div />' } },
        { path: '/profile-settings', name: 'profile-settings', component: { template: '<div />' } },
      ],
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
          MainLayout: { template: '<div><slot /></div>' },
          HeaderSection: { props: ['title', 'subtitle'], template: '<div><h1>{{ title }}</h1><p>{{ subtitle }}</p></div>' },
          Card: { template: '<div><slot name="title" /><slot name="content" /><slot /></div>' },
          Button: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
          Select: { template: '<div />' },
          StatusBadge: { template: '<span><slot /></span>' },
        },
        mocks: {
          $primevue: { config: {} },
        },
      },
    })

    await flushPromises()
    wrapper.vm.form.coachUserId = 'coach-1'
    wrapper.vm.form.teamId = 'team-1'
    wrapper.vm.form.status = 'active'

    await wrapper.vm.submit()
    await flushPromises()

    expect(saveCoachTeamAssignment).not.toHaveBeenCalled()
    expect(wrapper.vm.error).toBe('An active assignment already exists for this coach and team.')
  })
})

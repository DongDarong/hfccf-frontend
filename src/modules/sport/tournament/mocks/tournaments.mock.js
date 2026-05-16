import {
  TOURNAMENT_REGISTRATION_STATUSES,
  TOURNAMENT_RULE_DEFAULTS,
  TOURNAMENT_SPORT_TYPES,
  TOURNAMENT_STATES,
  TOURNAMENT_VISIBILITY_OPTIONS,
} from '../constants/tournamentStates'

function deepClone(value) {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value)
    } catch {
      return JSON.parse(JSON.stringify(value))
    }
  }

  return JSON.parse(JSON.stringify(value))
}

function currentSeasonLabel() {
  return '2025 / 2026'
}

function createTeam(id, name, status = 'active') {
  return {
    id,
    name,
    status,
  }
}

export function createTournamentDraft() {
  const nowYear = new Date().getFullYear()

  return {
    id: '',
    name: '',
    season: String(nowYear),
    sportType: TOURNAMENT_SPORT_TYPES[0],
    description: '',
    logo: '',
    banner: '',
    location: '',
    organizer: '',
    registrationOpenAt: '',
    registrationCloseAt: '',
    startAt: '',
    endAt: '',
    state: 'draft',
    registrationStatus: 'closed',
    visibility: 'private',
    rules: deepClone(TOURNAMENT_RULE_DEFAULTS),
    statistics: {
      registeredTeams: 0,
      totalTeams: 0,
      groupsCompleted: 0,
      fixturesGenerated: 0,
      matches: 0,
      completedMatches: 0,
    },
    teams: [],
  }
}

export const mockTournaments = [
  {
    id: 'tournament-001',
    name: 'HFCCF National Youth League',
    season: currentSeasonLabel(),
    sportType: 'football',
    description: 'A flagship youth competition with group stages, knockout rounds, and official match tracking.',
    logo: '',
    banner: '',
    location: 'Olympic Stadium, Phnom Penh',
    organizer: 'HFCCF Sports Office',
    registrationOpenAt: '2026-03-20',
    registrationCloseAt: '2026-04-10',
    startAt: '2026-04-18',
    endAt: '2026-06-30',
    state: 'active',
    registrationStatus: 'closed',
    visibility: 'public',
    rules: {
      ...TOURNAMENT_RULE_DEFAULTS,
      groupCount: 4,
      teamsPerGroup: 4,
      knockoutEnabled: true,
      homeAwayEnabled: true,
      extraTimeEnabled: true,
      penaltyEnabled: true,
    },
    statistics: {
      registeredTeams: 16,
      totalTeams: 16,
      groupsCompleted: 4,
      fixturesGenerated: 32,
      matches: 48,
      completedMatches: 31,
    },
    teams: [
      createTeam('team-001', 'Blue Phoenix'),
      createTeam('team-002', 'River Hawks'),
      createTeam('team-003', 'Mekong Stars'),
      createTeam('team-004', 'Royal Tigers'),
    ],
  },
  {
    id: 'tournament-002',
    name: 'HFCCF Inter-College Cup',
    season: '2025',
    sportType: 'basketball',
    description: 'Registration is open for college teams preparing for the draw phase.',
    logo: '',
    banner: '',
    location: 'National Sports Complex',
    organizer: 'HFCCF Collegiate League',
    registrationOpenAt: '2026-02-10',
    registrationCloseAt: '2026-03-05',
    startAt: '2026-03-18',
    endAt: '2026-05-22',
    state: 'registration_open',
    registrationStatus: 'open',
    visibility: 'public',
    rules: {
      ...TOURNAMENT_RULE_DEFAULTS,
      groupCount: 2,
      teamsPerGroup: 6,
      knockoutEnabled: true,
      homeAwayEnabled: false,
      extraTimeEnabled: false,
      penaltyEnabled: false,
    },
    statistics: {
      registeredTeams: 8,
      totalTeams: 12,
      groupsCompleted: 0,
      fixturesGenerated: 0,
      matches: 0,
      completedMatches: 0,
    },
    teams: [
      createTeam('team-005', 'City College Eagles'),
      createTeam('team-006', 'Sunrise Falcons'),
      createTeam('team-007', 'Urban Kings'),
      createTeam('team-008', 'Maverick Lions'),
    ],
  },
  {
    id: 'tournament-003',
    name: 'HFCCF School Games',
    season: '2024 / 2025',
    sportType: 'volleyball',
    description: 'Group draws are complete and fixture generation is ready.',
    logo: '',
    banner: '',
    location: 'Regional Education Arena',
    organizer: 'School Sports Department',
    registrationOpenAt: '2025-09-01',
    registrationCloseAt: '2025-10-01',
    startAt: '2025-10-10',
    endAt: '2025-12-12',
    state: 'group_draw_completed',
    registrationStatus: 'closed',
    visibility: 'public',
    rules: {
      ...TOURNAMENT_RULE_DEFAULTS,
      groupCount: 3,
      teamsPerGroup: 4,
      knockoutEnabled: true,
      homeAwayEnabled: false,
      extraTimeEnabled: false,
      penaltyEnabled: true,
    },
    statistics: {
      registeredTeams: 12,
      totalTeams: 12,
      groupsCompleted: 3,
      fixturesGenerated: 0,
      matches: 0,
      completedMatches: 0,
    },
    teams: [
      createTeam('team-009', 'North Ridge'),
      createTeam('team-010', 'Westview'),
      createTeam('team-011', 'Central Academy'),
      createTeam('team-012', 'Riverdale'),
    ],
  },
  {
    id: 'tournament-004',
    name: 'HFCCF Legacy Championship',
    season: '2024',
    sportType: 'badminton',
    description: 'A completed championship with archived records and final results.',
    logo: '',
    banner: '',
    location: 'Indoor Sports Hall',
    organizer: 'HFCCF Legacy Board',
    registrationOpenAt: '2025-01-05',
    registrationCloseAt: '2025-01-20',
    startAt: '2025-02-01',
    endAt: '2025-03-15',
    state: 'completed',
    registrationStatus: 'closed',
    visibility: 'private',
    rules: {
      ...TOURNAMENT_RULE_DEFAULTS,
      groupCount: 2,
      teamsPerGroup: 8,
      knockoutEnabled: true,
      homeAwayEnabled: false,
      extraTimeEnabled: true,
      penaltyEnabled: true,
    },
    statistics: {
      registeredTeams: 14,
      totalTeams: 16,
      groupsCompleted: 2,
      fixturesGenerated: 24,
      matches: 36,
      completedMatches: 36,
    },
    teams: [
      createTeam('team-013', 'Eastern Dragons'),
      createTeam('team-014', 'Silver Arrows'),
      createTeam('team-015', 'Golden Kites'),
      createTeam('team-016', 'Harmony Club'),
    ],
  },
]

export function cloneTournamentRecord(tournament) {
  return deepClone(tournament)
}

export function createMockTournaments() {
  return mockTournaments.map((tournament) => cloneTournamentRecord(tournament))
}

export function createMockTournamentStats(tournaments = mockTournaments) {
  const items = Array.isArray(tournaments) ? tournaments : []

  return {
    total: items.length,
    active: items.filter((item) => item.state === 'active').length,
    registrationOpen: items.filter((item) => item.state === 'registration_open').length,
    completed: items.filter((item) => item.state === 'completed').length,
    totalRegisteredTeams: items.reduce((sum, item) => sum + Number(item.statistics?.registeredTeams || 0), 0),
    totalMatches: items.reduce((sum, item) => sum + Number(item.statistics?.matches || 0), 0),
  }
}

export function createMockTournamentRules() {
  return {
    ...TOURNAMENT_RULE_DEFAULTS,
  }
}

export function createMockTournamentSelectors() {
  return {
    sportTypes: [...TOURNAMENT_SPORT_TYPES],
    registrationStatuses: [...TOURNAMENT_REGISTRATION_STATUSES],
    visibilityOptions: [...TOURNAMENT_VISIBILITY_OPTIONS],
    states: [...TOURNAMENT_STATES],
  }
}

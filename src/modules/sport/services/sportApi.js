import http from '@/services/http'
import {
  buildQueryParams,
  getApiErrorMessage,
  unwrapApiData,
  unwrapApiItems,
  unwrapApiPagination,
} from '@/services/api'
import { mapUser, mapUsers } from '@/services/mappers/userMapper'

function normalizeText(value) {
  return String(value ?? '').trim()
}

function normalizeBooleanLike(value) {
  return Boolean(value)
}

function splitName(fullName) {
  const tokens = normalizeText(fullName).split(/\s+/).filter(Boolean)
  const [firstName = '', ...rest] = tokens
  return {
    firstName,
    lastName: rest.join(' '),
  }
}

function resolveId(payloadOrId) {
  if (typeof payloadOrId === 'string' || typeof payloadOrId === 'number') {
    return normalizeText(payloadOrId)
  }

  return normalizeText(payloadOrId?.id || payloadOrId?._id)
}

function parseMatchEventTiming(event = {}) {
  const minuteInput = event.minute ?? event.minuteValue ?? 0
  const extraTimeInput = event.extraTimeMinute ?? event.extra_time_minute ?? null

  if (typeof minuteInput === 'string' && /\d+\+\d+/.test(minuteInput)) {
    const [minutePart, extraPart] = minuteInput.split('+', 2)
    return {
      minute: Number.parseInt(minutePart, 10) || 0,
      extraTimeMinute: Number.parseInt(extraPart, 10) || 0,
    }
  }

  return {
    minute: Number.parseInt(minuteInput, 10) || 0,
    extraTimeMinute: extraTimeInput === null || extraTimeInput === undefined || extraTimeInput === ''
      ? null
      : Number.parseInt(extraTimeInput, 10) || 0,
  }
}

function compareMatchEvents(left = {}, right = {}) {
  const leftTiming = parseMatchEventTiming(left)
  const rightTiming = parseMatchEventTiming(right)

  if (leftTiming.minute !== rightTiming.minute) {
    return leftTiming.minute - rightTiming.minute
  }

  const leftExtra = leftTiming.extraTimeMinute === null ? -1 : leftTiming.extraTimeMinute
  const rightExtra = rightTiming.extraTimeMinute === null ? -1 : rightTiming.extraTimeMinute

  if (leftExtra !== rightExtra) {
    return leftExtra - rightExtra
  }

  const leftId = String(left.id ?? '')
  const rightId = String(right.id ?? '')
  return leftId.localeCompare(rightId)
}

function buildFormData(payload = {}, options = {}) {
  const formData = new FormData()
  const method = String(options.method || 'POST').toUpperCase()

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    if (value instanceof File) {
      formData.append(key, value)
      return
    }
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(`${key}[]`, item))
      return
    }
    if (typeof value === 'boolean') {
      formData.append(key, value ? '1' : '0')
      return
    }
    formData.append(key, value)
  })

  if (method === 'PUT') {
    formData.append('_method', 'PUT')
  }

  return formData
}

function normalizeCoachRow(row = {}) {
  const user = mapUser(row?.coach || row)
  const name = normalizeText(row.name || row.fullName || user.fullName || `${user.firstName} ${user.lastName}`)

  return {
    ...user,
    id: row.id ?? user.id,
    name,
    fullName: name,
    role: 'coach',
    status: normalizeText(row.status || user.status || 'active'),
    raw: row,
  }
}

function normalizeTeamRow(row = {}) {
  const coach = row.coach || {}
  const coachName = normalizeText(
    row.coachDisplayName || row.coach_display_name || coach.fullName || coach.name || coach.username,
  )
  const name = normalizeText(row.name || '')

  return {
    id: row.id ?? '',
    teamCode: normalizeText(row.teamCode || row.team_code),
    name,
    shortName: normalizeText(row.shortName || row.short_name),
    coachUserId: row.coachUserId ?? row.coach_user_id ?? '',
    coachDisplayName: coachName,
    coach: coachName,
    division: normalizeText(row.division),
    captainName: normalizeText(row.captainName || row.captain_name),
    playersCount: Number(row.playersCount ?? row.players_count ?? row.players ?? 0),
    players: Number(row.playersCount ?? row.players_count ?? row.players ?? 0),
    matchesCount: Number(row.matchesCount ?? row.matches_count ?? row.matches ?? 0),
    matches: Number(row.matchesCount ?? row.matches_count ?? row.matches ?? 0),
    wins: Number(row.wins ?? 0),
    draws: Number(row.draws ?? 0),
    losses: Number(row.losses ?? 0),
    points: Number(row.points ?? 0),
    venue: normalizeText(row.venue),
    logo: normalizeText(row.logo),
    status: normalizeText(row.status || 'active'),
    description: normalizeText(row.description),
    createdAt: row.createdAt || row.created_at || '',
    updatedAt: row.updatedAt || row.updated_at || '',
    deletedAt: row.deletedAt || row.deleted_at || '',
    raw: row,
  }
}

function normalizeTournamentRow(row = {}) {
  return {
    id: row.id ?? '',
    tournamentCode: normalizeText(row.tournamentCode || row.tournament_code),
    name: normalizeText(row.name),
    title: normalizeText(row.title || row.name),
    season: normalizeText(row.season),
    tournamentType: normalizeText(row.tournamentType || row.tournament_type || 'league'),
    status: normalizeText(row.status || 'draft'),
    startsAt: row.startsAt || row.starts_at || '',
    endsAt: row.endsAt || row.ends_at || '',
    description: normalizeText(row.description),
    teamsCount: Number(row.teamsCount ?? row.teams_count ?? row.totalTeams ?? 0),
    matchesCount: Number(row.matchesCount ?? row.matches_count ?? row.matches ?? 0),
    standingsCount: Number(row.standingsCount ?? row.standings_count ?? 0),
    teams: Number(row.teamsCount ?? row.teams_count ?? row.totalTeams ?? 0),
    matches: Number(row.matchesCount ?? row.matches_count ?? row.matches ?? 0),
    location: normalizeText(row.location || row.season || row.tournamentType || ''),
    createdAt: row.createdAt || row.created_at || '',
    updatedAt: row.updatedAt || row.updated_at || '',
    deletedAt: row.deletedAt || row.deleted_at || '',
    raw: row,
  }
}

function normalizeStandingRow(row = {}) {
  const team = row.team || {}

  return {
    id: row.id ?? '',
    tournamentId: row.tournamentId ?? row.tournament_id ?? '',
    teamId: row.teamId ?? row.team_id ?? '',
    rankPosition: Number(row.rankPosition ?? row.rank_position ?? 0),
    played: Number(row.played ?? 0),
    wins: Number(row.wins ?? 0),
    draws: Number(row.draws ?? 0),
    losses: Number(row.losses ?? 0),
    goalsFor: Number(row.goalsFor ?? row.goals_for ?? 0),
    goalsAgainst: Number(row.goalsAgainst ?? row.goals_against ?? 0),
    goalDifference: Number(row.goalDifference ?? row.goal_difference ?? 0),
    points: Number(row.points ?? 0),
    team: {
      id: team.id ?? '',
      teamCode: normalizeText(team.teamCode || team.team_code),
      name: normalizeText(team.name),
      shortName: normalizeText(team.shortName || team.short_name),
      logo: normalizeText(team.logo),
      status: normalizeText(team.status || ''),
    },
    updatedAt: row.updatedAt || row.updated_at || '',
    raw: row,
  }
}

function normalizePlayerRow(row = {}) {
  const firstName = normalizeText(row.firstName || row.first_name)
  const lastName = normalizeText(row.lastName || row.last_name)
  const name = normalizeText(row.name || `${firstName} ${lastName}`)
  const team = row.team || {}
  const teamName = normalizeText(row.teamName || row.team_name || team.name)

  return {
    id: row.id ?? '',
    playerCode: normalizeText(row.playerCode || row.player_code),
    firstName,
    lastName,
    name,
    jerseyNumber: row.jerseyNumber ?? row.jersey_number ?? null,
    position: normalizeText(row.position || row.primaryPosition || row.primary_position),
    teamId: row.teamId ?? row.team_id ?? '',
    team: teamName,
    division: normalizeText(row.division),
    gender: normalizeText(row.gender),
    age: row.age ?? null,
    dateOfBirth: row.dateOfBirth || row.date_of_birth || '',
    phone: normalizeText(row.phone),
    photo: normalizeText(row.photo),
    heightCm: row.heightCm ?? row.height_cm ?? null,
    weightKg: row.weightKg ?? row.weight_kg ?? null,
    preferredFoot: normalizeText(row.preferredFoot || row.preferred_foot),
    bloodType: normalizeText(row.bloodType || row.blood_type),
    village: normalizeText(row.village),
    commune: normalizeText(row.commune),
    district: normalizeText(row.district),
    province: normalizeText(row.province),
    currentSchool: normalizeText(row.currentSchool || row.current_school),
    gradeYear: normalizeText(row.gradeYear || row.grade_year),
    primaryPosition: normalizeText(row.primaryPosition || row.primary_position),
    registrationStatus: normalizeText(row.registrationStatus || row.registration_status),
    matchesPlayed: Number(row.matchesPlayed ?? row.matches_played ?? 0),
    goalsScored: Number(row.goalsScored ?? row.goals_scored ?? 0),
    status: normalizeText(row.status || 'active'),
    notes: normalizeText(row.notes),
    createdAt: row.createdAt || row.created_at || '',
    updatedAt: row.updatedAt || row.updated_at || '',
    deletedAt: row.deletedAt || row.deleted_at || '',
    raw: row,
  }
}

function normalizeEventRow(row = {}, homeTeamId = null, awayTeamId = null) {
  const teamId = row.teamId ?? row.team_id ?? ''
  const teamType =
    homeTeamId && String(teamId) === String(homeTeamId)
      ? 'home'
      : awayTeamId && String(teamId) === String(awayTeamId)
        ? 'away'
        : 'home'
  const player = row.player || {}
  const timing = parseMatchEventTiming(row)

  return {
    id: row.id ?? '',
    matchId: row.matchId ?? row.match_id ?? '',
    teamId,
    teamType,
    playerId: row.playerId ?? row.player_id ?? '',
    eventType: normalizeText(row.eventType || row.event_type || 'goal'),
    minute: timing.minute,
    extraTimeMinute: timing.extraTimeMinute,
    playerName: normalizeText(
      row.playerName ||
        row.player_name ||
        player.name ||
        `${player.firstName || player.first_name || ''} ${player.lastName || player.last_name || ''}`,
    ),
    player: player && typeof player === 'object' ? player : null,
    teamName: normalizeText(row.teamName || row.team_name || row.team?.name),
    metadata: row.metadata && typeof row.metadata === 'object' ? row.metadata : {},
    createdByUserId: row.createdByUserId ?? row.created_by_user_id ?? '',
    createdAt: row.createdAt || row.created_at || '',
    updatedAt: row.updatedAt || row.updated_at || '',
    raw: row,
  }
}

function normalizeMatchRow(row = {}) {
  const homeTeam = row.homeTeam || {}
  const awayTeam = row.awayTeam || {}
  const tournament = row.tournament || null
  const events = Array.isArray(row.events) ? row.events.map((event) => normalizeEventRow(event, homeTeam.id, awayTeam.id)) : []

  return {
    id: row.id ?? '',
    matchCode: normalizeText(row.matchCode || row.match_code),
    homeTeamId: row.homeTeamId ?? row.home_team_id ?? '',
    awayTeamId: row.awayTeamId ?? row.away_team_id ?? '',
    tournamentId: row.tournamentId ?? row.tournament_id ?? '',
    homeTeam: normalizeText(homeTeam.name || row.homeTeamName || row.home_team_name || row.home_team || ''),
    awayTeam: normalizeText(awayTeam.name || row.awayTeamName || row.away_team_name || row.away_team || ''),
    homeTeamData: homeTeam,
    awayTeamData: awayTeam,
    tournament: tournament && (tournament.id || tournament.name || tournament.tournamentCode || tournament.tournament_code)
      ? normalizeTournamentRow(tournament)
      : null,
    competitionType: normalizeText(row.competitionType || row.competition_type),
    tournamentName: normalizeText(row.tournamentName || row.tournament_name || tournament?.name),
    venue: normalizeText(row.venue),
    schedule: row.scheduledAt || row.scheduled_at || '',
    scheduledAt: row.scheduledAt || row.scheduled_at || '',
    startedAt: row.startedAt || row.started_at || '',
    completedAt: row.completedAt || row.completed_at || '',
    status: normalizeText(row.status || 'draft'),
    currentPeriod: normalizeText(row.currentPeriod || row.current_period),
    homeScore: Number(row.homeScore ?? row.home_score ?? 0),
    awayScore: Number(row.awayScore ?? row.away_score ?? 0),
    score: `${Number(row.homeScore ?? row.home_score ?? 0)} - ${Number(row.awayScore ?? row.away_score ?? 0)}`,
    notes: normalizeText(row.notes),
    createdByUserId: row.createdByUserId ?? row.created_by_user_id ?? '',
    eventsCount: Number(row.eventsCount ?? row.events_count ?? events.length),
    events,
    createdAt: row.createdAt || row.created_at || '',
    updatedAt: row.updatedAt || row.updated_at || '',
    deletedAt: row.deletedAt || row.deleted_at || '',
    raw: row,
  }
}

function normalizeCoachListResponse(response, fallbackPage = 1, fallbackPerPage = 10) {
  const items = unwrapApiItems(response)
  return {
    items: mapUsers(items).map((coach) => normalizeCoachRow(coach)),
    pagination: unwrapApiPagination(response, fallbackPage, fallbackPerPage, items.length),
  }
}

function normalizeTeamListResponse(response, fallbackPage = 1, fallbackPerPage = 10) {
  const items = unwrapApiItems(response)
  return {
    items: items.map(normalizeTeamRow),
    pagination: unwrapApiPagination(response, fallbackPage, fallbackPerPage, items.length),
  }
}

function normalizePlayerListResponse(response, fallbackPage = 1, fallbackPerPage = 10) {
  const items = unwrapApiItems(response)
  return {
    items: items.map(normalizePlayerRow),
    pagination: unwrapApiPagination(response, fallbackPage, fallbackPerPage, items.length),
  }
}

function normalizeMatchListResponse(response, fallbackPage = 1, fallbackPerPage = 10) {
  const items = unwrapApiItems(response)
  return {
    items: items.map(normalizeMatchRow),
    pagination: unwrapApiPagination(response, fallbackPage, fallbackPerPage, items.length),
  }
}

function normalizeTournamentListResponse(response, fallbackPage = 1, fallbackPerPage = 10) {
  const items = unwrapApiItems(response)
  return {
    items: items.map(normalizeTournamentRow),
    pagination: unwrapApiPagination(response, fallbackPage, fallbackPerPage, items.length),
  }
}

function normalizeStandingListResponse(response, fallbackPage = 1, fallbackPerPage = 10) {
  const items = unwrapApiItems(response)
  return {
    items: items.map(normalizeStandingRow),
    pagination: unwrapApiPagination(response, fallbackPage, fallbackPerPage, items.length),
  }
}

function normalizeEventListResponse(response, homeTeamId = null, awayTeamId = null, fallbackPage = 1, fallbackPerPage = 10) {
  const items = unwrapApiItems(response)
  return {
    items: items
      .map((event) => normalizeEventRow(event, homeTeamId, awayTeamId))
      .sort(compareMatchEvents),
    pagination: unwrapApiPagination(response, fallbackPage, fallbackPerPage, items.length),
  }
}

function buildTeamPayload(payload = {}, options = {}) {
  return buildFormData({
    team_code: payload.teamCode || payload.team_code,
    name: payload.name,
    short_name: payload.shortName || payload.short_name,
    coach_user_id: payload.coachUserId || payload.coach_user_id || '',
    coach_display_name: payload.coachDisplayName || payload.coach_display_name || payload.coach,
    division: payload.division,
    captain_name: payload.captainName || payload.captain_name || payload.captain,
    players_count: payload.playersCount ?? payload.players_count ?? payload.players,
    matches_count: payload.matchesCount ?? payload.matches_count ?? payload.matches,
    wins: payload.wins,
    draws: payload.draws,
    losses: payload.losses,
    points: payload.points,
    venue: payload.venue,
    logo: payload.logo instanceof File ? payload.logo : undefined,
    remove_logo: payload.removeLogo || payload.remove_logo,
    status: payload.status,
    description: payload.description,
  }, options)
}

function buildPlayerPayload(payload = {}, options = {}) {
  const fullName = normalizeText(payload.name || payload.fullName)
  const split = splitName(fullName)

  return buildFormData({
    name: fullName,
    first_name: payload.firstName || payload.first_name || split.firstName,
    last_name: payload.lastName || payload.last_name || split.lastName,
    player_code: payload.playerCode || payload.player_code,
    jersey_number: payload.jerseyNumber ?? payload.jersey_number,
    position: payload.position,
    team: payload.team || payload.teamName || payload.team_name,
    gender: payload.gender,
    age: payload.age,
    date_of_birth: payload.dateOfBirth || payload.date_of_birth,
    phone: payload.phone,
    photo: payload.photo instanceof File ? payload.photo : payload.profileImage instanceof File ? payload.profileImage : undefined,
    remove_photo: payload.removePhoto || payload.remove_photo,
    height_cm: payload.heightCm ?? payload.height_cm,
    weight_kg: payload.weightKg ?? payload.weight_kg,
    preferred_foot: payload.preferredFoot || payload.preferred_foot,
    blood_type: payload.bloodType || payload.blood_type,
    village: payload.village,
    commune: payload.commune,
    district: payload.district,
    province: payload.province,
    current_school: payload.currentSchool || payload.current_school,
    grade_year: payload.gradeYear || payload.grade_year,
    primary_position: payload.primaryPosition || payload.primary_position,
    registration_status: payload.registrationStatus || payload.registration_status,
    matches_played: payload.matchesPlayed ?? payload.matches_played,
    goals_scored: payload.goalsScored ?? payload.goals_scored,
    status: payload.status,
    notes: payload.notes,
    division: payload.division,
  }, options)
}

function buildCoachPayload(payload = {}, options = {}) {
  const fullName = normalizeText(payload.name || payload.fullName)
  const split = splitName(fullName)

  return buildFormData({
    name: fullName,
    first_name: payload.firstName || payload.first_name || split.firstName,
    last_name: payload.lastName || payload.last_name || split.lastName,
    username: payload.username || fullName,
    email: payload.email,
    phone: payload.phone,
    status: payload.status,
    password: payload.password,
    password_confirmation: payload.confirmPassword || payload.password_confirmation,
    avatar: payload.avatar instanceof File ? payload.avatar : payload.profileImage instanceof File ? payload.profileImage : undefined,
    remove_avatar: payload.removeAvatar || payload.remove_avatar,
  }, options)
}

function buildMatchPayload(payload = {}, options = {}) {
  return buildFormData({
    match_code: payload.matchCode || payload.match_code,
    home_team: payload.homeTeam || payload.home_team,
    away_team: payload.awayTeam || payload.away_team,
    tournament_id: payload.tournamentId || payload.tournament_id,
    competition_type: payload.competitionType || payload.competition_type,
    tournament_name: payload.tournamentName || payload.tournament_name || payload.tournament,
    venue: payload.venue,
    scheduled_at: payload.scheduledAt || payload.scheduled_at || payload.dateTime,
    status: payload.status,
    current_period: payload.currentPeriod || payload.current_period,
    notes: payload.notes,
  }, options)
}

function buildTournamentPayload(payload = {}, options = {}) {
  return buildFormData({
    tournament_code: payload.tournamentCode || payload.tournament_code,
    name: payload.name,
    season: payload.season,
    tournament_type: payload.tournamentType || payload.tournament_type,
    status: payload.status,
    starts_at: payload.startsAt || payload.starts_at,
    ends_at: payload.endsAt || payload.ends_at,
    description: payload.description,
  }, options)
}

function buildEventPayload(payload = {}, options = {}) {
  return buildFormData({
    team_id: payload.teamId || payload.team_id,
    player_id: payload.playerId || payload.player_id,
    player_name: payload.playerName || payload.player_name,
    event_type: payload.eventType || payload.event_type,
    minute: payload.minute,
    extra_time_minute: payload.extraTimeMinute || payload.extra_time_minute,
    metadata: payload.metadata,
  }, options)
}

function normalizeDashboardPayload(response) {
  const payload = unwrapApiData(response) || {}

  return {
    ...payload,
    summary: payload.summary || {},
    teams: Array.isArray(payload.teams) ? payload.teams.map(normalizeTeamRow) : [],
    players: Array.isArray(payload.players) ? payload.players.map(normalizePlayerRow) : [],
    matches: Array.isArray(payload.matches) ? payload.matches.map(normalizeMatchRow) : [],
    events: Array.isArray(payload.events)
      ? payload.events.map((event) => normalizeEventRow(event, event?.match?.homeTeam?.id, event?.match?.awayTeam?.id))
      : [],
    tournaments: Array.isArray(payload.tournaments) ? payload.tournaments.map(normalizeTournamentRow) : [],
    featuredTournament: payload.featuredTournament ? normalizeTournamentRow(payload.featuredTournament) : null,
    standings: Array.isArray(payload.standings) ? payload.standings.map(normalizeStandingRow) : [],
  }
}

export async function fetchSportDashboard(options = {}) {
  const response = await http.get('/sport/dashboard', {
    signal: options.signal,
  })

  return normalizeDashboardPayload(response)
}

export async function fetchSportTournaments(
  { page = 1, perPage = 10, search = '', status = '', type = '', sortBy = 'created_at', sortDirection = 'desc' } = {},
  options = {},
) {
  const response = await http.get('/sport/tournaments', {
    params: buildQueryParams({
      page,
      per_page: perPage,
      search,
      status,
      type,
      sort_by: sortBy,
      sort_direction: sortDirection,
    }),
    signal: options.signal,
  })

  return normalizeTournamentListResponse(response, page, perPage)
}

export async function fetchSportTournament(id, options = {}) {
  const tournamentId = resolveId(id)
  if (!tournamentId) return null

  const response = await http.get(`/sport/tournaments/${encodeURIComponent(tournamentId)}`, {
    signal: options.signal,
  })

  const payload = unwrapApiData(response) || {}
  return normalizeTournamentRow(payload.tournament || payload)
}

export async function createSportTournament(payload = {}) {
  const response = await http.post('/sport/tournaments', buildTournamentPayload(payload))
  const data = unwrapApiData(response) || {}
  return normalizeTournamentRow(data.tournament || data)
}

export async function updateSportTournament(id, payload = {}) {
  const tournamentId = resolveId(id)
  if (!tournamentId) throw new Error('Tournament id is required.')

  const response = await http.post(
    `/sport/tournaments/${encodeURIComponent(tournamentId)}`,
    buildTournamentPayload(payload, { method: 'PUT' }),
  )

  const data = unwrapApiData(response) || {}
  return normalizeTournamentRow(data.tournament || data)
}

export async function deleteSportTournament(id) {
  const tournamentId = resolveId(id)
  if (!tournamentId) return false

  await http.delete(`/sport/tournaments/${encodeURIComponent(tournamentId)}`)
  return true
}

export async function addTournamentTeam(id, teamId) {
  const tournamentId = resolveId(id)
  if (!tournamentId) throw new Error('Tournament id is required.')

  const response = await http.post(`/sport/tournaments/${encodeURIComponent(tournamentId)}/teams`, {
    team_id: teamId,
  })

  const data = unwrapApiData(response) || {}
  return {
    tournament: data.tournament ? normalizeTournamentRow(data.tournament) : null,
    standings: Array.isArray(data.standings) ? data.standings.map(normalizeStandingRow) : [],
  }
}

export async function removeTournamentTeam(id, teamId) {
  const tournamentId = resolveId(id)
  if (!tournamentId) throw new Error('Tournament id is required.')

  const response = await http.delete(`/sport/tournaments/${encodeURIComponent(tournamentId)}/teams/${encodeURIComponent(resolveId(teamId))}`)
  const data = unwrapApiData(response) || {}
  return {
    tournament: data.tournament ? normalizeTournamentRow(data.tournament) : null,
    standings: Array.isArray(data.standings) ? data.standings.map(normalizeStandingRow) : [],
  }
}

export async function fetchTournamentStandings(id, { page = 1, perPage = 50 } = {}, options = {}) {
  const tournamentId = resolveId(id)
  if (!tournamentId) {
    return { items: [], pagination: { page: 1, perPage: 50, total: 0, totalPages: 1 } }
  }

  const response = await http.get(`/sport/tournaments/${encodeURIComponent(tournamentId)}/standings`, {
    params: buildQueryParams({
      page,
      per_page: perPage,
    }),
    signal: options.signal,
  })

  return normalizeStandingListResponse(response, page, perPage)
}

export async function recalculateTournamentStandings(id) {
  const tournamentId = resolveId(id)
  if (!tournamentId) throw new Error('Tournament id is required.')

  const response = await http.post(`/sport/tournaments/${encodeURIComponent(tournamentId)}/recalculate-standings`)
  const data = unwrapApiData(response) || {}

  return {
    tournamentId: data.tournamentId ?? tournamentId,
    standings: Array.isArray(data.standings) ? data.standings.map(normalizeStandingRow) : [],
  }
}

export async function fetchCoachDashboard(options = {}) {
  const response = await http.get('/sport/coach/dashboard', {
    signal: options.signal,
  })

  return unwrapApiData(response) || {}
}

export async function fetchSportCoaches(
  { page = 1, perPage = 10, search = '', status = '', sortBy = 'created_at', sortDirection = 'desc' } = {},
  options = {},
) {
  const response = await http.get('/sport/coaches', {
    params: buildQueryParams({
      page,
      per_page: perPage,
      search,
      status,
      sort_by: sortBy,
      sort_direction: sortDirection,
    }),
    signal: options.signal,
  })

  return normalizeCoachListResponse(response, page, perPage)
}

export async function fetchSportCoach(id, options = {}) {
  const coachId = resolveId(id)
  if (!coachId) return null

  const response = await http.get(`/sport/coaches/${encodeURIComponent(coachId)}`, {
    signal: options.signal,
  })

  const payload = unwrapApiData(response) || {}
  return normalizeCoachRow(payload.coach || payload.user || payload)
}

export async function createSportCoach(payload = {}) {
  const response = await http.post('/sport/coaches', buildCoachPayload(payload))
  const data = unwrapApiData(response) || {}
  return normalizeCoachRow(data.coach || data.user || data)
}

export async function updateSportCoach(id, payload = {}) {
  const coachId = resolveId(id)
  if (!coachId) throw new Error('Coach id is required.')

  const response = await http.post(
    `/sport/coaches/${encodeURIComponent(coachId)}`,
    buildCoachPayload(payload, { method: 'PUT' }),
  )
  const data = unwrapApiData(response) || {}
  return normalizeCoachRow(data.coach || data.user || data)
}

export async function deleteSportCoach(id) {
  const coachId = resolveId(id)
  if (!coachId) return false

  await http.delete(`/sport/coaches/${encodeURIComponent(coachId)}`)
  return true
}

export async function fetchSportTeams(
  { page = 1, perPage = 10, search = '', status = '', division = '', coachUserId = '', sortBy = 'created_at', sortDirection = 'desc' } = {},
  options = {},
) {
  const response = await http.get('/sport/teams', {
    params: buildQueryParams({
      page,
      per_page: perPage,
      search,
      status,
      division,
      coach_user_id: coachUserId,
      sort_by: sortBy,
      sort_direction: sortDirection,
    }),
    signal: options.signal,
  })

  return normalizeTeamListResponse(response, page, perPage)
}

export async function fetchSportTeam(id, options = {}) {
  const teamId = resolveId(id)
  if (!teamId) return null

  const response = await http.get(`/sport/teams/${encodeURIComponent(teamId)}`, {
    signal: options.signal,
  })

  const payload = unwrapApiData(response) || {}
  return normalizeTeamRow(payload.team || payload)
}

export async function createSportTeam(payload = {}) {
  const response = await http.post('/sport/teams', buildTeamPayload(payload))
  const data = unwrapApiData(response) || {}
  return normalizeTeamRow(data.team || data)
}

export async function updateSportTeam(id, payload = {}) {
  const teamId = resolveId(id)
  if (!teamId) throw new Error('Team id is required.')

  const response = await http.post(
    `/sport/teams/${encodeURIComponent(teamId)}`,
    buildTeamPayload(payload, { method: 'PUT' }),
  )

  const data = unwrapApiData(response) || {}
  return normalizeTeamRow(data.team || data)
}

export async function deleteSportTeam(id) {
  const teamId = resolveId(id)
  if (!teamId) return false

  await http.delete(`/sport/teams/${encodeURIComponent(teamId)}`)
  return true
}

export async function fetchSportPlayers(
  { page = 1, perPage = 10, search = '', status = '', teamId = '', division = '', sortBy = 'created_at', sortDirection = 'desc' } = {},
  options = {},
) {
  const response = await http.get('/sport/players', {
    params: buildQueryParams({
      page,
      per_page: perPage,
      search,
      status,
      team_id: teamId,
      division,
      sort_by: sortBy,
      sort_direction: sortDirection,
    }),
    signal: options.signal,
  })

  return normalizePlayerListResponse(response, page, perPage)
}

export async function fetchSportPlayer(id, options = {}) {
  const playerId = resolveId(id)
  if (!playerId) return null

  const response = await http.get(`/sport/players/${encodeURIComponent(playerId)}`, {
    signal: options.signal,
  })

  const payload = unwrapApiData(response) || {}
  return normalizePlayerRow(payload.player || payload)
}

export async function createSportPlayer(payload = {}) {
  const response = await http.post('/sport/players', buildPlayerPayload(payload))
  const data = unwrapApiData(response) || {}
  return normalizePlayerRow(data.player || data)
}

export async function updateSportPlayer(id, payload = {}) {
  const playerId = resolveId(id)
  if (!playerId) throw new Error('Player id is required.')

  const response = await http.post(
    `/sport/players/${encodeURIComponent(playerId)}`,
    buildPlayerPayload(payload, { method: 'PUT' }),
  )

  const data = unwrapApiData(response) || {}
  return normalizePlayerRow(data.player || data)
}

export async function deleteSportPlayer(id) {
  const playerId = resolveId(id)
  if (!playerId) return false

  await http.delete(`/sport/players/${encodeURIComponent(playerId)}`)
  return true
}

export async function fetchSportMatches(
  { page = 1, perPage = 10, search = '', status = '', teamId = '', sortBy = 'scheduled_at', sortDirection = 'desc' } = {},
  options = {},
) {
  const response = await http.get('/sport/matches', {
    params: buildQueryParams({
      page,
      per_page: perPage,
      search,
      status,
      team_id: teamId,
      sort_by: sortBy,
      sort_direction: sortDirection,
    }),
    signal: options.signal,
  })

  return normalizeMatchListResponse(response, page, perPage)
}

export async function fetchSportMatch(id, options = {}) {
  const matchId = resolveId(id)
  if (!matchId) return null

  const response = await http.get(`/sport/matches/${encodeURIComponent(matchId)}`, {
    signal: options.signal,
  })

  const payload = unwrapApiData(response) || {}
  return normalizeMatchRow(payload.match || payload)
}

export async function createSportMatch(payload = {}) {
  const response = await http.post('/sport/matches', buildMatchPayload(payload))
  const data = unwrapApiData(response) || {}
  return normalizeMatchRow(data.match || data)
}

export async function updateSportMatch(id, payload = {}) {
  const matchId = resolveId(id)
  if (!matchId) throw new Error('Match id is required.')

  const response = await http.post(
    `/sport/matches/${encodeURIComponent(matchId)}`,
    buildMatchPayload(payload, { method: 'PUT' }),
  )

  const data = unwrapApiData(response) || {}
  return normalizeMatchRow(data.match || data)
}

export async function deleteSportMatch(id) {
  const matchId = resolveId(id)
  if (!matchId) return false

  await http.delete(`/sport/matches/${encodeURIComponent(matchId)}`)
  return true
}

export async function updateMatchStatus(id, payload = {}) {
  const matchId = resolveId(id)
  if (!matchId) throw new Error('Match id is required.')

  const response = await http.patch(`/sport/matches/${encodeURIComponent(matchId)}/status`, {
    status: payload.status,
    current_period: payload.currentPeriod || payload.current_period,
  })

  const data = unwrapApiData(response) || {}
  return normalizeMatchRow(data.match || data)
}

export async function fetchMatchEvents(matchId, options = {}) {
  const targetId = resolveId(matchId)
  if (!targetId) return { items: [], pagination: { page: 1, perPage: 10, total: 0, totalPages: 1 } }

  const response = await http.get(`/sport/matches/${encodeURIComponent(targetId)}/events`, {
    signal: options.signal,
  })
  const payload = unwrapApiData(response) || {}
  const match = payload.match || {}
  const homeTeamId = options.homeTeamId || match.homeTeamId || match.home_team_id
  const awayTeamId = options.awayTeamId || match.awayTeamId || match.away_team_id

  return normalizeEventListResponse(response, homeTeamId, awayTeamId)
}

export async function createMatchEvent(matchId, payload = {}) {
  const targetId = resolveId(matchId)
  if (!targetId) throw new Error('Match id is required.')

  const response = await http.post(
    `/sport/matches/${encodeURIComponent(targetId)}/events`,
    buildEventPayload(payload),
  )

  const data = unwrapApiData(response) || {}
  return normalizeEventRow(data.event || data)
}

export async function updateMatchEvent(id, payload = {}) {
  const eventId = resolveId(id)
  if (!eventId) throw new Error('Event id is required.')

  const response = await http.post(
    `/sport/events/${encodeURIComponent(eventId)}`,
    buildEventPayload(payload, { method: 'PUT' }),
  )

  const data = unwrapApiData(response) || {}
  return normalizeEventRow(data.event || data)
}

export async function deleteMatchEvent(id) {
  const eventId = resolveId(id)
  if (!eventId) return false

  await http.delete(`/sport/events/${encodeURIComponent(eventId)}`)
  return true
}

export { buildQueryParams, getApiErrorMessage, normalizeBooleanLike, unwrapApiData }
export { compareMatchEvents }

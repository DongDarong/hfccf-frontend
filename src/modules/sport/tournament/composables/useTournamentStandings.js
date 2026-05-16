import { computed, ref, watch } from 'vue'

function normalizeText(value) {
  return String(value || '').trim()
}

function normalizeTeamId(team) {
  return String(team?.id ?? team ?? '').trim()
}

function normalizeScoreValue(value) {
  if (value === null || value === undefined || value === '') return null

  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : null
}

function createEmptyStandingRow(team, qualificationSlots = 0) {
  return {
    teamId: normalizeText(team?.id),
    teamName: normalizeText(team?.name) || normalizeText(team?.id),
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    qualificationSlots,
    qualified: false,
  }
}

function compareStandingRows(left, right) {
  if (right.points !== left.points) return right.points - left.points
  if (right.goalDifference !== left.goalDifference) return right.goalDifference - left.goalDifference
  if (right.goalsFor !== left.goalsFor) return right.goalsFor - left.goalsFor
  return String(left.teamName || '').localeCompare(String(right.teamName || ''))
}

function updateStandingRow(row, scoredFor = 0, scoredAgainst = 0, rules = {}) {
  const pointsWin = Number(rules.pointsWin ?? 3)
  const pointsDraw = Number(rules.pointsDraw ?? 1)
  const pointsLoss = Number(rules.pointsLoss ?? 0)

  row.played += 1
  row.goalsFor += scoredFor
  row.goalsAgainst += scoredAgainst
  row.goalDifference = row.goalsFor - row.goalsAgainst

  if (scoredFor > scoredAgainst) {
    row.wins += 1
    row.points += pointsWin
    return
  }

  if (scoredFor < scoredAgainst) {
    row.losses += 1
    row.points += pointsLoss
    return
  }

  row.draws += 1
  row.points += pointsDraw
}

function resolveFixtureScore(fixture = {}) {
  return {
    home: normalizeScoreValue(fixture?.score?.home),
    away: normalizeScoreValue(fixture?.score?.away),
  }
}

function isCountableFixture(fixture = {}) {
  const status = String(fixture?.status || '').trim().toLowerCase()
  if (status === 'cancelled' || status === 'postponed') return false

  const score = resolveFixtureScore(fixture)
  return score.home !== null && score.away !== null
}

export function calculateTournamentGroupStandings({
  group = {},
  teams = [],
  fixtures = [],
  rules = {},
} = {}) {
  const qualificationSlots = Math.max(1, Number(group?.qualificationSlots ?? rules?.qualificationSlots ?? 2) || 1)
  const groupId = normalizeText(group?.id)
  const groupTeams = (Array.isArray(group?.teamIds) ? group.teamIds : [])
    .map((teamId) => {
      const normalizedTeamId = normalizeTeamId(teamId)
      const record = (Array.isArray(teams) ? teams : []).find((team) => normalizeTeamId(team) === normalizedTeamId)

      return record || {
        id: normalizedTeamId,
        name: normalizedTeamId,
      }
    })
    .filter((team) => normalizeTeamId(team))

  const rows = groupTeams.map((team) => createEmptyStandingRow(team, qualificationSlots))
  const rowMap = new Map(rows.map((row) => [row.teamId, row]))
  const groupFixtures = (Array.isArray(fixtures) ? fixtures : []).filter((fixture) => normalizeText(fixture?.groupId) === groupId)

  groupFixtures.forEach((fixture) => {
    if (!isCountableFixture(fixture)) {
      return
    }

    const homeRow = rowMap.get(normalizeText(fixture?.homeTeamId))
    const awayRow = rowMap.get(normalizeText(fixture?.awayTeamId))

    if (!homeRow || !awayRow) {
      return
    }

    const score = resolveFixtureScore(fixture)
    updateStandingRow(homeRow, score.home, score.away, rules)
    updateStandingRow(awayRow, score.away, score.home, rules)
  })

  const sortedRows = rows
    .map((row) => ({
      ...row,
      goalDifference: row.goalsFor - row.goalsAgainst,
    }))
    .sort(compareStandingRows)
    .map((row, index) => ({
      ...row,
      position: index + 1,
      qualified: index < qualificationSlots,
    }))

  return {
    groupId,
    groupName: normalizeText(group?.name),
    qualificationSlots,
    rows: sortedRows,
    completedMatches: groupFixtures.filter((fixture) => String(fixture?.status || '').trim().toLowerCase() === 'completed').length,
    totalMatches: groupFixtures.length,
  }
}

export function calculateTournamentStandings({
  tournament = {},
} = {}) {
  const groups = Array.isArray(tournament?.groupDraw?.groups) ? tournament.groupDraw.groups : []
  const teams = Array.isArray(tournament?.teams) ? tournament.teams : []
  const fixtures = Array.isArray(tournament?.fixtures) ? tournament.fixtures : []
  const rules = tournament?.rules || {}

  const groupStandings = groups.map((group) =>
    calculateTournamentGroupStandings({
      group,
      teams,
      fixtures,
      rules,
    }),
  )

  return {
    groups: groupStandings,
    totalMatches: fixtures.length,
    completedMatches: fixtures.filter((fixture) => String(fixture?.status || '').trim().toLowerCase() === 'completed').length,
  }
}

export function useTournamentStandings(tournament) {
  const selectedGroupId = ref('')

  const groupStandings = computed(() => calculateTournamentStandings({ tournament: tournament?.value || tournament || {} }).groups)

  const groupOptions = computed(() =>
    groupStandings.value.map((group) => ({
      label: group.groupName || group.groupId,
      value: group.groupId,
    })),
  )

  watch(
    groupStandings,
    (nextGroups) => {
      if (!nextGroups.length) {
        selectedGroupId.value = ''
        return
      }

      const current = nextGroups.find((group) => group.groupId === selectedGroupId.value)
      if (!current) {
        selectedGroupId.value = nextGroups[0].groupId
      }
    },
    { immediate: true },
  )

  const selectedGroupStandings = computed(() =>
    groupStandings.value.find((group) => group.groupId === selectedGroupId.value) || groupStandings.value[0] || null,
  )

  return {
    selectedGroupId,
    groupStandings,
    groupOptions,
    selectedGroupStandings,
    totalMatches: computed(() => calculateTournamentStandings({ tournament: tournament?.value || tournament || {} }).totalMatches),
    completedMatches: computed(() => calculateTournamentStandings({ tournament: tournament?.value || tournament || {} }).completedMatches),
  }
}

export {
  compareStandingRows,
  createEmptyStandingRow,
  isCountableFixture,
  normalizeScoreValue,
  resolveFixtureScore,
}

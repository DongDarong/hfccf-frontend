import { computed, ref, watch } from 'vue'
import { calculateTournamentStandings, normalizeScoreValue } from './useTournamentStandings'
import { normalizeTournamentState } from './useTournamentStateMachine'

function normalizeText(value) {
  return String(value || '').trim()
}

function normalizeMatchStatus(value) {
  const status = normalizeText(value).toLowerCase()
  return ['scheduled', 'live', 'completed', 'postponed', 'cancelled'].includes(status) ? status : 'scheduled'
}

function normalizeEventType(value) {
  const type = normalizeText(value).toLowerCase()
  return ['goal', 'own_goal', 'yellow_card', 'red_card', 'penalty'].includes(type) ? type : 'goal'
}

function normalizeFixtureEvent(event = {}, index = 0) {
  return {
    id: normalizeText(event.id) || `event-${index + 1}`,
    minute: Math.max(0, Number(event.minute ?? 0) || 0),
    type: normalizeEventType(event.type),
    teamId: normalizeText(event.teamId),
    teamName: normalizeText(event.teamName),
    playerName: normalizeText(event.playerName),
    notes: normalizeText(event.notes),
  }
}

function normalizeFixtureScore(score = {}) {
  return {
    home: normalizeScoreValue(score?.home),
    away: normalizeScoreValue(score?.away),
  }
}

export function createFixtureResultDraft(fixture = null) {
  return {
    status: normalizeMatchStatus(fixture?.status),
    score: normalizeFixtureScore(fixture?.score),
    venue: normalizeText(fixture?.venue || ''),
    dateTime: normalizeText(fixture?.dateTime || ''),
    notes: normalizeText(fixture?.notes || ''),
    events: Array.isArray(fixture?.events) ? fixture.events.map((event, index) => normalizeFixtureEvent(event, index)) : [],
  }
}

function createEventId(events = []) {
  return `event-${String((Array.isArray(events) ? events.length : 0) + 1).padStart(2, '0')}`
}

export function useTournamentResults(tournament, actions = {}) {
  const selectedFixtureId = ref('')
  const resultDraft = ref(createFixtureResultDraft())

  const fixtures = computed(() => {
    const source = Array.isArray(tournament?.value?.fixtures) ? tournament.value.fixtures : []

    return source.map((fixture) => ({
      ...fixture,
      status: normalizeMatchStatus(fixture?.status),
      score: normalizeFixtureScore(fixture?.score),
      events: Array.isArray(fixture?.events) ? fixture.events.map((event, index) => normalizeFixtureEvent(event, index)) : [],
    }))
  })

  const selectedFixture = computed(() =>
    fixtures.value.find((fixture) => fixture.id === selectedFixtureId.value) || fixtures.value[0] || null,
  )

  const statusOptions = computed(() => [
    { label: 'Scheduled', value: 'scheduled' },
    { label: 'Live', value: 'live' },
    { label: 'Completed', value: 'completed' },
    { label: 'Postponed', value: 'postponed' },
    { label: 'Cancelled', value: 'cancelled' },
  ])

  const eventTypes = computed(() => [
    { label: 'Goal', value: 'goal' },
    { label: 'Own goal', value: 'own_goal' },
    { label: 'Yellow card', value: 'yellow_card' },
    { label: 'Red card', value: 'red_card' },
    { label: 'Penalty', value: 'penalty' },
  ])

  watch(
    fixtures,
    (nextFixtures) => {
      if (!nextFixtures.length) {
        selectedFixtureId.value = ''
        resultDraft.value = createFixtureResultDraft()
        return
      }

      if (!selectedFixtureId.value || !nextFixtures.some((fixture) => fixture.id === selectedFixtureId.value)) {
        selectedFixtureId.value = nextFixtures[0].id
      }
    },
    { immediate: true },
  )

  watch(
    selectedFixture,
    (nextFixture) => {
      resultDraft.value = createFixtureResultDraft(nextFixture)
    },
    { immediate: true },
  )

  function selectFixture(fixtureId) {
    const normalizedId = normalizeText(fixtureId)
    if (!normalizedId) return

    selectedFixtureId.value = normalizedId
  }

  function updateDraft(patch = {}) {
    resultDraft.value = {
      ...resultDraft.value,
      ...patch,
      score: patch.score ? normalizeFixtureScore(patch.score) : resultDraft.value.score,
      events: Array.isArray(patch.events)
        ? patch.events.map((event, index) => normalizeFixtureEvent(event, index))
        : resultDraft.value.events,
      status: patch.status ? normalizeMatchStatus(patch.status) : resultDraft.value.status,
    }
  }

  function setScore(home, away) {
    updateDraft({
      score: {
        home: normalizeScoreValue(home),
        away: normalizeScoreValue(away),
      },
    })
  }

  function setStatus(status) {
    updateDraft({ status })
  }

  function addEvent(event = {}) {
    const normalized = normalizeFixtureEvent(event, resultDraft.value.events.length)
    normalized.id = normalized.id || createEventId(resultDraft.value.events)

    updateDraft({
      events: [...resultDraft.value.events, normalized],
    })
  }

  function removeEvent(eventId) {
    const targetId = normalizeText(eventId)
    if (!targetId) return

    updateDraft({
      events: resultDraft.value.events.filter((event) => event.id !== targetId),
    })
  }

  function saveResult() {
    const updateTournament = actions.updateTournament
    const transitionTournament = actions.transitionTournament
    const currentTournament = tournament?.value || {}
    const currentFixture = selectedFixture.value

    if (typeof updateTournament !== 'function' || typeof transitionTournament !== 'function') {
      return null
    }

    if (!currentTournament?.id || !currentFixture?.id) {
      return null
    }

    const nextFixtures = fixtures.value.map((fixture) =>
      fixture.id !== currentFixture.id
        ? fixture
        : {
            ...fixture,
            status: normalizeMatchStatus(resultDraft.value.status),
            score: normalizeFixtureScore(resultDraft.value.score),
            venue: normalizeText(resultDraft.value.venue || fixture.venue),
            dateTime: normalizeText(resultDraft.value.dateTime || fixture.dateTime),
            notes: normalizeText(resultDraft.value.notes || fixture.notes),
            events: resultDraft.value.events.map((event, index) => normalizeFixtureEvent(event, index)),
            completedAt:
              normalizeMatchStatus(resultDraft.value.status) === 'completed'
                ? new Date().toISOString()
                : normalizeText(fixture.completedAt || ''),
          },
    )

    const nextStandings = calculateTournamentStandings({
      tournament: {
        ...currentTournament,
        fixtures: nextFixtures,
      },
    }).groups

    const completedMatches = nextFixtures.filter((fixture) => fixture.status === 'completed').length
    const anyScored = Number.isFinite(resultDraft.value.score.home) && Number.isFinite(resultDraft.value.score.away)
    const updated = updateTournament(currentTournament.id, {
      fixtures: nextFixtures,
      results: nextFixtures.filter((fixture) => fixture.status === 'completed'),
      standings: nextStandings,
      statistics: {
        ...currentTournament.statistics,
        fixturesGenerated: nextFixtures.length,
        matches: nextFixtures.length,
        completedMatches,
      },
    })

    if (updated?.id && normalizeTournamentState(currentTournament.state) === 'fixtures_generated' && (anyScored || resultDraft.value.status === 'completed')) {
      transitionTournament(updated.id, 'active')
    }

    return updated
  }

  return {
    selectedFixtureId,
    selectedFixture,
    fixtures,
    resultDraft,
    statusOptions,
    eventTypes,
    selectFixture,
    updateDraft,
    setScore,
    setStatus,
    addEvent,
    removeEvent,
    saveResult,
  }
}

export {
  createEventId,
  normalizeEventType,
  normalizeFixtureEvent,
  normalizeFixtureScore,
  normalizeMatchStatus,
}

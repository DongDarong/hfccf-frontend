<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import AlertError from '@/components/alerts/AlertError.vue'
import AlertQuestion from '@/components/alerts/AlertQuestion.vue'
import { useLanguage } from '@/composables/useLanguage'
import FixtureSummaryCard from '@/modules/sport/admin/components/match-results/FixtureSummaryCard.vue'
import ResultEntryPanel from '@/modules/sport/admin/components/match-results/ResultEntryPanel.vue'
import { useMatchSquad } from '@/modules/sport/match-squads/composables/useMatchSquad'
import { useMatchEvents } from '@/modules/sport/match-events/composables/useMatchEvents'
import MatchEventForm from '@/modules/sport/match-events/components/MatchEventForm.vue'
import MatchTimeline from '@/modules/sport/match-events/components/MatchTimeline.vue'
import { MATCH_EVENT_TYPES } from '@/modules/sport/constants/matchEvent'
import { useMatchResultEntry } from '@/modules/sport/admin/composables/useMatchResultEntry'

defineOptions({
  name: 'SportAdminMatchesResultEntryPage',
})

const router = useRouter()
const route = useRoute()
const { t, language } = useLanguage()
const matchId = computed(() => String(route.params.id || '').trim())

const isKh = computed(() => language.value === 'KH')
const showSuccess = ref(false)
const showError = ref(false)
const errorMessage = ref('')
const draftEvent = ref(createDraftEvent())
const selectedMatch = computed(() => matchRecord.value)
const pendingDeleteEvent = ref(null)

const { loading: matchLoading, loadMatch, loadMatchSquads, squads, match: matchRecord } = useMatchSquad()
const {
  items: matchEvents,
  loading: eventsLoading,
  loadEvents,
  createEvent,
  updateEvent,
  removeEvent,
} = useMatchEvents()
const {
  loading: saveLoading,
  saveResult,
} = useMatchResultEntry()

const pageTitle = computed(() => t('sportMatchesManagement.resultsEntry.title'))
const pageSubtitle = computed(() => {
  if (!selectedMatch.value) return t('sportMatchesManagement.resultsEntry.subtitle')
  return t('sportMatchesManagement.resultsEntry.matchSubtitle', {
    homeTeam: selectedMatch.value.homeTeam,
    awayTeam: selectedMatch.value.awayTeam,
  })
})

const statusOptions = computed(() => [
  { value: 'completed', label: t('sportMatchesManagement.status.completed') },
  { value: 'live', label: t('sportMatchesManagement.status.live') },
  { value: 'postponed', label: t('sportMatchesManagement.status.postponed') },
  { value: 'cancelled', label: t('sportMatchesManagement.status.cancelled') },
])

const fixtureSummary = computed(() => {
  const match = selectedMatch.value || {}
  const [matchDate = '-', matchTime = '-'] = String(match.schedule || '')
    .trim()
    .split(/\s+/)

  return {
    homeTeam: String(match.homeTeam || '-'),
    awayTeam: String(match.awayTeam || '-'),
    matchDate,
    matchTime,
    venue: String(match.venue || '-'),
    competition: String(match.tournament?.name || match.tournamentName || match.competitionType || '-'),
  }
})

const scoreState = computed(() => calculateScore(matchEvents.value, selectedMatch.value))

watch(
  scoreState,
  (value) => {
    resultEntryValue.value.homeScore = value.home
    resultEntryValue.value.awayScore = value.away
  },
  { immediate: true, deep: true },
)

const resultEntryValue = ref(createResultValue())

watch(
  selectedMatch,
  (match) => {
    if (!match) return

    resultEntryValue.value = createResultValue({
      homeTeam: match.homeTeam || '',
      awayTeam: match.awayTeam || '',
      status: match.status || 'completed',
      report: match.notes || '',
    })
  },
  { immediate: true },
)

function createResultValue(value = {}) {
  return {
    homeTeam: String(value.homeTeam || ''),
    awayTeam: String(value.awayTeam || ''),
    homeScore: Number(value.homeScore || 0),
    awayScore: Number(value.awayScore || 0),
    status: String(value.status || 'completed'),
    report: String(value.report || ''),
    homeEvents: Array.isArray(value.homeEvents) ? value.homeEvents : [],
    awayEvents: Array.isArray(value.awayEvents) ? value.awayEvents : [],
  }
}

function createDraftEvent(value = {}) {
  return {
    id: value.id || '',
    eventType: String(value.eventType || MATCH_EVENT_TYPES.GOAL),
    teamId: value.teamId || '',
    squadId: value.squadId || '',
    squadPlayerId: value.squadPlayerId || '',
    relatedSquadPlayerId: value.relatedSquadPlayerId || '',
    minute: Number(value.minute || 0),
    stoppageMinute: Number(value.stoppageMinute || 0),
    period: String(value.period || 'first_half'),
    notes: String(value.notes || value.description || ''),
  }
}

function isScoringEvent(event = {}) {
  const type = String(event.eventType || '').toLowerCase()
  return ['goal', 'own_goal', 'penalty_goal', 'extra_time_goal'].includes(type)
}

function calculateScore(events = [], match = {}) {
  return events.reduce(
    (carry, event) => {
      if (!isScoringEvent(event)) return carry

      const teamId = String(event.teamId || event.team_id || '')
      const awayId = String(match.awayTeamId || match.away_team_id || '')
      const eventSide = String(event.side || '').toLowerCase()
      let creditedTeam = teamId === awayId || eventSide === 'away' ? 'away' : 'home'

      if (String(event.eventType || '').toLowerCase() === 'own_goal') {
        creditedTeam = creditedTeam === 'home' ? 'away' : 'home'
      }

      if (creditedTeam === 'home') carry.home += 1
      if (creditedTeam === 'away') carry.away += 1

      return carry
    },
    { home: 0, away: 0 },
  )
}

function resetFeedback() {
  errorMessage.value = ''
  showError.value = false
}

function goBackToMatches() {
  router.push({ name: 'dashboard-sport-admin-matches' })
}

function onEditEvent(event) {
  draftEvent.value = createDraftEvent(event)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function requestDeleteEvent(event) {
  pendingDeleteEvent.value = event
}

function cancelDeleteEvent() {
  pendingDeleteEvent.value = null
}

function resetDraftEvent() {
  draftEvent.value = createDraftEvent()
}

async function confirmDeleteEvent() {
  if (!pendingDeleteEvent.value) return

  try {
    await removeEvent(pendingDeleteEvent.value.id)
    showSuccess.value = true
  } catch {
    errorMessage.value = t('sportMatchesManagement.resultsEntry.events.deleteFailed')
    showError.value = true
  } finally {
    cancelDeleteEvent()
  }
}

async function onSubmitEvent(payload) {
  if (payload?.error) {
    errorMessage.value = payload.error
    showError.value = true
    return
  }

  resetFeedback()

  try {
    const target = payload.id ? updateEvent : createEvent
    await target(payload.id || matchId.value, payload)
    draftEvent.value = createDraftEvent()
    showSuccess.value = true
  } catch {
    errorMessage.value = t('sportMatchesManagement.resultsEntry.events.saveFailed')
    showError.value = true
  }
}

async function onSaveResult(result) {
  resetFeedback()

  if (!selectedMatch.value) {
    errorMessage.value = t('sportMatchesManagement.resultsEntry.validation.matchRequired')
    showError.value = true
    return
  }

  if (Number(result.homeScore) < 0 || Number(result.awayScore) < 0) {
    errorMessage.value = t('sportMatchesManagement.resultsEntry.validation.scoreInvalid')
    showError.value = true
    return
  }

  if (!result.status) {
    errorMessage.value = t('sportMatchesManagement.resultsEntry.validation.statusRequired')
    showError.value = true
    return
  }

  try {
    await saveResult(matchId.value, {
      status: result.status,
      currentPeriod: 'final',
      notes: result.report,
    })
    showSuccess.value = true
  } catch {
    errorMessage.value = t('sportMatchesManagement.resultsEntry.saveFailed')
    showError.value = true
  }
}

async function loadMatchData() {
  const [match] = await Promise.all([
    loadMatch(matchId.value),
    loadMatchSquads(matchId.value),
    loadEvents(matchId.value),
  ])

  if (!match?.id) return

  resultEntryValue.value = createResultValue({
    homeTeam: match.homeTeam || '',
    awayTeam: match.awayTeam || '',
    status: match.status || 'completed',
    report: match.notes || '',
  })
}

onMounted(() => {
  void loadMatchData()
})
</script>

<template>
  <MainLayout>
    <section :class="isKh ? 'matches-result-entry matches-result-entry--kh' : 'matches-result-entry'">
      <HeaderSection :title="pageTitle" :subtitle="pageSubtitle" />

      <div class="matches-result-entry__shell">
        <FixtureSummaryCard
          :home-team="fixtureSummary.homeTeam"
          :away-team="fixtureSummary.awayTeam"
          :home-score="resultEntryValue.homeScore"
          :away-score="resultEntryValue.awayScore"
          :match-date="fixtureSummary.matchDate"
          :match-time="fixtureSummary.matchTime"
          :venue="fixtureSummary.venue"
          :competition="fixtureSummary.competition"
        />

        <ResultEntryPanel
          v-model="resultEntryValue"
          :loading="saveLoading"
          :readonly="saveLoading || matchLoading"
          :show-goal-editors="false"
          :status-options="statusOptions"
          @save="onSaveResult"
          @cancel="goBackToMatches"
        />
      </div>

      <div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <MatchEventForm
          v-model="draftEvent"
          :match="selectedMatch"
          :squads="squads"
          :existing-events="matchEvents"
          :loading="eventsLoading"
          :readonly="eventsLoading"
          @submit="onSubmitEvent"
          @cancel="resetDraftEvent"
        />

        <MatchTimeline
          :events="matchEvents"
          :home-team="selectedMatch?.homeTeam || ''"
          :away-team="selectedMatch?.awayTeam || ''"
          :loading="eventsLoading"
          :readonly="false"
          @edit="onEditEvent"
          @delete="requestDeleteEvent"
        />
      </div>

      <AlertError
        :show="showError"
        :title="t('sportMatchesManagement.resultsEntry.errorTitle')"
        :message="errorMessage || t('common.errorTryAgain')"
        :button-text="t('common.close')"
        @close="showError = false"
      />

      <AlertSuccess
        :show="showSuccess"
        :title="t('sportMatchesManagement.resultsEntry.successTitle')"
        :message="t('sportMatchesManagement.resultsEntry.successMessage')"
        :button-text="t('common.close')"
        @close="showSuccess = false"
      />

      <AlertQuestion
        :show="Boolean(pendingDeleteEvent)"
        :title="t('sportMatchesManagement.resultsEntry.events.deleteTitle')"
        :message="t('sportMatchesManagement.resultsEntry.events.deleteMessage')"
        :confirm-text="t('common.delete')"
        :cancel-text="t('common.cancel')"
        type="danger"
        @confirm="confirmDeleteEvent"
        @cancel="cancelDeleteEvent"
      />
    </section>
  </MainLayout>
</template>

<style scoped>
.matches-result-entry {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.matches-result-entry__shell {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid #dce6f2;
  background:
    radial-gradient(circle at top left, rgba(186, 230, 253, 0.18), transparent 24%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.5);
}

.matches-result-entry--kh,
.matches-result-entry--kh :deep(input),
.matches-result-entry--kh :deep(.p-select-label) {
  font-family:
    'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
}
</style>
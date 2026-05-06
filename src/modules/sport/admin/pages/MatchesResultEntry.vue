<script setup>
/**
 * SportAdminMatchesResultEntryPage
 * Keeps route lookup, validation, alerts, and simulated persistence in one place.
 * Presentational sections live in smaller components under `components/match-results`.
 */
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import AlertError from '@/components/alerts/AlertError.vue'
import { useLanguage } from '@/composables/useLanguage'
import FixtureSummaryCard from '@/modules/sport/admin/components/match-results/FixtureSummaryCard.vue'
import ResultEntryPanel from '@/modules/sport/admin/components/match-results/ResultEntryPanel.vue'
import ResultListCard from '@/modules/sport/admin/components/match-results/result-list/ResultListCard.vue'
import matchesManagementData from '@/mocks/sport/matches-management-data.json'

defineOptions({
  name: 'SportAdminMatchesResultEntryPage',
})

const router = useRouter()
const route = useRoute()
const { t, language } = useLanguage()

const isKh = computed(() => language.value === 'KH')
const matchId = computed(() => String(route.params.id || '').trim())
const isSubmitting = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const errorMessage = ref('')
const resultEntryValue = ref(createResultValue())
const resultListFilters = ref({
  search: '',
  status: '',
})

const selectedMatch = computed(() => {
  const matches = Array.isArray(matchesManagementData) ? matchesManagementData : []
  return matches.find((match) => String(match?.id || '').trim() === matchId.value) || null
})

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

const resultListStatusOptions = computed(() => [
  { value: '', label: t('sportMatchesManagement.resultList.statuses.all') },
  { value: 'Finished', label: t('sportMatchesManagement.resultList.statuses.finished') },
  { value: 'Pending', label: t('sportMatchesManagement.resultList.statuses.pending') },
  { value: 'Verified', label: t('sportMatchesManagement.resultList.statuses.verified') },
  { value: 'Rejected', label: t('sportMatchesManagement.resultList.statuses.rejected') },
])

const resultListLabels = computed(() => ({
  match: t('sportMatchesManagement.resultList.table.match'),
  score: t('sportMatchesManagement.resultList.table.score'),
  report: t('sportMatchesManagement.resultList.table.report'),
  schedule: t('sportMatchesManagement.resultList.table.schedule'),
  status: t('sportMatchesManagement.resultList.table.status'),
  actions: t('sportMatchesManagement.resultList.table.actions'),
}))

const fixtureSummary = computed(() => {
  const match = selectedMatch.value || {}
  const [matchDate = '-', matchTime = '-'] = String(match.schedule || '')
    .trim()
    .split(/\s+/)

  // The card is reusable and expects display-ready strings, so the page handles mock data shaping.
  return {
    homeTeam: String(match.homeTeam || '-'),
    awayTeam: String(match.awayTeam || '-'),
    matchDate,
    matchTime,
    venue: String(match.venue || '-'),
    competition: String(match.competition || '-'),
  }
})

function mapResultStatus(matchStatus) {
  // Result list uses admin-oriented status labels (separate from fixture lifecycle).
  const value = String(matchStatus || '').trim().toLowerCase()
  if (value === 'completed') return 'Finished'
  if (value === 'scheduled') return 'Pending'
  if (value === 'live') return 'Verified'
  if (value === 'postponed' || value === 'cancelled' || value === 'canceled') return 'Rejected'
  return 'Pending'
}

function normalize(value) {
  return String(value ?? '').trim().toLowerCase()
}

const resultListMatches = computed(() => {
  const query = normalize(resultListFilters.value.search)
  const status = String(resultListFilters.value.status || '')

  const matches = Array.isArray(matchesManagementData) ? matchesManagementData : []
  return matches
    .map((match) => ({
      id: String(match.id || ''),
      homeTeam: String(match.homeTeam || ''),
      awayTeam: String(match.awayTeam || ''),
      competition: String(match.competition || ''),
      score: String(match.score || ''),
      report: null,
      datetime: String(match.schedule || ''),
      venue: String(match.venue || ''),
      status: mapResultStatus(match.status),
    }))
    .filter((match) => {
      let isMatch = true

      if (query) {
        // Search is page-owned so it can evolve into backend parameters later.
        const haystack = normalize(
          `${match.homeTeam} ${match.awayTeam} ${match.venue} ${match.competition} ${match.score} ${match.datetime} ${match.report || ''}`,
        )
        isMatch = haystack.includes(query)
      }

      if (isMatch && status) {
        isMatch = match.status === status
      }

      return isMatch
    })
})

function createResultValue(value = {}) {
  return {
    homeTeam: String(value.homeTeam || ''),
    awayTeam: String(value.awayTeam || ''),
    homeScore: Number(value.homeScore || 0),
    awayScore: Number(value.awayScore || 0),
    status: String(value.status || 'completed'),
    report: String(value.report || ''),
    events: Array.isArray(value.events) ? value.events : [],
  }
}

function parseScore(score) {
  const [home = '0', away = '0'] = String(score || '')
    .split('-')
    .map((value) => value.trim())

  return {
    home: Number.isFinite(Number(home)) ? Number(home) : 0,
    away: Number.isFinite(Number(away)) ? Number(away) : 0,
  }
}

watch(
  selectedMatch,
  (match) => {
    if (!match) return
    const score = parseScore(match.score)
    resultEntryValue.value = createResultValue({
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeScore: score.home,
      awayScore: score.away,
      status: match.status || 'completed',
      report: '',
      events: [],
    })
  },
  { immediate: true },
)

function resetFeedback() {
  errorMessage.value = ''
  showError.value = false
}

function validateResult(result) {
  if (!selectedMatch.value) return t('sportMatchesManagement.resultsEntry.validation.matchRequired')
  if (Number(result.homeScore) < 0 || Number(result.awayScore) < 0) {
    return t('sportMatchesManagement.resultsEntry.validation.scoreInvalid')
  }
  if (!result.status) return t('sportMatchesManagement.resultsEntry.validation.statusRequired')
  return ''
}

async function onSaveResult(result) {
  resetFeedback()
  const validationError = validateResult(result)
  if (validationError) {
    errorMessage.value = validationError
    showError.value = true
    return
  }

  isSubmitting.value = true
  try {
    // UI-only save: backend result persistence will replace this simulated delay.
    await new Promise((resolve) => setTimeout(resolve, 600))
    resultEntryValue.value = createResultValue(result)
    showSuccess.value = true
  } catch {
    errorMessage.value = t('sportMatchesManagement.resultsEntry.saveFailed')
    showError.value = true
  } finally {
    isSubmitting.value = false
  }
}

function goBackToMatches() {
  router.push({ name: 'dashboard-sport-admin-matches' })
}

function onUpdateMatch(match) {
  const id = String(match?.id || '').trim()
  if (!id) return
  // Route back into the per-match result entry flow.
  router.push({ name: 'dashboard-sport-admin-matches-results', params: { id } })
}
</script>

<template>
  <MainLayout>
    <section :class="isKh ? 'matches-result-entry matches-result-entry--kh' : 'matches-result-entry'">
      <HeaderSection :title="pageTitle" :subtitle="pageSubtitle" />

      <div class="matches-result-entry__shell">
        <FixtureSummaryCard
          :home-team="fixtureSummary.homeTeam"
          :away-team="fixtureSummary.awayTeam"
          :match-date="fixtureSummary.matchDate"
          :match-time="fixtureSummary.matchTime"
          :venue="fixtureSummary.venue"
          :competition="fixtureSummary.competition"
        />

        <ResultEntryPanel
          v-model="resultEntryValue"
          :loading="isSubmitting"
          :readonly="isSubmitting"
          :status-options="statusOptions"
          @save="onSaveResult"
          @cancel="goBackToMatches"
        />
      </div>

      <!-- Result list is included here for quick navigation across fixtures while entering results. -->
      <div class="mt-6">
        <ResultListCard
          :matches="resultListMatches"
          :loading="false"
          :filters="resultListFilters"
          :title="t('sportMatchesManagement.resultList.title')"
          :export-label="t('sportMatchesManagement.resultList.exportLabel')"
          :search-placeholder="t('sportMatchesManagement.resultList.searchPlaceholder')"
          :search-label="t('sportMatchesManagement.resultList.searchLabel')"
          :status-label="t('sportMatchesManagement.resultList.statusLabel')"
          :status-options="resultListStatusOptions"
          :empty-text="t('sportMatchesManagement.resultList.empty')"
          :table-labels="resultListLabels"
          :action-label="t('sportMatchesManagement.resultList.actionLabel')"
          @update:filters="resultListFilters = $event"
          @update-match="onUpdateMatch"
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

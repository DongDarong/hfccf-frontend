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
import MatchResultActions from '@/modules/sport/admin/components/match-results/MatchResultActions.vue'
import MatchResultFields from '@/modules/sport/admin/components/match-results/MatchResultFields.vue'
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
const homeScore = ref(0)
const awayScore = ref(0)
const resultStatus = ref('completed')
const resultNote = ref('')

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

const scorePreview = computed(() => `${Number(homeScore.value || 0)} - ${Number(awayScore.value || 0)}`)
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
const fieldLabels = computed(() => ({
  homeScore: t('sportMatchesManagement.resultsEntry.homeScore'),
  awayScore: t('sportMatchesManagement.resultsEntry.awayScore'),
  resultStatus: t('sportMatchesManagement.resultsEntry.resultStatus'),
  resultNote: t('sportMatchesManagement.resultsEntry.resultNote'),
}))
const fieldPlaceholders = computed(() => ({
  resultNote: t('sportMatchesManagement.resultsEntry.resultNotePlaceholder'),
}))

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
    homeScore.value = score.home
    awayScore.value = score.away
    resultStatus.value = String(match.status || 'completed')
  },
  { immediate: true },
)

function resetFeedback() {
  errorMessage.value = ''
  showError.value = false
}

function validateResult() {
  if (!selectedMatch.value) return t('sportMatchesManagement.resultsEntry.validation.matchRequired')
  if (Number(homeScore.value) < 0 || Number(awayScore.value) < 0) {
    return t('sportMatchesManagement.resultsEntry.validation.scoreInvalid')
  }
  if (!resultStatus.value) return t('sportMatchesManagement.resultsEntry.validation.statusRequired')
  return ''
}

async function onSubmit() {
  resetFeedback()
  const validationError = validateResult()
  if (validationError) {
    errorMessage.value = validationError
    showError.value = true
    return
  }

  isSubmitting.value = true
  try {
    // UI-only save: backend result persistence will replace this simulated delay.
    await new Promise((resolve) => setTimeout(resolve, 600))
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
</script>

<template>
  <MainLayout>
    <section :class="isKh ? 'matches-result-entry matches-result-entry--kh' : 'matches-result-entry'">
      <HeaderSection :title="pageTitle" :subtitle="pageSubtitle" />

      <form class="matches-result-entry__shell" @submit.prevent="onSubmit">
        <FixtureSummaryCard
          :home-team="fixtureSummary.homeTeam"
          :away-team="fixtureSummary.awayTeam"
          :match-date="fixtureSummary.matchDate"
          :match-time="fixtureSummary.matchTime"
          :venue="fixtureSummary.venue"
          :competition="fixtureSummary.competition"
        />

        <div class="matches-result-entry__score-preview" aria-live="polite">
          <span>{{ t('sportMatchesManagement.resultsEntry.scorePreview') }}</span>
          <strong>{{ scorePreview }}</strong>
        </div>

        <MatchResultFields
          v-model:home-score="homeScore"
          v-model:away-score="awayScore"
          v-model:result-status="resultStatus"
          v-model:result-note="resultNote"
          :status-options="statusOptions"
          :labels="fieldLabels"
          :placeholders="fieldPlaceholders"
        />

        <MatchResultActions
          :loading="isSubmitting"
          :cancel-text="t('common.cancel')"
          :submit-text="t('sportMatchesManagement.resultsEntry.saveButton')"
          @cancel="goBackToMatches"
        />
      </form>

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

.matches-result-entry__score-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: #ffffff;
  color: #1d1d1b;
}

.matches-result-entry__score-preview span {
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.matches-result-entry__score-preview strong {
  color: #00aeef;
  font-size: 1.2rem;
  font-weight: 900;
}

.matches-result-entry--kh,
.matches-result-entry--kh :deep(input),
.matches-result-entry--kh :deep(.p-select-label) {
  font-family:
    'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
}

@media (max-width: 720px) {
  .matches-result-entry__score-preview {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

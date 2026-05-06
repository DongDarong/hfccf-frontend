<script setup>
/**
 * SportAdminMatchesResultEntryPage
 * UI-only result entry page for a selected match.
 *
 * Future backend integration should persist these fields against `sport_matches`
 * and related match result/stat tables.
 */
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import AlertError from '@/components/alerts/AlertError.vue'
import { useLanguage } from '@/composables/useLanguage'
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
        <div class="matches-result-entry__summary">
          <div>
            <p class="matches-result-entry__eyebrow">
              {{ selectedMatch?.id || t('sportMatchesManagement.resultsEntry.noMatch') }}
            </p>
            <h3 class="matches-result-entry__teams">
              {{ selectedMatch?.homeTeam || '-' }} vs {{ selectedMatch?.awayTeam || '-' }}
            </h3>
            <p class="matches-result-entry__meta">
              {{ selectedMatch?.schedule || '-' }} · {{ selectedMatch?.venue || '-' }}
            </p>
          </div>
          <span class="matches-result-entry__score">{{ scorePreview }}</span>
        </div>

        <div class="matches-result-entry__grid">
          <label class="matches-result-entry__field">
            <span class="matches-result-entry__label">
              {{ t('sportMatchesManagement.resultsEntry.homeScore') }}
            </span>
            <InputText v-model="homeScore" type="number" min="0" class="w-full" />
          </label>

          <label class="matches-result-entry__field">
            <span class="matches-result-entry__label">
              {{ t('sportMatchesManagement.resultsEntry.awayScore') }}
            </span>
            <InputText v-model="awayScore" type="number" min="0" class="w-full" />
          </label>

          <label class="matches-result-entry__field">
            <span class="matches-result-entry__label">
              {{ t('sportMatchesManagement.resultsEntry.resultStatus') }}
            </span>
            <Select
              v-model="resultStatus"
              :options="statusOptions"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </label>

          <label class="matches-result-entry__field">
            <span class="matches-result-entry__label">
              {{ t('sportMatchesManagement.resultsEntry.resultNote') }}
            </span>
            <InputText
              v-model="resultNote"
              type="text"
              :placeholder="t('sportMatchesManagement.resultsEntry.resultNotePlaceholder')"
              class="w-full"
            />
          </label>
        </div>

        <div class="matches-result-entry__actions">
          <Button type="button" variant="outline" rounded="xl" :disabled="isSubmitting" @click="goBackToMatches">
            {{ t('common.cancel') }}
          </Button>
          <Button type="submit" variant="primary" rounded="xl" :loading="isSubmitting">
            {{ t('sportMatchesManagement.resultsEntry.saveButton') }}
          </Button>
        </div>
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

.matches-result-entry__summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid #dbe6f4;
  background: #ffffff;
}

.matches-result-entry__eyebrow,
.matches-result-entry__label {
  margin: 0;
  color: #475569;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.matches-result-entry__teams {
  margin: 0.35rem 0 0;
  color: #0f172a;
  font-size: 1.1rem;
  font-weight: 800;
}

.matches-result-entry__meta {
  margin: 0.3rem 0 0;
  color: #64748b;
  font-size: 0.9rem;
}

.matches-result-entry__score {
  flex: 0 0 auto;
  border-radius: 0.9rem;
  background: #f8fafc;
  padding: 0.75rem 1rem;
  color: #0f172a;
  font-size: 1.35rem;
  font-weight: 900;
}

.matches-result-entry__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.matches-result-entry__field {
  display: grid;
  gap: 0.45rem;
}

.matches-result-entry__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.75rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
}

.matches-result-entry--kh,
.matches-result-entry--kh :deep(input),
.matches-result-entry--kh :deep(.p-select-label) {
  font-family:
    'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
}

@media (max-width: 720px) {
  .matches-result-entry__summary {
    align-items: flex-start;
    flex-direction: column;
  }

  .matches-result-entry__grid {
    grid-template-columns: 1fr;
  }

  .matches-result-entry__actions {
    justify-content: stretch;
  }
}
</style>

<script setup>
/**
 * SportAdminAddMatchPage
 * Placeholder shell for creating a new match record.
 *
 * The full match form will be introduced later; for now this page exists so the
 * Manage Matches "Add Match" action has a valid destination.
 */
import { computed, ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import AlertError from '@/components/alerts/AlertError.vue'
import { useLanguage } from '@/composables/useLanguage'
import FormMatche from '@/modules/sport/admin/components/add-match/FormMatche.vue'
import teamsManagementData from '@/mocks/sport/teams-management-data.json'

defineOptions({
  name: 'SportAdminAddMatchPage',
})

const { t, language } = useLanguage()
const isKh = computed(() => language.value === 'KH')

const pageTitle = computed(() => t('sportMatchesManagement.addTitle'))
const pageSubtitle = computed(() => t('sportMatchesManagement.addSubtitle'))
const isSubmitting = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const errorMessage = ref('')
const competitionType = ref('')
const tournament = ref('')
const dateTime = ref('')
const venue = ref('')
const status = ref('scheduled')
const homeTeam = ref('')
const awayTeam = ref('')

const competitionTypeOptions = computed(() => [
  { value: 'tournament', label: t('sportMatchesManagement.competitionTypes.tournament') },
  { value: 'friendly', label: t('sportMatchesManagement.competitionTypes.friendly') },
])

const tournamentOptions = computed(() => [
  { value: 'hfccf_cup_2026', label: 'HFCCF Cup 2026' },
  { value: 'friendly_league', label: 'Friendly League' },
  { value: 'summer_showcase', label: 'Summer Showcase' },
])

const statusOptions = computed(() => [
  { value: 'scheduled', label: t('sportMatchesManagement.status.scheduled') },
  { value: 'live', label: t('sportMatchesManagement.status.live') },
  { value: 'completed', label: t('sportMatchesManagement.status.completed') },
  { value: 'postponed', label: t('sportMatchesManagement.status.postponed') },
  { value: 'cancelled', label: t('sportMatchesManagement.status.cancelled') },
])

const teamOptions = computed(() => {
  // Reuse the live team directory so match team selection stays aligned with sport data.
  const teams = Array.isArray(teamsManagementData) ? teamsManagementData : []
  const values = teams
    .map((item) => String(item?.name || '').trim())
    .filter(Boolean)
  return [...new Set(values)].sort()
})

function resetFeedback() {
  errorMessage.value = ''
  showError.value = false
}

async function onSubmit() {
  resetFeedback()

  // Keep the placeholder form honest: a match cannot use the same team twice.
  if (homeTeam.value && homeTeam.value === awayTeam.value) {
    errorMessage.value = t('sportMatchesManagement.teamSelectionError')
    showError.value = true
    return
  }

  isSubmitting.value = true

  try {
    // Placeholder submit: the real match form will replace this shell later.
    await new Promise((resolve) => setTimeout(resolve, 700))
    showSuccess.value = true
  } catch {
    errorMessage.value = t('sportMatchesManagement.addFailed')
    showError.value = true
  } finally {
    isSubmitting.value = false
  }
}

function onErrorClose() {
  showError.value = false
}

function onSuccessClose() {
  showSuccess.value = false
}
</script>

<template>
  <MainLayout>
    <section :class="isKh ? 'add-match-page add-match-page--kh' : 'add-match-page'">
      <HeaderSection :title="pageTitle" :subtitle="pageSubtitle" />

      <div class="add-match-page__shell">
        <FormMatche
          :title="pageTitle"
          :description="''"
          :submit-text="t('sportMatchesManagement.actions.addButton')"
          :loading="isSubmitting"
          :competition-type="competitionType"
          :competition-type-options="competitionTypeOptions"
          :tournament="tournament"
          :tournament-options="tournamentOptions"
          :date-time="dateTime"
          :venue="venue"
          :status="status"
          :home-team="homeTeam"
          :away-team="awayTeam"
          :team-options="teamOptions"
          :status-options="statusOptions"
          @update:competition-type="competitionType = $event"
          @update:tournament="tournament = $event"
          @update:date-time="dateTime = $event"
          @update:venue="venue = $event"
          @update:status="status = $event"
          @update:home-team="homeTeam = $event"
          @update:away-team="awayTeam = $event"
          @submit="onSubmit"
        />
      </div>
    </section>

    <AlertError
      :show="showError"
      :title="t('sportMatchesManagement.addErrorTitle')"
      :message="errorMessage || t('common.errorTryAgain')"
      :button-text="t('common.close')"
      @close="onErrorClose"
    />

    <AlertSuccess
      :show="showSuccess"
      :title="t('sportMatchesManagement.addSuccessTitle')"
      :message="t('sportMatchesManagement.addSuccessMessage')"
      :button-text="t('common.close')"
      @close="onSuccessClose"
    />
  </MainLayout>
</template>

<style scoped>
.add-match-page {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.add-match-page__shell {
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid #dce6f2;
  background:
    radial-gradient(circle at top left, rgba(186, 230, 253, 0.18), transparent 24%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.5);
}

.add-match-page--kh .add-match-page__shell {
  font-family:
    'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
}
</style>

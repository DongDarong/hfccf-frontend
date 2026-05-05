<script setup>
/**
 * SportAdminManageMatchesPage
 * Placeholder page for match management (fixtures / live match feeds).
 * UI-only for now: future backend integration will use `sport_matches` and related tournament tables.
 */
import { computed, ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'
import MatchesSearchFilterBar from '@/modules/sport/admin/components/matches-management/MatchesSearchFilterBar.vue'
import MatchesTable from '@/modules/sport/admin/components/matches-management/MatchesTable.vue'
import PlayerInfoToolbar from '@/modules/sport/admin/components/player-management/PlayerInfoToolbar.vue'

defineOptions({
  name: 'SportAdminManageMatchesPage',
})

const { t, language } = useLanguage()
const isKh = computed(() => language.value === 'KH')

const title = computed(() => t('sportMatchesManagement.title'))
const subtitle = computed(() => t('sportMatchesManagement.subtitle'))
const tableEmptyText = computed(() => t('sportMatchesManagement.table.empty'))

// Filter state (UI-only until the matches table/list is implemented).
const searchQuery = ref('')
const competition = ref('')
const tournament = ref('')
const matchDateInput = ref('')

// Placeholder options: these will come from the backend/API later.
const competitionOptions = ['U-18 Premier', 'U-16 Elite', 'Senior Development']
const tournamentOptions = ['HFCCF Cup 2026', 'Friendly League']

// UI-only mock data until backend API is connected.
const matches = ref([
  {
    id: 'M-0001',
    competition: 'U-18 Premier',
    tournament: 'HFCCF Cup 2026',
    homeTeam: 'Victory Academy',
    awayTeam: 'HFCCF Juniors',
    score: '2 - 1',
    schedule: '2026-05-06 15:30',
    venue: 'Main Stadium',
    status: 'completed',
  },
  {
    id: 'M-0002',
    competition: 'U-16 Elite',
    tournament: 'Friendly League',
    homeTeam: 'Youth Stars',
    awayTeam: 'Victory Academy',
    score: '- - -',
    schedule: '2026-05-09 09:00',
    venue: 'Training Ground A',
    status: 'scheduled',
  },
  {
    id: 'M-0003',
    competition: 'Senior Development',
    tournament: 'HFCCF Cup 2026',
    homeTeam: 'HFCCF Seniors',
    awayTeam: 'City Academy',
    score: '0 - 0',
    schedule: '2026-05-10 18:00',
    venue: 'City Stadium',
    status: 'live',
  },
])

function normalize(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
}

const toolbarEyebrow = computed(() => t('sportMatchesManagement.toolbarEyebrow'))

const filteredMatches = computed(() => {
  // Filtering lives on the page so it can evolve with API parameters later.
  const query = normalize(searchQuery.value)

  return matches.value.filter((match) => {
    let isMatch = true

    if (query) {
      const haystack = normalize(
        `${match.id} ${match.homeTeam} ${match.awayTeam} ${match.venue} ${match.tournament} ${match.competition}`,
      )
      isMatch = haystack.includes(query)
    }

    if (isMatch && competition.value) {
      isMatch = normalize(match.competition) === normalize(competition.value)
    }

    if (isMatch && tournament.value) {
      isMatch = normalize(match.tournament) === normalize(tournament.value)
    }

    if (isMatch && matchDateInput.value) {
      // Keep it simple: match schedule starts with YYYY-MM-DD for now.
      isMatch = String(match.schedule || '').startsWith(matchDateInput.value)
    }

    return isMatch
  })
})

const totalMatches = computed(() => matches.value.length)
const liveMatches = computed(
  () => matches.value.filter((match) => normalize(match.status) === 'live').length,
)

const toolbarSummary = computed(() =>
  t('sportMatchesManagement.toolbarSummary', { count: filteredMatches.value.length }),
)

const visibleRangeLabel = computed(() => {
  if (!filteredMatches.value.length) return t('sportMatchesManagement.noResults')
  return t('sportMatchesManagement.visibleRange', {
    shown: filteredMatches.value.length,
    total: totalMatches.value,
  })
})

const spotlightLabel = computed(() => t('sportMatchesManagement.spotlightLabel'))

function onResults(match) {
  // UI-only placeholder: future implementation can route to a match details/results page.
  // Keeping the handler here avoids baking navigation into the table component.
  void match
}

function onEdit(match) {
  // UI-only placeholder: future implementation can open an edit dialog or navigate to edit page.
  void match
}

function onDelete(match) {
  const id = String(match?.id || '').trim()
  if (!id) return
  matches.value = matches.value.filter((item) => item.id !== id)
}
</script>

<template>
  <MainLayout>
    <section :class="isKh ? 'manage-matches-page manage-matches-page--kh' : 'manage-matches-page'">
      <HeaderSection :title="title" :subtitle="subtitle" />

      <div class="manage-matches-page__shell">
        <!-- Toolbar matches the hierarchy used by Teams/Players pages for consistent UX. -->
        <PlayerInfoToolbar
          :eyebrow="toolbarEyebrow"
          :title="toolbarSummary"
          :text="visibleRangeLabel"
          :spotlight-label="spotlightLabel"
          :spotlight-value="String(liveMatches)"
        />

        <MatchesSearchFilterBar
          v-model:searchQuery="searchQuery"
          v-model:competition="competition"
          v-model:tournament="tournament"
          v-model:matchDateInput="matchDateInput"
          :competition-options="competitionOptions"
          :tournament-options="tournamentOptions"
        />

        <div class="mt-5">
          <MatchesTable
            :matches="filteredMatches"
            :t="t"
            :empty-text="tableEmptyText"
            @results="onResults"
            @edit="onEdit"
            @delete="onDelete"
          />
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.manage-matches-page {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.manage-matches-page__shell {
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid #dce6f2;
  background:
    radial-gradient(circle at top left, rgba(186, 230, 253, 0.18), transparent 24%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.5);
}

.manage-matches-page__hint {
  margin: 0;
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.7;
}

.manage-matches-page--kh .manage-matches-page__shell {
  font-family:
    'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
}
</style>

<script setup>
/**
 * SportAdminManageMatchesPage
 * Placeholder page for match management (fixtures / live match feeds).
 * UI-only for now: future backend integration will use `sport_matches` and related tournament tables.
 */
import { computed, ref, watch } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'
import MatchesSearchFilterBar from '@/modules/sport/admin/components/matches-management/MatchesSearchFilterBar.vue'
import MatchesTable from '@/modules/sport/admin/components/matches-management/MatchesTable.vue'
import PlayerInfoToolbar from '@/modules/sport/admin/components/player-management/PlayerInfoToolbar.vue'
import Pagination from '@/components/data-display/Pagination.vue'
import matchesData from '@/mocks/sport/matches-management-data.json'

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
const currentPage = ref(1)

// Keep pagination consistent with other Sport Admin list pages.
const pageSize = 8

// Placeholder options: these will come from the backend/API later.
const matches = ref(Array.isArray(matchesData) ? [...matchesData] : [])

const competitionOptions = computed(() => {
  const options = matches.value.map((match) => match.competition).filter(Boolean)
  return [...new Set(options)].sort()
})

const tournamentOptions = computed(() => {
  const options = matches.value.map((match) => match.tournament).filter(Boolean)
  return [...new Set(options)].sort()
})

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

const totalPages = computed(() => Math.max(Math.ceil(filteredMatches.value.length / pageSize), 1))
const paginatedMatches = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredMatches.value.slice(start, start + pageSize)
})

// Reset pagination when filters change (avoids landing on an empty page).
watch(
  () => filteredMatches.value.length,
  () => {
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  },
)

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
            :matches="paginatedMatches"
            :t="t"
            :empty-text="tableEmptyText"
            @results="onResults"
            @edit="onEdit"
            @delete="onDelete"
          />

          <!-- Pagination stays outside the table so the table component stays presentation-only. -->
          <div v-if="totalPages > 1" class="mt-4 flex justify-end">
            <Pagination v-model="currentPage" :total-pages="totalPages" />
          </div>
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

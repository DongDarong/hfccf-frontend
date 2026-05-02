<script setup>
/**
 * SportAdminManagesPlayerInforPage
 * The main container for managing player information.
 * Handles data fetching (mock), filtering, and coordination between sub-components.
 */
import { computed, ref, watch } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import SearchFilterBar from '@/components/forms/SearchFilterBar.vue'
import Button from 'primevue/button'
import { useLanguage } from '@/composables/useLanguage'
import playersData from '@/mocks/sport/players-management-data.json'

// Sub-components
import PlayerStatsCards from '../components/player-management/PlayerStatsCards.vue'
import PlayerInfoToolbar from '../components/player-management/PlayerInfoToolbar.vue'
import PlayerHighlights from '../components/player-management/PlayerHighlights.vue'
import PlayerTable from '../components/player-management/PlayerTable.vue'

defineOptions({
  name: 'SportAdminManagesPlayerInforPage',
})

// i18n and global state
const { t, language } = useLanguage()
const isKh = computed(() => language.value === 'KH')

// Filter and Pagination state
const searchQuery = ref('')
const statusFilter = ref('')
const divisionFilter = ref('')
const currentPage = ref(1)
const pageSize = 8
const statusOptions = ['active', 'pending', 'inactive', 'suspended']

const divisionOptions = computed(() => {
  const divisions = playerRecords.value.map((p) => p.division).filter(Boolean)
  return [...new Set(divisions)].sort()
})

// Computed labels for i18n
const pageTitle = computed(() => t('sportPlayerInformation.title'))
const pageSubtitle = computed(() => t('sportPlayerInformation.subtitle'))
const searchPlaceholder = computed(() => t('sportPlayerInformation.searchPlaceholder'))
const tableEmptyText = computed(() => t('sportPlayerInformation.tableEmpty'))
const toolbarEyebrow = computed(() => t('sportPlayerInformation.toolbarEyebrow'))
const activeRateTitle = computed(() => t('sportPlayerInformation.activeRateLabel'))

// Data Source - Keep as ref so it can be updated by an API later
const playerRecords = ref(Array.isArray(playersData) ? [...playersData] : [])

/**
 * Helper to normalize strings for searching and comparison
 */
function normalize(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
}

/**
 * Filtered players based on search query and status filter
 */
const filteredPlayers = computed(() => {
  const query = normalize(searchQuery.value)

  return playerRecords.value.filter((player) => {
    let isMatch = true

    if (query) {
      const haystack = normalize(player.name)
      isMatch = haystack.includes(query)
    }

    if (isMatch && statusFilter.value) {
      isMatch = normalize(player.status) === normalize(statusFilter.value)
    }

    if (isMatch && divisionFilter.value) {
      isMatch = normalize(player.division) === normalize(divisionFilter.value)
    }

    return isMatch
  })
})

// Pagination logic
const totalPages = computed(() => Math.max(Math.ceil(filteredPlayers.value.length / pageSize), 1))
const paginatedPlayers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPlayers.value.slice(start, start + pageSize).map((player, index) => ({
    ...player,
    rowNumber: start + index + 1,
  }))
})

// Summary metrics
const totalPlayers = computed(() => playerRecords.value.length)
const activePlayers = computed(
  () => playerRecords.value.filter((player) => normalize(player.status) === 'active').length,
)
const pendingPlayers = computed(
  () => playerRecords.value.filter((player) => normalize(player.status) === 'pending').length,
)
const attentionPlayers = computed(
  () =>
    playerRecords.value.filter((player) =>
      ['inactive', 'suspended'].includes(normalize(player.status)),
    ).length,
)

// Formatting metrics
const activeRateLabel = computed(() => {
  if (!totalPlayers.value) return '0%'
  return `${Math.round((activePlayers.value / totalPlayers.value) * 100)}%`
})

const toolbarSummary = computed(() =>
  t('sportPlayerInformation.toolbarSummary', { count: filteredPlayers.value.length }),
)

const visibleRangeLabel = computed(() => {
  if (!filteredPlayers.value.length) return t('sportPlayerInformation.noResults')

  const start = (currentPage.value - 1) * pageSize + 1
  const end = Math.min(currentPage.value * pageSize, filteredPlayers.value.length)
  return t('sportPlayerInformation.visibleRange', {
    start,
    end,
    total: filteredPlayers.value.length,
  })
})

/**
 * Configuration for the summary cards
 */
const summaryCards = computed(() => [
  {
    id: 'total',
    title: t('sportPlayerInformation.summary.total.title'),
    value: totalPlayers.value,
    badge: t('sportPlayerInformation.summary.total.badge', { count: filteredPlayers.value.length }),
    caption: t('sportPlayerInformation.summary.total.caption'),
    tone: 'info',
    icon:
      'M12 2a5 5 0 00-5 5v1a5 5 0 0010 0V7a5 5 0 00-5-5zm0 12c-4.418 0-8 1.79-8 4v4h16v-4c0-2.21-3.582-4-8-4z',
  },
  {
    id: 'active',
    title: t('sportPlayerInformation.summary.active.title'),
    value: activePlayers.value,
    badge: t('sportPlayerInformation.summary.active.badge', { rate: activeRateLabel.value }),
    caption: t('sportPlayerInformation.summary.active.caption'),
    tone: 'success',
    icon: 'M5 13l4 4L19 7',
  },
  {
    id: 'pending',
    title: t('sportPlayerInformation.summary.pending.title'),
    value: pendingPlayers.value,
    badge: pendingPlayers.value
      ? t('sportPlayerInformation.summary.pending.badge')
      : t('sportPlayerInformation.summary.pending.badgeClear'),
    caption: t('sportPlayerInformation.summary.pending.caption'),
    tone: 'warning',
    icon:
      'M12 8v4m0 4h.01M10.3 3.86l-7.5 13a1 1 0 00.87 1.5h16.66a1 1 0 00.87-1.5l-7.5-13a1 1 0 00-1.74 0z',
  },
  {
    id: 'attention',
    title: t('sportPlayerInformation.summary.attention.title'),
    value: attentionPlayers.value,
    badge: attentionPlayers.value
      ? t('sportPlayerInformation.summary.attention.badge')
      : t('sportPlayerInformation.summary.attention.badgeClear'),
    caption: t('sportPlayerInformation.summary.attention.caption'),
    tone: 'danger',
    icon: 'M6 18L18 6M6 6l12 12',
  },
])

/**
 * Configuration for the highlights section
 */
const highlightItems = computed(() => [
  {
    label: t('sportPlayerInformation.highlights.visiblePlayers'),
    value: filteredPlayers.value.length,
  },
  {
    label: t('sportPlayerInformation.highlights.divisions'),
    value: new Set(filteredPlayers.value.map((player) => player.division).filter(Boolean)).size,
  },
  {
    label: t('sportPlayerInformation.highlights.attentionItems'),
    value: filteredPlayers.value.filter((player) =>
      ['inactive', 'suspended'].includes(normalize(player.status)),
    ).length,
  },
])

// Reset pagination when filter changes
watch(
  () => filteredPlayers.value.length,
  () => {
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  },
)
</script>

<template>
  <MainLayout>
    <section :class="isKh ? 'player-info-page player-info-page--kh' : 'player-info-page'">
      <HeaderSection :title="pageTitle" :subtitle="pageSubtitle" />

      <!-- Top Summary Cards -->
      <PlayerStatsCards :cards="summaryCards" />

      <div class="player-info-page__shell">
        <!-- Page Toolbar with active rate spotlight -->
        <PlayerInfoToolbar
          :eyebrow="toolbarEyebrow"
          :title="toolbarSummary"
          :text="visibleRangeLabel"
          :spotlight-label="activeRateTitle"
          :spotlight-value="activeRateLabel"
        >
          <template #actions>
            <Button
              type="button"
              :label="t('sportPlayerInformation.addButton')"
              icon="pi pi-plus"
              class="player-info-page__add-button"
              @click="() => {}"
            />
          </template>
        </PlayerInfoToolbar>

        <!-- Filter Bar -->
        <SearchFilterBar
          class="w-full"
          v-model:searchQuery="searchQuery"
          v-model:statusFilter="statusFilter"
          v-model:divisionFilter="divisionFilter"
          :search-placeholder="searchPlaceholder"
          :status-options="statusOptions"
          :division-options="divisionOptions"
          :show-role-filter="false"
          :show-division-filter="true"
        />

        <!-- Quick Stats Highlights -->
        <PlayerHighlights :items="highlightItems" />

        <!-- Main Data Table -->
        <PlayerTable
          v-model:currentPage="currentPage"
          :players="paginatedPlayers"
          :t="t"
          :empty-text="tableEmptyText"
          :total-pages="totalPages"
        />
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.player-info-page {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.player-info-page__shell {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid #dce6f2;
  background:
    radial-gradient(circle at top left, rgba(186, 230, 253, 0.18), transparent 24%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.5);
}

.player-info-page__add-button {
  min-height: 2.8rem;
  border-radius: 0.9rem;
  font-weight: 800;
}

/* Khmer Support Styles */
.player-info-page--kh .player-info-page__shell {
  font-family:
    'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
}

@media (max-width: 640px) {
  .player-info-page__shell {
    padding: 1.1rem;
  }
}
</style>

<script setup>
import { computed, ref, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Avatar from 'primevue/avatar'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import SearchFilterBar from '@/components/forms/SearchFilterBar.vue'
import Pagination from '@/components/data-display/Pagination.vue'
import StatusBadge from '@/components/badges/StatusBadge.vue'
import { useLanguage } from '@/composables/useLanguage'
import playersData from '@/mocks/sport/players-management-data.json'

defineOptions({
  name: 'SportAdminManagesPlayerInforPage',
})

const { t, language } = useLanguage()
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)

const pageSize = 8
const isKh = computed(() => language.value === 'KH')
const statusOptions = ['active', 'pending', 'inactive', 'suspended']

const pageTitle = computed(() => t('sportPlayerInformation.title'))
const pageSubtitle = computed(() => t('sportPlayerInformation.subtitle'))
const searchPlaceholder = computed(() => t('sportPlayerInformation.searchPlaceholder'))
const tableEmptyText = computed(() => t('sportPlayerInformation.tableEmpty'))
const toolbarEyebrow = computed(() => t('sportPlayerInformation.toolbarEyebrow'))
const activeRateTitle = computed(() => t('sportPlayerInformation.activeRateLabel'))

// Keep players as standalone data records so the future API can replace this mock file directly.
const playerRecords = ref(Array.isArray(playersData) ? [...playersData] : [])

function normalize(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
}

function statusType(status) {
  const value = normalize(status)
  if (value === 'active') return 'success'
  if (value === 'pending') return 'pending'
  if (value === 'inactive') return 'warning'
  if (value === 'suspended') return 'danger'
  return 'info'
}

function initials(name) {
  return (
    String(name ?? '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || '?'
  )
}

const filteredPlayers = computed(() => {
  const query = normalize(searchQuery.value)

  return playerRecords.value.filter((player) => {
    let isMatch = true

    if (query) {
      const haystack = normalize(
        `${player.name} ${player.team} ${player.division} ${player.position} ${player.jerseyNumber} ${player.age} ${player.status}`,
      )
      isMatch = haystack.includes(query)
    }

    if (isMatch && statusFilter.value) {
      isMatch = normalize(player.status) === normalize(statusFilter.value)
    }

    return isMatch
  })
})

const totalPages = computed(() => Math.max(Math.ceil(filteredPlayers.value.length / pageSize), 1))
const paginatedPlayers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPlayers.value.slice(start, start + pageSize).map((player, index) => ({
    ...player,
    rowNumber: start + index + 1,
  }))
})

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
const highlightItems = computed(() => [
  {
    label: t('sportPlayerInformation.highlights.visiblePlayers'),
    value: filteredPlayers.value.length,
  },
  {
    label: t('sportPlayerInformation.highlights.teams'),
    value: new Set(filteredPlayers.value.map((player) => player.team).filter(Boolean)).size,
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

watch(
  () => filteredPlayers.value.length,
  () => {
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  },
)
</script>

<template>
  <MainLayout>
    <section :class="isKh ? 'player-information-page player-information-page--kh' : 'player-information-page'">
      <HeaderSection :title="pageTitle" :subtitle="pageSubtitle" />

      <div class="player-information-page__summary-grid">
        <article
          v-for="card in summaryCards"
          :key="card.id"
          class="player-information-page__summary-card"
          :class="`player-information-page__summary-card--${card.tone}`"
        >
          <div class="player-information-page__summary-header">
            <div>
              <p class="player-information-page__summary-title">{{ card.title }}</p>
              <p class="player-information-page__summary-value">{{ card.value }}</p>
            </div>

            <span class="player-information-page__summary-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path :d="card.icon" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>

          <p class="player-information-page__summary-badge">{{ card.badge }}</p>
          <p class="player-information-page__summary-caption">{{ card.caption }}</p>
        </article>
      </div>

      <div class="player-information-page__shell">
        <div class="player-information-page__toolbar">
          <div class="player-information-page__toolbar-copy">
            <p class="player-information-page__eyebrow">{{ toolbarEyebrow }}</p>
            <h2 class="player-information-page__toolbar-title">{{ toolbarSummary }}</h2>
            <p class="player-information-page__toolbar-text">{{ visibleRangeLabel }}</p>
          </div>

          <div class="player-information-page__toolbar-actions">
            <div class="player-information-page__spotlight">
              <span class="player-information-page__spotlight-label">{{ activeRateTitle }}</span>
              <strong class="player-information-page__spotlight-value">{{ activeRateLabel }}</strong>
            </div>
          </div>
        </div>

        <SearchFilterBar
          class="w-full"
          v-model:searchQuery="searchQuery"
          v-model:statusFilter="statusFilter"
          :search-placeholder="searchPlaceholder"
          :status-options="statusOptions"
          :show-role-filter="false"
        />

        <div class="player-information-page__highlights">
          <div v-for="item in highlightItems" :key="item.label" class="player-information-page__highlight">
            <span class="player-information-page__highlight-label">{{ item.label }}</span>
            <strong class="player-information-page__highlight-value">{{ item.value }}</strong>
          </div>
        </div>

        <DataTable
          :value="paginatedPlayers"
          data-key="id"
          striped-rows
          removable-sort
          class="player-information-page__table"
        >
          <template #empty>
            <div class="px-4 py-7 text-center text-sm text-surface-500">
              {{ tableEmptyText }}
            </div>
          </template>

          <Column field="rowNumber" :header="t('common.table.number')">
            <template #body="{ data }">
              <span class="text-[12px] font-semibold text-surface-700 sm:text-sm">
                {{ data.rowNumber }}
              </span>
            </template>
          </Column>

          <Column field="name" :header="t('sportPlayerInformation.table.player')">
            <template #body="{ data }">
              <div class="flex items-center gap-3">
                <Avatar
                  :label="initials(data.name)"
                  shape="circle"
                  class="player-information-page__avatar"
                />
                <div>
                  <div class="text-[13px] font-semibold leading-5 text-surface-900 sm:text-sm">
                    {{ data.name }}
                  </div>
                  <div class="text-[11px] text-surface-500 sm:text-xs">
                    {{ data.position }}
                  </div>
                </div>
              </div>
            </template>
          </Column>

          <Column field="team" :header="t('sportPlayerInformation.table.team')" />

          <Column field="division" :header="t('sportPlayerInformation.table.division')" />

          <Column field="position" :header="t('sportPlayerInformation.table.position')" />

          <Column field="jerseyNumber" :header="t('sportPlayerInformation.table.jersey')" />

          <Column field="age" :header="t('sportPlayerInformation.table.age')" />

          <Column field="stats" :header="t('sportPlayerInformation.table.stats')">
            <template #body="{ data }">
              <span class="font-semibold text-slate-700">
                {{ data.matchesPlayed }} / {{ data.goalsScored }}
              </span>
            </template>
          </Column>

          <Column field="status" :header="t('common.table.status')">
            <template #body="{ data }">
              <StatusBadge :status="statusType(data.status)" :label="data.status" size="sm" />
            </template>
          </Column>
        </DataTable>

        <div v-if="totalPages > 1" class="flex justify-end">
          <Pagination v-model="currentPage" :total-pages="totalPages" class="mt-2" />
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.player-information-page {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.player-information-page__summary-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.player-information-page__summary-card {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 100%;
  padding: 1.35rem;
  border-radius: 1.35rem;
  border: 1px solid #dbe6f4;
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.92), transparent 34%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(244, 248, 252, 0.98) 100%);
  box-shadow: 0 24px 48px -38px rgba(15, 23, 42, 0.45);
}

.player-information-page__summary-card::after {
  content: '';
  position: absolute;
  inset: auto 1.35rem 0.9rem 1.35rem;
  height: 0.25rem;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.16;
}

.player-information-page__summary-card--info {
  color: #0f6f8f;
}

.player-information-page__summary-card--success {
  color: #2f7a42;
}

.player-information-page__summary-card--warning {
  color: #9a5d09;
}

.player-information-page__summary-card--danger {
  color: #b42318;
}

.player-information-page__summary-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.9rem;
}

.player-information-page__summary-title {
  margin: 0;
  color: #64748b;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.player-information-page__summary-value {
  margin: 0.65rem 0 0;
  color: #0f172a;
  font-size: 2rem;
  line-height: 1;
  font-weight: 800;
}

.player-information-page__summary-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.95rem;
  background: color-mix(in srgb, currentColor 12%, white);
  border: 1px solid color-mix(in srgb, currentColor 18%, white);
}

.player-information-page__summary-icon svg {
  width: 1.15rem;
  height: 1.15rem;
}

.player-information-page__summary-badge {
  margin: 0;
  display: inline-flex;
  align-self: flex-start;
  padding: 0.38rem 0.72rem;
  border-radius: 999px;
  background: color-mix(in srgb, currentColor 10%, white);
  color: color-mix(in srgb, currentColor 85%, black 10%);
  font-size: 0.78rem;
  font-weight: 700;
}

.player-information-page__summary-caption {
  margin: 0;
  color: #475569;
  font-size: 0.88rem;
  line-height: 1.55;
}

.player-information-page__shell {
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

.player-information-page__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.player-information-page__toolbar-copy {
  min-width: 0;
}

.player-information-page__eyebrow {
  margin: 0;
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.player-information-page__toolbar-title {
  margin: 0.35rem 0 0;
  color: #0f172a;
  font-size: 1.4rem;
  line-height: 1.2;
  font-weight: 800;
}

.player-information-page__toolbar-text {
  margin: 0.45rem 0 0;
  color: #475569;
  font-size: 0.92rem;
  line-height: 1.6;
}

.player-information-page__toolbar-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

.player-information-page__spotlight {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.8rem 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(14, 116, 144, 0.16);
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(255, 255, 255, 0.94) 100%);
}

.player-information-page__spotlight-label {
  color: #0f6f8f;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.player-information-page__spotlight-value {
  color: #0f172a;
  font-size: 1.3rem;
  line-height: 1;
  font-weight: 800;
}

.player-information-page__highlights {
  display: grid;
  gap: 0.85rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.player-information-page__highlight {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  background: rgba(255, 255, 255, 0.82);
}

.player-information-page__highlight-label {
  color: #475569;
  font-size: 0.82rem;
  font-weight: 600;
}

.player-information-page__highlight-value {
  color: #0f172a;
  font-size: 1.05rem;
  font-weight: 800;
}

.player-information-page__avatar.p-avatar {
  width: 2.75rem;
  height: 2.75rem;
  box-shadow: 0 10px 18px -14px rgba(0, 174, 239, 0.55);
}

.player-information-page__avatar.p-avatar:not(.p-avatar-image) {
  background: linear-gradient(135deg, var(--brand-primary-500) 0%, var(--brand-primary-700) 100%);
  color: #fff;
}

.player-information-page--kh .player-information-page__summary-title,
.player-information-page--kh .player-information-page__summary-badge,
.player-information-page--kh .player-information-page__eyebrow,
.player-information-page--kh .player-information-page__spotlight-label,
.player-information-page--kh .player-information-page__highlight-label,
.player-information-page--kh .player-information-page__toolbar-text,
.player-information-page--kh .player-information-page__summary-caption {
  font-family:
    'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
}

.player-information-page--kh .player-information-page__summary-title,
.player-information-page--kh .player-information-page__eyebrow,
.player-information-page--kh .player-information-page__spotlight-label {
  text-transform: none;
  letter-spacing: 0.01em;
}

@media (max-width: 640px) {
  .player-information-page__summary-card,
  .player-information-page__shell {
    padding: 1.1rem;
  }

  .player-information-page__toolbar-title {
    font-size: 1.2rem;
  }
}
</style>

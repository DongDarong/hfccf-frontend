<script setup>
import { computed } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/HeaderSection.vue'
import StatsCards from '@/components/StatsCards.vue'
import TournamentBanner from '@/modules/sport/admin/components/admin-dashboard/TournamentBanner.vue'
import TournamentQuickPanels from '@/modules/sport/admin/components/admin-dashboard/TournamentQuickPanels.vue'
import { useLanguage } from '@/composables/useLanguage'
import adminDashboardData from '@/mocks/sport/admin-dashboard-data.json'

const { t } = useLanguage()

const title = computed(() => t('sportAdminDashboard.title'))
const subtitle = computed(() => t('sportAdminDashboard.subtitle'))

const cards = computed(() => [
  {
    title: t('sportAdminDashboard.cards.totalTeams.title'),
    value: adminDashboardData.cards.totalTeams,
    label: t('sportAdminDashboard.cards.totalTeams.label'),
    status: 'info',
  },
  {
    title: t('sportAdminDashboard.cards.totalPlayers.title'),
    value: adminDashboardData.cards.totalPlayers,
    label: t('sportAdminDashboard.cards.totalPlayers.label'),
    status: 'warning',
  },
  {
    title: t('sportAdminDashboard.cards.upcomingMatches.title'),
    value: adminDashboardData.cards.upcomingMatches,
    label: t('sportAdminDashboard.cards.upcomingMatches.label'),
    status: 'success',
  },
  {
    title: t('sportAdminDashboard.cards.lowStockItems.title'),
    value: adminDashboardData.cards.lowStockItems,
    label: t('sportAdminDashboard.cards.lowStockItems.label'),
    status: 'error',
  },
  {
    title: t('sportAdminDashboard.cards.totalCoaches.title'),
    value: adminDashboardData.cards.totalCoaches,
    label: t('sportAdminDashboard.cards.totalCoaches.label'),
    status: 'info',
  },
  {
    title: t('sportAdminDashboard.cards.coachesRequests.title'),
    value: adminDashboardData.cards.coachesRequests,
    label: t('sportAdminDashboard.cards.coachesRequests.label'),
    status: 'warning',
  },
])

const tournament = computed(() => adminDashboardData.tournament)
</script>

<template>
  <MainLayout>
    <section class="sport-dashboard">
      <div class="sport-dashboard__content">
        <HeaderSection :title="title" :subtitle="subtitle" />
        <div class="sport-dashboard__cards">
          <StatsCards :cards="cards" />
        </div>
        <TournamentBanner
          :tournamentTitle="tournament.title"
          :tournamentSubtitle="`${tournament.subtitle} � ${tournament.location}`"
          :actionLabel="t('sportAdminDashboard.tournamentBanner.action')"
        />
        <TournamentQuickPanels />
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.sport-dashboard {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sport-dashboard__content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sport-dashboard__cards {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
</style>





<script setup>
import { computed, onMounted, ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import StatsCards from '@/components/data-display/StatsCards.vue'
import TournamentBanner from '@/modules/sport/admin/components/admin-dashboard/TournamentBanner.vue'
import TournamentList from '@/modules/sport/admin/components/admin-dashboard/TournamentList.vue'
import { useLanguage } from '@/composables/useLanguage'
import { fetchSportDashboard } from '@/modules/sport/services/sportApi'

const { t } = useLanguage()
const dashboard = ref({ summary: {}, teams: [], players: [], matches: [], events: [] })

const title = computed(() => t('sportAdminDashboard.title'))
const subtitle = computed(() => t('sportAdminDashboard.subtitle'))

const cards = computed(() => [
  {
    title: t('sportAdminDashboard.cards.totalTeams.title'),
    value: dashboard.value.summary.teams ?? 0,
    label: t('sportAdminDashboard.cards.totalTeams.label'),
    status: 'info',
  },
  {
    title: t('sportAdminDashboard.cards.totalPlayers.title'),
    value: dashboard.value.summary.players ?? 0,
    label: t('sportAdminDashboard.cards.totalPlayers.label'),
    status: 'warning',
  },
  {
    title: t('sportAdminDashboard.cards.upcomingMatches.title'),
    value: dashboard.value.summary.scheduledMatches ?? 0,
    label: t('sportAdminDashboard.cards.upcomingMatches.label'),
    status: 'success',
  },
  {
    title: t('sportAdminDashboard.cards.lowStockItems.title'),
    value: dashboard.value.summary.liveMatches ?? 0,
    label: t('sportAdminDashboard.cards.lowStockItems.label'),
    status: 'error',
  },
  {
    title: t('sportAdminDashboard.cards.totalCoaches.title'),
    value: dashboard.value.summary.coaches ?? 0,
    label: t('sportAdminDashboard.cards.totalCoaches.label'),
    status: 'info',
  },
  {
    title: t('sportAdminDashboard.cards.coachesRequests.title'),
    value: dashboard.value.summary.completedMatches ?? 0,
    label: t('sportAdminDashboard.cards.coachesRequests.label'),
    status: 'warning',
  },
])

const tournament = computed(() => ({
  title: t('sportAdminDashboard.tournamentBanner.title'),
  subtitle: t('sportAdminDashboard.tournamentBanner.subtitle'),
  location: t('sportAdminDashboard.tournamentBanner.location'),
  matches: dashboard.value.summary.matches ?? 0,
  status: t('sportAdminDashboard.tournamentBanner.status'),
}))
const tournaments = computed(() => dashboard.value.matches || [])

onMounted(async () => {
  dashboard.value = await fetchSportDashboard().catch(() => ({ summary: {}, teams: [], players: [], matches: [], events: [] }))
})
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
          :tournamentSubtitle="tournament.subtitle"
          :tournamentLocation="tournament.location"
          :tournamentMatches="tournament.matches"
          :tournamentStatus="tournament.status"
          :actionLabel="t('sportAdminDashboard.tournamentBanner.action')"
        />
        <TournamentList :tournaments="tournaments" />
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

.sport-dashboard__quick-panels {
  display: flex;
  flex-direction: column;
}
</style>

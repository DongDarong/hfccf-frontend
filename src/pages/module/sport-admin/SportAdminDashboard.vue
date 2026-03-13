<script setup>
import { computed } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/layout/HeaderSection.vue'
import StatsCards from '@/components/common/StatsCards.vue'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

const title = computed(() => t('sportAdminDashboard.title'))
const subtitle = computed(() => t('sportAdminDashboard.subtitle'))

const cards = computed(() => [
  {
    title: t('sportAdminDashboard.cards.totalTeams.title'),
    value: 28,
    label: t('sportAdminDashboard.cards.totalTeams.label'),
    status: 'info',
  },
  {
    title: t('sportAdminDashboard.cards.totalPlayers.title'),
    value: 9,
    label: t('sportAdminDashboard.cards.totalPlayers.label'),
    status: 'warning',
  },
  {
    title: t('sportAdminDashboard.cards.upcomingMatches.title'),
    value: 21,
    label: t('sportAdminDashboard.cards.upcomingMatches.label'),
    status: 'success',
  },
  {
    title: t('sportAdminDashboard.cards.lowStockItems.title'),
    value: 3,
    label: t('sportAdminDashboard.cards.lowStockItems.label'),
    status: 'error',
  },
  {
    title: t('sportAdminDashboard.cards.totalCoaches.title'),
    value: '86%',
    label: t('sportAdminDashboard.cards.totalCoaches.label'),
    status: 'info',
  },
  {
    title: t('sportAdminDashboard.cards.coachesRequests.title'),
    value: 4,
    label: t('sportAdminDashboard.cards.coachesRequests.label'),
    status: 'warning',
  },
])
</script>

<template>
  <MainLayout>
    <section class="sport-dashboard">
      <HeaderSection :title="title" :subtitle="subtitle" />

      <StatsCards :cards="cards" />
    </section>
  </MainLayout>
</template>

<style scoped>
.sport-dashboard {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>

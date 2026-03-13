<script setup>
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/layout/HeaderSection.vue'
import StatsCards from '@/components/common/StatsCards.vue'

const cards = [
  { title: 'Total Teams', value: 28, label: 'Active rosters', status: 'info' },
  { title: 'Total Players', value: 9, label: 'Under observation', status: 'warning' },
  { title: 'Upcoming Matches', value: 21, label: 'Confirmed fixtures', status: 'success' },
  { title: 'Low Stock Items', value: 3, label: 'Reorder soon', status: 'error' },
  { title: 'Total Coaches', value: '86%', label: 'Coverage target', status: 'info' },
  { title: 'Coaches Requests', value: 4, label: 'Pending approvals', status: 'warning' },
]
</script>

<template>
  <MainLayout>
    <section class="sport-dashboard">
      <HeaderSection
        title="Sport Program Dashboard"
        subtitle="Session coverage, athlete readiness, and facility usage."
      />

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

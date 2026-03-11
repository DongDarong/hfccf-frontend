<script setup>
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/layout/HeaderSection.vue'
import StatsCards from '@/components/common/StatsCards.vue'

const cards = [
  { title: 'Weekly sessions', value: 24, label: 'Planned this week', status: 'info' },
  { title: 'Athletes flagged', value: 5, label: 'Condition monitoring', status: 'warning' },
  { title: 'Coach confirmations', value: 18, label: 'Completed', status: 'success' },
  { title: 'Facility conflicts', value: 1, label: 'Needs reschedule', status: 'error' },
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

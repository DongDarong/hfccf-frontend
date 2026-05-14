<script setup>
import { computed, onMounted, ref } from 'vue'
import RoleDashboardLayout from '@/shared/components/dashboards/RoleDashboardLayout.vue'
import { fetchCoachDashboard } from '@/modules/sport/services/sportApi'

const dashboard = ref({ summary: {} })

const cards = computed(() => [
  { title: 'Teams', value: dashboard.value.summary.teams ?? 0, label: 'Assigned teams', status: 'info' },
  { title: 'Matches', value: dashboard.value.summary.matches ?? 0, label: 'Recent matches', status: 'warning' },
  { title: 'Live matches', value: dashboard.value.summary.liveMatches ?? 0, label: 'Current activity', status: 'error' },
  { title: 'Upcoming', value: dashboard.value.summary.upcomingMatches ?? 0, label: 'Scheduled next', status: 'success' },
])

onMounted(async () => {
  dashboard.value = await fetchCoachDashboard().catch(() => ({ summary: {} }))
})
</script>

<template>
  <RoleDashboardLayout
    title="Coaching Control Panel"
    subtitle="Training cycles, athlete performance, and safety readiness."
    :cards="cards"
    spotlight-title="Athlete readiness"
    spotlight-text="Complete performance reviews and monitor injury watchlist before next sessions."
    :actions="[
      'Finalize training intensity plans',
      'Submit performance notes',
      'Confirm recovery protocols',
    ]"
  />
</template>




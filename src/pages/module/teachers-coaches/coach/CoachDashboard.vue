<script setup>
import RoleDashboardLayout from '../../roles/RoleDashboardLayout.vue'

const cards = [
  { title: 'Training blocks', value: 8, label: 'Current cycle', status: 'info' },
  { title: 'Performance reviews', value: 12, label: 'Pending completion', status: 'warning' },
  { title: 'Injury watchlist', value: 3, label: 'Monitor closely', status: 'error' },
  { title: 'Programs completed', value: 5, label: 'This month', status: 'success' },
]
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

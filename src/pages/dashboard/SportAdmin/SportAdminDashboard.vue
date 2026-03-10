<script setup>
import RoleDashboardLayout from '../roles/RoleDashboardLayout.vue'

const cards = [
  { title: 'Weekly sessions', value: 24, label: 'Planned this week', status: 'info' },
  { title: 'Athletes flagged', value: 5, label: 'Condition monitoring', status: 'warning' },
  { title: 'Coach confirmations', value: 18, label: 'Completed', status: 'success' },
  { title: 'Facility conflicts', value: 1, label: 'Needs reschedule', status: 'error' },
]
</script>

<template>
  <RoleDashboardLayout
    title="Sport Program Dashboard"
    subtitle="Session coverage, athlete readiness, and facility usage."
    :cards="cards"
    spotlight-title="Training operations"
    spotlight-text="Fix facility conflicts first, then close athlete readiness checks before sessions start."
    :actions="['Reassign conflicted sessions', 'Confirm recovery schedules', 'Lock weekly coach roster']"
  />
</template>

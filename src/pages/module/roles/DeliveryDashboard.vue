<script setup>
import RoleDashboardLayout from './RoleDashboardLayout.vue'

const cards = [
  { title: 'Open tasks', value: 17, label: 'Assigned to you', status: 'warning' },
  { title: 'Completed today', value: 9, label: 'Execution progress', status: 'success' },
  { title: 'Blocked tasks', value: 2, label: 'Needs escalation', status: 'error' },
  { title: 'Upcoming deadlines', value: 6, label: 'Next 3 days', status: 'info' },
]
</script>

<template>
  <RoleDashboardLayout
    title="Delivery Activity Board"
    subtitle="Execution view for task-based contributors."
    :cards="cards"
    spotlight-title="Daily execution"
    spotlight-text="Unblock critical tasks first, then close deadline items due within 72 hours."
    :actions="['Escalate blockers', 'Complete due tasks', 'Update task notes for handoff']"
  />
</template>

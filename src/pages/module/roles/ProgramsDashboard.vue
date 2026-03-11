<script setup>
import RoleDashboardLayout from './RoleDashboardLayout.vue'

const cards = [
  { title: 'Program drafts', value: 7, label: 'Awaiting approval', status: 'warning' },
  { title: 'Published initiatives', value: 13, label: 'Active now', status: 'success' },
  { title: 'Content revisions', value: 5, label: 'Needs update', status: 'error' },
  { title: 'Stakeholder reviews', value: 8, label: 'Scheduled this week', status: 'info' },
]
</script>

<template>
  <RoleDashboardLayout
    title="Program Delivery Board"
    subtitle="Planning and rollout checkpoints for program owners."
    :cards="cards"
    spotlight-title="Rollout readiness"
    spotlight-text="Finalize revisions and clear draft approvals before next release window."
    :actions="['Resolve content feedback', 'Approve ready drafts', 'Lock next rollout schedule']"
  />
</template>

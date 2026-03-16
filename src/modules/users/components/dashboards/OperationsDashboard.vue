<script setup>
import RoleDashboardLayout from './RoleDashboardLayout.vue'

const cards = [
  { title: 'Accounts pending action', value: 10, label: 'Needs role review', status: 'warning' },
  { title: 'Resolved tickets', value: 26, label: 'This week', status: 'success' },
  { title: 'Security alerts', value: 1, label: 'Open incident', status: 'error' },
  { title: 'Policy updates', value: 4, label: 'Ready to publish', status: 'info' },
]
</script>

<template>
  <RoleDashboardLayout
    title="Operations Access Board"
    subtitle="User administration and service stability checks."
    :cards="cards"
    spotlight-title="Access governance"
    spotlight-text="Review account role changes and close the remaining security alert."
    :actions="[
      'Approve role update requests',
      'Validate account audit trail',
      'Publish pending policy notices',
    ]"
  />
</template>



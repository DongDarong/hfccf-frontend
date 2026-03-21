<script setup>
import RoleDashboardLayout from '@/modules/users/shared/dashboards/RoleDashboardLayout.vue'

const cards = [
  { title: 'Active classes', value: 16, label: 'Current term', status: 'success' },
  { title: 'Tutor substitutions', value: 4, label: 'Need assignment', status: 'warning' },
  { title: 'Learners at risk', value: 9, label: 'Low progress alerts', status: 'error' },
  { title: 'Curriculum updates', value: 5, label: 'Ready to publish', status: 'info' },
]
</script>

<template>
  <RoleDashboardLayout
    title="English Program Control"
    subtitle="Program delivery, tutor allocation, and learner progress."
    :cards="cards"
    spotlight-title="Program continuity"
    spotlight-text="Resolve tutor substitutions and action low-progress learner alerts today."
    :actions="[
      'Approve class staffing updates',
      'Review learner intervention plans',
      'Publish curriculum changes',
    ]"
  />
</template>




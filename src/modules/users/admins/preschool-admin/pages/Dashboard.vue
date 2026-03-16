<script setup>
import RoleDashboardLayout from '@/modules/users/components/dashboards/RoleDashboardLayout.vue'

const cards = [
  { title: 'New enrollments', value: 14, label: 'This week', status: 'success' },
  { title: 'Classrooms at capacity', value: 3, label: 'Requires rebalancing', status: 'warning' },
  { title: 'Parent meetings', value: 11, label: 'Scheduled this week', status: 'info' },
  { title: 'Missing attendance logs', value: 2, label: 'Follow up today', status: 'error' },
]
</script>

<template>
  <RoleDashboardLayout
    title="Preschool Operations Board"
    subtitle="Enrollment readiness, attendance, and classroom resourcing."
    :cards="cards"
    spotlight-title="Early-learning priorities"
    spotlight-text="Confirm attendance gaps and finalize this week's parent engagement schedule."
    :actions="[
      'Assign overflow students',
      'Approve classroom support requests',
      'Close missing attendance records',
    ]"
  />
</template>




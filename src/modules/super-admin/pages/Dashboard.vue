<script setup>
import RoleDashboardLayout from '@/shared/components/dashboards/RoleDashboardLayout.vue'

const cards = [
  { title: 'Open escalations', value: 4, label: 'Needs decision today', status: 'error' },
  { title: 'Live programs', value: 21, label: 'Across all departments', status: 'success' },
  { title: 'Access violations', value: 2, label: 'Audit queue', status: 'warning' },
  { title: 'New partner requests', value: 7, label: 'Pending review', status: 'info' },
]
</script>

<template>
  <RoleDashboardLayout
    title="Executive Command Center"
    subtitle="Cross-team health, policy exceptions, and system-wide priorities."
    :cards="cards"
    spotlight-title="Global control focus"
    spotlight-text="You have full access. Prioritize escalations and complete policy approvals before end of day."
    :actions="[
      'Review unresolved incidents',
      'Approve cross-department requests',
      'Validate weekly governance report',
    ]"
  />
</template>





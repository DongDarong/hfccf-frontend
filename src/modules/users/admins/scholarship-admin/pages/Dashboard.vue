<script setup>
import RoleDashboardLayout from '@/modules/users/components/dashboards/RoleDashboardLayout.vue'

const cards = [
  { title: 'Applications in review', value: 28, label: 'Awaiting decision', status: 'warning' },
  { title: 'Approved this month', value: 19, label: 'Ready for onboarding', status: 'success' },
  { title: 'Documents incomplete', value: 6, label: 'Need applicant follow-up', status: 'error' },
  { title: 'Donor reports due', value: 3, label: 'Submit by Friday', status: 'info' },
]
</script>

<template>
  <RoleDashboardLayout
    title="Scholarship Review Desk"
    subtitle="Application pipeline, eligibility checks, and donor reporting."
    :cards="cards"
    spotlight-title="Funding decision queue"
    spotlight-text="Prioritize incomplete files first to reduce decision cycle time this week."
    :actions="[
      'Finalize pending eligibility checks',
      'Trigger applicant reminder emails',
      'Prepare donor utilization summary',
    ]"
  />
</template>




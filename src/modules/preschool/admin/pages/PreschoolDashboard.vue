<script setup>
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import PreschoolDashboardSummary from '@/modules/preschool/admin/components/dashboard/PreschoolDashboardSummary.vue'
import PreschoolDashboardSpotlight from '@/modules/preschool/admin/components/dashboard/PreschoolDashboardSpotlight.vue'
import PreschoolDashboardActionList from '@/modules/preschool/admin/components/dashboard/PreschoolDashboardActionList.vue'
import PreschoolDashboardActivity from '@/modules/preschool/admin/components/dashboard/PreschoolDashboardActivity.vue'

const cards = [
  { title: 'New enrollments', value: 14, label: 'This week', status: 'success' },
  { title: 'Classrooms at capacity', value: 3, label: 'Requires rebalancing', status: 'warning' },
  { title: 'Parent meetings', value: 11, label: 'Scheduled this week', status: 'info' },
  { title: 'Missing attendance logs', value: 2, label: 'Follow up today', status: 'error' },
]

const actions = [
  'Assign overflow students',
  'Approve classroom support requests',
  'Close missing attendance records',
]

const notes = [
  {
    title: 'Attendance follow-up',
    text: 'Two classrooms still have incomplete attendance logs from yesterday morning.',
  },
  {
    title: 'Parent communication',
    text: 'Meeting confirmations are pending for three families before Friday scheduling closes.',
  },
  {
    title: 'Capacity planning',
    text: 'One mixed-age room needs rebalancing before next week’s intake is finalized.',
  },
]
</script>

<template>
  <MainLayout>
    <section class="preschool-dashboard-page">
      <HeaderSection
        title="Preschool Operations Board"
        subtitle="Enrollment readiness, attendance, and classroom resourcing."
      />

      <PreschoolDashboardSummary :cards="cards" />

      <div class="preschool-dashboard-page__grid">
        <PreschoolDashboardSpotlight
          title="Early-learning priorities"
          text="Confirm attendance gaps and finalize this week's parent engagement schedule."
        />
        <PreschoolDashboardActionList title="Action Queue" :items="actions" />
      </div>

      <PreschoolDashboardActivity :items="notes" />
    </section>
  </MainLayout>
</template>

<style scoped>
.preschool-dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.preschool-dashboard-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.9fr);
  gap: 1rem;
  align-items: start;
}

@media (max-width: 980px) {
  .preschool-dashboard-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>

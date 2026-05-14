<script setup>
import { computed, onMounted, ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import PreschoolDashboardSummary from '@/modules/preschool/admin/components/dashboard/PreschoolDashboardSummary.vue'
import PreschoolDashboardSpotlight from '@/modules/preschool/admin/components/dashboard/PreschoolDashboardSpotlight.vue'
import PreschoolDashboardActionList from '@/modules/preschool/admin/components/dashboard/PreschoolDashboardActionList.vue'
import PreschoolDashboardActivity from '@/modules/preschool/admin/components/dashboard/PreschoolDashboardActivity.vue'
import { fetchPreschoolDashboard } from '@/modules/preschool/services/preschoolApi'

const dashboard = ref({
  summary: {
    students: 0,
    classes: 0,
    teachers: 0,
    attendanceToday: 0,
    pendingPayments: 0,
    overduePayments: 0,
  },
  recentAttendance: [],
  upcomingClasses: [],
  paymentSummary: {
    paid: 0,
    pending: 0,
    overdue: 0,
    cancelled: 0,
  },
})
const loading = ref(false)
const errorMessage = ref('')

async function loadDashboard() {
  loading.value = true
  errorMessage.value = ''

  try {
    dashboard.value = await fetchPreschoolDashboard()
  } catch (error) {
    errorMessage.value = error?.message || 'Failed to load preschool dashboard.'
  } finally {
    loading.value = false
  }
}

const cards = computed(() => [
  { title: 'Total Students', value: dashboard.value.summary.students || 0, label: 'Active student records', status: 'success' },
  { title: 'Active Classes', value: dashboard.value.summary.classes || 0, label: 'Live classroom groups', status: 'info' },
  { title: 'Teachers', value: dashboard.value.summary.teachers || 0, label: 'Preschool teachers', status: 'warning' },
  { title: 'Attendance Today', value: dashboard.value.summary.attendanceToday || 0, label: 'Recorded today', status: 'error' },
])

const actions = computed(() => [
  `Pending payments: ${dashboard.value.summary.pendingPayments || 0}`,
  `Overdue payments: ${dashboard.value.summary.overduePayments || 0}`,
  `Paid payments: ${dashboard.value.paymentSummary?.paid || 0}`,
  `Upcoming classes: ${dashboard.value.upcomingClasses.length || 0}`,
])

const notes = computed(() =>
  (dashboard.value.recentAttendance || []).slice(0, 5).map((item) => ({
    title: `${item.studentName || 'Student'} - ${item.className || 'Class'}`,
    text: `${item.attendanceDate || '-'} • ${item.status || '-'}`,
  })),
)

const spotlightTitle = computed(() =>
  dashboard.value.upcomingClasses[0]
    ? `${dashboard.value.upcomingClasses[0].name} is next`
    : 'No upcoming classes',
)

const spotlightText = computed(() =>
  dashboard.value.upcomingClasses[0]
    ? `${dashboard.value.upcomingClasses[0].teacherDisplayName || 'Assigned teacher'} has ${dashboard.value.upcomingClasses[0].studentsCount || 0} enrolled students.`
    : 'Create classes and assign teachers to populate this board.',
)

onMounted(() => {
  loadDashboard()
})
</script>

<template>
  <MainLayout>
    <section class="preschool-dashboard-page">
      <HeaderSection
        title="Preschool Operations Board"
        subtitle="Enrollment readiness, attendance, and classroom resourcing."
      />

      <div
        v-if="errorMessage"
        class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
      >
        {{ errorMessage }}
      </div>

      <div
        v-if="loading"
        class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500"
      >
        Loading preschool dashboard...
      </div>

      <PreschoolDashboardSummary :cards="cards" />

      <div class="preschool-dashboard-page__grid">
        <PreschoolDashboardSpotlight
          :title="spotlightTitle"
          :text="spotlightText"
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

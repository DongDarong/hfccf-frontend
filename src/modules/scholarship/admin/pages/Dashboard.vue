<script setup>
import { computed, onMounted, ref } from 'vue'
import Card from 'primevue/card'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import DashboardOverview from '@/shared/components/dashboards/DashboardOverview.vue'
import Loading from '@/components/feedback/Loading.vue'
import { fetchScholarshipDashboard } from '@/modules/scholarship/services/scholarshipApi'

defineOptions({
  name: 'ScholarshipAdminDashboard',
})

const dashboard = ref({
  summary: {
    totalStudents: 0,
    totalApplications: 0,
    pendingReviews: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    underReviewCount: 0,
  },
  reviewerWorkload: [],
  recentSubmissions: [],
  recentDecisions: [],
})
const loading = ref(false)
const errorMessage = ref('')

const summaryCards = computed(() => [
  {
    title: 'Total Students',
    value: dashboard.value.summary.totalStudents,
    label: 'Active scholarship students',
    status: 'info',
  },
  {
    title: 'Applications',
    value: dashboard.value.summary.totalApplications,
    label: 'All scholarship applications',
    status: 'success',
  },
  {
    title: 'Pending Reviews',
    value: dashboard.value.summary.pendingReviews,
    label: 'Awaiting reviewer action',
    status: 'warning',
  },
  {
    title: 'Approved',
    value: dashboard.value.summary.approvedApplications,
    label: 'Finalized approvals',
    status: 'success',
  },
])

async function loadDashboard() {
  loading.value = true
  errorMessage.value = ''

  try {
    dashboard.value = await fetchScholarshipDashboard()
  } catch (error) {
    errorMessage.value = error?.message || 'Failed to load scholarship dashboard.'
  } finally {
    loading.value = false
  }
}

function statusLabel(status) {
  const normalized = String(status || '').trim().toLowerCase()
  if (!normalized) return '-'
  return normalized.replace(/_/g, ' ')
}

onMounted(() => {
  loadDashboard()
})
</script>

<template>
  <MainLayout>
    <section class="scholarship-dashboard-page">
      <HeaderSection
        title="Scholarship Dashboard"
        subtitle="Application pipeline, reviewer workload, and decision tracking."
      />

      <div
        v-if="errorMessage"
        class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
      >
        {{ errorMessage }}
      </div>

      <!-- Overview Section -->
      <div class="scholarship-dashboard-page__section">
        <DashboardOverview
          :cards="summaryCards"
          spotlight-title="Scholarship Snapshot"
          spotlight-text="Track new submissions, decisions, and reviewer assignments from live scholarship data."
          :actions="[
            `Under review: ${dashboard.summary.underReviewCount}`,
            `Pending reviews: ${dashboard.summary.pendingReviews}`,
            `Approved: ${dashboard.summary.approvedApplications}`,
          ]"
        />
      </div>

      <!-- Pipeline & Workload Zone -->
      <div class="scholarship-dashboard-page__zone">
        <div class="scholarship-dashboard-page__zone-header">
          <h2 class="scholarship-dashboard-page__zone-title">📋 Pipeline & Workload</h2>
          <p class="scholarship-dashboard-page__zone-description">Track submissions and reviewer capacity</p>
        </div>
        <div class="scholarship-dashboard-page__grid">
          <Card class="scholarship-dashboard-page__card">
            <template #title>
              <div class="scholarship-dashboard-page__card-title">
                <span>👥 Reviewer Workload</span>
                <small>Current assignments</small>
              </div>
            </template>
            <template #content>
              <Loading v-if="loading" label="Loading reviewer workload" />
              <div v-else class="scholarship-dashboard-page__list">
                <div v-for="item in dashboard.reviewerWorkload" :key="item.reviewerUserId || item.count" class="scholarship-dashboard-page__row">
                  <span>Reviewer {{ item.reviewerUserId || '-' }}</span>
                  <strong>{{ item.count }}</strong>
                </div>
                <p v-if="!dashboard.reviewerWorkload.length" class="scholarship-dashboard-page__empty">
                  No reviewer workload data yet.
                </p>
              </div>
            </template>
          </Card>

          <Card class="scholarship-dashboard-page__card">
            <template #title>
              <div class="scholarship-dashboard-page__card-title">
                <span>📥 Recent Submissions</span>
                <small>Latest applications</small>
              </div>
            </template>
            <template #content>
              <Loading v-if="loading" label="Loading recent submissions" />
              <div v-else class="scholarship-dashboard-page__list">
                <div v-for="item in dashboard.recentSubmissions" :key="item.id" class="scholarship-dashboard-page__timeline">
                  <strong>{{ item.applicationCode || '-' }}</strong>
                  <span>{{ item.student?.fullName || '-' }}</span>
                  <small>{{ item.scholarshipType || '-' }} · {{ item.submissionDate || '-' }}</small>
                </div>
                <p v-if="!dashboard.recentSubmissions.length" class="scholarship-dashboard-page__empty">
                  No recent submissions.
                </p>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <!-- Decisions Zone -->
      <div class="scholarship-dashboard-page__zone">
        <div class="scholarship-dashboard-page__zone-header">
          <h2 class="scholarship-dashboard-page__zone-title">✅ Recent Decisions</h2>
          <p class="scholarship-dashboard-page__zone-description">Outcomes and approvals</p>
        </div>
        <div class="scholarship-dashboard-page__grid scholarship-dashboard-page__grid--single">
          <Card class="scholarship-dashboard-page__card">
            <template #title>
              <div class="scholarship-dashboard-page__card-title">
                <span>Decision History</span>
                <small>Latest outcomes</small>
              </div>
            </template>
            <template #content>
              <Loading v-if="loading" label="Loading recent decisions" />
              <div v-else class="scholarship-dashboard-page__list">
                <div v-for="item in dashboard.recentDecisions" :key="item.id" class="scholarship-dashboard-page__timeline">
                  <strong>{{ item.applicationCode || '-' }}</strong>
                  <span class="scholarship-dashboard-page__decision-status">
                    Status: {{ statusLabel(item.applicationStatus) }}
                  </span>
                  <small>
                    {{ item.approvedAt ? `Approved: ${item.approvedAt}` : item.rejectedAt ? `Rejected: ${item.rejectedAt}` : 'Pending' }}
                  </small>
                </div>
                <p v-if="!dashboard.recentDecisions.length" class="scholarship-dashboard-page__empty">
                  No recent decisions.
                </p>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.scholarship-dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.scholarship-dashboard-page__section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.scholarship-dashboard-page__zone {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.scholarship-dashboard-page__zone-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.scholarship-dashboard-page__zone-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.scholarship-dashboard-page__zone-description {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
}

.scholarship-dashboard-page__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.scholarship-dashboard-page__grid--single {
  grid-template-columns: 1fr;
}

.scholarship-dashboard-page__card {
  border: 1px solid #e2e8f0;
  border-radius: 1.25rem;
  background: #fff;
  box-shadow: 0 18px 34px -34px rgba(15, 23, 42, 0.25);
}

.scholarship-dashboard-page__card-title {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.scholarship-dashboard-page__card-title small {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
}

.scholarship-dashboard-page__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.scholarship-dashboard-page__decision-status {
  color: #3b82f6;
  font-weight: 600;
}

.scholarship-dashboard-page__row,
.scholarship-dashboard-page__timeline {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.75rem 0.85rem;
  border-radius: 0.9rem;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.scholarship-dashboard-page__row {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.scholarship-dashboard-page__empty {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}

@media (max-width: 1100px) {
  .scholarship-dashboard-page {
    gap: 1.25rem;
  }

  .scholarship-dashboard-page__grid {
    grid-template-columns: 1fr;
  }

  .scholarship-dashboard-page__zone {
    gap: 0.5rem;
  }

  .scholarship-dashboard-page__zone-title {
    font-size: 0.95rem;
  }
}
</style>

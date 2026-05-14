<script setup>
import { computed, onMounted, ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Table from '@/components/data-display/Table.vue'
import { fetchEnglishDashboard } from '@/modules/english/services/englishApi'

defineOptions({
  name: 'EnglishAdminDashboardPage',
})

const loading = ref(false)
const errorMessage = ref('')
const summary = ref({})

const cards = computed(() => summary.value.summaryCards || [])

const assignmentColumns = [
  { key: 'title', label: 'Recent Assignments', align: 'left' },
  { key: 'className', label: 'Class', align: 'left' },
  { key: 'taskStatus', label: 'Status', align: 'left' },
  { key: 'dueDate', label: 'Due Date', align: 'left' },
]

const reviewColumns = [
  { key: 'taskTitle', label: 'Reviewed Task', align: 'left' },
  { key: 'studentName', label: 'Student', align: 'left' },
  { key: 'submissionStatus', label: 'Status', align: 'left' },
  { key: 'reviewedAt', label: 'Reviewed At', align: 'left' },
]

const workloadColumns = [
  { key: 'name', label: 'Teacher', align: 'left' },
  { key: 'classes', label: 'Classes', align: 'left' },
  { key: 'tasks', label: 'Tasks', align: 'left' },
]

const recentAssignments = computed(() =>
  (summary.value.recentAssignments || []).map((item) => ({
    ...item,
    className: item.className || '-',
    taskStatus: item.taskStatus || '-',
    dueDate: item.dueDate || '-',
  })),
)

const recentReviews = computed(() =>
  (summary.value.recentReviews || []).map((item) => ({
    ...item,
    taskTitle: item.taskTitle || '-',
    studentName: item.studentName || '-',
    submissionStatus: item.submissionStatus || '-',
    reviewedAt: item.reviewedAt || '-',
  })),
)

const teacherWorkload = computed(() =>
  (summary.value.teacherWorkload || []).map((item) => ({
    ...item,
    name: item.name || '-',
    classes: item.classes ?? 0,
    tasks: item.tasks ?? 0,
  })),
)

async function loadDashboard() {
  loading.value = true
  errorMessage.value = ''

  try {
    summary.value = await fetchEnglishDashboard()
  } catch (error) {
    summary.value = {}
    errorMessage.value = error?.message || 'Failed to load English dashboard.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboard()
})
</script>

<template>
  <MainLayout>
    <section class="english-dashboard-page">
      <HeaderSection
        title="English Dashboard"
        subtitle="Overview of classes, teachers, students, and task activity."
      />

      <div class="english-dashboard-page__shell">
        <div v-if="loading" class="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
          Loading English dashboard...
        </div>

        <div
          v-if="errorMessage"
          class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {{ errorMessage }}
        </div>

        <div class="english-dashboard-page__cards">
          <article
            v-for="card in cards"
            :key="card.title"
            class="english-dashboard-page__card"
          >
            <p class="english-dashboard-page__card-title">{{ card.title }}</p>
            <p class="english-dashboard-page__card-value">{{ card.value }}</p>
            <p class="english-dashboard-page__card-label">{{ card.label }}</p>
          </article>
        </div>

        <div class="english-dashboard-page__grid">
          <section class="english-dashboard-page__panel">
            <div class="english-dashboard-page__panel-header">
              <h2 class="english-dashboard-page__panel-title">Recent Assignments</h2>
              <span class="english-dashboard-page__panel-caption">Latest tasks</span>
            </div>

            <Table
              :rows="recentAssignments"
              :columns="assignmentColumns"
              :loading="loading"
              empty-text="No recent assignments."
              :show-view-action="false"
              :show-edit-action="false"
              :show-delete-action="false"
            />
          </section>

          <section class="english-dashboard-page__panel">
            <div class="english-dashboard-page__panel-header">
              <h2 class="english-dashboard-page__panel-title">Recent Reviews</h2>
              <span class="english-dashboard-page__panel-caption">Latest reviewed submissions</span>
            </div>

            <Table
              :rows="recentReviews"
              :columns="reviewColumns"
              :loading="loading"
              empty-text="No recent reviews."
              :show-view-action="false"
              :show-edit-action="false"
              :show-delete-action="false"
            />
          </section>
        </div>

        <section class="english-dashboard-page__panel">
          <div class="english-dashboard-page__panel-header">
            <h2 class="english-dashboard-page__panel-title">Teacher Workload</h2>
            <span class="english-dashboard-page__panel-caption">Classes and tasks per teacher</span>
          </div>

          <Table
            :rows="teacherWorkload"
            :columns="workloadColumns"
            :loading="loading"
            empty-text="No teacher workload data."
            :show-view-action="false"
            :show-edit-action="false"
            :show-delete-action="false"
          />
        </section>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.english-dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.english-dashboard-page__shell {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid #dce6f2;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.5);
}

.english-dashboard-page__cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
}

.english-dashboard-page__card {
  border-radius: 1.25rem;
  border: 1px solid #dbe7f5;
  background: #fff;
  padding: 1rem 1.1rem;
}

.english-dashboard-page__card-title {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
}

.english-dashboard-page__card-value {
  margin-top: 0.35rem;
  font-size: 1.7rem;
  font-weight: 800;
  color: #0f172a;
}

.english-dashboard-page__card-label {
  margin-top: 0.2rem;
  font-size: 0.88rem;
  color: #475569;
}

.english-dashboard-page__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.english-dashboard-page__panel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-radius: 1.25rem;
  border: 1px solid #dbe7f5;
  background: #fff;
  padding: 1rem;
}

.english-dashboard-page__panel-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
}

.english-dashboard-page__panel-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.english-dashboard-page__panel-caption {
  font-size: 0.85rem;
  color: #64748b;
}

@media (max-width: 1024px) {
  .english-dashboard-page__cards,
  .english-dashboard-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>

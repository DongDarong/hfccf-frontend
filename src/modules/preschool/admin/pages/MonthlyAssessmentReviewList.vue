<template>
  <MainLayout>
    <div class="monthly-assessment-review-list">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>{{ t('monthlyAssessmentAdmin.list.title') }}</h1>
          <p class="text-muted">{{ t('monthlyAssessmentAdmin.list.subtitle') }}</p>
        </div>
        <div class="header-meta">
          <span v-if="submittedCount > 0" class="submitted-badge">
            {{ submittedCount }} {{ t('monthlyAssessmentAdmin.queue.pending') }}
          </span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>{{ t('monthlyAssessmentAdmin.loading') }}</p>
      </div>

      <!-- Filters -->
      <div v-else class="filters-section">
        <div class="filters-bar">
          <select v-model="filters.status" class="form-control filter-select">
            <option value="">{{ t('monthlyAssessmentAdmin.filters.allStatuses') }}</option>
            <option value="submitted">{{ formatStatus('submitted') }}</option>
            <option value="returned">{{ formatStatus('returned') }}</option>
            <option value="finalized">{{ formatStatus('finalized') }}</option>
            <option value="archived">{{ formatStatus('archived') }}</option>
            <option value="draft">{{ formatStatus('draft') }}</option>
          </select>

          <select v-model="filters.academicYear" class="form-control filter-select">
            <option value="">{{ t('monthlyAssessmentAdmin.filters.allYears') }}</option>
            <option v-for="year in academicYears" :key="year.id" :value="year.id">
              {{ year.label }}
            </option>
          </select>

          <select v-model="filters.class" class="form-control filter-select">
            <option value="">{{ t('monthlyAssessmentAdmin.filters.allClasses') }}</option>
            <option v-for="cls in classes" :key="cls.id" :value="cls.id">
              {{ cls.name }}
            </option>
          </select>

          <select v-model="filters.category" class="form-control filter-select">
            <option value="">{{ t('monthlyAssessmentAdmin.filters.allCategories') }}</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>

          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('monthlyAssessmentAdmin.filters.search')"
            class="form-control search-input"
          />
        </div>
      </div>

      <!-- Submissions Table -->
      <div v-if="!loading && filteredSubmissions.length > 0" class="submissions-table">
        <table>
          <thead>
            <tr>
              <th>{{ t('monthlyAssessmentAdmin.table.class') }}</th>
              <th>{{ t('monthlyAssessmentAdmin.table.teacher') }}</th>
              <th>{{ t('monthlyAssessmentAdmin.table.category') }}</th>
              <th>{{ t('monthlyAssessmentAdmin.table.month') }}</th>
              <th>{{ t('monthlyAssessmentAdmin.table.status') }}</th>
              <th>{{ t('monthlyAssessmentAdmin.table.progress') }}</th>
              <th>{{ t('monthlyAssessmentAdmin.table.submitted') }}</th>
              <th>{{ t('monthlyAssessmentAdmin.table.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="submission in paginatedSubmissions"
              :key="submission.id"
              :class="['submission-row', `status-${submission.status}`]"
            >
              <td class="class-name">
                <strong>{{ submission.class?.name }}</strong>
              </td>
              <td>{{ submission.submittedBy?.first_name }} {{ submission.submittedBy?.last_name }}</td>
              <td>{{ submission.category?.name }}</td>
              <td>{{ formatMonth(submission.submission_month) }}</td>
              <td>
                <span :class="['badge', `badge-${submission.status}`]">
                  {{ formatStatus(submission.status) }}
                </span>
              </td>
              <td>
                <div class="progress-cell">
                  <div class="progress-bar">
                    <div
                      class="progress"
                      :style="{ width: calculateProgress(submission) + '%' }"
                    ></div>
                  </div>
                  <small>{{ calculateProgress(submission) }}%</small>
                </div>
              </td>
              <td class="date-cell">
                <span v-if="submission.submitted_at">
                  {{ formatDate(submission.submitted_at) }}
                </span>
                <span v-else class="text-muted">-</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button
                    v-if="submission.status === 'submitted'"
                    @click="openDetail(submission)"
                    class="btn-action review"
                    :title="t('monthlyAssessmentAdmin.actions.review')"
                  >
                    <i class="pi pi-arrow-right"></i>
                  </button>
                  <button
                    v-else-if="submission.status === 'returned'"
                    @click="openDetail(submission)"
                    class="btn-action view"
                    :title="t('monthlyAssessmentAdmin.actions.viewReturned')"
                  >
                    <i class="pi pi-eye"></i>
                  </button>
                  <button
                    v-else-if="['finalized', 'archived'].includes(submission.status)"
                    @click="openDetail(submission)"
                    class="btn-action view"
                    :title="t('monthlyAssessmentAdmin.actions.viewHistory')"
                  >
                    <i class="pi pi-eye"></i>
                  </button>
                  <button
                    v-else
                    @click="openDetail(submission)"
                    class="btn-action view"
                    :title="t('monthlyAssessmentAdmin.actions.view')"
                  >
                    <i class="pi pi-eye"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination-bar">
          <button
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="btn-pagination"
          >
            {{ t('monthlyAssessmentAdmin.pagination.previous') }}
          </button>

          <span class="pagination-info">
            {{ t('monthlyAssessmentAdmin.pagination.page') }} {{ currentPage }} {{ t('monthlyAssessmentAdmin.pagination.of') }} {{ totalPages }}
          </span>

          <button
            :disabled="currentPage === totalPages"
            @click="currentPage++"
            class="btn-pagination"
          >
            {{ t('monthlyAssessmentAdmin.pagination.next') }}
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading" class="empty-state">
        <i class="pi pi-inbox"></i>
        <h3>{{ t('monthlyAssessmentAdmin.empty.title') }}</h3>
        <p>{{ t('monthlyAssessmentAdmin.empty.subtitle') }}</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="error-banner">
        {{ error }}
        <button @click="error = null" class="btn-close-error">×</button>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { useLanguage } from '@/composables/useLanguage'
import { fetchMonthlySubmissions } from '@/modules/preschool/services/preschoolApi'

defineOptions({
  name: 'MonthlyAssessmentReviewList',
})

const router = useRouter()
const { t } = useLanguage()

// State
const submissions = ref([])
const loading = ref(true)
const error = ref(null)
const currentPage = ref(1)
const perPage = ref(20)
const totalCount = ref(0)

const filters = ref({
  status: 'submitted', // Default to submitted queue
  academicYear: '',
  class: '',
  category: '',
})
const searchQuery = ref('')

// Lookup data
const academicYears = ref([])
const classes = ref([])
const categories = ref([])

// Computed
const paginatedSubmissions = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filteredSubmissions.value.slice(start, start + perPage.value)
})

const filteredSubmissions = computed(() => {
  return submissions.value.filter(sub => {
    if (filters.value.status && sub.status !== filters.value.status) return false
    if (filters.value.academicYear && sub.academic_year_id !== filters.value.academicYear) return false
    if (filters.value.class && sub.class_id !== filters.value.class) return false
    if (filters.value.category && sub.assessment_category_id !== filters.value.category) return false
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      return (
        sub.class?.name?.toLowerCase().includes(query) ||
        sub.category?.name?.toLowerCase().includes(query) ||
        `${sub.submittedBy?.first_name} ${sub.submittedBy?.last_name}`.toLowerCase().includes(query)
      )
    }
    return true
  })
})

const totalPages = computed(() => Math.ceil(filteredSubmissions.value.length / perPage.value))

const submittedCount = computed(() => submissions.value.filter(s => s.status === 'submitted').length)

// Methods
const loadSubmissions = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await fetchMonthlySubmissions({
      page: 1,
      perPage: 1000, // Load all for client-side filtering
    })
    submissions.value = response.items || []
    totalCount.value = response.pagination?.total || 0

    // Extract unique lookup values
    const years = new Set()
    const classList = new Set()
    const catList = new Set()

    submissions.value.forEach(sub => {
      if (sub.academicYear?.id) {
        years.add(JSON.stringify({ id: sub.academicYear.id, label: sub.academicYear.label }))
      }
      if (sub.class?.id) {
        classList.add(JSON.stringify({ id: sub.class.id, name: sub.class.name }))
      }
      if (sub.category?.id) {
        catList.add(JSON.stringify({ id: sub.category.id, name: sub.category.name }))
      }
    })

    academicYears.value = Array.from(years).map(y => JSON.parse(y))
    classes.value = Array.from(classList).map(c => JSON.parse(c))
    categories.value = Array.from(catList).map(c => JSON.parse(c))
  } catch (err) {
    error.value = t('monthlyAssessmentAdmin.error.loadFailed')
    console.error('Failed to load submissions:', err)
  } finally {
    loading.value = false
  }
}

const openDetail = (submission) => {
  router.push({
    name: 'preschool-admin-monthly-assessment-detail',
    params: { submissionId: submission.id },
  })
}

const formatStatus = (status) => {
  const statuses = {
    draft: t('monthlyAssessmentAdmin.statuses.draft'),
    submitted: t('monthlyAssessmentAdmin.statuses.submitted'),
    returned: t('monthlyAssessmentAdmin.statuses.returned'),
    finalized: t('monthlyAssessmentAdmin.statuses.finalized'),
    archived: t('monthlyAssessmentAdmin.statuses.archived'),
  }
  return statuses[status] || status
}

const formatMonth = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const calculateProgress = (submission) => {
  if (!submission.student_assessments?.length) return 0
  const completed = submission.student_assessments.filter(a => a.score !== null && a.score !== undefined).length
  return Math.round((completed / submission.student_assessments.length) * 100)
}

// Lifecycle
onMounted(() => {
  loadSubmissions()
})
</script>

<style scoped>
.monthly-assessment-review-list {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.header-content h1 {
  margin: 0;
  font-size: 1.875rem;
  font-weight: 700;
}

.header-content .text-muted {
  margin: 0.5rem 0 0 0;
  color: #6b7280;
  font-size: 0.95rem;
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.submitted-badge {
  background: #fef3c7;
  color: #92400e;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.loading-state {
  text-align: center;
  padding: 3rem;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.filters-section {
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.filters-bar {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.form-control {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.95rem;
  font-family: inherit;
}

.filter-select {
  min-width: 150px;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.submissions-table {
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.95rem;
}

tbody tr:hover {
  background: #f9fafb;
}

.class-name {
  font-weight: 600;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.badge-draft {
  background: #dbeafe;
  color: #1e40af;
}

.badge-submitted {
  background: #fef3c7;
  color: #92400e;
}

.badge-returned {
  background: #fee2e2;
  color: #991b1b;
}

.badge-finalized {
  background: #dcfce7;
  color: #166534;
}

.badge-archived {
  background: #f3f4f6;
  color: #374151;
}

.progress-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.progress-bar {
  height: 0.375rem;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #3b82f6;
  transition: width 0.2s;
}

.date-cell {
  font-size: 0.9rem;
  color: #6b7280;
}

.text-muted {
  color: #9ca3af;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.btn-action:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.btn-action.review {
  color: #2563eb;
}

.btn-action.view {
  color: #6b7280;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.empty-state i {
  font-size: 3rem;
  color: #d1d5db;
  display: block;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.empty-state p {
  margin: 0;
  color: #6b7280;
}

.pagination-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-pagination {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.btn-pagination:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: #6b7280;
  font-size: 0.95rem;
}

.error-banner {
  background: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: 0.375rem;
  padding: 1rem;
  color: #991b1b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.btn-close-error {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #991b1b;
  padding: 0;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .filters-bar {
    flex-direction: column;
  }

  .form-control {
    width: 100%;
  }

  table {
    font-size: 0.85rem;
  }

  th,
  td {
    padding: 0.75rem;
  }
}
</style>

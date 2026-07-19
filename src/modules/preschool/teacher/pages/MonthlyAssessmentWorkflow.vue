<template>
  <div class="monthly-assessment-workflow">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h1>Monthly Assessment Submissions</h1>
        <p class="text-muted">Manage and submit your monthly student assessments</p>
      </div>
      <div class="header-actions">
        <button
          v-if="!showDetailView"
          @click="createNewSubmission"
          class="btn btn-primary"
          :disabled="loading"
        >
          <i class="icon-plus"></i> New Assessment
        </button>
        <button
          v-else
          @click="backToList"
          class="btn btn-secondary"
        >
          <i class="icon-arrow-left"></i> Back to List
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="initialLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading assessments...</p>
    </div>

    <!-- List View -->
    <div v-else-if="!showDetailView" class="submission-list">
      <!-- Filters -->
      <div class="filters-bar">
        <select v-model="filters.status" class="form-control">
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="returned">Returned</option>
          <option value="finalized">Finalized</option>
          <option value="archived">Archived</option>
        </select>

        <select v-model="filters.academicYear" class="form-control">
          <option value="">All Academic Years</option>
          <option
            v-for="year in academicYears"
            :key="year.id"
            :value="year.id"
          >
            {{ year.label }}
          </option>
        </select>

        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by class or category..."
          class="form-control search-input"
        />
      </div>

      <!-- Submissions Table -->
      <div v-if="filteredSubmissions.length > 0" class="submissions-table">
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Category</th>
              <th>Month</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="submission in filteredSubmissions"
              :key="submission.id"
              :class="['submission-row', `status-${submission.status}`]"
            >
              <td class="class-name">
                <strong>{{ submission.class?.name }}</strong>
              </td>
              <td>{{ submission.category?.name }}</td>
              <td>{{ formatMonth(submission.submission_month) }}</td>
              <td>
                <span :class="['badge', `badge-${submission.status}`]">
                  {{ formatStatus(submission.status) }}
                </span>
              </td>
              <td>
                <div class="progress-bar">
                  <div
                    class="progress"
                    :style="{ width: calculateProgress(submission) + '%' }"
                  ></div>
                </div>
                <small>{{ calculateProgress(submission) }}%</small>
              </td>
              <td>
                <div class="action-buttons">
                  <button
                    @click="editSubmission(submission)"
                    class="btn-action edit"
                    :title="`Edit ${submission.status} submission`"
                  >
                    <i class="icon-edit"></i>
                  </button>
                  <button
                    v-if="submission.status === 'draft'"
                    @click="submitForReview(submission)"
                    class="btn-action submit"
                    :title="'Submit for admin review'"
                  >
                    <i class="icon-check"></i>
                  </button>
                  <button
                    v-if="submission.status === 'returned'"
                    @click="resubmitAfterReturn(submission)"
                    class="btn-action resubmit"
                    :title="'Resubmit corrected assessment'"
                  >
                    <i class="icon-refresh"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <i class="icon-file"></i>
        <h3>No submissions found</h3>
        <p>Start by creating a new monthly assessment for your class.</p>
      </div>
    </div>

    <!-- Detail View -->
    <div v-else class="submission-detail">
      <SubmissionDetailEditor
        v-if="currentSubmission"
        :submission="currentSubmission"
        :loading="detailLoading"
        @update="handleSubmissionUpdate"
        @submit="handleSubmissionSubmit"
        @close="backToList"
      />
    </div>

    <!-- Toast Notifications -->
    <div v-if="notification" :class="['notification', `notification-${notification.type}`]">
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  fetchMonthlySubmissions,
  submitMonthlySubmission,
} from '@/modules/preschool/services/preschoolApi'
import SubmissionDetailEditor from '../components/SubmissionDetailEditor.vue'

// State
const submissions = ref([])
const academicYears = ref([])
const currentSubmission = ref(null)
const showDetailView = ref(false)
const initialLoading = ref(true)
const detailLoading = ref(false)
const loading = ref(false)

// Filters
const filters = ref({
  status: '',
  academicYear: '',
})
const searchQuery = ref('')

// Notifications
const notification = ref(null)

// Computed
const filteredSubmissions = computed(() => {
  return submissions.value.filter(sub => {
    if (filters.value.status && sub.status !== filters.value.status) return false
    if (filters.value.academicYear && sub.academic_year_id !== filters.value.academicYear) return false
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      return (
        sub.class?.name?.toLowerCase().includes(query) ||
        sub.category?.name?.toLowerCase().includes(query)
      )
    }
    return true
  })
})

// Methods
const loadSubmissions = async () => {
  try {
    initialLoading.value = true
    const response = await fetchMonthlySubmissions({
      page: 1,
      perPage: 100,
      status: filters.value.status,
      academicYearId: filters.value.academicYear,
    })
    submissions.value = response.items || []
  } catch (error) {
    showNotification('Failed to load submissions', 'error')
    console.error(error)
  } finally {
    initialLoading.value = false
  }
}

const loadAcademicYears = async () => {
  try {
    // This would need an API endpoint - for now we can fetch from submissions
    // or create a separate endpoint. For this implementation, we'll keep it simple.
    academicYears.value = []
  } catch (error) {
    console.error('Failed to load academic years:', error)
  }
}

const createNewSubmission = () => {
  currentSubmission.value = null
  showDetailView.value = true
}

const editSubmission = (submission) => {
  currentSubmission.value = { ...submission }
  showDetailView.value = true
}

const backToList = () => {
  showDetailView.value = false
  currentSubmission.value = null
  loadSubmissions()
}

const submitForReview = async (submission) => {
  if (!confirm('Submit this assessment for admin review?')) return

  try {
    loading.value = true
    await submitMonthlySubmission(submission.id)
    showNotification('Assessment submitted successfully', 'success')
    await loadSubmissions()
  } catch (error) {
    showNotification(error?.message || 'Failed to submit', 'error')
  } finally {
    loading.value = false
  }
}

const resubmitAfterReturn = async (submission) => {
  if (!confirm('Resubmit this corrected assessment?')) return

  try {
    loading.value = true
    await submitMonthlySubmission(submission.id)
    showNotification('Corrected assessment resubmitted', 'success')
    await loadSubmissions()
  } catch (error) {
    showNotification(error?.message || 'Failed to resubmit', 'error')
  } finally {
    loading.value = false
  }
}

const handleSubmissionUpdate = async (submission) => {
  currentSubmission.value = submission
}

const handleSubmissionSubmit = async (submission) => {
  try {
    loading.value = true
    await submitMonthlySubmission(submission.id)
    showNotification('Assessment submitted successfully', 'success')
    backToList()
  } catch (error) {
    showNotification(error?.message || 'Failed to submit', 'error')
  } finally {
    loading.value = false
  }
}

const formatMonth = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
}

const formatStatus = (status) => {
  const statuses = {
    draft: 'Draft',
    submitted: 'Submitted',
    returned: 'Returned',
    finalized: 'Finalized',
    archived: 'Archived'
  }
  return statuses[status] || status
}

const calculateProgress = (submission) => {
  if (!submission.student_assessments) return 0
  const total = submission.student_assessments.length
  const completed = submission.student_assessments.filter(a => a.score !== null).length
  return total > 0 ? Math.round((completed / total) * 100) : 0
}

const showNotification = (message, type = 'info') => {
  notification.value = { message, type }
  setTimeout(() => {
    notification.value = null
  }, 3000)
}

// Lifecycle
onMounted(() => {
  loadSubmissions()
  loadAcademicYears()
})
</script>

<style scoped>
.monthly-assessment-workflow {
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

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.95rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background: #d1d5db;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  to { transform: rotate(360deg); }
}

.filters-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.form-control {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.95rem;
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

.progress-bar {
  height: 0.375rem;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.progress {
  height: 100%;
  background: #3b82f6;
  transition: width 0.2s;
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

.btn-action.edit {
  color: #2563eb;
}

.btn-action.submit {
  color: #16a34a;
}

.btn-action.resubmit {
  color: #ea580c;
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

.notification {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.notification-success {
  background: #dcfce7;
  color: #166534;
}

.notification-error {
  background: #fee2e2;
  color: #991b1b;
}

.notification-info {
  background: #dbeafe;
  color: #1e40af;
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
    min-width: unset;
  }

  table {
    font-size: 0.85rem;
  }

  th, td {
    padding: 0.75rem;
  }
}
</style>

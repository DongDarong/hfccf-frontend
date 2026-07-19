<template>
  <MainLayout>
    <div class="monthly-assessment-review-detail">
      <!-- Header with Back Button -->
      <div class="detail-header">
        <button @click="$router.back()" class="btn-back">
          <i class="pi pi-arrow-left"></i> {{ t('monthlyAssessmentAdmin.detail.back') }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
      </div>

      <!-- Submission Detail -->
      <div v-else-if="submission" class="detail-content">
        <!-- Status Banner -->
        <div :class="['status-banner', `status-${submission.status}`]">
          <span :class="['badge', `badge-${submission.status}`]">
            {{ formatStatus(submission.status) }}
          </span>
          <span class="banner-text">
            {{ t(`monthlyAssessmentAdmin.detail.status.${submission.status}`) }}
          </span>
        </div>

        <!-- Submission Info -->
        <div class="info-card">
          <h2>{{ t('monthlyAssessmentAdmin.detail.submissionInfo') }}</h2>
          <div class="info-grid">
            <div class="info-row">
              <label>{{ t('monthlyAssessmentAdmin.detail.class') }}</label>
              <span>{{ submission.class?.name }}</span>
            </div>
            <div class="info-row">
              <label>{{ t('monthlyAssessmentAdmin.detail.teacher') }}</label>
              <span>{{ submission.submittedBy?.first_name }} {{ submission.submittedBy?.last_name }}</span>
            </div>
            <div class="info-row">
              <label>{{ t('monthlyAssessmentAdmin.detail.academicYear') }}</label>
              <span>{{ submission.academicYear?.label }}</span>
            </div>
            <div class="info-row">
              <label>{{ t('monthlyAssessmentAdmin.detail.category') }}</label>
              <span>{{ submission.category?.name }}</span>
            </div>
            <div class="info-row">
              <label>{{ t('monthlyAssessmentAdmin.detail.month') }}</label>
              <span>{{ formatMonth(submission.submission_month) }}</span>
            </div>
            <div class="info-row">
              <label>{{ t('monthlyAssessmentAdmin.detail.progress') }}</label>
              <span>{{ calculateProgress(submission) }}% ({{ completedCount }}/{{ totalCount }})</span>
            </div>
          </div>
        </div>

        <!-- Workflow Activity -->
        <div v-if="hasWorkflowMetadata" class="info-card">
          <h3>{{ t('monthlyAssessmentAdmin.detail.workflowActivity') }}</h3>
          <div class="activity-timeline">
            <div v-if="submission.submitted_at" class="activity-item">
              <span class="activity-label">{{ t('monthlyAssessmentAdmin.detail.submittedAt') }}</span>
              <span class="activity-date">{{ formatDateTime(submission.submitted_at) }}</span>
            </div>
            <div v-if="submission.returned_at" class="activity-item">
              <span class="activity-label">{{ t('monthlyAssessmentAdmin.detail.returnedAt') }}</span>
              <span class="activity-date">{{ formatDateTime(submission.returned_at) }}</span>
              <p v-if="submission.return_reason" class="activity-reason">
                {{ t('monthlyAssessmentAdmin.detail.reason') }}: {{ submission.return_reason }}
              </p>
            </div>
            <div v-if="submission.finalized_at" class="activity-item">
              <span class="activity-label">{{ t('monthlyAssessmentAdmin.detail.finalizedAt') }}</span>
              <span class="activity-date">{{ formatDateTime(submission.finalized_at) }}</span>
            </div>
          </div>
        </div>

        <!-- Student Scores Table (Read-Only) -->
        <div class="scores-card">
          <h3>{{ t('monthlyAssessmentAdmin.detail.studentScores') }}</h3>
          <table class="scores-table">
            <thead>
              <tr>
                <th>{{ t('monthlyAssessmentAdmin.detail.student') }}</th>
                <th>{{ t('monthlyAssessmentAdmin.detail.score') }}</th>
                <th>{{ t('monthlyAssessmentAdmin.detail.rating') }}</th>
                <th>{{ t('monthlyAssessmentAdmin.detail.observation') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="assessment in submission.student_assessments"
                :key="assessment.student_id"
                :class="{ 'score-missing': assessment.score === null || assessment.score === undefined }"
              >
                <td>{{ assessment.student?.first_name }} {{ assessment.student?.last_name }}</td>
                <td class="score-cell">
                  {{ assessment.score !== null && assessment.score !== undefined ? assessment.score : '-' }}
                </td>
                <td>{{ assessment.rating || '-' }}</td>
                <td class="observation-cell">{{ assessment.observation || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Grading Snapshot -->
        <div v-if="submission.grading_scale_snapshot" class="scores-card">
          <h3>{{ t('monthlyAssessmentAdmin.detail.gradingSnapshot') }}</h3>
          <p class="snapshot-date">{{ t('monthlyAssessmentAdmin.detail.snapshotCapturedAt') }}: {{ formatDateTime(submission.grading_scale_snapshot.captured_at) }}</p>
          <table class="grading-table">
            <thead>
              <tr>
                <th>{{ t('monthlyAssessmentAdmin.detail.grade') }}</th>
                <th>{{ t('monthlyAssessmentAdmin.detail.range') }}</th>
                <th>{{ t('monthlyAssessmentAdmin.detail.passing') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="scale in submission.grading_scale_snapshot.scales" :key="scale.grade">
                <td class="grade-cell">
                  <strong>{{ scale.grade }}</strong>
                </td>
                <td>{{ scale.min }} - {{ scale.max }}</td>
                <td>{{ scale.is_passing ? t('monthlyAssessmentAdmin.detail.yes') : t('monthlyAssessmentAdmin.detail.no') }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Action Buttons -->
        <div v-if="isEditable" class="actions-footer">
          <button
            v-if="submission.status === 'submitted'"
            @click="showReturnDialog = true"
            class="btn btn-return"
          >
            {{ t('monthlyAssessmentAdmin.detail.returnButton') }}
          </button>
          <button
            v-if="submission.status === 'submitted'"
            @click="showFinalizeDialog = true"
            class="btn btn-finalize"
          >
            {{ t('monthlyAssessmentAdmin.detail.finalizeButton') }}
          </button>
          <button
            v-if="submission.status === 'finalized'"
            @click="showArchiveDialog = true"
            class="btn btn-archive"
          >
            {{ t('monthlyAssessmentAdmin.detail.archiveButton') }}
          </button>
        </div>
      </div>

      <!-- Return Dialog -->
      <div v-if="showReturnDialog" class="dialog-overlay" @click.self="showReturnDialog = false">
        <div class="dialog">
          <div class="dialog-header">
            <h3>{{ t('monthlyAssessmentAdmin.dialog.returnTitle') }}</h3>
            <button @click="showReturnDialog = false" class="btn-close">×</button>
          </div>
          <div class="dialog-content">
            <label>{{ t('monthlyAssessmentAdmin.dialog.returnReason') }} *</label>
            <textarea
              v-model="returnReason"
              :placeholder="t('monthlyAssessmentAdmin.dialog.returnPlaceholder')"
              class="form-control"
              rows="4"
            ></textarea>
            <p v-if="returnError" class="error-text">{{ returnError }}</p>
          </div>
          <div class="dialog-actions">
            <button @click="showReturnDialog = false" class="btn btn-cancel">
              {{ t('monthlyAssessmentAdmin.dialog.cancel') }}
            </button>
            <button @click="submitReturn" :disabled="returning" class="btn btn-return">
              {{ returning ? t('monthlyAssessmentAdmin.dialog.returning') : t('monthlyAssessmentAdmin.dialog.return') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Finalize Dialog -->
      <div v-if="showFinalizeDialog" class="dialog-overlay" @click.self="showFinalizeDialog = false">
        <div class="dialog">
          <div class="dialog-header">
            <h3>{{ t('monthlyAssessmentAdmin.dialog.finalizeTitle') }}</h3>
            <button @click="showFinalizeDialog = false" class="btn-close">×</button>
          </div>
          <div class="dialog-content">
            <p>{{ t('monthlyAssessmentAdmin.dialog.finalizeConfirm') }}</p>
            <p class="warning">{{ t('monthlyAssessmentAdmin.dialog.finalizeWarning') }}</p>
          </div>
          <div class="dialog-actions">
            <button @click="showFinalizeDialog = false" class="btn btn-cancel">
              {{ t('monthlyAssessmentAdmin.dialog.cancel') }}
            </button>
            <button @click="submitFinalize" :disabled="finalizing" class="btn btn-finalize">
              {{ finalizing ? t('monthlyAssessmentAdmin.dialog.finalizing') : t('monthlyAssessmentAdmin.dialog.finalize') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Archive Dialog -->
      <div v-if="showArchiveDialog" class="dialog-overlay" @click.self="showArchiveDialog = false">
        <div class="dialog">
          <div class="dialog-header">
            <h3>{{ t('monthlyAssessmentAdmin.dialog.archiveTitle') }}</h3>
            <button @click="showArchiveDialog = false" class="btn-close">×</button>
          </div>
          <div class="dialog-content">
            <p>{{ t('monthlyAssessmentAdmin.dialog.archiveConfirm') }}</p>
            <p class="info-text">{{ t('monthlyAssessmentAdmin.dialog.archiveInfo') }}</p>
          </div>
          <div class="dialog-actions">
            <button @click="showArchiveDialog = false" class="btn btn-cancel">
              {{ t('monthlyAssessmentAdmin.dialog.cancel') }}
            </button>
            <button @click="submitArchive" :disabled="archiving" class="btn btn-archive">
              {{ archiving ? t('monthlyAssessmentAdmin.dialog.archiving') : t('monthlyAssessmentAdmin.dialog.archive') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { useLanguage } from '@/composables/useLanguage'
import {
  fetchMonthlySubmission,
  returnMonthlySubmission,
  finalizeMonthlySubmission,
  archiveMonthlySubmission,
} from '@/modules/preschool/services/preschoolApi'

defineOptions({
  name: 'MonthlyAssessmentReviewDetail',
})

const route = useRoute()
const { t } = useLanguage()

// State
const submission = ref(null)
const loading = ref(true)
const returning = ref(false)
const finalizing = ref(false)
const archiving = ref(false)
const returnReason = ref('')
const returnError = ref(null)
const showReturnDialog = ref(false)
const showFinalizeDialog = ref(false)
const showArchiveDialog = ref(false)

// Computed
const isEditable = computed(() => ['submitted', 'finalized'].includes(submission.value?.status))

const totalCount = computed(() => submission.value?.student_assessments?.length || 0)

const completedCount = computed(() => {
  if (!submission.value?.student_assessments) return 0
  return submission.value.student_assessments.filter(a => a.score !== null && a.score !== undefined).length
})

const hasWorkflowMetadata = computed(() => {
  return submission.value && (submission.value.submitted_at || submission.value.returned_at || submission.value.finalized_at)
})

// Methods
const loadSubmission = async () => {
  try {
    loading.value = true
    submission.value = await fetchMonthlySubmission(route.params.submissionId)
  } catch (error) {
    console.error('Failed to load submission:', error)
    submission.value = null
  } finally {
    loading.value = false
  }
}

const submitReturn = async () => {
  returnError.value = null

  if (!returnReason.value.trim()) {
    returnError.value = t('monthlyAssessmentAdmin.dialog.reasonRequired')
    return
  }

  try {
    returning.value = true
    submission.value = await returnMonthlySubmission(submission.value.id, {
      return_reason: returnReason.value.trim(),
    })
    showReturnDialog.value = false
    returnReason.value = ''
  } catch (error) {
    if (error.response?.status === 422) {
      returnError.value = error.response.data?.message || t('monthlyAssessmentAdmin.error.validationFailed')
    } else if (error.response?.status === 409) {
      await loadSubmission()
      returnError.value = t('monthlyAssessmentAdmin.error.stateChanged')
    } else {
      returnError.value = t('monthlyAssessmentAdmin.error.returnFailed')
    }
  } finally {
    returning.value = false
  }
}

const submitFinalize = async () => {
  try {
    finalizing.value = true
    submission.value = await finalizeMonthlySubmission(submission.value.id)
    showFinalizeDialog.value = false
  } catch (error) {
    if (error.response?.status === 409) {
      await loadSubmission()
    }
    console.error('Failed to finalize:', error)
  } finally {
    finalizing.value = false
  }
}

const submitArchive = async () => {
  try {
    archiving.value = true
    submission.value = await archiveMonthlySubmission(submission.value.id)
    showArchiveDialog.value = false
  } catch (error) {
    if (error.response?.status === 409) {
      await loadSubmission()
    }
    console.error('Failed to archive:', error)
  } finally {
    archiving.value = false
  }
}

const formatStatus = (status) => {
  const statuses = {
    draft: 'Draft',
    submitted: 'Submitted',
    returned: 'Returned',
    finalized: 'Finalized',
    archived: 'Archived',
  }
  return statuses[status] || status
}

const formatMonth = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

const calculateProgress = (submission) => {
  if (!submission.student_assessments?.length) return 0
  const completed = submission.student_assessments.filter(a => a.score !== null && a.score !== undefined).length
  return Math.round((completed / submission.student_assessments.length) * 100)
}

// Lifecycle
onMounted(() => {
  loadSubmission()
})
</script>

<style scoped>
.monthly-assessment-review-detail {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.detail-header {
  margin-bottom: 2rem;
}

.btn-back {
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
}

.btn-back:hover {
  text-decoration: underline;
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
  margin: 0 auto;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.status-banner {
  background: white;
  border-radius: 0.5rem;
  border-left: 4px solid #3b82f6;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-banner.status-submitted {
  border-left-color: #f59e0b;
  background: #fffbeb;
}

.status-banner.status-returned {
  border-left-color: #ef4444;
  background: #fef2f2;
}

.status-banner.status-finalized {
  border-left-color: #10b981;
  background: #f0fdf4;
}

.status-banner.status-archived {
  border-left-color: #6b7280;
  background: #f9fafb;
}

.banner-text {
  color: #374151;
  font-weight: 500;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  white-space: nowrap;
}

.badge-submitted {
  background: #fef3c7;
  color: #92400e;
}

.badge-finalized {
  background: #dcfce7;
  color: #166534;
}

.badge-archived {
  background: #e5e7eb;
  color: #374151;
}

.info-card {
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
}

.info-card h2 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
}

.info-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-row {
  display: flex;
  flex-direction: column;
}

.info-row label {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-row span {
  font-size: 0.95rem;
  color: #374151;
  font-weight: 500;
}

.activity-timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-left: 2px solid #e5e7eb;
  padding-left: 1rem;
}

.activity-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.activity-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.activity-date {
  color: #6b7280;
  font-size: 0.85rem;
}

.activity-reason {
  margin: 0.5rem 0 0 0;
  color: #6b7280;
  font-size: 0.9rem;
  padding: 0.5rem;
  background: #f9fafb;
  border-radius: 0.25rem;
}

.scores-card {
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  overflow-x: auto;
}

.scores-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.snapshot-date {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0 0 1rem 0;
}

.scores-table,
.grading-table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f9fafb;
}

th {
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.85rem;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
}

td {
  padding: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.95rem;
}

tbody tr:hover {
  background: #f9fafb;
}

tr.score-missing {
  opacity: 0.6;
}

.score-cell {
  font-weight: 600;
  color: #1f2937;
}

.observation-cell {
  color: #6b7280;
  font-size: 0.9rem;
}

.grade-cell {
  text-align: center;
}

.actions-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.btn-return {
  background: #fee2e2;
  color: #991b1b;
}

.btn-return:hover:not(:disabled) {
  background: #fca5a5;
}

.btn-finalize {
  background: #dcfce7;
  color: #166534;
}

.btn-finalize:hover:not(:disabled) {
  background: #bbf7d0;
}

.btn-archive {
  background: #e5e7eb;
  color: #374151;
}

.btn-archive:hover:not(:disabled) {
  background: #d1d5db;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: white;
  border-radius: 0.5rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.dialog-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
}

.dialog-content {
  padding: 1.5rem;
}

.dialog-content label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.error-text {
  color: #dc2626;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.warning {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 0.75rem;
  border-radius: 0.25rem;
  color: #78350f;
  margin: 1rem 0 0 0;
}

.info-text {
  background: #eff6ff;
  border-left: 4px solid #3b82f6;
  padding: 0.75rem;
  border-radius: 0.25rem;
  color: #1e3a8a;
  margin: 1rem 0 0 0;
  font-size: 0.95rem;
}

.dialog-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel {
  background: #e5e7eb;
  color: #374151;
}

.btn-cancel:hover:not(:disabled) {
  background: #d1d5db;
}

@media (max-width: 768px) {
  .monthly-assessment-review-detail {
    padding: 1rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .actions-footer {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>

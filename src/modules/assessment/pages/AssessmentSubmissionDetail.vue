<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Tag from 'primevue/tag'
import Textarea from 'primevue/textarea'
import { useLanguage } from '@/composables/useLanguage'
import { assessmentSubmissionApi } from '../services/assessmentSubmissionApi'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

defineOptions({ name: 'AssessmentSubmissionDetailPage' })

const route = useRoute()
const router = useRouter()
const { t } = useLanguage()
const toast = useToast()
const confirm = useConfirm()

const submission = ref(null)
const isLoading = ref(false)
const reviewNote = ref('')

const statusSeverity = {
  draft: 'secondary',
  submitted: 'info',
  under_review: 'warn',
  approved: 'success',
  rejected: 'danger',
}

async function load() {
  isLoading.value = true
  try {
    const res = await assessmentSubmissionApi.get(route.params.id)
    submission.value = res.data.data
  } finally {
    isLoading.value = false
  }
}

async function approve() {
  confirm.require({
    message: t('submissions.confirmApprove'),
    accept: async () => {
      await assessmentSubmissionApi.review(route.params.id, { action: 'approve', note: reviewNote.value })
      toast.add({ severity: 'success', summary: t('common.success'), life: 3000 })
      load()
    },
  })
}

async function reject() {
  confirm.require({
    message: t('submissions.confirmReject'),
    accept: async () => {
      await assessmentSubmissionApi.review(route.params.id, { action: 'reject', note: reviewNote.value })
      toast.add({ severity: 'success', summary: t('common.success'), life: 3000 })
      load()
    },
  })
}

onMounted(load)
</script>

<template>
  <MainLayout>
    <div class="submission-detail">
      <HeaderSection :title="t('submissions.title')">
        <template #actions>
          <Button
            :label="t('common.back')"
            icon="pi pi-arrow-left"
            severity="secondary"
            @click="router.back()"
          />
          <template v-if="submission?.status === 'submitted'">
            <Button :label="t('submissions.actions.approve')" icon="pi pi-check" @click="approve" />
            <Button :label="t('submissions.actions.reject')" icon="pi pi-times" severity="danger" @click="reject" />
          </template>
        </template>
      </HeaderSection>

      <div v-if="isLoading" class="submission-detail__loading">
        <i class="pi pi-spin pi-spinner" />
      </div>

      <template v-else-if="submission">
        <div class="submission-detail__meta">
          <div class="submission-detail__meta-item">
            <span class="submission-detail__meta-label">{{ t('submissions.student') }}</span>
            <span>{{ submission.student?.full_name ?? '—' }}</span>
          </div>
          <div class="submission-detail__meta-item">
            <span class="submission-detail__meta-label">{{ t('submissions.form') }}</span>
            <span>{{ submission.form_template?.name ?? '—' }}</span>
          </div>
          <div class="submission-detail__meta-item">
            <span class="submission-detail__meta-label">{{ t('submissions.status') }}</span>
            <Tag :severity="statusSeverity[submission.status]" :value="t(`submissions.statuses.${submission.status}`)" />
          </div>
          <div class="submission-detail__meta-item">
            <span class="submission-detail__meta-label">{{ t('scoring.totalScore') }}</span>
            <span>{{ submission.total_score ?? '—' }}</span>
          </div>
        </div>

        <div class="submission-detail__review">
          <label>{{ t('submissions.reviewNote') }}</label>
          <Textarea v-model="reviewNote" rows="3" class="w-full" />
        </div>
      </template>
    </div>
  </MainLayout>
</template>

<style scoped>
.submission-detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.submission-detail__loading {
  display: flex;
  justify-content: center;
  padding: 3rem;
}

.submission-detail__meta {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  padding: 1.25rem;
}

.submission-detail__meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.submission-detail__meta-label {
  font-size: 0.8125rem;
  color: var(--text-color-secondary);
  font-weight: 500;
}

.submission-detail__review {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Select from 'primevue/select'
import { useLanguage } from '@/composables/useLanguage'
import { assessmentSubmissionApi } from '../services/assessmentSubmissionApi'

defineOptions({ name: 'AssessmentSubmissionListPage' })

const router = useRouter()
const { t } = useLanguage()

const submissions = ref([])
const isLoading = ref(false)
const statusFilter = ref(null)

const statusOptions = [
  { label: t('submissions.statuses.draft'), value: 'draft' },
  { label: t('submissions.statuses.submitted'), value: 'submitted' },
  { label: t('submissions.statuses.under_review'), value: 'under_review' },
  { label: t('submissions.statuses.approved'), value: 'approved' },
  { label: t('submissions.statuses.rejected'), value: 'rejected' },
]

const statusSeverity = {
  draft: 'secondary',
  submitted: 'info',
  under_review: 'warn',
  approved: 'success',
  rejected: 'danger',
  archived: 'secondary',
}

async function load() {
  isLoading.value = true
  try {
    const params = {}
    if (statusFilter.value) params.status = statusFilter.value
    const res = await assessmentSubmissionApi.list(params)
    submissions.value = res.data.data
  } finally {
    isLoading.value = false
  }
}

onMounted(load)
</script>

<template>
  <MainLayout>
    <div class="submission-list">
      <HeaderSection :title="t('submissions.title')">
        <template #actions>
          <Button
            :label="t('assessmentWizard.title')"
            icon="pi pi-plus"
            @click="router.push({ name: 'assessment-wizard' })"
          />
        </template>
      </HeaderSection>

      <div class="submission-list__filters">
        <Select
          v-model="statusFilter"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          :placeholder="t('submissions.filterByStatus')"
          show-clear
          @change="load"
        />
      </div>

      <DataTable :value="submissions" :loading="isLoading">
        <Column field="id" :header="t('submissions.submissionId')" />
        <Column :header="t('submissions.student')">
          <template #body="{ data }">
            {{ data.student?.full_name ?? '—' }}
          </template>
        </Column>
        <Column :header="t('submissions.form')">
          <template #body="{ data }">
            {{ data.form_template?.name ?? '—' }}
          </template>
        </Column>
        <Column :header="t('submissions.status')">
          <template #body="{ data }">
            <Tag :severity="statusSeverity[data.status]" :value="t(`submissions.statuses.${data.status}`)" />
          </template>
        </Column>
        <Column field="submitted_at" :header="t('submissions.submittedAt')" />
        <Column :header="t('common.actions')">
          <template #body="{ data }">
            <Button
              icon="pi pi-eye"
              severity="secondary"
              size="small"
              @click="router.push({ name: 'assessment-submission-detail', params: { id: data.id } })"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </MainLayout>
</template>

<style scoped>
.submission-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.submission-list__filters {
  display: flex;
  gap: 0.75rem;
}
</style>

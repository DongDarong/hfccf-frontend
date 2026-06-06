<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import { useLanguage } from '@/composables/useLanguage'
import { assessmentSubmissionApi } from '../services/assessmentSubmissionApi'

defineOptions({ name: 'AssessmentSubmissionListPage' })

const router = useRouter()
const { t }  = useLanguage()

const submissions  = ref([])
const isLoading    = ref(false)
const total        = ref(0)
const search       = ref('')
const statusFilter = ref(null)

const statusOptions = computed(() =>
  ['draft', 'submitted', 'under_review', 'approved', 'rejected'].map(v => ({
    label: t(`submissions.statuses.${v}`),
    value: v,
  }))
)

const statusSeverity = {
  draft: 'secondary', submitted: 'info', under_review: 'warn', approved: 'success', rejected: 'danger', archived: 'secondary',
}

let searchDebounce = null
watch(search, () => {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(load, 350)
})
watch(statusFilter, load)

async function load() {
  isLoading.value = true
  try {
    const params = {}
    if (statusFilter.value)   params.status = statusFilter.value
    if (search.value.trim())  params.search = search.value.trim()
    const res = await assessmentSubmissionApi.list(params)
    submissions.value = res.data.data
    total.value = res.data.meta?.total ?? submissions.value.length
  } finally {
    isLoading.value = false
  }
}

onMounted(load)
</script>

<template>
  <MainLayout>
    <div class="flex flex-col gap-6">
      <HeaderSection :title="t('submissions.title')">
        <template #actions>
          <Button
            :label="t('assessmentWizard.title')"
            icon="pi pi-plus"
            @click="router.push({ name: 'assessment-wizard' })"
          />
        </template>
      </HeaderSection>

      <!-- Filters -->
      <div class="flex flex-wrap gap-3">
        <span class="p-input-icon-left min-w-48 flex-1">
          <i class="pi pi-search text-slate-400" />
          <InputText
            v-model="search"
            :placeholder="t('submissions.filterByStudent')"
            class="w-full pl-8"
          />
        </span>
        <Select
          v-model="statusFilter"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          :placeholder="t('submissions.filterByStatus')"
          show-clear
          class="w-44"
        />
      </div>

      <!-- Result count -->
      <p class="-mt-3 text-xs text-slate-400">{{ total }} {{ t('submissions.noSubmissions') }}</p>

      <DataTable
        :value="submissions"
        :loading="isLoading"
        class="rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        <template #empty>
          <div class="py-12 text-center text-sm text-slate-400">
            <i class="pi pi-inbox mb-3 block text-3xl" />
            {{ t('submissions.noSubmissions') }}
          </div>
        </template>

        <Column field="id" :header="t('submissions.submissionId')" />
        <Column :header="t('submissions.student')">
          <template #body="{ data }">
            <p class="font-medium text-slate-800">{{ data.student?.full_name ?? '—' }}</p>
            <p class="text-xs text-slate-400">{{ data.student?.student_code }}</p>
          </template>
        </Column>
        <Column :header="t('submissions.form')">
          <template #body="{ data }">
            <span class="text-sm text-slate-700">{{ data.form_template?.name ?? '—' }}</span>
          </template>
        </Column>
        <Column :header="t('submissions.status')">
          <template #body="{ data }">
            <Tag :severity="statusSeverity[data.status]" :value="t(`submissions.statuses.${data.status}`)" />
          </template>
        </Column>
        <Column :header="t('submissions.submittedAt')">
          <template #body="{ data }">
            <span class="text-xs text-slate-400">{{ data.submitted_at ? new Date(data.submitted_at).toLocaleDateString() : '—' }}</span>
          </template>
        </Column>
        <Column :header="t('common.table.actions')">
          <template #body="{ data }">
            <Button
              icon="pi pi-eye"
              severity="secondary"
              size="sm"
              @click="router.push({ name: 'assessment-submission-detail', params: { id: data.id } })"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </MainLayout>
</template>

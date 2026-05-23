<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import { useLanguage } from '@/composables/useLanguage'
import { assessmentFormApi } from '../services/assessmentFormApi'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

defineOptions({ name: 'AssessmentFormListPage' })

const router = useRouter()
const { t } = useLanguage()
const confirm = useConfirm()
const toast = useToast()

const forms = ref([])
const isLoading = ref(false)
const total = ref(0)

const statusSeverity = {
  draft: 'warn',
  published: 'success',
  archived: 'secondary',
}

async function load() {
  isLoading.value = true
  try {
    const res = await assessmentFormApi.list({ module: 'preschool' })
    forms.value = res.data.data
    total.value = res.data.meta?.total ?? forms.value.length
  } finally {
    isLoading.value = false
  }
}

async function archive(id) {
  confirm.require({
    message: t('formBuilder.archiveConfirm'),
    accept: async () => {
      await assessmentFormApi.archive(id)
      toast.add({ severity: 'success', summary: t('common.success'), life: 3000 })
      load()
    },
  })
}

async function duplicate(id) {
  await assessmentFormApi.duplicate(id)
  toast.add({ severity: 'success', summary: t('common.success'), life: 3000 })
  load()
}

onMounted(load)
</script>

<template>
  <MainLayout>
    <div class="assessment-form-list">
      <HeaderSection :title="t('formBuilder.title')">
        <template #actions>
          <Button
            :label="t('formBuilder.newForm')"
            icon="pi pi-plus"
            @click="router.push({ name: 'assessment-form-create' })"
          />
        </template>
      </HeaderSection>

      <DataTable :value="forms" :loading="isLoading" class="assessment-form-list__table">
        <Column field="name" :header="t('formBuilder.formName')" />
        <Column field="module" :header="t('formBuilder.module')" />
        <Column :header="t('formBuilder.status')">
          <template #body="{ data }">
            <Tag :severity="statusSeverity[data.status]" :value="t(`formBuilder.statuses.${data.status}`)" />
          </template>
        </Column>
        <Column field="current_version" :header="t('formBuilder.version')" />
        <Column :header="t('common.actions')">
          <template #body="{ data }">
            <div class="assessment-form-list__actions">
              <Button
                icon="pi pi-pencil"
                severity="secondary"
                size="small"
                @click="router.push({ name: 'assessment-form-edit', params: { id: data.id } })"
              />
              <Button
                icon="pi pi-copy"
                severity="secondary"
                size="small"
                @click="duplicate(data.id)"
              />
              <Button
                icon="pi pi-inbox"
                severity="secondary"
                size="small"
                @click="archive(data.id)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </MainLayout>
</template>

<style scoped>
.assessment-form-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.assessment-form-list__actions {
  display: flex;
  gap: 0.5rem;
}
</style>

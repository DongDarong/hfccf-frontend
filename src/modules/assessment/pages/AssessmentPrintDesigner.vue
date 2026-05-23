<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useLanguage } from '@/composables/useLanguage'
import { assessmentPrintApi } from '../services/assessmentPrintApi'
import { useToast } from 'primevue/usetoast'

defineOptions({ name: 'AssessmentPrintDesignerPage' })

const route = useRoute()
const { t } = useLanguage()
const toast = useToast()

const templates = ref([])
const isLoading = ref(false)

async function load() {
  isLoading.value = true
  try {
    const res = await assessmentPrintApi.list({ form_template_id: route.params.id })
    templates.value = res.data.data
  } finally {
    isLoading.value = false
  }
}

onMounted(load)
</script>

<template>
  <MainLayout>
    <div class="print-designer">
      <HeaderSection :title="t('printDesigner.title')">
        <template #actions>
          <Button :label="t('printDesigner.newTemplate')" icon="pi pi-plus" />
        </template>
      </HeaderSection>

      <DataTable :value="templates" :loading="isLoading">
        <Column field="name" :header="t('printDesigner.templateName')" />
        <Column field="orientation" :header="t('printDesigner.orientation')" />
        <Column field="page_size" :header="t('printDesigner.pageSize')" />
        <Column :header="t('common.actions')">
          <template #body>
            <Button icon="pi pi-pencil" severity="secondary" size="small" />
          </template>
        </Column>
      </DataTable>
    </div>
  </MainLayout>
</template>

<style scoped>
.print-designer {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>

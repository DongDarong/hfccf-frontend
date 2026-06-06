<script setup>
import { onMounted, ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useLanguage } from '@/composables/useLanguage'
import { assessmentReportApi } from '../services/assessmentReportApi'

defineOptions({ name: 'AssessmentAuditLogsPage' })

const { t } = useLanguage()

const logs      = ref([])
const isLoading = ref(false)

async function load() {
  isLoading.value = true
  try {
    const res = await assessmentReportApi.auditLogs()
    logs.value = res.data.data
  } finally {
    isLoading.value = false
  }
}

onMounted(load)
</script>

<template>
  <MainLayout>
    <div class="flex flex-col gap-6">
      <HeaderSection :title="t('assessmentReports.auditLogs.title')" />

      <DataTable
        :value="logs"
        :loading="isLoading"
        class="rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        <template #empty>
          <div class="py-12 text-center text-sm text-slate-400">
            <i class="pi pi-list mb-3 block text-3xl" />
            {{ t('assessmentReports.auditLogs.noLogs') }}
          </div>
        </template>

        <Column field="event" :header="t('assessmentReports.auditLogs.event')" />
        <Column :header="t('assessmentReports.auditLogs.actor')">
          <template #body="{ data }">
            <span class="text-sm text-slate-700">{{ data.actor?.name ?? '—' }}</span>
          </template>
        </Column>
        <Column field="description" :header="t('assessmentReports.auditLogs.description')" />
        <Column :header="t('assessmentReports.auditLogs.timestamp')">
          <template #body="{ data }">
            <span class="text-xs text-slate-400">{{ data.created_at ? new Date(data.created_at).toLocaleString() : '—' }}</span>
          </template>
        </Column>
      </DataTable>
    </div>
  </MainLayout>
</template>

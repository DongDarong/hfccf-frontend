<template>
  <div>
    <DataTable
      :value="items"
      :loading="loading"
      striped-rows
      responsive-layout="scroll"
      class="text-sm"
    >
      <Column field="performedAt" :header="t('preschoolGuardianRemediation.table.performedAt')">
        <template #body="{ data }">
          {{ data.performedAt ? new Date(data.performedAt).toLocaleString() : '—' }}
        </template>
      </Column>
      <Column field="issueType" :header="t('preschoolGuardianRemediation.table.issueType')" />
      <Column field="action" :header="t('preschoolGuardianRemediation.table.action')">
        <template #body="{ data }">
          {{ ACTION_LABELS[data.action] ?? data.action }}
        </template>
      </Column>
      <Column field="performedByName" :header="t('preschoolGuardianRemediation.table.performedBy')">
        <template #body="{ data }">{{ data.performedByName ?? '—' }}</template>
      </Column>
      <Column field="notes" :header="t('preschoolGuardianRemediation.table.notes')">
        <template #body="{ data }">{{ data.notes ?? '—' }}</template>
      </Column>
      <Column :header="t('preschoolGuardianRemediation.table.snapshots')">
        <template #body="{ data }">
          <Button
            v-if="data.beforeSnapshot || data.afterSnapshot"
            :label="t('preschoolGuardianRemediation.table.viewSnapshots')"
            size="small"
            text
            @click="$emit('view-snapshots', data)"
          />
          <span v-else>—</span>
        </template>
      </Column>
    </DataTable>

    <div v-if="meta.total > 0" class="flex justify-end mt-3">
      <Paginator
        :rows="meta.perPage"
        :total-records="meta.total"
        :first="(meta.currentPage - 1) * meta.perPage"
        @page="$emit('page-change', $event)"
      />
    </div>

    <div
      v-if="!loading && items.length === 0"
      class="text-center py-8 text-surface-400"
    >
      {{ t('preschoolGuardianRemediation.table.empty') }}
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Paginator from 'primevue/paginator'
import { useLanguage } from '@/composables/useLanguage'
import { ACTION_LABELS } from '@/modules/preschool/services/api/preschoolGuardianRemediationMappers'

defineProps({
  items: { type: Array, default: () => [] },
  meta: { type: Object, default: () => ({ currentPage: 1, lastPage: 1, perPage: 25, total: 0 }) },
  loading: { type: Boolean, default: false },
})

defineEmits(['view-snapshots', 'page-change'])

const { t } = useLanguage()
</script>

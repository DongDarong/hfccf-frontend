<script setup>
import { computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Button from '@/components/buttons/Button.vue'
import Loading from '@/components/feedback/Loading.vue'

defineOptions({
  name: 'ClassTable',
})

const props = defineProps({
  classes: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  emptyText: {
    type: String,
    default: 'No classes found.',
  },
})

const emit = defineEmits(['view', 'edit', 'delete'])

const normalizedRows = computed(() =>
  props.classes.map((item, index) => ({
    id: item.id || `class-${index + 1}`,
    code: item.code || item.classCode || '-',
    name: item.name || item.className || '-',
    teacher: item.teacher || item.teacherName || '-',
    level: item.level || item.grade || '-',
    schedule: item.schedule || item.time || '-',
    students: item.students ?? item.studentCount ?? 0,
    status: item.status || 'Active',
    raw: item,
  })),
)

function statusSeverity(status) {
  const value = String(status || '').trim().toLowerCase()
  if (value === 'active' || value === 'open') return 'success'
  if (value === 'pending') return 'warn'
  if (value === 'inactive' || value === 'closed') return 'danger'
  return 'secondary'
}
</script>

<template>
  <DataTable
    :value="normalizedRows"
    data-key="id"
    striped-rows
    removable-sort
    class="class-table"
    :loading="loading"
  >
    <template #empty>
      <div class="px-4 py-7 text-center text-sm text-slate-500">
        {{ emptyText }}
      </div>
    </template>

    <template #loading>
      <div class="px-4 py-8">
        <Loading label="Loading classes..." size="md" />
      </div>
    </template>

    <Column field="code" header="Code" sortable />
    <Column field="name" header="Class" sortable />
    <Column field="teacher" header="Teacher" sortable />
    <Column field="level" header="Level" sortable />
    <Column field="schedule" header="Schedule" />
    <Column field="students" header="Students" sortable>
      <template #body="{ data }">
        <span class="font-semibold text-slate-700">{{ data.students }}</span>
      </template>
    </Column>
    <Column field="status" header="Status" sortable>
      <template #body="{ data }">
        <Tag :value="data.status" :severity="statusSeverity(data.status)" rounded />
      </template>
    </Column>
    <Column header="Actions" :pt="{ headerCell: { class: 'text-right' }, bodyCell: { class: 'text-right' } }">
      <template #body="{ data }">
        <div class="flex justify-end gap-2">
          <Button variant="outline" size="sm" @click="emit('view', data.raw)">View</Button>
          <Button variant="primary" size="sm" @click="emit('edit', data.raw)">Edit</Button>
          <Button variant="danger" size="sm" @click="emit('delete', data.raw)">Delete</Button>
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
:deep(.class-table.p-datatable) {
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  overflow: hidden;
}

:deep(.class-table .p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #475569;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

:deep(.class-table .p-datatable-tbody > tr > td) {
  padding: 0.95rem 1rem;
}
</style>


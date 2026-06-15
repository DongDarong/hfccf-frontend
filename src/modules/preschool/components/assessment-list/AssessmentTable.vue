<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import StatusBadge from '@/modules/preschool/components/assessment-common/StatusBadge.vue'
import RatingBadge from '@/modules/preschool/components/assessment-common/RatingBadge.vue'
import ActionMenu from './ActionMenu.vue'

defineOptions({
  name: 'AssessmentTable',
})

const props = defineProps({
  assessments: {
    type: Array,
    required: true,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  paginated: {
    type: Boolean,
    default: false,
  },
  totalRecords: {
    type: Number,
    default: 0,
  },
  rows: {
    type: Number,
    default: 25,
  },
})

const emit = defineEmits(['edit', 'finalize', 'archive', 'view', 'page-change'])

const selectedAssessments = ref([])

function getCategoryName(categoryId) {
  return props.categories.find(category => category.id === categoryId)?.name || '-'
}

function getStudentIdentifier(student) {
  return student?.publicId || student?.studentCode || student?.code || '-'
}

function handlePageChange(event) {
  emit('page-change', {
    page: event.page + 1,
    rows: event.rows,
  })
}
</script>

<template>
  <DataTable
    v-model:selection="selectedAssessments"
    :value="assessments"
    :loading="loading"
    :paginator="paginated"
    :rows="rows"
    :total-records="totalRecords"
    paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rows-per-page-options="[10, 25, 50, 100]"
    current-page-report-template="Showing {first} to {last} of {totalRecords} assessments"
    responsive-layout="scroll"
    striped-rows
    show-gridlines
    class="w-full"
    @page="handlePageChange"
  >
    <Column
      selection-mode="multiple"
      header-style="width: 3rem"
    />

    <Column
      field="student.fullName"
      header="Student"
      sortable
    >
      <template #body="{ data }">
        <div class="space-y-0.5">
          <p class="font-medium text-slate-900">
            {{ data.student?.fullName || '-' }}
          </p>
          <p class="text-xs text-slate-500">
            {{ getStudentIdentifier(data.student) }}
          </p>
        </div>
      </template>
    </Column>

    <Column
      field="class.name"
      header="Class"
      sortable
    >
      <template #body="{ data }">
        <span class="text-sm text-slate-700">
          {{ data.class?.code ? `${data.class.code} - ` : '' }}{{ data.class?.name || '-' }}
        </span>
      </template>
    </Column>

    <Column
      field="category.name"
      header="Category"
      sortable
    >
      <template #body="{ data }">
        <span class="text-sm font-medium text-slate-700">
          {{ getCategoryName(data.categoryId) }}
        </span>
      </template>
    </Column>

    <Column
      field="assessmentDate"
      header="Date"
      sortable
      sort-field="assessmentDate"
    >
      <template #body="{ data }">
        <span class="text-sm text-slate-700">
          {{ data.assessmentDate ? new Date(data.assessmentDate).toLocaleDateString() : '-' }}
        </span>
      </template>
    </Column>

    <Column
      field="score"
      header="Score"
      sortable
      style="width: 10%"
    >
      <template #body="{ data }">
        <div class="text-center">
          <span
            v-if="data.score !== null && data.score !== undefined && data.score !== ''"
            :class="[
              'inline-block rounded-lg px-3 py-1 font-bold text-white',
              parseFloat(data.score) >= 80
                ? 'bg-blue-500'
                : parseFloat(data.score) >= 70
                  ? 'bg-emerald-500'
                  : parseFloat(data.score) >= 60
                    ? 'bg-amber-500'
                    : 'bg-red-500',
            ]"
          >
            {{ data.score }}
          </span>
          <span v-else class="text-sm text-slate-400">-</span>
        </div>
      </template>
    </Column>

    <Column
      field="rating"
      header="Rating"
    >
      <template #body="{ data }">
        <RatingBadge
          v-if="data.rating"
          :rating="data.rating"
          size="sm"
        />
        <span v-else class="text-sm text-slate-400">-</span>
      </template>
    </Column>

    <Column
      field="status"
      header="Status"
    >
      <template #body="{ data }">
        <StatusBadge
          :status="data.status"
          size="sm"
        />
      </template>
    </Column>

    <Column
      field="actions"
      header="Actions"
      style="width: 8%"
    >
      <template #body="{ data }">
        <ActionMenu
          :assessment="data"
          :can-edit="data.status === 'draft'"
          :can-finalize="data.status === 'draft'"
          :can-archive="true"
          @edit="emit('edit', data)"
          @finalize="emit('finalize', data)"
          @archive="emit('archive', data)"
          @view="emit('view', data)"
        />
      </template>
    </Column>

    <template #empty>
      <div class="py-8 text-center">
        <p class="text-slate-500">No assessments found.</p>
      </div>
    </template>

    <template #loadingicon>
      <i class="pi pi-spin pi-spinner" />
    </template>
  </DataTable>
</template>

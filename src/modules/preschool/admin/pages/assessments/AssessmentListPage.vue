<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Select from 'primevue/select'
import { useAssessmentStore } from '@/modules/preschool/stores/assessmentStore'
import { useAssessmentData } from '@/modules/preschool/composables/useAssessmentData'
import { useAssessmentFilters } from '@/modules/preschool/composables/useAssessmentFilters'
import { useAssessmentMutations } from '@/modules/preschool/composables/useAssessmentMutations'
import FilterBar from '@/modules/preschool/components/assessment-list/FilterBar.vue'
import AssessmentTable from '@/modules/preschool/components/assessment-list/AssessmentTable.vue'
import AssessmentModal from '@/modules/preschool/components/assessment-form/AssessmentModal.vue'

defineOptions({
  name: 'PreschoolAssessmentListPage',
})

const route = useRoute()
const store = useAssessmentStore()

const {
  loadAllLookupData,
  loadAssessments,
  assessments,
  categories,
  studentOptions,
  classOptions,
  loading,
} = useAssessmentData()

const {
  studentFilter,
  classFilter,
  categoryFilter,
  periodFilter,
  statusFilter,
  searchFilter,
  dateFromFilter,
  dateToFilter,
  activeFilterCount,
  clearAllFilters,
  filteredAssessments,
} = useAssessmentFilters()

const {
  saveAssessment,
  updateAssessment,
  finalizeAssessment,
  archiveAssessment,
  validationErrors,
  saving,
} = useAssessmentMutations()

const selectedStudentId = ref(route.query.studentId ? Number(route.query.studentId) : null)

const isFormOpen = computed(() => store.isFormOpen)
const editingAssessment = computed(() => store.editingAssessment)
const selectedStudent = computed(() => {
  if (!selectedStudentId.value) return null
  return studentOptions.value.find(option => option.value === selectedStudentId.value) || null
})

const categoryOptions = computed(() =>
  categories.value.map(category => ({
    label: category.name,
    value: category.id,
  }))
)

const filterSummary = computed(() => [
  { label: 'Student', value: selectedStudent.value?.label || 'Choose a student' },
  { label: 'Assessments', value: filteredAssessments.value.length.toString() },
  { label: 'Active Filters', value: activeFilterCount.value.toString() },
])

onMounted(async () => {
  await loadAllLookupData()
})

watch(
  selectedStudentId,
  async (value) => {
    if (value) {
      await loadAssessments(value)
      return
    }

    store.reset()
  },
  { immediate: true }
)

async function handleSaveAssessment(data) {
  if (!selectedStudentId.value) return

  try {
    if (data.id) {
      await updateAssessment(data.id, data)
    } else {
      await saveAssessment(selectedStudentId.value, data)
    }
    store.closeForm()
    await loadAssessments(selectedStudentId.value)
  } catch (err) {
    console.error('Save failed:', err)
  }
}

async function handleFinalizeAssessment(assessmentId) {
  try {
    await finalizeAssessment(assessmentId)
    store.closeForm()
    if (selectedStudentId.value) {
      await loadAssessments(selectedStudentId.value)
    }
  } catch (err) {
    console.error('Finalize failed:', err)
  }
}

async function handleArchiveAssessment(assessment) {
  if (!assessment) return

  if (confirm(`Archive assessment for ${assessment.student?.fullName || 'this student'}?`)) {
    try {
      await archiveAssessment(assessment.id)
      if (selectedStudentId.value) {
        await loadAssessments(selectedStudentId.value)
      }
    } catch (err) {
      console.error('Archive failed:', err)
    }
  }
}

function handleOpenCreateForm() {
  if (!selectedStudentId.value) return
  store.openCreateForm()
}

function handleOpenEditForm(assessment) {
  store.openEditForm(assessment)
}

function handlePageChange(pagination) {
  if (!selectedStudentId.value) return

  loadAssessments(selectedStudentId.value, {
    page: pagination.page,
    perPage: pagination.rows,
  })
}
</script>

<template>
  <MainLayout>
    <div class="space-y-6">
      <HeaderSection
        title="Assessment List"
        subtitle="Select a student, review their assessments, and manage draft or finalized records."
      />

      <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="grid gap-4 lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] lg:items-end">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Student</label>
            <Select
              v-model="selectedStudentId"
              :options="studentOptions"
              option-label="label"
              option-value="value"
              filter
              show-clear
              placeholder="Choose a student to load assessments"
              class="w-full"
            />
          </div>

          <div
            v-for="item in filterSummary"
            :key="item.label"
            class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {{ item.label }}
            </p>
            <p class="mt-1 text-sm font-semibold text-slate-900">{{ item.value }}</p>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap gap-3">
          <Button
            label="Create Assessment"
            icon="pi pi-plus"
            :disabled="!selectedStudentId"
            @click="handleOpenCreateForm"
          />
          <Button
            label="Clear Filters"
            icon="pi pi-filter-slash"
            variant="secondary"
            :disabled="!activeFilterCount"
            @click="clearAllFilters"
          />
        </div>
      </section>

      <FilterBar
        v-model:student-filter="studentFilter"
        v-model:class-filter="classFilter"
        v-model:category-filter="categoryFilter"
        v-model:period-filter="periodFilter"
        v-model:status-filter="statusFilter"
        v-model:search-filter="searchFilter"
        v-model:date-from-filter="dateFromFilter"
        v-model:date-to-filter="dateToFilter"
        :student-options="studentOptions"
        :class-options="classOptions"
        :category-options="categoryOptions"
        :active-filter-count="activeFilterCount"
        @clear-all="clearAllFilters"
      />

      <AssessmentTable
        :assessments="filteredAssessments"
        :categories="categories"
        :loading="loading"
        :paginated="true"
        :total-records="assessments.length"
        :rows="25"
        @edit="handleOpenEditForm"
        @finalize="handleFinalizeAssessment"
        @archive="handleArchiveAssessment"
        @page-change="handlePageChange"
      />

      <AssessmentModal
        v-model:visible="isFormOpen"
        :assessment="editingAssessment"
        :categories="categories"
        :student-options="studentOptions"
        :class-options="classOptions"
        :validation-errors="validationErrors"
        :saving="saving"
        @save="handleSaveAssessment"
        @finalize="handleFinalizeAssessment"
      />

      <div
        v-if="!loading && selectedStudentId && filteredAssessments.length === 0"
        class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center"
      >
        <p class="text-lg text-slate-600">No assessments found for the selected student.</p>
        <p class="mt-2 text-sm text-slate-500">
          Create the first assessment or clear filters to review the full student history.
        </p>
        <Button
          label="Create Assessment"
          icon="pi pi-plus"
          size="sm"
          class="mt-4"
          @click="handleOpenCreateForm"
        />
      </div>

      <div
        v-if="!selectedStudentId"
        class="rounded-2xl border border-dashed border-blue-200 bg-blue-50 p-12 text-center"
      >
        <p class="text-lg font-semibold text-blue-900">Choose a student to begin.</p>
        <p class="mt-2 text-sm text-blue-700">
          The Preschool assessment API is student-based, so the list opens around one student context at a time.
        </p>
      </div>
    </div>
  </MainLayout>
</template>

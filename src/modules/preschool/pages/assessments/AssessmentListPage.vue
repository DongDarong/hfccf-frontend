<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
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
  filteredAssessments,
  activeFilterCount,
  studentFilter,
  classFilter,
  categoryFilter,
  periodFilter,
  statusFilter,
  searchFilter,
} = useAssessmentFilters()

const {
  saveAssessment,
  updateAssessment,
  finalizeAssessment,
  archiveAssessment,
  validationErrors,
  saving,
} = useAssessmentMutations()

// Modal state - managed in composables
const store = useAssessmentStore()
const isFormOpen = computed(() => store.isFormOpen)
const editingAssessment = computed(() => store.editingAssessment)

// Get student ID from URL or state
const studentId = computed(() => route.query.studentId || null)

onMounted(async () => {
  await loadAllLookupData()
  if (studentId.value) {
    await loadAssessments(studentId.value)
  }
})

// Category options for filters
const categoryOptions = computed(() =>
  categories.value.map(cat => ({
    label: cat.name,
    value: cat.id,
  }))
)

async function handleSaveAssessment(data) {
  try {
    if (data.id) {
      await updateAssessment(data.id, data)
    } else {
      await saveAssessment(studentId.value, data)
    }
    store.closeForm()
    await loadAssessments(studentId.value)
  } catch (err) {
    console.error('Save failed:', err)
  }
}

async function handleFinalizeAssessment(assessmentId) {
  try {
    await finalizeAssessment(assessmentId)
    store.closeForm()
    await loadAssessments(studentId.value)
  } catch (err) {
    console.error('Finalize failed:', err)
  }
}

async function handleArchiveAssessment(assessment) {
  if (confirm(`Archive assessment for ${assessment.student?.fullName}?`)) {
    try {
      await archiveAssessment(assessment.id)
      await loadAssessments(studentId.value)
    } catch (err) {
      console.error('Archive failed:', err)
    }
  }
}

function handleOpenCreateForm() {
  store.openCreateForm()
}

function handleOpenEditForm(assessment) {
  store.openEditForm(assessment)
}

function handlePageChange(pagination) {
  loadAssessments(studentId.value, {
    page: pagination.page,
    perPage: pagination.rows
  })
}
</script>

<template>
  <MainLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <HeaderSection
          title="📋 Assessment List"
          subtitle="View and manage all student assessments"
        />

        <!-- Action Button -->
        <div class="mt-4">
          <Button
            label="➕ Create New Assessment"
            icon="pi pi-plus"
            @click="handleOpenCreateForm"
          />
        </div>
      </div>

      <!-- Filter Bar -->
      <FilterBar
        v-model:student-filter="studentFilter"
        v-model:class-filter="classFilter"
        v-model:category-filter="categoryFilter"
        v-model:period-filter="periodFilter"
        v-model:status-filter="statusFilter"
        v-model:search-filter="searchFilter"
        :student-options="studentOptions"
        :class-options="classOptions"
        :category-options="categoryOptions"
        :active-filter-count="activeFilterCount"
        @clear-all="clearAllFilters"
      />

      <!-- Assessment Table -->
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

      <!-- Assessment Modal -->
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

      <!-- Empty State -->
      <div
        v-if="!loading && filteredAssessments.length === 0"
        class="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center"
      >
        <p class="text-lg text-gray-600">📭 No assessments found</p>
        <p class="mt-2 text-sm text-gray-500">
          Create your first assessment or adjust your filters
        </p>
        <Button
          label="Create Assessment"
          icon="pi pi-plus"
          size="sm"
          class="mt-4"
          @click="handleOpenCreateForm"
        />
      </div>
    </div>
  </MainLayout>
</template>

<script>
import { useAssessmentStore } from '@/modules/preschool/stores/assessmentStore'
import { useAssessmentFilters } from '@/modules/preschool/composables/useAssessmentFilters'

export default {
  setup() {
    const { clearAllFilters } = useAssessmentFilters()
    return { clearAllFilters }
  },
}
</script>

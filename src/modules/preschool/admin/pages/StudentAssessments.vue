<script setup>
// Keep the assessment list page thin so the list, edit dialog, and summary
// links can share one teacher/admin flow without duplicating backend calls.
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import { useLanguage } from '@/composables/useLanguage'
import AssessmentForm from '@/modules/preschool/shared/components/assessment/AssessmentForm.vue'
import AssessmentList from '@/modules/preschool/shared/components/assessment/AssessmentList.vue'
import { usePreschoolAssessments } from '@/modules/preschool/composables/usePreschoolAssessments'

defineOptions({
  name: 'PreschoolStudentAssessmentsPage',
})

const router = useRouter()
const { t } = useLanguage()

const {
  assessmentItems,
  archiveAssessmentById,
  categoryOptions,
  classOptions,
  errorMessage,
  finalizeAssessmentById,
  isTermLocked,
  isReportPeriodLocked,
  loadAssessments,
  loadLookupData,
  loading,
  pagination,
  lockMessage,
  saveAssessment,
  searchQuery,
  selectedCategoryId,
  selectedClassId,
  selectedPeriodLabel,
  selectedStatus,
  selectedStudentId,
  setSelectedCategoryId,
  setSelectedClassId,
  setSelectedPeriodLabel,
  setSelectedStatus,
  setSelectedStudentId,
  setSearchQuery,
  studentOptions,
  saving,
} = usePreschoolAssessments()

const isFormOpen = ref(false)
const editingAssessment = ref(null)
const formModel = ref({
  class_id: '',
  category_id: '',
  period_label: '',
  assessment_date: '',
  score: '',
  rating: '',
  observation: '',
  teacher_comment: '',
})

const pageTitle = computed(() => t('preschoolAssessmentPage.title'))
const pageSubtitle = computed(() => t('preschoolAssessmentPage.subtitle'))

function resetForm() {
  formModel.value = {
    class_id: selectedClassId.value || '',
    category_id: selectedCategoryId.value || '',
    period_label: selectedPeriodLabel.value || '',
    assessment_date: '',
    score: '',
    rating: '',
    observation: '',
    teacher_comment: '',
  }
}

function openCreateForm() {
  editingAssessment.value = null
  resetForm()
  isFormOpen.value = true
}

function openEditForm(assessment) {
  editingAssessment.value = assessment || null
  formModel.value = {
    class_id: assessment?.classId || '',
    category_id: assessment?.categoryId || '',
    period_label: assessment?.periodLabel || '',
    assessment_date: assessment?.assessmentDate || '',
    score: assessment?.score ?? '',
    rating: assessment?.rating || '',
    observation: assessment?.observation || '',
    teacher_comment: assessment?.teacherComment || '',
  }
  isFormOpen.value = true
}

function closeForm() {
  isFormOpen.value = false
  editingAssessment.value = null
  resetForm()
}

async function applyFilters() {
  await loadAssessments(selectedStudentId.value, {
    page: 1,
    status: selectedStatus.value,
    categoryId: selectedCategoryId.value,
    periodLabel: selectedPeriodLabel.value,
    search: searchQuery.value,
    classId: selectedClassId.value,
  })
}

async function onSaveAssessment() {
  try {
    const result = await saveAssessment(selectedStudentId.value, formModel.value, editingAssessment.value?.id || '')
    isFormOpen.value = false
    editingAssessment.value = result
    await applyFilters()
  } catch (error) {
    errorMessage.value = error?.message || t('preschoolAssessmentPage.messages.saveFailed')
  }
}

async function onFinalizeAssessment(assessment) {
  try {
    await finalizeAssessmentById(assessment?.id)
  } catch (error) {
    errorMessage.value = error?.message || t('preschoolAssessmentPage.messages.finalizeFailed')
  }
}

async function onArchiveAssessment(assessment) {
  try {
    await archiveAssessmentById(assessment?.id)
  } catch (error) {
    errorMessage.value = error?.message || t('preschoolAssessmentPage.messages.archiveFailed')
  }
}

function onPageChange(page) {
  loadAssessments(selectedStudentId.value, {
    page,
    status: selectedStatus.value,
    categoryId: selectedCategoryId.value,
    periodLabel: selectedPeriodLabel.value,
    search: searchQuery.value,
    classId: selectedClassId.value,
  })
}

function openProgressSummary() {
  if (!selectedStudentId.value) return
  router.push({
    name: 'dashboard-preschool-progress-summary',
    query: { studentId: selectedStudentId.value },
  })
}

onMounted(async () => {
  await loadLookupData()

  if (selectedStudentId.value) {
    await loadAssessments(selectedStudentId.value)
  }
})
</script>

<template>
  <MainLayout>
    <section class="preschool-assessments-page">
      <HeaderSection :title="pageTitle" :subtitle="pageSubtitle" />

      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="grid gap-3 md:grid-cols-5">
          <label class="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
            <span>{{ t('preschoolAssessmentPage.filters.student') }}</span>
            <Select
              :model-value="selectedStudentId"
              :options="studentOptions"
              option-label="label"
              option-value="value"
              class="w-full"
              :placeholder="t('preschoolAssessmentPage.placeholders.student')"
              @update:model-value="setSelectedStudentId"
            />
          </label>

          <label class="space-y-2 text-sm font-medium text-slate-700">
            <span>{{ t('preschoolAssessmentPage.filters.class') }}</span>
            <Select
              :model-value="selectedClassId"
              :options="classOptions"
              option-label="label"
              option-value="value"
              class="w-full"
              :placeholder="t('preschoolAssessmentPage.placeholders.class')"
              @update:model-value="setSelectedClassId"
            />
          </label>

          <label class="space-y-2 text-sm font-medium text-slate-700">
            <span>{{ t('preschoolAssessmentPage.filters.category') }}</span>
            <Select
              :model-value="selectedCategoryId"
              :options="categoryOptions"
              option-label="name"
              option-value="id"
              class="w-full"
              :placeholder="t('preschoolAssessmentPage.placeholders.category')"
              @update:model-value="setSelectedCategoryId"
            />
          </label>

          <label class="space-y-2 text-sm font-medium text-slate-700">
            <span>{{ t('preschoolAssessmentPage.filters.status') }}</span>
            <Select
              :model-value="selectedStatus"
              :options="[
                { label: t('preschoolAssessmentStatus.draft'), value: 'draft' },
                { label: t('preschoolAssessmentStatus.finalized'), value: 'finalized' },
                { label: t('preschoolAssessmentStatus.archived'), value: 'archived' },
              ]"
              option-label="label"
              option-value="value"
              class="w-full"
              :placeholder="t('preschoolAssessmentPage.placeholders.status')"
              @update:model-value="setSelectedStatus"
            />
          </label>
        </div>

        <div class="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
          <label class="space-y-2 text-sm font-medium text-slate-700">
            <span>{{ t('preschoolAssessmentPage.filters.search') }}</span>
            <InputText
              :model-value="searchQuery"
              class="w-full"
              :placeholder="t('preschoolAssessmentPage.placeholders.search')"
              @update:model-value="setSearchQuery"
            />
          </label>

          <label class="space-y-2 text-sm font-medium text-slate-700">
            <span>{{ t('preschoolAssessmentPage.filters.periodLabel') }}</span>
            <InputText
              :model-value="selectedPeriodLabel"
              class="w-full"
              :placeholder="t('preschoolAssessmentPage.placeholders.periodLabel')"
              @update:model-value="setSelectedPeriodLabel"
            />
          </label>

          <div class="flex items-end gap-2">
            <Button type="button" variant="primary" size="md" rounded="xl" :loading="loading" @click="applyFilters">
              {{ t('preschoolAssessmentPage.actions.search') }}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              rounded="xl"
              :disabled="isTermLocked || isReportPeriodLocked"
              @click="openCreateForm"
            >
              {{ t('preschoolAssessmentPage.actions.addAssessment') }}
            </Button>
          </div>

          <div class="flex items-end justify-end gap-2">
            <Button type="button" variant="ghost" size="md" rounded="xl" @click="openProgressSummary">
              {{ t('preschoolAssessmentPage.actions.progressSummary') }}
            </Button>
          </div>
        </div>
      </div>

      <div
        v-if="errorMessage"
        class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
      >
        {{ errorMessage }}
      </div>

      <div
        v-if="(isTermLocked || isReportPeriodLocked) && lockMessage"
        class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
      >
        {{ lockMessage }}
      </div>

      <AssessmentList
        :assessments="assessmentItems"
        :loading="loading"
        :pagination="pagination"
        :is-locked="isTermLocked || isReportPeriodLocked"
        :lock-message="lockMessage"
        @edit="openEditForm"
        @finalize="onFinalizeAssessment"
        @archive="onArchiveAssessment"
        @page-change="onPageChange"
      />

      <Dialog v-model:visible="isFormOpen" modal :header="editingAssessment ? t('preschoolAssessmentFormPage.editTitle') : t('preschoolAssessmentFormPage.title')" class="w-full max-w-3xl">
        <AssessmentForm
          v-model="formModel"
          :categories="categoryOptions"
          :classes="classOptions"
          :loading="saving"
          :is-locked="isTermLocked || isReportPeriodLocked"
          :lock-message="lockMessage"
          :submit-label="editingAssessment ? t('preschoolAssessmentFormPage.actions.update') : t('preschoolAssessmentFormPage.actions.save')"
          @submit="onSaveAssessment"
          @cancel="closeForm"
        />
      </Dialog>
    </section>
  </MainLayout>
</template>

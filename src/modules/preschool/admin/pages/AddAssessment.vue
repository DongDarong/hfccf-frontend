<script setup>
// Keep the dedicated add page focused on draft creation so the reusable form
// logic remains shared with the list page edit dialog.
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Select from 'primevue/select'
import { useLanguage } from '@/composables/useLanguage'
import { usePreschoolAssessments } from '@/modules/preschool/composables/usePreschoolAssessments'
import AssessmentForm from '@/modules/preschool/shared/components/assessment/AssessmentForm.vue'

defineOptions({
  name: 'PreschoolAddAssessmentPage',
})

const router = useRouter()
const route = useRoute()
const { t } = useLanguage()

const {
  categoryOptions,
  classOptions,
  errorMessage,
  loadLookupData,
  loadAssessments,
  saving,
  saveAssessment,
  selectedStudentId,
  setSelectedStudentId,
  studentOptions,
} = usePreschoolAssessments()

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

const pageTitle = computed(() => t('preschoolAssessmentFormPage.title'))
const pageSubtitle = computed(() => t('preschoolAssessmentFormPage.subtitle'))

async function onSave() {
  await saveAssessment(selectedStudentId.value, formModel.value)
  router.push({
    name: 'dashboard-preschool-assessments',
    query: selectedStudentId.value ? { studentId: selectedStudentId.value } : {},
  })
}

function onBack() {
  router.push({ name: 'dashboard-preschool-assessments' })
}

onMounted(async () => {
  const studentId = String(route.query.studentId || '').trim()
  if (studentId) {
    setSelectedStudentId(studentId)
  }

  await loadLookupData()

  if (selectedStudentId.value) {
    await loadAssessments(selectedStudentId.value)
  }
})
</script>

<template>
  <MainLayout>
    <section class="preschool-assessment-form-page">
      <HeaderSection :title="pageTitle" :subtitle="pageSubtitle" />

      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label class="mb-4 block space-y-2 text-sm font-medium text-slate-700">
          <span>{{ t('preschoolAssessmentFormPage.fields.student') }}</span>
          <Select
            :model-value="selectedStudentId"
            :options="studentOptions"
            option-label="label"
            option-value="value"
            class="w-full"
            :placeholder="t('preschoolAssessmentFormPage.placeholders.student')"
            @update:model-value="setSelectedStudentId"
          />
        </label>

        <AssessmentForm
          v-model="formModel"
          :categories="categoryOptions"
          :classes="classOptions"
          :loading="saving"
          :submit-label="t('preschoolAssessmentFormPage.actions.save')"
          @submit="onSave"
          @cancel="onBack"
        />
      </div>

      <div
        v-if="errorMessage"
        class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
      >
        {{ errorMessage }}
      </div>

      <div class="flex justify-end">
        <Button type="button" variant="ghost" size="md" rounded="xl" @click="onBack">
          {{ t('common.actions.back') }}
        </Button>
      </div>
    </section>
  </MainLayout>
</template>

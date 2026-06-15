<script setup>
import { computed, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputGroup from 'primevue/inputgroup'
import Button from '@/components/buttons/Button.vue'
import StudentSelector from './StudentSelector.vue'
import CategorySelector from './CategorySelector.vue'
import ScoringSection from './ScoringSection.vue'
import ObservationPanel from './ObservationPanel.vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'

defineOptions({
  name: 'AssessmentModal',
})

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  assessment: {
    type: Object,
    default: null,
  },
  categories: {
    type: Array,
    required: true,
  },
  studentOptions: {
    type: Array,
    required: true,
  },
  classOptions: {
    type: Array,
    required: true,
  },
  validationErrors: {
    type: Object,
    default: () => ({}),
  },
  saving: {
    type: Boolean,
    default: false,
  },
  periods: {
    type: Array,
    default: () => [
      { label: 'Q1', value: 'Q1' },
      { label: 'Q2', value: 'Q2' },
      { label: 'Q3', value: 'Q3' },
      { label: 'Q4', value: 'Q4' },
      { label: 'Midterm', value: 'Midterm' },
      { label: 'Final', value: 'Final' },
    ],
  },
})

const emit = defineEmits(['update:visible', 'save', 'finalize'])

const isEditMode = computed(() => !!props.assessment?.id)

const formData = ref({
  studentId: null,
  classId: null,
  categoryId: null,
  periodLabel: null,
  assessmentDate: new Date().toISOString().split('T')[0],
  score: null,
  rating: '',
  observation: '',
  teacherComment: '',
})

// Initialize form with assessment data when editing
watch(
  () => props.assessment,
  (assessment) => {
    if (assessment) {
      formData.value = {
        studentId: assessment.studentId,
        classId: assessment.classId,
        categoryId: assessment.categoryId,
        periodLabel: assessment.periodLabel,
        assessmentDate: assessment.assessmentDate,
        score: assessment.score,
        rating: assessment.rating,
        observation: assessment.observation,
        teacherComment: assessment.teacherComment,
      }
    } else {
      resetForm()
    }
  },
  { deep: true }
)

function resetForm() {
  formData.value = {
    studentId: null,
    classId: null,
    categoryId: null,
    periodLabel: null,
    assessmentDate: new Date().toISOString().split('T')[0],
    score: null,
    rating: '',
    observation: '',
    teacherComment: '',
  }
}

function handleClose() {
  emit('update:visible', false)
  resetForm()
}

function handleSave() {
  emit('save', { ...formData.value, id: props.assessment?.id })
}

function handleFinalize() {
  emit('finalize', props.assessment?.id)
}

const categoryOptions = computed(() =>
  props.categories.map(cat => ({
    label: cat.name,
    value: cat.id,
  }))
)
</script>

<template>
  <Dialog
    :visible="visible"
    :header="`${isEditMode ? '✏️ Edit' : '➕ Create'} Assessment`"
    :modal="true"
    :style="{ width: '90vw', maxWidth: '900px' }"
    class="p-dialog-centered"
    @update:visible="handleClose"
  >
    <!-- Form Content -->
    <form class="space-y-6">
      <!-- Student & Class Section -->
      <div class="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h4 class="font-semibold text-gray-900">👥 Student Information</h4>

        <div class="grid gap-4 sm:grid-cols-2">
          <!-- Student Selector -->
          <StudentSelector
            v-model="formData.studentId"
            :options="studentOptions"
            :error="validationErrors.studentId"
            :disabled="saving"
          />

          <!-- Class (Auto-filled) -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              🏫 Class
              <span class="text-red-500">*</span>
            </label>

            <Select
              v-model="formData.classId"
              :options="classOptions"
              option-label="label"
              option-value="value"
              placeholder="Select a class..."
              :disabled="saving"
              show-clear
              class="w-full"
            />

            <p v-if="validationErrors.classId" class="text-sm text-red-600">
              ❌ {{ validationErrors.classId }}
            </p>
          </div>
        </div>
      </div>

      <!-- Assessment Details Section -->
      <div class="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h4 class="font-semibold text-gray-900">📋 Assessment Details</h4>

        <div class="grid gap-4 sm:grid-cols-2">
          <!-- Category -->
          <CategorySelector
            v-model="formData.categoryId"
            :categories="props.categories"
            :error="validationErrors.categoryId"
            :disabled="saving"
          />

          <!-- Period -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              📅 Period
              <span class="text-red-500">*</span>
            </label>

            <Select
              v-model="formData.periodLabel"
              :options="props.periods"
              option-label="label"
              option-value="value"
              placeholder="Select period..."
              :disabled="saving"
              show-clear
              class="w-full"
            />

            <p v-if="validationErrors.periodLabel" class="text-sm text-red-600">
              ❌ {{ validationErrors.periodLabel }}
            </p>
          </div>
        </div>

        <!-- Assessment Date -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            📆 Assessment Date
            <span class="text-red-500">*</span>
          </label>

          <InputText
            v-model="formData.assessmentDate"
            type="date"
            :disabled="saving"
            class="w-full"
          />

          <p v-if="validationErrors.assessmentDate" class="text-sm text-red-600">
            ❌ {{ validationErrors.assessmentDate }}
          </p>
        </div>
      </div>

      <!-- Scoring Section -->
      <ScoringSection
        v-model:score="formData.score"
        v-model:rating="formData.rating"
        :score-error="validationErrors.score"
        :rating-error="validationErrors.rating"
        :disabled="saving"
      />

      <!-- Observation Section -->
      <ObservationPanel
        v-model:observation="formData.observation"
        v-model:teacher-comment="formData.teacherComment"
        :disabled="saving"
      />
    </form>

    <!-- Modal Footer -->
    <template #footer>
      <div class="flex justify-between gap-2">
        <!-- Left Side Actions -->
        <Button
          v-if="isEditMode && assessment?.status === 'draft'"
          label="Finalize & Close"
          icon="pi pi-check"
          severity="success"
          :loading="saving"
          @click="handleFinalize"
        />

        <!-- Right Side Actions -->
        <div class="flex gap-2">
          <Button
            label="Cancel"
            icon="pi pi-times"
            variant="secondary"
            :disabled="saving"
            @click="handleClose"
          />

          <Button
            :label="`${isEditMode ? 'Update' : 'Create'} & Save`"
            icon="pi pi-check"
            :loading="saving"
            @click="handleSave"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

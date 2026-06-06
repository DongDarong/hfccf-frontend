<script setup>
import { onMounted, ref } from 'vue'
import { useAssessmentWizard } from '../../composables/useAssessmentWizard'
import { assessmentFormApi } from '../../services/assessmentFormApi'
import QuestionRenderer from '../questions/QuestionRenderer.vue'

const { store } = useAssessmentWizard()

const sections  = ref([])
const questions = ref([])
const isLoading = ref(false)

async function load() {
  if (!store.selectedForm) return
  isLoading.value = true
  try {
    const [sRes, qRes] = await Promise.all([
      assessmentFormApi.listSections(store.selectedForm.id),
      assessmentFormApi.listQuestions(store.selectedForm.id),
    ])
    sections.value  = sRes.data.data
    questions.value = qRes.data.data
  } finally {
    isLoading.value = false
  }
}

function getQuestionsForSection(sectionId) {
  return questions.value
    .filter((q) => q.section_id === sectionId)
    .sort((a, b) => a.order - b.order)
}

onMounted(load)
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-16 text-slate-400">
      <i class="pi pi-spin pi-spinner text-3xl" />
    </div>

    <!-- No form selected -->
    <div v-else-if="!store.selectedForm" class="py-12 text-center">
      <i class="pi pi-file-edit mb-3 block text-3xl text-slate-300" />
      <p class="text-sm text-slate-400">No form selected.</p>
    </div>

    <!-- Sections -->
    <template v-else>
      <div
        v-for="section in sections"
        :key="section.id"
        class="rounded-xl border border-slate-200 bg-white"
      >
        <div class="border-b border-slate-100 px-5 py-3.5">
          <h4 class="text-sm font-semibold text-slate-800">{{ section.title }}</h4>
          <p v-if="section.description" class="mt-0.5 text-xs text-slate-400">{{ section.description }}</p>
        </div>
        <div class="flex flex-col gap-4 p-5">
          <QuestionRenderer
            v-for="question in getQuestionsForSection(section.id)"
            :key="question.id"
            :question="question"
            :model-value="store.answers[`${question.id}_0`]?.answer_value"
            @update:model-value="(val) => store.setAnswer(question.id, val)"
          />
          <p v-if="!getQuestionsForSection(section.id).length" class="text-sm text-slate-400">
            No questions in this section.
          </p>
        </div>
      </div>

      <!-- No sections -->
      <div v-if="!sections.length" class="py-12 text-center">
        <i class="pi pi-inbox mb-3 block text-3xl text-slate-300" />
        <p class="text-sm text-slate-400">This form has no sections.</p>
      </div>
    </template>
  </div>
</template>

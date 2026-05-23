<script setup>
import { ref } from 'vue'
import Button from '@/components/buttons/Button.vue'
import Tag from 'primevue/tag'
import { useLanguage } from '@/composables/useLanguage'
import { assessmentFormApi } from '../../services/assessmentFormApi'
import { useFormBuilderStore } from '../../stores/useFormBuilderStore'

const props = defineProps({
  question: { type: Object, required: true },
  formId: { type: [String, Number], required: true },
})

const { t } = useLanguage()
const store = useFormBuilderStore()

async function deleteQuestion() {
  await assessmentFormApi.deleteQuestion(props.formId, props.question.id)
  if (store.template?.questions) {
    store.template.questions = store.template.questions.filter((q) => q.id !== props.question.id)
  }
}
</script>

<template>
  <div class="question-card">
    <div class="question-card__header">
      <div class="question-card__meta">
        <Tag
          :value="t(`formBuilder.questionTypes.${question.question_type_key}`)"
          severity="secondary"
          class="question-card__type"
        />
        <span v-if="question.is_required" class="question-card__required">*</span>
      </div>
      <div class="question-card__actions">
        <Button icon="pi pi-trash" text size="small" severity="danger" @click="deleteQuestion" />
      </div>
    </div>
    <div class="question-card__text">{{ question.question_text }}</div>
    <div v-if="question.help_text" class="question-card__help">{{ question.help_text }}</div>
  </div>
</template>

<style scoped>
.question-card {
  background: var(--surface-ground);
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  padding: 0.75rem 1rem;
}

.question-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.question-card__meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.question-card__required {
  color: var(--red-500);
  font-weight: 700;
}

.question-card__text {
  font-weight: 500;
}

.question-card__help {
  font-size: 0.8125rem;
  color: var(--text-color-secondary);
  margin-top: 0.25rem;
}

.question-card__actions {
  display: flex;
  gap: 0.25rem;
}
</style>

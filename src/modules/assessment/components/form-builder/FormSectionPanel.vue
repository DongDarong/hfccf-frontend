<script setup>
import { ref } from 'vue'
import Button from '@/components/buttons/Button.vue'
import InputText from 'primevue/inputtext'
import { useLanguage } from '@/composables/useLanguage'
import { useFormBuilderStore } from '../../stores/useFormBuilderStore'
import QuestionCard from './QuestionCard.vue'
import AddQuestionPanel from './AddQuestionPanel.vue'

const props = defineProps({
  section: { type: Object, required: true },
})

const { t } = useLanguage()
const store = useFormBuilderStore()

const isEditingTitle = ref(false)
const localTitle = ref(props.section.title)
const isExpanded = ref(true)
const showAddQuestion = ref(false)

const questions = computed(() =>
  (store.template?.questions ?? [])
    .filter((q) => q.section_id === props.section.id)
    .sort((a, b) => a.order - b.order),
)

async function saveTitle() {
  await store.updateSection(props.section.id, { title: localTitle.value })
  isEditingTitle.value = false
}

async function deleteSection() {
  await store.deleteSection(props.section.id)
}
</script>

<script>
import { computed } from 'vue'
</script>

<template>
  <div class="form-section-panel">
    <div class="form-section-panel__header">
      <div class="form-section-panel__title-area">
        <Button
          :icon="isExpanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
          text
          size="small"
          @click="isExpanded = !isExpanded"
        />
        <InputText
          v-if="isEditingTitle"
          v-model="localTitle"
          size="small"
          autofocus
          @blur="saveTitle"
          @keyup.enter="saveTitle"
        />
        <span
          v-else
          class="form-section-panel__title"
          @dblclick="isEditingTitle = true"
        >
          {{ section.title }}
        </span>
      </div>
      <div class="form-section-panel__header-actions">
        <Button icon="pi pi-pencil" text size="small" @click="isEditingTitle = true" />
        <Button icon="pi pi-trash" text size="small" severity="danger" @click="deleteSection" />
      </div>
    </div>

    <div v-if="isExpanded" class="form-section-panel__body">
      <QuestionCard
        v-for="question in questions"
        :key="question.id"
        :question="question"
        :form-id="store.template?.id"
      />

      <Button
        :label="t('formBuilder.questions.addQuestion')"
        icon="pi pi-plus"
        text
        size="small"
        @click="showAddQuestion = true"
      />

      <AddQuestionPanel
        v-if="showAddQuestion"
        :section-id="section.id"
        :form-id="store.template?.id"
        @close="showAddQuestion = false"
      />
    </div>
  </div>
</template>

<style scoped>
.form-section-panel {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  overflow: hidden;
}

.form-section-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: var(--surface-ground);
  border-bottom: 1px solid var(--surface-border);
}

.form-section-panel__title-area {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-section-panel__title {
  font-weight: 600;
  cursor: pointer;
}

.form-section-panel__header-actions {
  display: flex;
  gap: 0.25rem;
}

.form-section-panel__body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>

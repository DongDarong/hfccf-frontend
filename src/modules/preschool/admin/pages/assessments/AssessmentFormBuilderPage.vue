<script setup>
import { computed, ref, watch } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import Button from '@/components/buttons/Button.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'
import AssessmentPageHeader from '@/modules/preschool/admin/components/assessment/AssessmentPageHeader.vue'
import FormBuilderQuestionPalette from '@/modules/preschool/admin/components/assessment/FormBuilderQuestionPalette.vue'
import FormBuilderCanvas from '@/modules/preschool/admin/components/assessment/FormBuilderCanvas.vue'
import FormBuilderQuestionSettings from '@/modules/preschool/admin/components/assessment/FormBuilderQuestionSettings.vue'
import {
  PRESCHOOL_ASSESSMENT_FORM_BUILDER_PALETTE,
  PRESCHOOL_ASSESSMENT_FORM_BUILDER_SECTIONS,
  PRESCHOOL_ASSESSMENT_FORM_BUILDER_DEFAULT_SECTIONS,
  PRESCHOOL_ASSESSMENT_FORM_BUILDER_SECTION_QUESTION_SEEDS,
} from './constants/preschoolAssessmentFormBuilder'

defineOptions({
  name: 'PreschoolAssessmentFormBuilderPage',
})

const { t, te } = useLanguage()
const selectedQuestionKey = ref(PRESCHOOL_ASSESSMENT_FORM_BUILDER_PALETTE[0]?.key || null)
const selectedSectionKey = ref(PRESCHOOL_ASSESSMENT_FORM_BUILDER_DEFAULT_SECTIONS[0]?.key || null)
const builderSections = ref(
  PRESCHOOL_ASSESSMENT_FORM_BUILDER_DEFAULT_SECTIONS.map((section, index) => ({
    ...section,
    order: index,
  }))
)
const builderSectionQuestionMap = ref(createInitialSectionQuestionMap())
const dragState = ref({
  type: null,
  questionKey: null,
  questionId: null,
  sectionKey: null,
  fromSectionKey: null,
})
const questionState = ref({})
let questionSequence = 0

function safeText(key, fallback) {
  return te(key) ? t(key) : fallback
}

const workspaceStats = computed(() => [
  {
    label: safeText('assessmentFormBuilder.stats.sections', 'Sections'),
    value: String(builderSections.value.length),
  },
  {
    label: safeText('assessmentFormBuilder.stats.questions', 'Questions'),
    value: String(totalQuestionCount.value),
  },
  {
    label: safeText('assessmentFormBuilder.stats.version', 'Version'),
    value: '2026.1',
  },
])

const builderPaletteSections = computed(() =>
  PRESCHOOL_ASSESSMENT_FORM_BUILDER_SECTIONS.map(section => ({
    ...section,
    title: safeText(section.titleKey, section.titleFallback),
    description: safeText(section.descriptionKey, section.descriptionFallback),
  }))
)

const builderCanvasSections = computed(() =>
  builderSections.value.map(section => ({
    ...section,
    title: safeText(`assessmentFormBuilder.sections.${section.key}.title`, section.titleFallback),
    description: safeText(`assessmentFormBuilder.sections.${section.key}.description`, section.descriptionFallback),
    hint: safeText(`assessmentFormBuilder.sections.${section.key}.hint`, section.hintFallback),
    questionCount: (builderSectionQuestionMap.value[section.key] || []).length,
  }))
)

const paletteGroups = computed(() => {
  return PRESCHOOL_ASSESSMENT_FORM_BUILDER_PALETTE.map(item => ({
    ...item,
    title: safeText(`assessmentFormBuilder.palette.${item.key}.title`, item.titleFallback),
    description: safeText(`assessmentFormBuilder.palette.${item.key}.description`, item.descriptionFallback),
  }))
})

function handleQuestionSelect(question) {
  selectedQuestionKey.value = question.key
  if (question.group === 'core') {
    selectedSectionKey.value = 'studentProfile'
    return
  }
  if (question.group === 'choices') {
    selectedSectionKey.value = 'family'
    return
  }
  selectedSectionKey.value = 'scoring'
}

function handleSectionSelect(section) {
  selectedSectionKey.value = section.key
}

function handlePaletteDragStart(payload) {
  dragState.value = {
    type: 'palette-question',
    questionKey: payload.question?.key || null,
    questionId: null,
    sectionKey: null,
    fromSectionKey: null,
  }
}

function handleDragEnd() {
  clearDragState()
}

function handleSectionDragStart(payload) {
  dragState.value = {
    type: 'section',
    questionKey: null,
    questionId: null,
    sectionKey: payload.section?.key || null,
    fromSectionKey: null,
  }
}

function handleQuestionDragStart(payload) {
  dragState.value = {
    type: 'question',
    questionKey: payload.question?.key || null,
    questionId: payload.question?.id || null,
    sectionKey: null,
    fromSectionKey: payload.section?.key || null,
  }
}

const selectedQuestion = computed(() =>
  paletteGroups.value.find(question => question.key === selectedQuestionKey.value) || paletteGroups.value[0] || null
)

const selectedSection = computed(() =>
  builderCanvasSections.value.find(section => section.key === selectedSectionKey.value) || builderCanvasSections.value[0] || null
)

const totalQuestionCount = computed(() =>
  Object.values(builderSectionQuestionMap.value).reduce((count, sectionQuestions) => count + sectionQuestions.length, 0)
)

function createInitialSectionQuestionMap() {
  return Object.fromEntries(
    PRESCHOOL_ASSESSMENT_FORM_BUILDER_DEFAULT_SECTIONS.map(section => [
      section.key,
      createSectionQuestions(section.key),
    ])
  )
}

function createSectionQuestions(sectionKey) {
  const seeds = PRESCHOOL_ASSESSMENT_FORM_BUILDER_SECTION_QUESTION_SEEDS[sectionKey] || []

  return seeds.map((seed, index) => createQuestionInstance(seed.key, sectionKey, index, seed))
}

function createQuestionInstance(questionKey, sectionKey, index = 0, seed = null) {
  const paletteQuestion = PRESCHOOL_ASSESSMENT_FORM_BUILDER_PALETTE.find(question => question.key === questionKey)
  const title = seed?.titleFallback
    || paletteQuestion?.title
    || safeText(`assessmentFormBuilder.palette.${questionKey}.title`, questionKey)
  const description = seed?.descriptionFallback
    || paletteQuestion?.description
    || safeText(`assessmentFormBuilder.palette.${questionKey}.description`, '')

  return {
    id: `${sectionKey}-${questionKey}-${index + 1}-${questionSequence += 1}`,
    key: questionKey,
    title,
    description,
    group: paletteQuestion?.group || 'core',
  }
}

function clearDragState() {
  dragState.value = {
    type: null,
    questionKey: null,
    questionId: null,
    sectionKey: null,
    fromSectionKey: null,
  }
}

function reorderSections(fromKey, toKey) {
  if (!fromKey || !toKey || fromKey === toKey) return

  const nextSections = [...builderSections.value]
  const fromIndex = nextSections.findIndex(section => section.key === fromKey)
  const toIndex = nextSections.findIndex(section => section.key === toKey)

  if (fromIndex < 0 || toIndex < 0) return

  const [movedSection] = nextSections.splice(fromIndex, 1)
  const insertIndex = fromIndex < toIndex ? toIndex - 1 : toIndex

  nextSections.splice(insertIndex, 0, movedSection)
  builderSections.value = nextSections
}

function addQuestionToSection(sectionKey, questionKey, beforeQuestionId = null) {
  const targetQuestions = [...(builderSectionQuestionMap.value[sectionKey] || [])]
  const nextQuestion = createQuestionInstance(questionKey, sectionKey, targetQuestions.length)
  const insertIndex = beforeQuestionId
    ? targetQuestions.findIndex(question => question.id === beforeQuestionId)
    : targetQuestions.length

  targetQuestions.splice(insertIndex >= 0 ? insertIndex : targetQuestions.length, 0, nextQuestion)
  builderSectionQuestionMap.value = {
    ...builderSectionQuestionMap.value,
    [sectionKey]: targetQuestions,
  }
}

function moveQuestionToSection(questionId, fromSectionKey, toSectionKey, beforeQuestionId = null) {
  if (!questionId || !fromSectionKey || !toSectionKey) return

  const fromQuestions = [...(builderSectionQuestionMap.value[fromSectionKey] || [])]
  const sourceIndex = fromQuestions.findIndex(question => question.id === questionId)

  if (sourceIndex < 0) return

  const [movedQuestion] = fromQuestions.splice(sourceIndex, 1)
  const targetQuestions = fromSectionKey === toSectionKey
    ? fromQuestions
    : [...(builderSectionQuestionMap.value[toSectionKey] || [])]

  const insertIndex = beforeQuestionId
    ? targetQuestions.findIndex(question => question.id === beforeQuestionId)
    : targetQuestions.length

  targetQuestions.splice(insertIndex >= 0 ? insertIndex : targetQuestions.length, 0, movedQuestion)

  builderSectionQuestionMap.value = {
    ...builderSectionQuestionMap.value,
    [fromSectionKey]: fromSectionKey === toSectionKey ? targetQuestions : fromQuestions,
    [toSectionKey]: targetQuestions,
  }
}

function handleSectionDrop(payload) {
  if (dragState.value.type === 'section') {
    reorderSections(dragState.value.sectionKey, payload.section?.key)
  }

  if (dragState.value.type === 'palette-question' && dragState.value.questionKey) {
    addQuestionToSection(payload.section?.key, dragState.value.questionKey)
  }

  if (dragState.value.type === 'question' && dragState.value.questionId) {
    moveQuestionToSection(
      dragState.value.questionId,
      dragState.value.fromSectionKey,
      payload.section?.key,
    )
  }

  clearDragState()
}

function handleQuestionDrop(payload) {
  if (
    dragState.value.type === 'question'
    && dragState.value.questionId === payload.question?.id
    && dragState.value.fromSectionKey === payload.section?.key
  ) {
    clearDragState()
    return
  }

  if (dragState.value.type === 'palette-question' && dragState.value.questionKey) {
    addQuestionToSection(payload.section?.key, dragState.value.questionKey, payload.question?.id)
  }

  if (dragState.value.type === 'question' && dragState.value.questionId) {
    moveQuestionToSection(
      dragState.value.questionId,
      dragState.value.fromSectionKey,
      payload.section?.key,
      payload.question?.id,
    )
  }

  clearDragState()
}

function createQuestionState(question, section) {
  return {
    label: question?.title || '',
    helpText: question?.description || '',
    required: false,
    score: question?.group === 'structured' ? 10 : 5,
    answerType: question?.key || 'shortText',
    sectionKey: section?.key || '',
    validationMode: question?.group === 'structured' ? 'strict' : 'basic',
    options: question?.group === 'choices' ? 'Option 1, Option 2' : '',
  }
}

function resetQuestionState() {
  questionState.value = createQuestionState(selectedQuestion.value, selectedSection.value)
}

function handleQuestionStateUpdate(nextState) {
  questionState.value = nextState
}

function handleSettingsApply() {
  questionState.value = {
    ...questionState.value,
    sectionKey: selectedSection.value?.key || questionState.value.sectionKey,
  }
}

resetQuestionState()

watch(
  [selectedQuestionKey, selectedSectionKey],
  () => {
    resetQuestionState()
  },
)
</script>

<template>
  <MainLayout>
    <section class="assessment-form-builder-page">
      <AssessmentPageHeader
        :title="safeText('assessmentFormBuilder.title', 'Form Builder')"
        :subtitle="safeText('assessmentFormBuilder.subtitle', 'Design assessment forms, scoring rubrics, and reusable question layouts.')"
      />

      <div class="assessment-form-builder-toolbar">
        <div class="assessment-form-builder-toolbar__meta">
          <span class="assessment-form-builder-toolbar__badge">
            {{ safeText('assessmentFormBuilder.badge', 'Preschool Assessment') }}
          </span>
          <div class="assessment-form-builder-toolbar__stats">
            <div
              v-for="stat in workspaceStats"
              :key="stat.label"
              class="assessment-form-builder-toolbar__stat"
            >
              <strong>{{ stat.value }}</strong>
              <span>{{ stat.label }}</span>
            </div>
          </div>
        </div>

        <div class="assessment-form-builder-toolbar__actions">
          <Button
            :label="safeText('assessmentFormBuilder.actions.saveDraft', 'Save Draft')"
            icon="pi pi-save"
            severity="secondary"
          />
          <Button
            :label="safeText('assessmentFormBuilder.actions.preview', 'Preview')"
            icon="pi pi-eye"
            severity="secondary"
          />
          <Button
            :label="safeText('assessmentFormBuilder.actions.publish', 'Publish')"
            icon="pi pi-send"
          />
        </div>
      </div>

      <div class="assessment-form-builder-grid">
        <aside class="assessment-form-builder-panel assessment-form-builder-panel--sidebar">
          <HeaderSection
            :title="safeText('assessmentFormBuilder.sidebar.title', 'Build Workspace')"
            :subtitle="safeText('assessmentFormBuilder.sidebar.subtitle', 'Start with sections, question libraries, and logic rules.')"
          />

          <FormBuilderQuestionPalette
            :sections="builderPaletteSections"
            :palette="paletteGroups"
            :selected-question-key="selectedQuestionKey"
            @select-question="handleQuestionSelect"
            @drag-question-start="handlePaletteDragStart"
            @drag-question-end="handleDragEnd"
          />
        </aside>

        <main class="assessment-form-builder-panel assessment-form-builder-panel--canvas">
          <FormBuilderCanvas
            :sections="builderCanvasSections"
            :section-questions="builderSectionQuestionMap"
            :selected-section-key="selectedSectionKey"
            @select-section="handleSectionSelect"
            @add-section="handleSectionSelect(builderCanvasSections[builderCanvasSections.length - 1])"
            @drag-section-start="handleSectionDragStart"
            @drag-question-start="handleQuestionDragStart"
            @drag-end="handleDragEnd"
            @drop-section="handleSectionDrop"
            @drop-question="handleQuestionDrop"
          />
        </main>

        <aside class="assessment-form-builder-panel assessment-form-builder-panel--settings">
          <FormBuilderQuestionSettings
            :question="selectedQuestion"
            :section="selectedSection"
            :state="questionState"
            :section-options="builderCanvasSections"
            @update:state="handleQuestionStateUpdate"
            @reset="resetQuestionState"
            @apply="handleSettingsApply"
          />
        </aside>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.assessment-form-builder-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.assessment-form-builder-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 1.25rem;
  border: 1px solid #dbeafe;
  background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
}

.assessment-form-builder-toolbar__meta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.assessment-form-builder-toolbar__badge {
  display: inline-flex;
  align-self: flex-start;
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 0.8rem;
  font-weight: 700;
}

.assessment-form-builder-toolbar__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.assessment-form-builder-toolbar__stat {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.65rem 0.85rem;
  border-radius: 0.9rem;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  min-width: 110px;
}

.assessment-form-builder-toolbar__stat strong {
  font-size: 1.05rem;
  color: #0f172a;
}

.assessment-form-builder-toolbar__stat span {
  font-size: 0.78rem;
  color: #64748b;
}

.assessment-form-builder-toolbar__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.75rem;
}

.assessment-form-builder-grid {
  display: grid;
  grid-template-columns: minmax(240px, 280px) minmax(0, 1fr) minmax(240px, 280px);
  gap: 1rem;
}

.assessment-form-builder-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 1.25rem;
  border: 1px solid #dbeafe;
  background: #ffffff;
  padding: 1rem;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.05);
}

@media (max-width: 1200px) {
  .assessment-form-builder-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .assessment-form-builder-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .assessment-form-builder-toolbar__actions {
    justify-content: stretch;
  }
}
</style>

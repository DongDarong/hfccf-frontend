<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import Button from '@/components/buttons/Button.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'
import AssessmentPageHeader from '@/modules/preschool/admin/components/assessment/AssessmentPageHeader.vue'
import FormBuilderQuestionPalette from '@/modules/preschool/admin/components/assessment/FormBuilderQuestionPalette.vue'
import FormBuilderCanvas from '@/modules/preschool/admin/components/assessment/FormBuilderCanvas.vue'
import FormBuilderQuestionSettings from '@/modules/preschool/admin/components/assessment/FormBuilderQuestionSettings.vue'
import {
  archiveAssessmentForm,
  buildFormTemplatePayload,
  createAssessmentForm,
  duplicateAssessmentForm,
  fetchAssessmentForm,
  publishAssessmentForm,
  restoreAssessmentForm,
  updateAssessmentForm,
} from '@/modules/preschool/services/api/preschoolAssessmentApi'
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
const route = useRoute()
const router = useRouter()
const selectedQuestionKey = ref(PRESCHOOL_ASSESSMENT_FORM_BUILDER_PALETTE[0]?.key || null)
const selectedSectionKey = ref(PRESCHOOL_ASSESSMENT_FORM_BUILDER_DEFAULT_SECTIONS[0]?.key || null)
const builderSections = ref(
  PRESCHOOL_ASSESSMENT_FORM_BUILDER_DEFAULT_SECTIONS.map((section, index) => ({
    ...section,
    order: index,
    code: section.code || section.key,
  }))
)
const builderSectionQuestionMap = ref(createInitialSectionQuestionMap())
const currentTemplateId = ref(route.query.templateId ? String(route.query.templateId) : '')
const templateStatus = ref('draft')
const templateVersion = ref(1)
const templateName = ref('')
const templateDescription = ref('')
const templateSnapshot = ref('')
const isTemplateLoading = ref(false)
const isTemplateSaving = ref(false)
const templateError = ref('')
const templateNotice = ref('')
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
    value: String(templateVersion.value || '1'),
  },
])

const templateStatusLabel = computed(() => {
  const key = `assessmentFormBuilder.status.${templateStatus.value}`

  return safeText(key, templateStatus.value || 'draft')
})

const templateStatusTone = computed(() => {
  if (templateStatus.value === 'published') return 'success'
  if (templateStatus.value === 'archived') return 'warning'
  return 'secondary'
})

const hasUnsavedChanges = computed(() => templateSnapshot.value !== serializeTemplateSnapshot())

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
    answerType: questionKey,
    required: false,
    score: questionKey === 'rating' || questionKey === 'table' ? 10 : 5,
    validationMode: questionKey === 'table' ? 'strict' : 'basic',
    options: questionKey === 'dropdown' || questionKey === 'rating'
      ? 'Option 1, Option 2'
      : '',
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

watch(
  () => route.query.templateId,
  (nextTemplateId) => {
    const normalizedId = nextTemplateId ? String(nextTemplateId) : ''
    if (normalizedId !== currentTemplateId.value) {
      loadTemplate(normalizedId)
    }
  },
)

function serializeTemplateSnapshot() {
  return JSON.stringify({
    id: currentTemplateId.value,
    name: templateName.value,
    description: templateDescription.value,
    status: templateStatus.value,
    version: templateVersion.value,
    sections: builderSections.value.map(section => ({
      id: section.id || null,
      code: section.code || section.key,
      key: section.key,
      title: section.title,
      description: section.description,
      order: section.order,
      questionCount: (builderSectionQuestionMap.value[section.key] || []).length,
      questions: (builderSectionQuestionMap.value[section.key] || []).map(question => ({
        id: question.id || null,
        key: question.key,
        title: question.title,
        description: question.description,
        group: question.group,
        answerType: question.answerType || question.key,
        required: Boolean(question.required),
        score: Number(question.score || 0),
        validationMode: question.validationMode || 'basic',
        options: question.options || '',
      })),
    })),
  })
}

function serializeTemplatePayload() {
  const sections = builderSections.value.map(section => ({
    id: section.id || null,
    code: section.code || section.key,
    title: section.title,
    description: section.description,
    sortOrder: section.order,
    settings: {
      hint: section.hint,
    },
    questions: (builderSectionQuestionMap.value[section.key] || []).map((question, index) => ({
      id: question.id || null,
      code: question.code || question.key,
      label: question.title,
      helpText: question.description,
      answerType: question.answerType || question.key,
      questionTypeKey: question.answerType || question.key,
      required: Boolean(question.required),
      score: Number(question.score || 0),
      validationMode: question.validationMode || 'basic',
      options: question.options || '',
      sortOrder: index + 1,
    })),
  }))

  return buildFormTemplatePayload({
    id: currentTemplateId.value,
    name: templateName.value || safeText('assessmentFormBuilder.title', 'Form Builder'),
    description: templateDescription.value || safeText('assessmentFormBuilder.subtitle', 'Design assessment forms, scoring rubrics, and reusable question layouts.'),
    category: 'preschool_assessment',
    settings: {
      builder: true,
      module: 'preschool',
      status: templateStatus.value,
    },
    sections,
  }, sections)
}

function hydrateBuilderTemplate(template) {
  currentTemplateId.value = String(template?.id || '')
  templateStatus.value = template?.status || 'draft'
  templateVersion.value = template?.currentVersion || template?.current_version || 1
  templateName.value = template?.name || safeText('assessmentFormBuilder.title', 'Form Builder')
  templateDescription.value = template?.description || safeText(
    'assessmentFormBuilder.subtitle',
    'Design assessment forms, scoring rubrics, and reusable question layouts.',
  )

  const sections = Array.isArray(template?.sections) && template.sections.length > 0
    ? template.sections.map((section, index) => ({
        id: section.id || null,
        key: section.code || `section-${section.id || index + 1}`,
        code: section.code || `section-${section.id || index + 1}`,
        title: section.title || section.code || `Section ${index + 1}`,
        description: section.description || '',
        hint: section.description || '',
        order: section.sortOrder ?? section.sort_order ?? index + 1,
        questionCount: Array.isArray(section.questions) ? section.questions.length : 0,
      }))
    : PRESCHOOL_ASSESSMENT_FORM_BUILDER_DEFAULT_SECTIONS.map((section, index) => ({
        ...section,
        id: null,
        code: section.code || section.key,
        key: section.key,
        order: index + 1,
      }))

  builderSections.value = sections
  selectedSectionKey.value = sections[0]?.key || selectedSectionKey.value
  builderSectionQuestionMap.value = Object.fromEntries(
    sections.map((section) => {
      const sourceQuestions = template?.sections?.find(item => (item.code || item.id) === (section.code || section.id))?.questions || []
      return [
        section.key,
        sourceQuestions.length > 0
          ? sourceQuestions.map((question, qIndex) => ({
              id: question.id || `${section.key}-question-${qIndex + 1}`,
              key: question.questionTypeKey || question.question_type_key || question.answerType || 'shortText',
              title: question.label || question.question_text || `Question ${qIndex + 1}`,
              description: question.helpText || question.help_text || '',
              group: question.questionTypeKey || question.question_type_key || 'core',
              answerType: question.questionTypeKey || question.question_type_key || 'shortText',
              required: Boolean(question.isRequired ?? question.is_required ?? false),
              score: Number(question.maxScore ?? question.max_score ?? 0),
              validationMode: question.validationRules?.mode || question.validation_rules?.mode || 'basic',
              options: Array.isArray(question.options)
                ? question.options.map(option => option.label || option.value).filter(Boolean).join(', ')
                : '',
              code: question.code || null,
            }))
          : createSectionQuestions(section.key),
      ]
    }),
  )

  resetQuestionState()
  templateSnapshot.value = serializeTemplateSnapshot()
  templateError.value = ''
  templateNotice.value = ''
}

async function loadTemplate(templateId) {
  if (!templateId) {
    hydrateBuilderTemplate(null)
    return
  }

  isTemplateLoading.value = true
  templateError.value = ''

  try {
    const template = await fetchAssessmentForm(templateId)
    hydrateBuilderTemplate(template)
  } catch (error) {
    templateError.value = error?.message || 'Unable to load the form template.'
  } finally {
    isTemplateLoading.value = false
  }
}

async function saveDraft() {
  isTemplateSaving.value = true
  templateError.value = ''
  templateNotice.value = ''

  try {
    const payload = serializeTemplatePayload()
    const template = currentTemplateId.value
      ? await updateAssessmentForm(currentTemplateId.value, payload)
      : await createAssessmentForm(payload)

    hydrateBuilderTemplate(template)
    await router.replace({
      query: {
        ...route.query,
        templateId: currentTemplateId.value,
      },
    })
    templateNotice.value = safeText('assessmentFormBuilder.messages.saved', 'Draft saved.')
  } catch (error) {
    templateError.value = error?.message || 'Unable to save the draft.'
    throw error
  } finally {
    isTemplateSaving.value = false
  }
}

async function duplicateTemplate() {
  if (!currentTemplateId.value) {
    await saveDraft()
  }

  isTemplateSaving.value = true
  templateError.value = ''

  try {
    const template = await duplicateAssessmentForm(currentTemplateId.value)
    hydrateBuilderTemplate(template)
    await router.replace({
      query: {
        ...route.query,
        templateId: currentTemplateId.value,
      },
    })
    templateNotice.value = safeText('assessmentFormBuilder.messages.duplicated', 'Template duplicated.')
  } catch (error) {
    templateError.value = error?.message || 'Unable to duplicate the template.'
    throw error
  } finally {
    isTemplateSaving.value = false
  }
}

async function publishTemplate() {
  if (hasUnsavedChanges.value) {
    await saveDraft()
  }

  isTemplateSaving.value = true
  templateError.value = ''

  try {
    const template = await publishAssessmentForm(currentTemplateId.value, {
      changeSummary: 'Publish from Preschool form builder',
    })
    hydrateBuilderTemplate(template)
    templateNotice.value = safeText('assessmentFormBuilder.messages.published', 'Template published.')
  } catch (error) {
    templateError.value = error?.message || 'Unable to publish the template.'
    throw error
  } finally {
    isTemplateSaving.value = false
  }
}

async function archiveTemplate() {
  if (!currentTemplateId.value) return

  isTemplateSaving.value = true
  templateError.value = ''

  try {
    const template = await archiveAssessmentForm(currentTemplateId.value)
    hydrateBuilderTemplate(template)
    templateNotice.value = safeText('assessmentFormBuilder.messages.archived', 'Template archived.')
  } catch (error) {
    templateError.value = error?.message || 'Unable to archive the template.'
    throw error
  } finally {
    isTemplateSaving.value = false
  }
}

async function restoreTemplate() {
  if (!currentTemplateId.value) return

  isTemplateSaving.value = true
  templateError.value = ''

  try {
    const template = await restoreAssessmentForm(currentTemplateId.value)
    hydrateBuilderTemplate(template)
    templateNotice.value = safeText('assessmentFormBuilder.messages.restored', 'Template restored.')
  } catch (error) {
    templateError.value = error?.message || 'Unable to restore the template.'
    throw error
  } finally {
    isTemplateSaving.value = false
  }
}

onMounted(() => {
  loadTemplate(currentTemplateId.value)
})
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
          <div class="assessment-form-builder-toolbar__status">
            <span class="assessment-form-builder-toolbar__status-badge" :data-tone="templateStatusTone">
              {{ templateStatusLabel }}
            </span>
            <span v-if="hasUnsavedChanges" class="assessment-form-builder-toolbar__status-changed">
              {{ safeText('assessmentFormBuilder.messages.unsavedChanges', 'Unsaved changes') }}
            </span>
            <span v-else class="assessment-form-builder-toolbar__status-changed assessment-form-builder-toolbar__status-changed--muted">
              {{ safeText('assessmentFormBuilder.messages.savedState', 'Draft saved') }}
            </span>
          </div>
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
            :loading="isTemplateSaving"
            @click="saveDraft"
          />
          <Button
            :label="safeText('assessmentFormBuilder.actions.duplicate', 'Duplicate')"
            icon="pi pi-copy"
            severity="secondary"
            :loading="isTemplateSaving"
            :disabled="!currentTemplateId"
            @click="duplicateTemplate"
          />
          <Button
            :label="safeText('assessmentFormBuilder.actions.preview', 'Preview')"
            icon="pi pi-eye"
            severity="secondary"
          />
          <Button
            :label="safeText('assessmentFormBuilder.actions.publish', 'Publish')"
            icon="pi pi-send"
            :loading="isTemplateSaving"
            @click="publishTemplate"
          />
          <Button
            v-if="templateStatus === 'archived'"
            :label="safeText('assessmentFormBuilder.actions.restore', 'Restore')"
            icon="pi pi-refresh"
            severity="secondary"
            :loading="isTemplateSaving"
            @click="restoreTemplate"
          />
          <Button
            v-else
            :label="safeText('assessmentFormBuilder.actions.archive', 'Archive')"
            icon="pi pi-box"
            severity="secondary"
            :loading="isTemplateSaving"
            @click="archiveTemplate"
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
          <div v-if="isTemplateLoading" class="assessment-form-builder-state">
            <i class="pi pi-spin pi-spinner" />
            <span>{{ safeText('assessmentFormBuilder.messages.loading', 'Loading template...') }}</span>
          </div>
          <div v-else-if="templateError" class="assessment-form-builder-state assessment-form-builder-state--error">
            <i class="pi pi-exclamation-triangle" />
            <span>{{ templateError }}</span>
          </div>
          <div v-else-if="templateNotice" class="assessment-form-builder-state assessment-form-builder-state--success">
            <i class="pi pi-check-circle" />
            <span>{{ templateNotice }}</span>
          </div>
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

.assessment-form-builder-toolbar__status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.assessment-form-builder-toolbar__status-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: #334155;
  background: #e2e8f0;
}

.assessment-form-builder-toolbar__status-badge[data-tone='success'] {
  color: #166534;
  background: #dcfce7;
}

.assessment-form-builder-toolbar__status-badge[data-tone='warning'] {
  color: #92400e;
  background: #fef3c7;
}

.assessment-form-builder-toolbar__status-changed {
  font-size: 0.78rem;
  font-weight: 700;
  color: #2563eb;
}

.assessment-form-builder-toolbar__status-changed--muted {
  color: #64748b;
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

.assessment-form-builder-state {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 0.9rem;
  border: 1px solid #dbeafe;
  background: #eff6ff;
  color: #1d4ed8;
}

.assessment-form-builder-state--error {
  border-color: #fecaca;
  background: #fef2f2;
  color: #b91c1c;
}

.assessment-form-builder-state--success {
  border-color: #bbf7d0;
  background: #f0fdf4;
  color: #166534;
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

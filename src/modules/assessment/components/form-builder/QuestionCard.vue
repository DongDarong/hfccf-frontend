<script setup>
import Button from '@/components/buttons/Button.vue'
import Tag from 'primevue/tag'
import Tooltip from 'primevue/tooltip'
import { useLanguage } from '@/composables/useLanguage'
import { assessmentFormApi } from '../../services/assessmentFormApi'
import { useFormBuilderStore } from '../../stores/useFormBuilderStore'

defineOptions({ directives: { tooltip: Tooltip } })

const props = defineProps({
  question: { type: Object, required: true },
  formId:   { type: [String, Number], required: true },
  order:    { type: Number, default: null },
})

const { t }  = useLanguage()
const store  = useFormBuilderStore()

const typeIcon = {
  short_text:   'pi-align-left',
  long_text:    'pi-align-justify',
  number:       'pi-hashtag',
  date:         'pi-calendar',
  radio:        'pi-circle',
  checkbox:     'pi-check-square',
  dropdown:     'pi-chevron-down',
  rating:       'pi-star',
  file:         'pi-upload',
  signature:    'pi-pen-to-square',
  matrix:       'pi-table',
  score_rubric: 'pi-list-check',
}

async function deleteQuestion() {
  await assessmentFormApi.deleteQuestion(props.formId, props.question.id)
  if (store.template?.questions) {
    store.template.questions = store.template.questions.filter((q) => q.id !== props.question.id)
  }
}
</script>

<template>
  <div class="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all hover:border-slate-300 hover:shadow">

    <!-- Order number -->
    <span
      v-if="order !== null"
      class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500"
    >
      {{ order }}
    </span>

    <!-- Type icon -->
    <span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
      <i :class="['pi text-sm', typeIcon[question.question_type_key] ?? 'pi-question-circle']" />
    </span>

    <!-- Content -->
    <div class="min-w-0 flex-1">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-medium leading-snug text-slate-800">
          {{ question.question_text }}
        </span>
        <span v-if="question.is_required" class="text-xs font-semibold text-red-500">*</span>
      </div>
      <div class="mt-1.5 flex items-center gap-2">
        <Tag
          :value="t(`formBuilder.questionTypes.${question.question_type_key}`)"
          severity="secondary"
          class="!px-1.5 !py-0 !text-xs"
        />
        <span v-if="question.help_text" class="truncate text-xs text-slate-400">{{ question.help_text }}</span>
      </div>
    </div>

    <!-- Actions (appear on hover) -->
    <div class="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
      <Button
        icon="pi pi-trash"
        text
        size="sm"
        severity="danger"
        v-tooltip.top="t('formBuilder.questions.deleteQuestion')"
        @click="deleteQuestion"
      />
    </div>
  </div>
</template>

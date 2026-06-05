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
  index:   { type: Number, default: 0 },
})

const { t }  = useLanguage()
const store  = useFormBuilderStore()

const isEditingTitle = ref(false)
const localTitle     = ref(props.section.title)
const isExpanded     = ref(true)
const showAddQuestion = ref(false)

const questions = () =>
  (store.template?.questions ?? [])
    .filter((q) => q.section_id === props.section.id)
    .sort((a, b) => a.order - b.order)

async function saveTitle() {
  if (localTitle.value.trim()) {
    await store.updateSection(props.section.id, { title: localTitle.value.trim() })
  }
  isEditingTitle.value = false
}

async function deleteSection() {
  await store.deleteSection(props.section.id)
}
</script>

<template>
  <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">

    <!-- Section header -->
    <div
      :class="[
        'flex items-center gap-3 border-b px-4 py-3 transition-colors',
        isExpanded ? 'border-slate-200 bg-slate-50' : 'border-transparent bg-white',
      ]"
    >
      <!-- Index badge -->
      <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
        {{ index + 1 }}
      </span>

      <!-- Title (editable) -->
      <div class="flex-1 min-w-0">
        <InputText
          v-if="isEditingTitle"
          v-model="localTitle"
          class="w-full text-sm font-semibold"
          autofocus
          @blur="saveTitle"
          @keyup.enter="saveTitle"
          @keyup.escape="isEditingTitle = false"
        />
        <button
          v-else
          class="w-full text-left text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors"
          @dblclick="isEditingTitle = true"
          @click.prevent
        >
          {{ section.title }}
        </button>
      </div>

      <!-- Question count -->
      <span class="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
        {{ questions().length }} {{ questions().length === 1 ? 'question' : 'questions' }}
      </span>

      <!-- Actions -->
      <div class="flex shrink-0 items-center gap-1">
        <Button icon="pi pi-pencil" text size="sm" class="!text-slate-400 hover:!text-blue-600" @click="isEditingTitle = true" />
        <Button icon="pi pi-trash"  text size="sm" severity="danger" @click="deleteSection" />
        <button
          class="flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          @click="isExpanded = !isExpanded"
        >
          <i :class="['pi text-xs transition-transform duration-200', isExpanded ? 'pi-chevron-down' : 'pi-chevron-right']" />
        </button>
      </div>
    </div>

    <!-- Section body -->
    <div v-if="isExpanded" class="p-4 flex flex-col gap-2">

      <!-- Questions -->
      <QuestionCard
        v-for="question in questions()"
        :key="question.id"
        :question="question"
        :form-id="store.template?.id"
      />

      <!-- Empty state -->
      <div
        v-if="!questions().length && !showAddQuestion"
        class="rounded-lg border border-dashed border-slate-200 py-6 text-center text-sm text-slate-400"
      >
        No questions yet — add your first below.
      </div>

      <!-- Add question inline panel -->
      <AddQuestionPanel
        v-if="showAddQuestion"
        :section-id="section.id"
        :form-id="store.template?.id"
        @close="showAddQuestion = false"
      />

      <!-- Add question button -->
      <button
        v-if="!showAddQuestion"
        class="flex items-center gap-2 rounded-lg border border-dashed border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
        @click="showAddQuestion = true"
      >
        <i class="pi pi-plus text-xs" />
        {{ t('formBuilder.questions.addQuestion') }}
      </button>
    </div>

  </div>
</template>

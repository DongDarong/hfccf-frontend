<script setup>
import { ref } from 'vue'
import Button from '@/components/buttons/Button.vue'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Checkbox from 'primevue/checkbox'
import { useLanguage } from '@/composables/useLanguage'
import { assessmentFormApi } from '../../services/assessmentFormApi'
import { useFormBuilderStore } from '../../stores/useFormBuilderStore'

const props = defineProps({
  sectionId: { type: [String, Number], required: true },
  formId: { type: [String, Number], required: true },
})

const emit = defineEmits(['close'])

const { t } = useLanguage()
const store = useFormBuilderStore()

const form = ref({
  section_id: props.sectionId,
  question_text: '',
  help_text: '',
  question_type_id: null,
  is_required: false,
  order: 1,
})

const typeOptions = computed(() =>
  store.questionTypes.map((qt) => ({
    label: t(`formBuilder.questionTypes.${qt.key}`),
    value: qt.id,
  })),
)

const isSaving = ref(false)

async function save() {
  isSaving.value = true
  try {
    const res = await assessmentFormApi.createQuestion(props.formId, form.value)
    if (!store.template.questions) store.template.questions = []
    store.template.questions.push(res.data.data)
    emit('close')
  } finally {
    isSaving.value = false
  }
}
</script>

<script>
import { computed } from 'vue'
</script>

<template>
  <div class="add-question-panel">
    <div class="add-question-panel__field">
      <label>{{ t('formBuilder.questions.questionText') }}</label>
      <InputText v-model="form.question_text" class="w-full" />
    </div>
    <div class="add-question-panel__field">
      <label>{{ t('formBuilder.questions.questionType') }}</label>
      <Select
        v-model="form.question_type_id"
        :options="typeOptions"
        option-label="label"
        option-value="value"
        class="w-full"
      />
    </div>
    <div class="add-question-panel__field">
      <label>{{ t('formBuilder.questions.helpText') }}</label>
      <Textarea v-model="form.help_text" rows="2" class="w-full" />
    </div>
    <div class="add-question-panel__field add-question-panel__field--inline">
      <Checkbox v-model="form.is_required" binary input-id="q-required" />
      <label for="q-required">{{ t('formBuilder.questions.required') }}</label>
    </div>
    <div class="add-question-panel__actions">
      <Button :label="t('common.cancel')" severity="secondary" @click="emit('close')" />
      <Button :label="t('common.save')" :loading="isSaving" @click="save" />
    </div>
  </div>
</template>

<style scoped>
.add-question-panel {
  background: var(--surface-section);
  border: 1px dashed var(--surface-border);
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.add-question-panel__field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.add-question-panel__field label {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.add-question-panel__field--inline {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.add-question-panel__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>

<script setup>
import { computed } from 'vue'
import Textarea from 'primevue/textarea'

defineOptions({
  name: 'AssessmentObservationPanel',
})

const props = defineProps({
  observation: {
    type: String,
    default: '',
  },
  teacherComment: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:observation', 'update:teacherComment'])

const observationValue = computed({
  get: () => props.observation,
  set: value => emit('update:observation', value),
})

const teacherCommentValue = computed({
  get: () => props.teacherComment,
  set: value => emit('update:teacherComment', value),
})
</script>

<template>
  <section class="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
    <div class="space-y-2">
      <label class="block text-sm font-medium text-slate-700">Observation</label>

      <Textarea
        v-model="observationValue"
        :disabled="disabled"
        placeholder="Document key observations about the student's performance..."
        rows="4"
        class="w-full"
      />

      <p class="text-xs text-slate-500">
        Include specific examples of behavior, skills demonstrated, or areas needing support.
      </p>
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-medium text-slate-700">Teacher comment</label>

      <Textarea
        v-model="teacherCommentValue"
        :disabled="disabled"
        placeholder="Add any additional comments or recommendations..."
        rows="3"
        class="w-full"
      />

      <p class="text-xs text-slate-500">
        Optional. Include recommendations for next steps or areas for improvement.
      </p>
    </div>

    <div class="flex justify-between text-xs text-slate-500">
      <span>Observation: {{ observationValue.length }} characters</span>
      <span>Comment: {{ teacherCommentValue.length }} characters</span>
    </div>
  </section>
</template>

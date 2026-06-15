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
  set: (value) => emit('update:observation', value),
})

const teacherCommentValue = computed({
  get: () => props.teacherComment,
  set: (value) => emit('update:teacherComment', value),
})
</script>

<template>
  <div class="space-y-4">
    <!-- Observation Section -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">
        📝 Observation
      </label>

      <Textarea
        v-model="observationValue"
        :disabled="disabled"
        placeholder="Document specific observations about the student's performance..."
        rows="4"
        class="w-full"
      />

      <p class="text-xs text-gray-500">
        Include specific examples of behavior, skills demonstrated, or areas needing support.
      </p>
    </div>

    <!-- Teacher Comment Section -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">
        💬 Teacher Comment
      </label>

      <Textarea
        v-model="teacherCommentValue"
        :disabled="disabled"
        placeholder="Add any additional comments or recommendations..."
        rows="3"
        class="w-full"
      />

      <p class="text-xs text-gray-500">
        Optional. Include recommendations for next steps or areas for improvement.
      </p>
    </div>

    <!-- Character Count -->
    <div class="flex justify-between text-xs text-gray-500">
      <span>Observation: {{ observationValue.length }} characters</span>
      <span>Comment: {{ teacherCommentValue.length }} characters</span>
    </div>
  </div>
</template>

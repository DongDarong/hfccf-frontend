<script setup>
import { computed } from 'vue'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'

defineOptions({
  name: 'AssessmentScoringSection',
})

const props = defineProps({
  score: {
    type: [String, Number],
    default: null,
  },
  rating: {
    type: String,
    default: '',
  },
  scoreError: {
    type: String,
    default: '',
  },
  ratingError: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:score', 'update:rating'])

const scoreValue = computed({
  get: () => props.score,
  set: (value) => emit('update:score', value),
})

const ratingValue = computed({
  get: () => props.rating,
  set: (value) => emit('update:rating', value),
})

const ratingOptions = [
  { label: '⭐ Excellent', value: 'Excellent' },
  { label: '👍 Good', value: 'Good' },
  { label: '👌 Fair', value: 'Fair' },
  { label: '⚠️ Needs Improvement', value: 'Needs Improvement' },
]

// Auto-set rating based on score
const suggestedRating = computed(() => {
  const score = parseFloat(scoreValue.value) || 0
  if (score >= 80) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 60) return 'Fair'
  return 'Needs Improvement'
})

function applySuggestedRating() {
  ratingValue.value = suggestedRating.value
}
</script>

<template>
  <div class="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
    <h4 class="font-semibold text-gray-900">📊 Scoring</h4>

    <!-- Score Input -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">
        Score (0-100)
        <span class="text-red-500">*</span>
      </label>

      <InputNumber
        v-model="scoreValue"
        :min="0"
        :max="100"
        :disabled="disabled"
        placeholder="Enter score..."
        class="w-full"
      />

      <p v-if="scoreError" class="text-sm text-red-600">
        ❌ {{ scoreError }}
      </p>

      <!-- Score Interpretation -->
      <div v-if="scoreValue" class="mt-2 rounded bg-blue-50 p-3">
        <p class="text-xs text-blue-700">
          <strong>Score Interpretation:</strong>
          <span v-if="scoreValue >= 80" class="ml-1">⭐ Excellent performance</span>
          <span v-else-if="scoreValue >= 70" class="ml-1">👍 Good performance</span>
          <span v-else-if="scoreValue >= 60" class="ml-1">👌 Fair performance</span>
          <span v-else class="ml-1">⚠️ Needs improvement</span>
        </p>
      </div>
    </div>

    <!-- Rating Select -->
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <label class="block text-sm font-medium text-gray-700">
          Rating
          <span class="text-red-500">*</span>
        </label>
        <button
          v-if="scoreValue"
          type="button"
          class="text-xs text-blue-600 hover:text-blue-800"
          @click="applySuggestedRating"
        >
          💡 Use suggested
        </button>
      </div>

      <Select
        v-model="ratingValue"
        :options="ratingOptions"
        option-label="label"
        option-value="value"
        placeholder="Select a rating..."
        :disabled="disabled"
        show-clear
        class="w-full"
      />

      <p v-if="ratingError" class="text-sm text-red-600">
        ❌ {{ ratingError }}
      </p>
    </div>

    <!-- Suggested Rating Info -->
    <div v-if="scoreValue && ratingValue !== suggestedRating" class="rounded bg-amber-50 p-3">
      <p class="text-xs text-amber-700">
        <strong>💡 Suggestion:</strong>
        Based on the score, the suggested rating is
        <strong>{{ suggestedRating }}</strong>
      </p>
    </div>
  </div>
</template>

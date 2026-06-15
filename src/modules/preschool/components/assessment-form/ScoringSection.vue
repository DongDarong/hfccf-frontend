<script setup>
import { computed } from 'vue'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import { PRESCHOOL_ASSESSMENT_RATING_OPTIONS } from '@/modules/preschool/pages/assessments/constants/preschoolAssessmentWorkspace'

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
  set: value => emit('update:score', value),
})

const ratingValue = computed({
  get: () => props.rating,
  set: value => emit('update:rating', value),
})

const ratingOptions = PRESCHOOL_ASSESSMENT_RATING_OPTIONS.map(option => ({
  label: option.label,
  value: option.value,
}))

const suggestedRating = computed(() => {
  const score = Number(scoreValue.value) || 0
  const match = PRESCHOOL_ASSESSMENT_RATING_OPTIONS.find(option => score >= option.scoreMin && score <= option.scoreMax)
  return match?.value || 'Needs Improvement'
})

function applySuggestedRating() {
  ratingValue.value = suggestedRating.value
}
</script>

<template>
  <section class="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <h4 class="text-sm font-semibold text-slate-900">Scoring</h4>

    <div class="space-y-2">
      <label class="block text-sm font-medium text-slate-700">
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
        {{ scoreError }}
      </p>

      <div v-if="scoreValue !== null && scoreValue !== ''" class="mt-2 rounded-xl bg-blue-50 p-3">
        <p class="text-xs text-blue-700">
          <strong>Score interpretation:</strong>
          <span class="ml-1">
            {{ suggestedRating === 'Excellent' ? 'Excellent performance' : suggestedRating === 'Good' ? 'Good performance' : suggestedRating === 'Fair' ? 'Fair performance' : 'Needs improvement' }}
          </span>
        </p>
      </div>
    </div>

    <div class="space-y-2">
      <div class="flex items-center justify-between gap-3">
        <label class="block text-sm font-medium text-slate-700">
          Rating
          <span class="text-red-500">*</span>
        </label>
        <button
          v-if="scoreValue !== null && scoreValue !== ''"
          type="button"
          class="text-xs font-medium text-blue-600 transition hover:text-blue-800"
          @click="applySuggestedRating"
        >
          Use suggested
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
        {{ ratingError }}
      </p>
    </div>

    <div v-if="scoreValue !== null && scoreValue !== '' && ratingValue !== suggestedRating" class="rounded-xl bg-amber-50 p-3">
      <p class="text-xs text-amber-700">
        <strong>Suggestion:</strong>
        Based on the score, the suggested rating is <strong>{{ suggestedRating }}</strong>.
      </p>
    </div>
  </section>
</template>

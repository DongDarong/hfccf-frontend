<script setup>
/**
 * MatchResultFields
 * Owns the editable result controls only; page-level validation remains in the route page.
 */
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'

defineOptions({
  name: 'MatchResultFields',
})

defineProps({
  homeScore: {
    type: [Number, String],
    default: 0,
  },
  awayScore: {
    type: [Number, String],
    default: 0,
  },
  resultStatus: {
    type: String,
    default: '',
  },
  resultNote: {
    type: String,
    default: '',
  },
  statusOptions: {
    type: Array,
    default: () => [],
  },
  labels: {
    type: Object,
    required: true,
  },
  placeholders: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'update:homeScore',
  'update:awayScore',
  'update:resultStatus',
  'update:resultNote',
])
</script>

<template>
  <div class="match-result-fields">
    <label class="match-result-fields__field">
      <span class="match-result-fields__label">{{ labels.homeScore }}</span>
      <InputText
        :model-value="homeScore"
        type="number"
        min="0"
        class="w-full"
        @update:model-value="emit('update:homeScore', $event)"
      />
    </label>

    <label class="match-result-fields__field">
      <span class="match-result-fields__label">{{ labels.awayScore }}</span>
      <InputText
        :model-value="awayScore"
        type="number"
        min="0"
        class="w-full"
        @update:model-value="emit('update:awayScore', $event)"
      />
    </label>

    <label class="match-result-fields__field">
      <span class="match-result-fields__label">{{ labels.resultStatus }}</span>
      <Select
        :model-value="resultStatus"
        :options="statusOptions"
        option-label="label"
        option-value="value"
        class="w-full"
        @update:model-value="emit('update:resultStatus', $event)"
      />
    </label>

    <label class="match-result-fields__field">
      <span class="match-result-fields__label">{{ labels.resultNote }}</span>
      <InputText
        :model-value="resultNote"
        type="text"
        :placeholder="placeholders.resultNote"
        class="w-full"
        @update:model-value="emit('update:resultNote', $event)"
      />
    </label>
  </div>
</template>

<style scoped>
.match-result-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.match-result-fields__field {
  display: grid;
  gap: 0.45rem;
}

.match-result-fields__label {
  margin: 0;
  color: #475569;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 720px) {
  .match-result-fields {
    grid-template-columns: 1fr;
  }
}
</style>

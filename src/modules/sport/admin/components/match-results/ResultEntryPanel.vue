<script setup>
/**
 * ResultEntryPanel
 * Reusable stateful container for match result entry workflows.
 *
 * Contract:
 * - Receives `modelValue` as initial/current result data.
 * - Owns a local copy so child components never mutate props.
 * - Emits `update:modelValue`, granular `field-update`, and `save`.
 */
import { computed, reactive, watch } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import GoalEventsEditor from '@/modules/sport/admin/components/match-results/GoalEventsEditor.vue'
import MatchResultActions from '@/modules/sport/admin/components/match-results/MatchResultActions.vue'
import MatchResultFields from '@/modules/sport/admin/components/match-results/MatchResultFields.vue'

defineOptions({
  name: 'ResultEntryPanel',
})

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  statusOptions: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'field-update', 'save', 'cancel'])
const { t } = useLanguage()

const form = reactive(createResultValue(props.modelValue))

const scorePreview = computed(() => `${Number(form.homeScore || 0)} - ${Number(form.awayScore || 0)}`)
const fieldLabels = computed(() => ({
  homeScore: t('sportMatchesManagement.resultsEntry.homeScore'),
  awayScore: t('sportMatchesManagement.resultsEntry.awayScore'),
  resultStatus: t('sportMatchesManagement.resultsEntry.resultStatus'),
  report: t('sportMatchesManagement.resultsEntry.report'),
}))
const fieldPlaceholders = computed(() => ({
  report: t('sportMatchesManagement.resultsEntry.reportPlaceholder'),
}))
const goalEventLabels = computed(() => ({
  title: t('sportMatchesManagement.resultsEntry.goalEvents.title'),
  description: t('sportMatchesManagement.resultsEntry.goalEvents.description'),
  add: t('sportMatchesManagement.resultsEntry.goalEvents.add'),
  empty: t('sportMatchesManagement.resultsEntry.goalEvents.empty'),
  playerName: t('sportMatchesManagement.resultsEntry.goalEvents.playerName'),
  minute: t('sportMatchesManagement.resultsEntry.goalEvents.minute'),
  remove: t('sportMatchesManagement.resultsEntry.goalEvents.remove'),
}))
const goalEventPlaceholders = computed(() => ({
  playerName: t('sportMatchesManagement.resultsEntry.goalEvents.playerNamePlaceholder'),
  minute: t('sportMatchesManagement.resultsEntry.goalEvents.minutePlaceholder'),
}))

watch(
  () => props.modelValue,
  (value) => {
    Object.assign(form, createResultValue(value))
  },
  { deep: true },
)

function createResultValue(value = {}) {
  return {
    homeTeam: String(value.homeTeam || ''),
    awayTeam: String(value.awayTeam || ''),
    homeScore: Number(value.homeScore || 0),
    awayScore: Number(value.awayScore || 0),
    status: String(value.status || 'completed'),
    report: String(value.report || ''),
    events: Array.isArray(value.events) ? value.events.map((event) => normalizeGoalEvent(event)) : [],
  }
}

function normalizeGoalEvent(event = {}) {
  return {
    id: event.id || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    playerName: String(event.playerName || ''),
    minute: String(event.minute || ''),
  }
}

function snapshot() {
  return createResultValue(form)
}

function commit(field, value) {
  form[field] = value
  const nextValue = snapshot()
  emit('update:modelValue', nextValue)
  emit('field-update', { field, value, result: nextValue })
}

function addGoalEvent() {
  const event = normalizeGoalEvent()
  commit('events', [...form.events, event])
}

function updateGoalEvent(updatedEvent) {
  commit(
    'events',
    form.events.map((event) => (event.id === updatedEvent.id ? normalizeGoalEvent(updatedEvent) : event)),
  )
}

function removeGoalEvent(id) {
  commit(
    'events',
    form.events.filter((event) => event.id !== id),
  )
}

function onSubmit() {
  emit('save', snapshot())
}
</script>

<template>
  <form class="result-entry-panel" @submit.prevent="onSubmit">
    <div class="result-entry-panel__score-preview" aria-live="polite">
      <span>{{ t('sportMatchesManagement.resultsEntry.scorePreview') }}</span>
      <strong>{{ scorePreview }}</strong>
    </div>

    <MatchResultFields
      :home-score="form.homeScore"
      :away-score="form.awayScore"
      :result-status="form.status"
      :report="form.report"
      :readonly="readonly"
      :status-options="statusOptions"
      :labels="fieldLabels"
      :placeholders="fieldPlaceholders"
      @update:home-score="commit('homeScore', Number($event || 0))"
      @update:away-score="commit('awayScore', Number($event || 0))"
      @update:result-status="commit('status', $event)"
      @update:report="commit('report', $event)"
    />

    <GoalEventsEditor
      :events="form.events"
      :labels="goalEventLabels"
      :placeholders="goalEventPlaceholders"
      :readonly="readonly"
      @add="addGoalEvent"
      @update="updateGoalEvent"
      @remove="removeGoalEvent"
    />

    <MatchResultActions
      :loading="loading"
      :cancel-text="t('common.cancel')"
      :submit-text="t('sportMatchesManagement.resultsEntry.saveButton')"
      @cancel="$emit('cancel')"
    />
  </form>
</template>

<style scoped>
.result-entry-panel {
  display: grid;
  gap: 1rem;
}

.result-entry-panel__score-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: #ffffff;
  color: #1d1d1b;
}

.result-entry-panel__score-preview span {
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.result-entry-panel__score-preview strong {
  color: #00aeef;
  font-size: 1.2rem;
  font-weight: 900;
}

@media (max-width: 720px) {
  .result-entry-panel__score-preview {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

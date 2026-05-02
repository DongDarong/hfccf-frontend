<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'

defineOptions({
  name: 'AddPlayerFormFields',
})

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  team: {
    type: String,
    default: '',
  },
  division: {
    type: String,
    default: '',
  },
  position: {
    type: String,
    default: '',
  },
  jerseyNumber: {
    type: [Number, null],
    default: null,
  },
  age: {
    type: [Number, null],
    default: null,
  },
  status: {
    type: String,
    default: '',
  },
  matchesPlayed: {
    type: Number,
    default: 0,
  },
  goalsScored: {
    type: Number,
    default: 0,
  },
  teamOptions: {
    type: Array,
    default: () => [],
  },
  divisionOptions: {
    type: Array,
    default: () => [],
  },
  statusOptions: {
    type: Array,
    default: () => [],
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  statusLabel: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits([
  'update:name',
  'update:team',
  'update:division',
  'update:position',
  'update:jerseyNumber',
  'update:age',
  'update:status',
  'update:matchesPlayed',
  'update:goalsScored',
])

const { t } = useI18n()

const labels = computed(() => ({
  fullName: t('sportAddPlayer.fullName'),
  team: t('sportAddPlayer.team'),
  division: t('sportAddPlayer.division'),
  position: t('sportAddPlayer.position'),
  status: t('sportAddPlayer.status'),
  jerseyNumber: t('sportAddPlayer.jerseyNumber'),
  age: t('sportAddPlayer.age'),
  matchesPlayed: t('sportAddPlayer.matchesPlayed'),
  goalsScored: t('sportAddPlayer.goalsScored'),
}))

const placeholders = computed(() => ({
  fullName: t('sportAddPlayer.fullNamePlaceholder'),
  team: t('sportAddPlayer.teamPlaceholder'),
  division: t('sportAddPlayer.divisionPlaceholder'),
  position: t('sportAddPlayer.positionPlaceholder'),
  jerseyNumber: t('sportAddPlayer.jerseyNumberPlaceholder'),
  age: t('sportAddPlayer.agePlaceholder'),
}))

const teamSelectOptions = computed(() =>
  props.teamOptions.map((value) => ({
    label: value,
    value,
  })),
)

const divisionSelectOptions = computed(() =>
  props.divisionOptions.map((value) => ({
    label: value,
    value,
  })),
)

const statusSelectOptions = computed(() =>
  props.statusOptions.map((value) => ({
    label: props.statusLabel(value),
    value,
  })),
)

function clampNonNegativeNumber(value) {
  const parsed = Number(value ?? 0)
  if (Number.isNaN(parsed)) return 0
  return Math.max(parsed, 0)
}

const selectPt = {
  root: {
    class:
      '!min-h-[3rem] !rounded-xl !border !border-surface-300 !bg-white transition-all duration-200 hover:enabled:!border-surface-400 focus-within:!border-brand-400 focus-within:!shadow-focus',
  },
  label: {
    class: '!px-4 !py-3 !text-sm !text-surface-900',
  },
  dropdown: {
    class: '!w-12 !bg-transparent !text-surface-500',
  },
  overlay: {
    class:
      '!mt-1 !rounded-xl !border !border-surface-200 !bg-white !shadow-[0_12px_24px_-18px_rgba(15,23,42,0.16)]',
  },
  listContainer: {
    class: '!bg-white !p-1.5',
  },
  option: {
    class:
      '!rounded-lg !bg-white !text-surface-900 hover:!bg-slate-50 data-[p-selected=true]:!bg-brand-50 data-[p-selected=true]:!text-brand-700',
  },
}
</script>

<template>
  <div class="add-player-form-fields">
    <label class="add-player-form-fields__field add-player-form-fields__field--full">
      <span class="add-player-form-fields__label">{{ labels.fullName }}</span>
      <InputText
        :model-value="name"
        :disabled="isLocked"
        :placeholder="placeholders.fullName"
        class="w-full"
        @update:model-value="emit('update:name', $event)"
      />
    </label>

    <label class="add-player-form-fields__field">
      <span class="add-player-form-fields__label">{{ labels.team }}</span>
      <Select
        :model-value="team"
        :options="teamSelectOptions"
        option-label="label"
        option-value="value"
        :disabled="isLocked"
        :placeholder="placeholders.team"
        append-to="self"
        class="w-full"
        :pt="selectPt"
        @update:model-value="emit('update:team', $event)"
      />
    </label>

    <label class="add-player-form-fields__field">
      <span class="add-player-form-fields__label">{{ labels.division }}</span>
      <Select
        :model-value="division"
        :options="divisionSelectOptions"
        option-label="label"
        option-value="value"
        :disabled="isLocked"
        :placeholder="placeholders.division"
        append-to="self"
        class="w-full"
        :pt="selectPt"
        @update:model-value="emit('update:division', $event)"
      />
    </label>

    <label class="add-player-form-fields__field">
      <span class="add-player-form-fields__label">{{ labels.position }}</span>
      <InputText
        :model-value="position"
        :disabled="isLocked"
        :placeholder="placeholders.position"
        class="w-full"
        @update:model-value="emit('update:position', $event)"
      />
    </label>

    <label class="add-player-form-fields__field">
      <span class="add-player-form-fields__label">{{ labels.status }}</span>
      <Select
        :model-value="status"
        :options="statusSelectOptions"
        option-label="label"
        option-value="value"
        :disabled="isLocked"
        append-to="self"
        class="w-full"
        :pt="selectPt"
        @update:model-value="emit('update:status', $event)"
      />
    </label>

    <label class="add-player-form-fields__field">
      <span class="add-player-form-fields__label">{{ labels.jerseyNumber }}</span>
      <InputNumber
        :model-value="jerseyNumber"
        :disabled="isLocked"
        :min="0"
        :placeholder="placeholders.jerseyNumber"
        class="w-full"
        input-class="w-full"
        @update:model-value="emit('update:jerseyNumber', $event)"
      />
    </label>

    <label class="add-player-form-fields__field">
      <span class="add-player-form-fields__label">{{ labels.age }}</span>
      <InputNumber
        :model-value="age"
        :disabled="isLocked"
        :min="0"
        :placeholder="placeholders.age"
        class="w-full"
        input-class="w-full"
        @update:model-value="emit('update:age', $event)"
      />
    </label>

    <label class="add-player-form-fields__field">
      <span class="add-player-form-fields__label">{{ labels.matchesPlayed }}</span>
      <InputNumber
        :model-value="matchesPlayed"
        :disabled="isLocked"
        :min="0"
        class="w-full"
        input-class="w-full"
        @update:model-value="emit('update:matchesPlayed', clampNonNegativeNumber($event))"
      />
    </label>

    <label class="add-player-form-fields__field">
      <span class="add-player-form-fields__label">{{ labels.goalsScored }}</span>
      <InputNumber
        :model-value="goalsScored"
        :disabled="isLocked"
        :min="0"
        class="w-full"
        input-class="w-full"
        @update:model-value="emit('update:goalsScored', clampNonNegativeNumber($event))"
      />
    </label>
  </div>
</template>

<style scoped>
.add-player-form-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.add-player-form-fields__field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.add-player-form-fields__field--full {
  grid-column: 1 / -1;
}

.add-player-form-fields__label {
  color: #334155;
  font-size: 0.86rem;
  font-weight: 700;
}

@media (max-width: 768px) {
  .add-player-form-fields {
    grid-template-columns: 1fr;
  }
}
</style>


<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Select from 'primevue/select'

defineOptions({
  name: 'AddPlayerSportsProfileStatusFields',
})

const props = defineProps({
  // Values
  primaryPosition: { type: String, default: '' },
  registrationStatus: { type: String, default: '' },

  // Options
  positionOptions: { type: Array, default: () => [] },
  registrationStatusOptions: { type: Array, default: () => ['registered', 'pending', 'unregistered'] },

  // State
  isLocked: { type: Boolean, default: false },
})

const emit = defineEmits([
  'update:primaryPosition',
  'update:registrationStatus',
])

const { t, te } = useI18n()

const labels = computed(() => ({
  sectionTitle: t('sportAddPlayer.sportsProfileStatus.title'),
  primaryPosition: t('sportAddPlayer.sportsProfileStatus.primaryPosition'),
  registrationStatus: t('sportAddPlayer.sportsProfileStatus.registrationStatus'),
}))

const placeholders = computed(() => ({
  primaryPosition: t('sportAddPlayer.sportsProfileStatus.primaryPositionPlaceholder'),
  registrationStatus: t('sportAddPlayer.sportsProfileStatus.registrationStatusPlaceholder'),
}))

const positionSelectOptions = computed(() =>
  props.positionOptions.map((value) => ({ label: value, value })),
)

function registrationStatusLabel(value) {
  const key = `sportAddPlayer.sportsProfileStatus.registrationStatusOptions.${String(value || '')
    .trim()
    .toLowerCase()}`
  return te(key) ? t(key) : String(value || '')
}

const registrationStatusSelectOptions = computed(() =>
  props.registrationStatusOptions.map((value) => ({ label: registrationStatusLabel(value), value })),
)

// Keep select styling consistent with the other fields on the Add Player form.
const selectPt = {
  root: {
    class:
      '!min-h-[3rem] !rounded-xl !border !border-surface-300 !bg-white transition-all duration-200 hover:enabled:!border-surface-400 focus-within:!border-brand-400 focus-within:!shadow-focus',
  },
  label: { class: '!px-4 !py-3 !text-sm !text-surface-900' },
  dropdown: { class: '!w-12 !bg-transparent !text-surface-500' },
  overlay: {
    class:
      '!mt-1 !rounded-xl !border !border-surface-200 !bg-white !shadow-[0_12px_24px_-18px_rgba(15,23,42,0.16)]',
  },
  listContainer: { class: '!bg-white !p-1.5' },
  option: {
    class:
      '!rounded-lg !bg-white !text-surface-900 hover:!bg-slate-50 data-[p-selected=true]:!bg-brand-50 data-[p-selected=true]:!text-brand-700',
  },
}
</script>

<template>
  <div class="add-player-sports-profile">
    <div class="add-player-sports-profile__section">
      <div class="add-player-sports-profile__title">{{ labels.sectionTitle }}</div>
    </div>

    <!-- Arrange by typical entry flow: positions, team, then status fields. -->
    <label class="add-player-sports-profile__field">
      <span class="add-player-sports-profile__label">{{ labels.primaryPosition }}</span>
      <Select
        :model-value="primaryPosition"
        :options="positionSelectOptions"
        option-label="label"
        option-value="value"
        :disabled="isLocked"
        :placeholder="placeholders.primaryPosition"
        append-to="self"
        class="w-full"
        :pt="selectPt"
        @update:model-value="emit('update:primaryPosition', $event)"
      />
    </label>

    <label class="add-player-sports-profile__field">
      <span class="add-player-sports-profile__label">{{ labels.registrationStatus }}</span>
      <Select
        :model-value="registrationStatus"
        :options="registrationStatusSelectOptions"
        option-label="label"
        option-value="value"
        :disabled="isLocked"
        :placeholder="placeholders.registrationStatus"
        append-to="self"
        class="w-full"
        :pt="selectPt"
        @update:model-value="emit('update:registrationStatus', $event)"
      />
    </label>
  </div>
</template>

<style scoped>
.add-player-sports-profile {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.add-player-sports-profile__field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.add-player-sports-profile__field--full {
  grid-column: 1 / -1;
}

.add-player-sports-profile__label {
  color: #334155;
  font-size: 0.86rem;
  font-weight: 700;
}

.add-player-sports-profile__section {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  margin-top: 0.25rem;
}

.add-player-sports-profile__title {
  color: #0f172a;
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.01em;
}

@media (max-width: 768px) {
  .add-player-sports-profile {
    grid-template-columns: 1fr;
  }
}
</style>

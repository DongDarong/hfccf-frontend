<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'

defineOptions({
  name: 'AddPlayerPersonalInformationFields',
})

const props = defineProps({
  // Contact & demographics (part of personal information).
  phone: { type: String, default: '' },
  gender: { type: String, default: '' },
  age: { type: [Number, null], default: null },

  // Values
  heightCm: { type: [Number, null], default: null },
  weightKg: { type: [Number, null], default: null },
  preferredFoot: { type: String, default: '' },
  bloodType: { type: String, default: '' },
  village: { type: String, default: '' },
  commune: { type: String, default: '' },
  district: { type: String, default: '' },
  province: { type: String, default: '' },
  currentSchool: { type: String, default: '' },
  gradeYear: { type: String, default: '' },

  // Options
  preferredFootOptions: { type: Array, default: () => ['Right', 'Left', 'Both'] },
  bloodTypeOptions: { type: Array, default: () => ['A', 'B', 'AB', 'O'] },
  genderOptions: { type: Array, default: () => ['male', 'female', 'other'] },

  // State
  isLocked: { type: Boolean, default: false },
})

const emit = defineEmits([
  'update:phone',
  'update:gender',
  'update:age',
  'update:heightCm',
  'update:weightKg',
  'update:preferredFoot',
  'update:bloodType',
  'update:village',
  'update:commune',
  'update:district',
  'update:province',
  'update:currentSchool',
  'update:gradeYear',
])

const { t, te } = useI18n()

const labels = computed(() => ({
  sectionTitle: t('sportAddPlayer.personalInformation.title'),
  physicalAttributes: t('sportAddPlayer.personalInformation.physicalAttributes'),
  phone: t('sportAddPlayer.phone'),
  gender: t('sportAddPlayer.gender'),
  age: t('sportAddPlayer.age'),
  heightCm: t('sportAddPlayer.personalInformation.heightCm'),
  weightKg: t('sportAddPlayer.personalInformation.weightKg'),
  preferredFoot: t('sportAddPlayer.personalInformation.preferredFoot'),
  bloodType: t('sportAddPlayer.personalInformation.bloodType'),
  village: t('sportAddPlayer.personalInformation.village'),
  commune: t('sportAddPlayer.personalInformation.commune'),
  district: t('sportAddPlayer.personalInformation.district'),
  province: t('sportAddPlayer.personalInformation.province'),
  currentSchool: t('sportAddPlayer.personalInformation.currentSchool'),
  gradeYear: t('sportAddPlayer.personalInformation.gradeYear'),
}))

const placeholders = computed(() => ({
  phone: t('sportAddPlayer.phonePlaceholder'),
  gender: t('sportAddPlayer.genderPlaceholder'),
  preferredFoot: t('sportAddPlayer.personalInformation.preferredFootPlaceholder'),
  bloodType: t('sportAddPlayer.personalInformation.bloodTypePlaceholder'),
  village: t('sportAddPlayer.personalInformation.villagePlaceholder'),
  commune: t('sportAddPlayer.personalInformation.communePlaceholder'),
  district: t('sportAddPlayer.personalInformation.districtPlaceholder'),
  province: t('sportAddPlayer.personalInformation.provincePlaceholder'),
  currentSchool: t('sportAddPlayer.personalInformation.currentSchoolPlaceholder'),
  gradeYear: t('sportAddPlayer.personalInformation.gradeYearPlaceholder'),
}))

const preferredFootSelectOptions = computed(() =>
  props.preferredFootOptions.map((value) => ({ label: value, value })),
)

const bloodTypeSelectOptions = computed(() =>
  props.bloodTypeOptions.map((value) => ({ label: value, value })),
)

function genderLabel(value) {
  const key = `sportAddPlayer.genderOptions.${String(value || '').trim().toLowerCase()}`
  return te(key) ? t(key) : String(value || '')
}

const genderSelectOptions = computed(() =>
  props.genderOptions.map((value) => ({ label: genderLabel(value), value })),
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
  <div class="add-player-personal-info">
    <div class="add-player-personal-info__section">
      <div class="add-player-personal-info__title">{{ labels.sectionTitle }}</div>
      <div class="add-player-personal-info__hint">{{ labels.physicalAttributes }}</div>
    </div>

    <!-- Arrange by what is typically collected first: contact/demographics, then body metrics, then address, then school info. -->
    <label class="add-player-personal-info__field add-player-personal-info__field--full">
      <span class="add-player-personal-info__label">{{ labels.phone }}</span>
      <InputText
        :model-value="phone"
        :disabled="isLocked"
        :placeholder="placeholders.phone"
        class="w-full"
        @update:model-value="emit('update:phone', $event)"
      />
    </label>

    <label class="add-player-personal-info__field">
      <span class="add-player-personal-info__label">{{ labels.gender }}</span>
      <Select
        :model-value="gender"
        :options="genderSelectOptions"
        option-label="label"
        option-value="value"
        :disabled="isLocked"
        :placeholder="placeholders.gender"
        append-to="self"
        class="w-full"
        :pt="selectPt"
        @update:model-value="emit('update:gender', $event)"
      />
    </label>

    <label class="add-player-personal-info__field">
      <span class="add-player-personal-info__label">{{ labels.age }}</span>
      <InputNumber
        :model-value="age"
        :disabled="isLocked"
        :min="0"
        class="w-full"
        input-class="w-full"
        @update:model-value="emit('update:age', $event)"
      />
    </label>

    <label class="add-player-personal-info__field">
      <span class="add-player-personal-info__label">{{ labels.heightCm }}</span>
      <InputNumber
        :model-value="heightCm"
        :disabled="isLocked"
        :min="0"
        class="w-full"
        input-class="w-full"
        @update:model-value="emit('update:heightCm', $event)"
      />
    </label>

    <label class="add-player-personal-info__field">
      <span class="add-player-personal-info__label">{{ labels.weightKg }}</span>
      <InputNumber
        :model-value="weightKg"
        :disabled="isLocked"
        :min="0"
        class="w-full"
        input-class="w-full"
        @update:model-value="emit('update:weightKg', $event)"
      />
    </label>

    <label class="add-player-personal-info__field">
      <span class="add-player-personal-info__label">{{ labels.preferredFoot }}</span>
      <Select
        :model-value="preferredFoot"
        :options="preferredFootSelectOptions"
        option-label="label"
        option-value="value"
        :disabled="isLocked"
        :placeholder="placeholders.preferredFoot"
        append-to="self"
        class="w-full"
        :pt="selectPt"
        @update:model-value="emit('update:preferredFoot', $event)"
      />
    </label>

    <label class="add-player-personal-info__field">
      <span class="add-player-personal-info__label">{{ labels.bloodType }}</span>
      <Select
        :model-value="bloodType"
        :options="bloodTypeSelectOptions"
        option-label="label"
        option-value="value"
        :disabled="isLocked"
        :placeholder="placeholders.bloodType"
        append-to="self"
        class="w-full"
        :pt="selectPt"
        @update:model-value="emit('update:bloodType', $event)"
      />
    </label>

    <label class="add-player-personal-info__field">
      <span class="add-player-personal-info__label">{{ labels.province }}</span>
      <InputText
        :model-value="province"
        :disabled="isLocked"
        :placeholder="placeholders.province"
        class="w-full"
        @update:model-value="emit('update:province', $event)"
      />
    </label>

    <label class="add-player-personal-info__field">
      <span class="add-player-personal-info__label">{{ labels.district }}</span>
      <InputText
        :model-value="district"
        :disabled="isLocked"
        :placeholder="placeholders.district"
        class="w-full"
        @update:model-value="emit('update:district', $event)"
      />
    </label>

    <label class="add-player-personal-info__field">
      <span class="add-player-personal-info__label">{{ labels.commune }}</span>
      <InputText
        :model-value="commune"
        :disabled="isLocked"
        :placeholder="placeholders.commune"
        class="w-full"
        @update:model-value="emit('update:commune', $event)"
      />
    </label>

    <label class="add-player-personal-info__field">
      <span class="add-player-personal-info__label">{{ labels.village }}</span>
      <InputText
        :model-value="village"
        :disabled="isLocked"
        :placeholder="placeholders.village"
        class="w-full"
        @update:model-value="emit('update:village', $event)"
      />
    </label>

    <label class="add-player-personal-info__field add-player-personal-info__field--full">
      <span class="add-player-personal-info__label">{{ labels.currentSchool }}</span>
      <InputText
        :model-value="currentSchool"
        :disabled="isLocked"
        :placeholder="placeholders.currentSchool"
        class="w-full"
        @update:model-value="emit('update:currentSchool', $event)"
      />
    </label>

    <label class="add-player-personal-info__field add-player-personal-info__field--full">
      <span class="add-player-personal-info__label">{{ labels.gradeYear }}</span>
      <InputText
        :model-value="gradeYear"
        :disabled="isLocked"
        :placeholder="placeholders.gradeYear"
        class="w-full"
        @update:model-value="emit('update:gradeYear', $event)"
      />
    </label>
  </div>
</template>

<style scoped>
.add-player-personal-info {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.add-player-personal-info__field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.add-player-personal-info__field--full {
  grid-column: 1 / -1;
}

.add-player-personal-info__label {
  color: #334155;
  font-size: 0.86rem;
  font-weight: 700;
}

.add-player-personal-info__section {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  margin-top: 0.25rem;
}

.add-player-personal-info__title {
  color: #0f172a;
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.01em;
}

.add-player-personal-info__hint {
  color: #64748b;
  font-size: 0.82rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

@media (max-width: 768px) {
  .add-player-personal-info {
    grid-template-columns: 1fr;
  }
}
</style>

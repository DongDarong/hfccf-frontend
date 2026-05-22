<script setup>
import InputNumber from 'primevue/inputnumber'
import ToggleSwitch from 'primevue/toggleswitch'
import Select from 'primevue/select'
import PreschoolSettingsSectionCard from './PreschoolSettingsSectionCard.vue'
import { useLanguage } from '@/composables/useLanguage'

// Attendance settings stay isolated so the operational rules remain easy to
// scan and the page can reuse the same validation model across sections.
defineOptions({
  name: 'PreschoolAttendanceConfiguration',
})

const { t } = useLanguage()

defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  absenceRuleOptions: {
    type: Array,
    default: () => [],
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

function updateField(field, value) {
  emit('update:modelValue', {
    ...field.model,
    [field.key]: value,
  })
}
</script>

<template>
  <PreschoolSettingsSectionCard
    :eyebrow="t('preschoolSettingsPage.sections.attendance.eyebrow')"
    :title="t('preschoolSettingsPage.sections.attendance.title')"
    :subtitle="t('preschoolSettingsPage.sections.attendance.subtitle')"
  >
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <label class="preschool-settings-field xl:col-span-2">
        <span>{{ t('preschoolSettingsPage.fields.markingWindow') }}</span>
        <input
          :value="modelValue.markingWindow"
          type="text"
          class="preschool-settings-input"
          :placeholder="t('preschoolSettingsPage.placeholders.markingWindow')"
          @input="updateField({ model: modelValue, key: 'markingWindow' }, $event.target.value)"
        />
        <small v-if="errors.markingWindow" class="text-xs font-medium text-rose-600">{{ t(`preschoolSettingsPage.validation.${errors.markingWindow}`) }}</small>
      </label>

      <label class="preschool-settings-field">
        <span>{{ t('preschoolSettingsPage.fields.lateThreshold') }}</span>
        <InputNumber
          :model-value="modelValue.lateThreshold"
          class="w-full"
          input-class="preschool-settings-input"
          :placeholder="t('preschoolSettingsPage.placeholders.lateThreshold')"
          @update:model-value="updateField({ model: modelValue, key: 'lateThreshold' }, $event)"
        />
        <small v-if="errors.lateThreshold" class="text-xs font-medium text-rose-600">{{ t(`preschoolSettingsPage.validation.${errors.lateThreshold}`) }}</small>
      </label>

      <label class="preschool-settings-field">
        <span>{{ t('preschoolSettingsPage.fields.absenceRule') }}</span>
        <Select
          :model-value="modelValue.absenceRule"
          :options="absenceRuleOptions"
          option-label="label"
          option-value="value"
          class="w-full"
          :placeholder="t('preschoolSettingsPage.placeholders.absenceRule')"
          @update:model-value="updateField({ model: modelValue, key: 'absenceRule' }, $event)"
        />
        <small v-if="errors.absenceRule" class="text-xs font-medium text-rose-600">{{ t(`preschoolSettingsPage.validation.${errors.absenceRule}`) }}</small>
      </label>

      <label class="preschool-settings-field xl:col-span-4">
        <span>{{ t('preschoolSettingsPage.fields.teacherCanEditAttendance') }}</span>
        <div class="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <span class="text-sm text-slate-600">{{ t('preschoolSettingsPage.help.teacherCanEditAttendance') }}</span>
          <ToggleSwitch
            :model-value="modelValue.teacherCanEditAttendance"
            @update:model-value="updateField({ model: modelValue, key: 'teacherCanEditAttendance' }, $event)"
          />
        </div>
        <small v-if="errors.teacherCanEditAttendance" class="text-xs font-medium text-rose-600">{{ t(`preschoolSettingsPage.validation.${errors.teacherCanEditAttendance}`) }}</small>
      </label>
    </div>
  </PreschoolSettingsSectionCard>
</template>

<style scoped>
.preschool-settings-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.preschool-settings-field > span {
  font-size: 0.85rem;
  font-weight: 700;
  color: #334155;
}

.preschool-settings-input {
  width: 100%;
  min-height: 2.75rem;
  border-radius: 0.9rem;
  border: 1px solid #d7e0ea;
  background: #fff;
  padding: 0.7rem 0.9rem;
  color: #0f172a;
}
</style>
<script setup>
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import Button from '@/components/buttons/Button.vue'
import { useLanguage } from '@/composables/useLanguage'
import PreschoolSettingsSectionCard from './PreschoolSettingsSectionCard.vue'

// Keep the term dialog isolated so the page can own state while this component
// stays focused on the form contract and validation feedback.
defineOptions({
  name: 'PreschoolTermDialog',
})

const { t } = useLanguage()

defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  draft: {
    type: Object,
    required: true,
  },
  statusOptions: {
    type: Array,
    default: () => [],
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['cancel', 'save', 'update:draft'])

function updateField(field, value) {
  emit('update:draft', {
    ...field.model,
    [field.key]: value,
  })
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :closable="false"
    class="preschool-settings-term-dialog"
    :style="{ width: 'min(92vw, 36rem)' }"
  >
    <template #header>
      <div>
        <h4 class="text-lg font-semibold text-slate-900">{{ title }}</h4>
        <p class="text-sm text-slate-500">{{ t('preschoolSettingsPage.termDialog.subtitle') }}</p>
      </div>
    </template>

    <PreschoolSettingsSectionCard
      :eyebrow="t('preschoolSettingsPage.termDialog.eyebrow')"
      :title="t('preschoolSettingsPage.termDialog.cardTitle')"
      :subtitle="t('preschoolSettingsPage.termDialog.cardSubtitle')"
    >
      <div class="grid gap-4 md:grid-cols-2">
        <label class="preschool-settings-field md:col-span-2">
          <span>{{ t('preschoolSettingsPage.fields.termName') }}</span>
          <input
            :value="draft.name"
            type="text"
            class="preschool-settings-input"
            :placeholder="t('preschoolSettingsPage.placeholders.termName')"
            @input="updateField({ model: draft, key: 'name' }, $event.target.value)"
          />
          <small v-if="errors.name" class="text-xs font-medium text-rose-600">{{ t(`preschoolSettingsPage.validation.${errors.name}`) }}</small>
        </label>

        <label class="preschool-settings-field">
          <span>{{ t('preschoolSettingsPage.fields.startDate') }}</span>
          <Calendar
            :model-value="draft.startDate"
            date-format="yy-mm-dd"
            show-icon
            class="w-full"
            :placeholder="t('preschoolSettingsPage.placeholders.startDate')"
            @update:model-value="updateField({ model: draft, key: 'startDate' }, $event)"
          />
          <small v-if="errors.startDate" class="text-xs font-medium text-rose-600">{{ t(`preschoolSettingsPage.validation.${errors.startDate}`) }}</small>
        </label>

        <label class="preschool-settings-field">
          <span>{{ t('preschoolSettingsPage.fields.endDate') }}</span>
          <Calendar
            :model-value="draft.endDate"
            date-format="yy-mm-dd"
            show-icon
            class="w-full"
            :placeholder="t('preschoolSettingsPage.placeholders.endDate')"
            @update:model-value="updateField({ model: draft, key: 'endDate' }, $event)"
          />
          <small v-if="errors.endDate" class="text-xs font-medium text-rose-600">{{ t(`preschoolSettingsPage.validation.${errors.endDate}`) }}</small>
        </label>

        <label class="preschool-settings-field md:col-span-2">
          <span>{{ t('preschoolSettingsPage.fields.status') }}</span>
          <Dropdown
            :model-value="draft.status"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            class="w-full"
            :placeholder="t('preschoolSettingsPage.placeholders.status')"
            @update:model-value="updateField({ model: draft, key: 'status' }, $event)"
          />
          <small v-if="errors.status" class="text-xs font-medium text-rose-600">{{ t(`preschoolSettingsPage.validation.${errors.status}`) }}</small>
        </label>
      </div>
    </PreschoolSettingsSectionCard>

    <template #footer>
      <div class="flex flex-wrap justify-end gap-3">
        <Button variant="ghost" @click="emit('cancel')">{{ t('preschoolSettingsPage.actions.cancel') }}</Button>
        <Button variant="primary" @click="emit('save')">{{ t('preschoolSettingsPage.actions.saveTerm') }}</Button>
      </div>
    </template>
  </Dialog>
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
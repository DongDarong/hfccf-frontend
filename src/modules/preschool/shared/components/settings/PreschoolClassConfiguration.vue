<script setup>
import Button from '@/components/buttons/Button.vue'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import PreschoolSettingsSectionCard from './PreschoolSettingsSectionCard.vue'
import { useLanguage } from '@/composables/useLanguage'

// Keep class-level configuration editable in a compact grid so the page owns
// the structure while this section only handles the repeatable form rows.
defineOptions({
  name: 'PreschoolClassConfiguration',
})

const { t } = useLanguage()

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  levelOptions: {
    type: Array,
    default: () => [],
  },
  teacherOptions: {
    type: Array,
    default: () => [],
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

const emit = defineEmits(['add', 'update:item', 'remove'])
</script>

<template>
  <PreschoolSettingsSectionCard
    :eyebrow="t('preschoolSettingsPage.sections.classConfiguration.eyebrow')"
    :title="t('preschoolSettingsPage.sections.classConfiguration.title')"
    :subtitle="t('preschoolSettingsPage.sections.classConfiguration.subtitle')"
  >
    <div class="flex flex-wrap items-center justify-between gap-3">
      <p class="text-sm text-slate-500">{{ t('preschoolSettingsPage.sections.classConfiguration.description') }}</p>
      <Button variant="primary" @click="emit('add')">{{ t('preschoolSettingsPage.actions.addClassConfiguration') }}</Button>
    </div>

    <div class="mt-4 grid gap-4 xl:grid-cols-2">
      <article
        v-for="(item, index) in items"
        :key="item.id || `${item.classLevel}-${index}`"
        class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-[0_10px_30px_-28px_rgba(15,23,42,0.45)]"
      >
        <div class="grid gap-4 md:grid-cols-2">
          <label class="preschool-settings-field">
            <span>{{ t('preschoolSettingsPage.fields.classLevel') }}</span>
            <Select
              :model-value="item.classLevel"
              :options="levelOptions"
              option-label="label"
              option-value="value"
              class="w-full"
              :placeholder="t('preschoolSettingsPage.placeholders.classLevel')"
              @update:model-value="emit('update:item', { index, field: 'classLevel', value: $event })"
            />
            <small v-if="errors?.[index]?.classLevel" class="text-xs font-medium text-rose-600">{{ t(`preschoolSettingsPage.validation.${errors[index].classLevel}`) }}</small>
          </label>

          <label class="preschool-settings-field">
            <span>{{ t('preschoolSettingsPage.fields.capacity') }}</span>
            <InputNumber
              :model-value="item.capacity"
              class="w-full"
              input-class="preschool-settings-input"
              :placeholder="t('preschoolSettingsPage.placeholders.capacity')"
              @update:model-value="emit('update:item', { index, field: 'capacity', value: $event })"
            />
            <small v-if="errors?.[index]?.capacity" class="text-xs font-medium text-rose-600">{{ t(`preschoolSettingsPage.validation.${errors[index].capacity}`) }}</small>
          </label>

          <label class="preschool-settings-field">
            <span>{{ t('preschoolSettingsPage.fields.assignedTeacher') }}</span>
            <Select
              :model-value="item.assignedTeacher"
              :options="teacherOptions"
              option-label="label"
              option-value="value"
              class="w-full"
              :placeholder="t('preschoolSettingsPage.placeholders.assignedTeacher')"
              @update:model-value="emit('update:item', { index, field: 'assignedTeacher', value: $event })"
            />
          </label>

          <label class="preschool-settings-field">
            <span>{{ t('preschoolSettingsPage.fields.room') }}</span>
            <input
              :value="item.room"
              type="text"
              class="preschool-settings-input"
              :placeholder="t('preschoolSettingsPage.placeholders.room')"
              @input="emit('update:item', { index, field: 'room', value: $event.target.value })"
            />
          </label>

          <label class="preschool-settings-field md:col-span-2">
            <span>{{ t('preschoolSettingsPage.fields.status') }}</span>
            <Select
              :model-value="item.status"
              :options="statusOptions"
              option-label="label"
              option-value="value"
              class="w-full"
              :placeholder="t('preschoolSettingsPage.placeholders.status')"
              @update:model-value="emit('update:item', { index, field: 'status', value: $event })"
            />
            <small v-if="errors?.[index]?.status" class="text-xs font-medium text-rose-600">{{ t(`preschoolSettingsPage.validation.${errors[index].status}`) }}</small>
          </label>
        </div>

        <div class="mt-4 flex justify-end">
          <Button variant="ghost" @click="emit('remove', index)">{{ t('preschoolSettingsPage.actions.remove') }}</Button>
        </div>
      </article>

      <div v-if="!items.length" class="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500 xl:col-span-2">
        {{ t('preschoolSettingsPage.emptyStates.classConfigurations') }}
      </div>
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
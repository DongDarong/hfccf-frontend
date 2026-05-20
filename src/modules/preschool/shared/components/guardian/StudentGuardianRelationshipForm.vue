<script setup>
// Keep relationship editing separate from guardian master data so the admin
// page can reuse the same guardian pool across siblings.
import Button from '@/components/buttons/Button.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'StudentGuardianRelationshipForm',
})

const { t } = useLanguage()

defineProps({
  form: {
    type: Object,
    required: true,
  },
  guardianOptions: {
    type: Array,
    default: () => [],
  },
  mode: {
    type: String,
    default: 'create',
  },
  saving: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['save', 'cancel'])
</script>

<template>
  <!-- The parent page owns the relationship draft object. The form mutates the
       shared draft on purpose so link/edit flows can stay compact and reusable. -->
  <!-- eslint-disable vue/no-mutating-props -->
  <div class="grid gap-3 md:grid-cols-2">
    <label class="guardian-form__field md:col-span-2">
      <span>{{ t('preschoolStudentGuardiansPage.fields.guardian') }}</span>
      <select v-model="form.guardian_id" class="guardian-form__input" :disabled="mode === 'edit'">
        <option value="">{{ t('preschoolStudentGuardiansPage.placeholders.guardian') }}</option>
        <option v-for="option in guardianOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <label class="guardian-form__field">
      <span>{{ t('preschoolStudentGuardiansPage.fields.relationshipType') }}</span>
      <select v-model="form.relationship_type" class="guardian-form__input">
        <option value="mother">{{ t('preschoolGuardianShared.relationshipTypes.mother') }}</option>
        <option value="father">{{ t('preschoolGuardianShared.relationshipTypes.father') }}</option>
        <option value="guardian">{{ t('preschoolGuardianShared.relationshipTypes.guardian') }}</option>
        <option value="grandparent">{{ t('preschoolGuardianShared.relationshipTypes.grandparent') }}</option>
        <option value="sibling">{{ t('preschoolGuardianShared.relationshipTypes.sibling') }}</option>
        <option value="relative">{{ t('preschoolGuardianShared.relationshipTypes.relative') }}</option>
        <option value="other">{{ t('preschoolGuardianShared.relationshipTypes.other') }}</option>
      </select>
    </label>

    <label class="guardian-form__field">
      <span>{{ t('preschoolStudentGuardiansPage.fields.priority') }}</span>
      <input v-model="form.emergency_priority" type="number" min="1" class="guardian-form__input" :placeholder="t('preschoolStudentGuardiansPage.placeholders.priority')" />
    </label>

    <label class="guardian-form__field">
      <span>{{ t('preschoolStudentGuardiansPage.fields.status') }}</span>
      <select v-model="form.status" class="guardian-form__input">
        <option value="active">{{ t('preschoolGuardianShared.statusLabels.active') }}</option>
        <option value="inactive">{{ t('preschoolGuardianShared.statusLabels.inactive') }}</option>
        <option value="archived">{{ t('preschoolGuardianShared.statusLabels.archived') }}</option>
      </select>
    </label>

    <label class="guardian-form__field">
      <span>{{ t('preschoolStudentGuardiansPage.fields.startsAt') }}</span>
      <input v-model="form.starts_at" type="date" class="guardian-form__input" />
    </label>

    <label class="guardian-form__field">
      <span>{{ t('preschoolStudentGuardiansPage.fields.endsAt') }}</span>
      <input v-model="form.ends_at" type="date" class="guardian-form__input" />
    </label>

    <label class="guardian-form__field md:col-span-2">
      <span>{{ t('preschoolStudentGuardiansPage.fields.notes') }}</span>
      <textarea v-model="form.notes" rows="3" class="guardian-form__input" :placeholder="t('preschoolStudentGuardiansPage.placeholders.notes')" />
    </label>

    <div class="md:col-span-2 flex flex-wrap gap-3">
      <label class="inline-flex items-center gap-2 text-sm text-slate-700">
        <input v-model="form.is_primary" type="checkbox" />
        <span>{{ t('preschoolGuardianShared.primaryGuardian.primary') }}</span>
      </label>
      <label class="inline-flex items-center gap-2 text-sm text-slate-700">
        <input v-model="form.can_pickup" type="checkbox" />
        <span>{{ t('preschoolGuardianShared.pickupPermission.allowed') }}</span>
      </label>
    </div>
  </div>

  <div class="mt-4 flex justify-end gap-2">
    <Button type="button" variant="outline" rounded="xl" @click="emit('cancel')">
      {{ t('common.cancel') }}
    </Button>
    <Button type="button" variant="primary" rounded="xl" :loading="saving" :disabled="saving" @click="emit('save')">
      {{ mode === 'edit' ? t('preschoolStudentGuardiansPage.actions.update') : t('preschoolStudentGuardiansPage.actions.link') }}
    </Button>
  </div>
</template>

<style scoped>
.guardian-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.guardian-form__field > span {
  font-size: 0.85rem;
  font-weight: 700;
  color: #334155;
}

.guardian-form__input {
  width: 100%;
  min-height: 2.75rem;
  border-radius: 0.85rem;
  border: 1px solid #d5dde8;
  background: #fff;
  padding: 0.7rem 0.85rem;
  color: #0f172a;
}
</style>

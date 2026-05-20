<script setup>
// Keep guardian edit fields in a small form component so the page can own the
// modal state while the component remains reusable for create/update actions.
import Button from '@/components/buttons/Button.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'GuardianForm',
})

const { t } = useLanguage()

defineProps({
  form: {
    type: Object,
    required: true,
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
  <!-- The parent page owns this guardian draft object. The form intentionally
       mutates the shared draft so create/edit flows can submit one normalized payload. -->
  <!-- eslint-disable vue/no-mutating-props -->
  <div class="grid gap-3 md:grid-cols-2">
    <label class="guardian-form__field">
      <span>{{ t('preschoolGuardiansPage.fields.fullName') }}</span>
      <input v-model="form.full_name" type="text" class="guardian-form__input" :placeholder="t('preschoolGuardiansPage.placeholders.fullName')" />
    </label>

    <label class="guardian-form__field">
      <span>{{ t('preschoolGuardiansPage.fields.phone') }}</span>
      <input v-model="form.phone" type="text" class="guardian-form__input" :placeholder="t('preschoolGuardiansPage.placeholders.phone')" />
    </label>

    <label class="guardian-form__field">
      <span>{{ t('preschoolGuardiansPage.fields.secondaryPhone') }}</span>
      <input v-model="form.secondary_phone" type="text" class="guardian-form__input" :placeholder="t('preschoolGuardiansPage.placeholders.secondaryPhone')" />
    </label>

    <label class="guardian-form__field">
      <span>{{ t('preschoolGuardiansPage.fields.email') }}</span>
      <input v-model="form.email" type="email" class="guardian-form__input" :placeholder="t('preschoolGuardiansPage.placeholders.email')" />
    </label>

    <label class="guardian-form__field md:col-span-2">
      <span>{{ t('preschoolGuardiansPage.fields.address') }}</span>
      <input v-model="form.address" type="text" class="guardian-form__input" :placeholder="t('preschoolGuardiansPage.placeholders.address')" />
    </label>

    <label class="guardian-form__field">
      <span>{{ t('preschoolGuardiansPage.fields.occupation') }}</span>
      <input v-model="form.occupation" type="text" class="guardian-form__input" :placeholder="t('preschoolGuardiansPage.placeholders.occupation')" />
    </label>

    <label class="guardian-form__field">
      <span>{{ t('preschoolGuardiansPage.fields.nationalId') }}</span>
      <input v-model="form.national_id" type="text" class="guardian-form__input" :placeholder="t('preschoolGuardiansPage.placeholders.nationalId')" />
    </label>

    <label class="guardian-form__field">
      <span>{{ t('preschoolGuardiansPage.fields.status') }}</span>
      <select v-model="form.status" class="guardian-form__input">
        <option value="active">{{ t('preschoolGuardianShared.statusLabels.active') }}</option>
        <option value="inactive">{{ t('preschoolGuardianShared.statusLabels.inactive') }}</option>
        <option value="archived">{{ t('preschoolGuardianShared.statusLabels.archived') }}</option>
      </select>
    </label>

    <label class="guardian-form__field md:col-span-2">
      <span>{{ t('preschoolGuardiansPage.fields.notes') }}</span>
      <textarea v-model="form.notes" rows="4" class="guardian-form__input" :placeholder="t('preschoolGuardiansPage.placeholders.notes')" />
    </label>
  </div>

  <div class="mt-4 flex justify-end gap-2">
    <Button type="button" variant="outline" rounded="xl" @click="emit('cancel')">
      {{ t('common.cancel') }}
    </Button>
    <Button type="button" variant="primary" rounded="xl" :loading="saving" :disabled="saving" @click="emit('save')">
      {{ mode === 'edit' ? t('preschoolGuardiansPage.actions.update') : t('preschoolGuardiansPage.actions.save') }}
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

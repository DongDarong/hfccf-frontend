<script setup>
// Keep the invitation form compact so portal access can be issued without
// coupling the admin UI to the underlying guardian activation token flow.
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      guardianId: '',
      email: '',
    }),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])
const { t } = useI18n()

function updateField(key, value) {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value,
  })
}
</script>

<template>
  <Card class="border-slate-200 shadow-sm">
    <template #content>
      <form class="grid gap-4" @submit.prevent="$emit('submit')">
        <div class="grid gap-2">
          <label class="text-sm font-bold text-slate-700">{{ t('guardianPortal.admin.guardianIdLabel') }}</label>
          <InputText
            :model-value="modelValue.guardianId"
            class="w-full"
            :placeholder="t('guardianPortal.admin.guardianIdPlaceholder')"
            @update:model-value="updateField('guardianId', $event)"
          />
        </div>

        <div class="grid gap-2">
          <label class="text-sm font-bold text-slate-700">{{ t('guardianPortal.admin.emailLabel') }}</label>
          <InputText
            :model-value="modelValue.email"
            class="w-full"
            :placeholder="t('guardianPortal.admin.emailPlaceholder')"
            @update:model-value="updateField('email', $event)"
          />
        </div>

        <Message v-if="errorMessage" severity="error" :closable="false">
          {{ errorMessage }}
        </Message>

        <Button type="submit" :loading="loading" :label="t('guardianPortal.admin.inviteAction')" />
      </form>
    </template>
  </Card>
</template>

<template>
  <Dialog
    :visible="visible"
    :header="title"
    :modal="true"
    :closable="!actionLoading"
    :style="{ width: '42rem', maxWidth: '95vw' }"
    @update:visible="$emit('update:visible', $event)"
  >
    <GuardianManualActionWarning />

    <p class="text-sm text-surface-600 dark:text-surface-300 mb-4">{{ description }}</p>

    <slot name="body" />

    <GuardianRemediationNoteField v-model="notes" class="mt-4" />

    <template #footer>
      <Button
        :label="t('preschoolGuardianRemediation.actions.cancel')"
        severity="secondary"
        text
        :disabled="actionLoading"
        @click="$emit('cancel')"
      />
      <Button
        :label="t('preschoolGuardianRemediation.actions.confirm')"
        severity="danger"
        :loading="actionLoading"
        @click="$emit('confirm', notes)"
      />
    </template>
  </Dialog>
</template>

<script setup>
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import GuardianManualActionWarning from './GuardianManualActionWarning.vue'
import GuardianRemediationNoteField from './GuardianRemediationNoteField.vue'

defineProps({
  visible: { type: Boolean, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  actionLoading: { type: Boolean, default: false },
})

defineEmits(['update:visible', 'confirm', 'cancel'])

const { t } = useLanguage()
const notes = ref('')
</script>

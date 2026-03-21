<script setup>
import { computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from '@/components/Button.vue'
import { useLanguage } from '@/composables/useLanguage'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
  confirmText: {
    type: String,
    default: '',
  },
  cancelText: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'danger',
  },
})

defineEmits(['confirm', 'cancel'])
const { t } = useLanguage()

const resolvedTitle = computed(() => props.title || t('common.areYouSure'))
const resolvedMessage = computed(() => props.message || t('common.actionCannotBeUndone'))
const resolvedConfirmText = computed(() => props.confirmText || t('common.confirm'))
const resolvedCancelText = computed(() => props.cancelText || t('common.cancel'))
</script>

<template>
  <Dialog
    :visible="show"
    modal
    :closable="false"
    :draggable="false"
    :dismissable-mask="true"
    class="ui-dialog ui-dialog--question"
    @update:visible="$emit('cancel')"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <span
          class="flex h-11 w-11 items-center justify-center rounded-xl"
          :class="{
            'bg-red-50 text-red-600': type === 'danger',
            'bg-amber-50 text-amber-600': type === 'warning',
            'bg-blue-50 text-blue-600': type === 'info',
          }"
        >
          <i class="pi pi-exclamation-triangle text-lg" />
        </span>
        <div>
          <h3 class="text-lg font-bold text-slate-900">{{ resolvedTitle }}</h3>
          <p class="text-sm text-slate-500">{{ resolvedMessage }}</p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" @click="$emit('cancel')">
          {{ resolvedCancelText }}
        </Button>
        <Button type="button" :variant="type === 'danger' ? 'danger' : 'primary'" @click="$emit('confirm')">
          {{ resolvedConfirmText }}
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
:deep(.ui-dialog--question.p-dialog) {
  border-radius: 1.25rem;
  overflow: hidden;
}
</style>

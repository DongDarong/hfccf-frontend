<script setup>
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import Button from '@/components/buttons/Button.vue'

defineOptions({
  name: 'UiForm',
})

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  submitText: {
    type: String,
    default: '',
  },
  cancelText: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showCancel: {
    type: Boolean,
    default: false,
  },
  submitVariant: {
    type: String,
    default: 'primary',
  },
  submitSize: {
    type: String,
    default: 'md',
  },
})

const emit = defineEmits(['submit', 'cancel'])
const { t } = useLanguage()

const resolvedSubmitText = computed(() => props.submitText || t('common.submit') || 'Submit')
const resolvedCancelText = computed(() => props.cancelText || t('common.cancel') || 'Cancel')
const isDisabled = computed(() => props.disabled || props.loading)

function onSubmit(event) {
  if (isDisabled.value) return
  emit('submit', event)
}

function onCancel() {
  if (isDisabled.value) return
  emit('cancel')
}
</script>

<template>
  <form
    class="relative w-full overflow-hidden rounded-[1.1rem] border border-surface-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.92)_100%)] shadow-[0_12px_30px_-20px_rgba(15,23,42,0.55),inset_0_1px_0_rgba(255,255,255,0.9)] before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-[linear-gradient(90deg,var(--hope-o-cyan-blue)_0%,var(--hope-h-lime-green)_55%,#93c5fd_100%)] before:content-['']"
    @submit.prevent="onSubmit"
  >
    <header
      v-if="title || description || $slots.header"
      class="border-b border-surface-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-4 pt-4 pb-[0.85rem] sm:px-[1.15rem] sm:pt-[1.05rem] sm:pb-[0.9rem]"
    >
      <slot name="header">
        <h3 v-if="title" class="m-0 text-base leading-tight font-extrabold text-surface-900">
          {{ title }}
        </h3>
        <p v-if="description" class="mt-[0.32rem] text-[0.86rem] leading-[1.35] text-surface-600">
          {{ description }}
        </p>
      </slot>
    </header>

    <div class="grid gap-[0.9rem] p-4 sm:px-[1.15rem] sm:py-[1.1rem]">
      <slot />
    </div>

    <footer
      v-if="$slots.actions || showCancel"
      class="mt-[0.1rem] flex flex-col-reverse gap-[0.6rem] border-t border-surface-200 bg-sky-50/30 px-4 pt-[0.9rem] pb-4 sm:flex-row sm:justify-end sm:px-[1.15rem] sm:pt-[0.95rem] sm:pb-[1.1rem]"
    >
      <slot name="actions" :loading="loading" :disabled="isDisabled">
        <Button
          v-if="showCancel"
          type="button"
          variant="outline"
          size="md"
          rounded="xl"
          :disabled="isDisabled"
          @click="onCancel"
        >
          {{ resolvedCancelText }}
        </Button>
        <Button
          type="submit"
          :variant="submitVariant"
          :size="submitSize"
          rounded="xl"
          :loading="loading"
          :disabled="isDisabled"
        >
          {{ resolvedSubmitText }}
        </Button>
      </slot>
    </footer>
  </form>
</template>

<style scoped>
:deep(footer button) {
  width: 100%;
}

.ui-form :deep(input),
.ui-form :deep(select),
.ui-form :deep(textarea),
form :deep(input),
form :deep(select),
form :deep(textarea) {
  border: 1px solid #d4dde8;
  border-radius: 0.75rem;
  background: #fcfdff;
  color: #0f172a;
  transition: all 0.18s ease;
}

form :deep(input:hover),
form :deep(select:hover),
form :deep(textarea:hover) {
  border-color: #bfcddd;
}

form :deep(input:focus),
form :deep(select:focus),
form :deep(textarea:focus) {
  border-color: var(--hope-o-cyan-blue);
  box-shadow: 0 0 0 3px rgba(0, 174, 239, 0.15);
  background: #ffffff;
}

form :deep(input::placeholder),
form :deep(textarea::placeholder) {
  color: #94a3b8;
}

form :deep(input:disabled),
form :deep(select:disabled),
form :deep(textarea:disabled) {
  background: #f3f6f9;
  color: #94a3b8;
  cursor: not-allowed;
}

@media (min-width: 640px) {
  :deep(footer button) {
    width: auto;
  }
}
</style>

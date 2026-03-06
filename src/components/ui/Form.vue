<script setup>
import { computed } from 'vue'
import { useLanguage } from '../../composables/useLanguage'
import Button from './Button.vue'

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
    class="ui-form"
    @submit.prevent="onSubmit"
  >
    <header v-if="title || description || $slots.header" class="ui-form__header">
      <slot name="header">
        <h3 v-if="title" class="ui-form__title">{{ title }}</h3>
        <p v-if="description" class="ui-form__description">{{ description }}</p>
      </slot>
    </header>

    <div class="ui-form__body">
      <slot />
    </div>

    <footer
      v-if="$slots.actions || showCancel"
      class="ui-form__actions"
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
.ui-form {
  width: 100%;
  border: 1px solid #dbe4ee;
  border-radius: 1rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.92) 100%);
  box-shadow:
    0 12px 30px -20px rgba(15, 23, 42, 0.55),
    0 1px 0 rgba(255, 255, 255, 0.9) inset;
  overflow: hidden;
}

.ui-form__header {
  padding: 1rem 1rem 0.85rem;
  border-bottom: 1px solid #e6edf5;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.ui-form__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
}

.ui-form__description {
  margin: 0.32rem 0 0;
  font-size: 0.86rem;
  color: #475569;
  line-height: 1.35;
}

.ui-form__body {
  padding: 1rem;
  display: grid;
  gap: 0.9rem;
}

.ui-form__actions {
  margin-top: 0.1rem;
  padding: 0.9rem 1rem 1rem;
  border-top: 1px solid #e6edf5;
  background: #fbfdff;
  display: flex;
  flex-direction: column-reverse;
  gap: 0.6rem;
}

@media (min-width: 640px) {
  .ui-form__header {
    padding: 1.05rem 1.15rem 0.9rem;
  }

  .ui-form__body {
    padding: 1.1rem 1.15rem;
  }

  .ui-form__actions {
    padding: 0.95rem 1.15rem 1.1rem;
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>

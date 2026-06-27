<script setup>
import { computed } from 'vue'
import Button from '@/components/buttons/Button.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'AddClassFormActions',
})

defineProps({
  isSubmitting: {
    type: Boolean,
    default: false,
  },
  isViewMode: {
    type: Boolean,
    default: false,
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['back', 'edit'])

const { t, language } = useLanguage()
const isKh = computed(() => language.value === 'KH')
</script>

<template>
  <div :class="isKh ? 'add-class-form-actions add-class-form-actions--kh' : 'add-class-form-actions'">
    <Button
      v-if="isViewMode"
      type="button"
      variant="outline"
      size="md"
      rounded="xl"
      class="add-class-form-actions__action"
      @click="$emit('back')"
    >
      {{ t('preschoolAddClass.backToClasses') }}
    </Button>
    <Button
      v-if="isViewMode"
      type="button"
      variant="primary"
      size="md"
      rounded="xl"
      class="add-class-form-actions__action"
      @click="$emit('edit')"
    >
      {{ t('preschoolAddClass.editAction') }}
    </Button>
    <Button
      v-else
      type="button"
      variant="outline"
      size="md"
      rounded="xl"
      class="add-class-form-actions__action"
      @click="$emit('back')"
    >
      {{ t('preschoolAddClass.backToClasses') }}
    </Button>
    <Button
      v-if="isEditMode"
      type="submit"
      variant="primary"
      size="md"
      rounded="xl"
      class="add-class-form-actions__action"
      :disabled="isSubmitting"
    >
      {{ isSubmitting ? t('preschoolAddClass.saving') : t('preschoolAddClass.updateAction') }}
    </Button>
  </div>
</template>

<style scoped>
.add-class-form-actions {
  display: flex;
  flex-direction: column-reverse;
  gap: 0.6rem;
  width: 100%;
}

.add-class-form-actions--kh .add-class-form-actions__action {
  font-family:
    'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
}

@media (min-width: 640px) {
  .add-class-form-actions {
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>

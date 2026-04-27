<script setup>
import Button from '@/components/buttons/Button.vue'

defineOptions({
  name: 'AddTeacherFormActions',
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
</script>

<template>
  <div class="add-teacher-form-actions">
    <Button
      type="button"
      variant="outline"
      size="md"
      rounded="xl"
      :disabled="isSubmitting"
      @click="$emit('back')"
    >
      {{ isViewMode ? 'Back to Teachers' : 'Cancel' }}
    </Button>

    <Button
      v-if="isViewMode"
      type="button"
      variant="primary"
      size="md"
      rounded="xl"
      @click="$emit('edit')"
    >
      Edit Teacher
    </Button>

    <Button
      v-else
      type="submit"
      variant="primary"
      size="md"
      rounded="xl"
      :loading="isSubmitting"
      :disabled="isSubmitting"
    >
      {{ isEditMode ? 'Update Teacher' : 'Add Teacher' }}
    </Button>
  </div>
</template>

<style scoped>
.add-teacher-form-actions {
  display: contents;
}
</style>

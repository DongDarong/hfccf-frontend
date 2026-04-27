<script setup>
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
</script>

<template>
  <div class="add-class-form-actions">
    <button
      v-if="isViewMode"
      type="button"
      class="add-class-form-actions__action add-class-form-actions__action--secondary"
      @click="$emit('back')"
    >
      Back to Classes
    </button>
    <button
      v-if="isViewMode"
      type="button"
      class="add-class-form-actions__action add-class-form-actions__action--primary"
      @click="$emit('edit')"
    >
      Edit Class
    </button>
    <button
      v-else
      type="button"
      class="add-class-form-actions__action add-class-form-actions__action--secondary"
      @click="$emit('back')"
    >
      Back to Classes
    </button>
    <button
      v-if="isEditMode"
      type="submit"
      class="add-class-form-actions__action add-class-form-actions__action--primary"
      :disabled="isSubmitting"
    >
      {{ isSubmitting ? 'Saving...' : 'Update Class' }}
    </button>
  </div>
</template>

<style scoped>
.add-class-form-actions {
  display: flex;
  flex-direction: column-reverse;
  gap: 0.6rem;
  width: 100%;
}

.add-class-form-actions__action {
  min-height: 2.8rem;
  width: 100%;
  border-radius: 0.9rem;
  border: 1px solid transparent;
  font-size: 0.95rem;
  font-weight: 800;
  transition: all 0.18s ease;
}

.add-class-form-actions__action--primary {
  background: #00aeef;
  border-color: #00aeef;
  color: #fff;
}

.add-class-form-actions__action--primary:hover:enabled {
  background: #0284c7;
  border-color: #0284c7;
}

.add-class-form-actions__action--secondary {
  background: #fff;
  border-color: #cbd5e1;
  color: #334155;
}

.add-class-form-actions__action--secondary:hover:enabled {
  background: #f8fafc;
  border-color: #94a3b8;
}

.add-class-form-actions__action:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

@media (min-width: 640px) {
  .add-class-form-actions {
    flex-direction: row;
    justify-content: flex-end;
  }

  .add-class-form-actions__action {
    width: auto;
    min-width: 10rem;
  }
}
</style>

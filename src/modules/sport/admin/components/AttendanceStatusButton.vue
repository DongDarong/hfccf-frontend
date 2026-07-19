<script setup>
import AppButton from '@/components/ui/AppButton.vue'

defineProps({
  value: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true,
  },
  activeClass: {
    type: String,
    required: true,
  },
  ringClass: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])
</script>

<template>
  <AppButton
    type="button"
    variant="outline"
    size="xs"
    class="att-status-btn"
    :class="isActive ? `${activeClass} ${ringClass}` : ''"
    :disabled="disabled"
    :aria-label="label"
    :aria-pressed="isActive ? 'true' : 'false'"
    :title="label"
    @click="emit('click')"
  >
    {{ short }}
  </AppButton>
</template>

<style scoped>
.att-status-btn {
  min-width: 2.5rem;
  height: 2.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  transition: all 150ms ease-in-out;
}

.att-status-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
}

.att-status-btn:focus-visible {
  outline: 2px solid #0f766e;
  outline-offset: 2px;
}
</style>

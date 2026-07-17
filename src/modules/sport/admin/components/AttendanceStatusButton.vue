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
  min-width: 2.15rem;
  font-size: 0.75rem;
  font-weight: 700;
}

</style>

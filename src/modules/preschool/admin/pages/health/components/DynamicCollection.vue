<script setup>
import { computed } from 'vue'
import Button from '@/components/buttons/Button.vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  emptyMessage: {
    type: String,
    default: 'No records added.',
  },
  addButtonLabel: {
    type: String,
    default: 'Add',
  },
})

const emit = defineEmits(['add', 'remove', 'update'])

const hasItems = computed(() => props.items && props.items.length > 0)

function handleAdd() {
  emit('add')
}

function handleRemove(index) {
  emit('remove', index)
}

function handleItemChange(index, key, value) {
  emit('update', { index, key, value })
}
</script>

<template>
  <div class="dynamic-collection">
    <div v-if="!hasItems" class="dynamic-collection__empty">
      {{ emptyMessage }}
    </div>

    <div v-else class="dynamic-collection__items">
      <slot name="item" v-for="(item, index) in items" :key="index" :item="item" :index="index" :onRemove="() => handleRemove(index)" :onChange="(key, value) => handleItemChange(index, key, value)" />
    </div>

    <div class="dynamic-collection__actions">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        rounded="lg"
        :label="`+ ${addButtonLabel}`"
        @click="handleAdd"
      />
    </div>
  </div>
</template>

<style scoped>
.dynamic-collection {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dynamic-collection__empty {
  padding: 1rem;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 0.75rem;
  color: #64748b;
  font-size: 0.9rem;
  text-align: center;
}

.dynamic-collection__items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.dynamic-collection__actions {
  display: flex;
  gap: 0.5rem;
}
</style>

<script setup>
import Table from '@/components/data-display/Table.vue'

defineOptions({
  name: 'PaymentTable',
})

defineProps({
  payments: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    default: () => [],
  },
  emptyText: {
    type: String,
    default: '',
  },
})

defineEmits(['view', 'edit', 'delete'])
</script>

<template>
  <Table
    :rows="payments"
    :columns="columns"
    :empty-text="emptyText"
    action-style="buttons"
    @view="$emit('view', $event)"
    @edit="$emit('edit', $event)"
    @delete="$emit('delete', $event)"
  />
</template>

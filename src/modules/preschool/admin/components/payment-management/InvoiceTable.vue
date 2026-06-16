<script setup>
import Table from '@/components/data-display/Table.vue'

defineOptions({
  name: 'InvoiceTable',
})

defineProps({
  invoices: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
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

defineEmits(['view', 'edit'])
</script>

<template>
  <Table
    :rows="invoices"
    :columns="columns"
    :loading="loading"
    :empty-text="emptyText"
    @view="$emit('view', $event)"
    @edit="$emit('edit', $event)"
  />
</template>

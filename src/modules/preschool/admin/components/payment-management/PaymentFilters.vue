<script setup>
import SearchFilterBar from '@/components/forms/SearchFilterBar.vue'

defineOptions({
  name: 'PaymentFilters',
})

defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
  classFilter: {
    type: String,
    default: '',
  },
  statusFilter: {
    type: String,
    default: '',
  },
  classOptions: {
    type: Array,
    default: () => [],
  },
  statusOptions: {
    type: Array,
    default: () => [],
  },
  searchPlaceholder: {
    type: String,
    default: '',
  },
})

defineEmits(['update:searchQuery', 'update:classFilter', 'update:statusFilter'])
</script>

<template>
  <SearchFilterBar
    :search-query="searchQuery"
    :role-filter="classFilter"
    :status-filter="statusFilter"
    :role-options="classOptions"
    :status-options="statusOptions"
    :search-placeholder="searchPlaceholder"
    @update:search-query="$emit('update:searchQuery', $event)"
    @update:role-filter="$emit('update:classFilter', $event)"
    @update:status-filter="$emit('update:statusFilter', $event)"
  />
</template>

<script setup>
import SearchInputField from './SearchInputField.vue'
import FilterSelectGroup from './FilterSelectGroup.vue'

const props = defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
  roleFilter: {
    type: String,
    default: '',
  },
  statusFilter: {
    type: String,
    default: '',
  },
  roleOptions: {
    type: Array,
    default: () => ['Admin', 'Coach', 'Player'],
  },
  statusOptions: {
    type: Array,
    default: () => ['Active', 'Pending', 'Inactive', 'Suspended'],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:searchQuery', 'update:roleFilter', 'update:statusFilter', 'clear'])

function clearFilters() {
  emit('update:searchQuery', '')
  emit('clear')
}
</script>

<template>
  <div class="p-3 sm:p-4 md:p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-stretch sm:items-center bg-gray-50 rounded-xl">
    <SearchInputField
      :model-value="props.searchQuery"
      :disabled="props.disabled"
      :placeholder="''"
      @update:model-value="emit('update:searchQuery', $event)"
    />

    <FilterSelectGroup
      :role-filter="props.roleFilter"
      :status-filter="props.statusFilter"
      :role-options="props.roleOptions"
      :status-options="props.statusOptions"
      :disabled="props.disabled"
      @update:role-filter="emit('update:roleFilter', $event)"
      @update:status-filter="emit('update:statusFilter', $event)"
      @clear="clearFilters"
    />
  </div>
</template>

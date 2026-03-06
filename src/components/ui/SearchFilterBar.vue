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
  // Reset search here; role/status resets are handled inside FilterSelectGroup.
  emit('update:searchQuery', '')
  emit('clear')
}
</script>

<template>
  <div class="w-full rounded-2xl border border-slate-200 bg-white shadow-sm p-4 md:p-5">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div class="flex-1 min-w-0">
        <SearchInputField
          :model-value="props.searchQuery"
          :disabled="props.disabled"
          :placeholder="''"
          input-class="bg-slate-50"
          @update:model-value="emit('update:searchQuery', $event)"
        />
      </div>

      <div class="flex flex-col gap-3 pt-2 lg:flex-row lg:items-center lg:pt-0">
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
    </div>
  </div>
</template>

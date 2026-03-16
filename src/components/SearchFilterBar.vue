<script setup>
import { computed } from 'vue'
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
  searchPlaceholder: {
    type: String,
    default: '',
  },
  showRoleFilter: {
    type: Boolean,
    default: true,
  },
  showStatusFilter: {
    type: Boolean,
    default: true,
  },
  showClearButton: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits([
  'update:searchQuery',
  'update:roleFilter',
  'update:statusFilter',
  'clear',
])

const hasFilterControls = computed(
  () => props.showRoleFilter || props.showStatusFilter || props.showClearButton,
)

function clearFilters() {
  emit('update:searchQuery', '')
  emit('clear')
}
</script>

<template>
  <div
    class="w-full rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm shadow-slate-200/60 md:p-5"
  >
    <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div class="min-w-0 flex-1">
        <SearchInputField
          :model-value="props.searchQuery"
          :disabled="props.disabled"
          :placeholder="props.searchPlaceholder"
          input-class="search-filter-bar__search-input"
          @update:model-value="emit('update:searchQuery', $event)"
        />
      </div>

      <div v-if="hasFilterControls" class="flex w-full xl:w-auto xl:justify-end">
        <FilterSelectGroup
          :role-filter="props.roleFilter"
          :status-filter="props.statusFilter"
          :role-options="props.roleOptions"
          :status-options="props.statusOptions"
          :disabled="props.disabled"
          :show-role-filter="props.showRoleFilter"
          :show-status-filter="props.showStatusFilter"
          :show-clear-button="props.showClearButton"
          @update:role-filter="emit('update:roleFilter', $event)"
          @update:status-filter="emit('update:statusFilter', $event)"
          @clear="clearFilters"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.search-filter-bar__search-input) {
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-color: #dbe1e8;
}
</style>



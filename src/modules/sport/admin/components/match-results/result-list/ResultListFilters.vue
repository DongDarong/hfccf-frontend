<script setup>
/**
 * ResultListFilters
 * Pure controlled inputs; parent owns filter state.
 */
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'

defineOptions({
  name: 'ResultListFilters',
})

defineProps({
  search: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: '',
  },
  searchPlaceholder: {
    type: String,
    required: true,
  },
  searchLabel: {
    type: String,
    required: true,
  },
  statusLabel: {
    type: String,
    required: true,
  },
  statusOptions: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:search', 'update:status'])
</script>

<template>
  <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_240px] md:items-center">
    <label class="sr-only" for="result-list-search">
      {{ searchLabel }}
    </label>

    <span class="p-input-icon-left w-full">
      <i class="pi pi-search text-slate-400" aria-hidden="true" />
      <InputText
        id="result-list-search"
        :model-value="search"
        class="w-full rounded-xl border-slate-300 bg-white py-3 pl-10 text-sm text-slate-800 shadow-sm transition-colors placeholder:text-slate-400 focus:border-brand-400"
        :placeholder="searchPlaceholder"
        @update:model-value="emit('update:search', $event)"
      />
    </span>

    <div class="w-full">
      <label class="sr-only" for="result-list-status">
        {{ statusLabel }}
      </label>

      <Select
        id="result-list-status"
        :model-value="status"
        :options="statusOptions"
        option-label="label"
        option-value="value"
        class="w-full rounded-xl border-slate-300 bg-white text-sm text-slate-800 shadow-sm transition-colors focus:border-brand-400"
        @update:model-value="emit('update:status', $event)"
      />
    </div>
  </div>
</template>

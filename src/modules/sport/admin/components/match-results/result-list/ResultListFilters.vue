<script setup>
/**
 * ResultListFilters
 * Controlled filters: the parent owns all state and clears through emits.
 */
import { computed, ref } from 'vue'
import AutoComplete from 'primevue/autocomplete'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Button from '@/components/buttons/Button.vue'

defineOptions({
  name: 'ResultListFilters',
})

const props = defineProps({
  searchTeamName: {
    type: String,
    default: '',
  },
  matchDate: {
    type: String,
    default: '',
  },
  matchType: {
    type: String,
    default: '',
  },
  searchTeamNameLabel: {
    type: String,
    required: true,
  },
  searchTeamNamePlaceholder: {
    type: String,
    required: true,
  },
  searchTeamSuggestions: {
    type: Array,
    default: () => [],
  },
  matchDateLabel: {
    type: String,
    required: true,
  },
  matchDatePlaceholder: {
    type: String,
    required: true,
  },
  matchTypeLabel: {
    type: String,
    required: true,
  },
  matchTypePlaceholder: {
    type: String,
    required: true,
  },
  matchTypeOptions: {
    type: Array,
    required: true,
  },
  clearLabel: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:searchTeamName', 'update:matchDate', 'update:matchType', 'clear'])

const hasActiveFilters = computed(
  () => Boolean(props.searchTeamName.trim()) || Boolean(props.matchDate) || Boolean(props.matchType),
)

const searchSuggestions = ref([])

function normalize(value) {
  return String(value ?? '').trim().toLowerCase()
}

function completeSearchTeamName(event) {
  const query = normalize(event?.query)
  const base = Array.isArray(props.searchTeamSuggestions) ? props.searchTeamSuggestions : []

  // Suggestions stay page-owned; the child only filters the provided source list.
  searchSuggestions.value = query
    ? base.filter((option) => normalize(option).includes(query))
    : base.slice(0, 10)
}

function onSearchUpdate(value) {
  emit('update:searchTeamName', String(value ?? ''))
}

function onClear() {
  // The filter state is owned by the parent, so the child only requests a reset.
  if (!hasActiveFilters.value) return
  emit('clear')
}
</script>

<template>
  <div class="grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_180px_220px_auto] lg:items-end">
    <div class="w-full">
      <label
        class="mb-1.5 block text-[0.72rem] font-extrabold tracking-[0.12em] uppercase text-slate-500"
        for="result-list-search-team"
      >
        {{ searchTeamNameLabel }}
      </label>

      <AutoComplete
        id="result-list-search-team"
        :model-value="searchTeamName"
        dropdown
        :suggestions="searchSuggestions"
        :placeholder="searchTeamNamePlaceholder"
        class="w-full"
        input-class="w-full rounded-xl border-slate-300 bg-white py-3 pl-10 text-sm text-slate-800 shadow-sm transition-colors placeholder:text-slate-400 focus:border-brand-400"
        @complete="completeSearchTeamName"
        @update:model-value="onSearchUpdate"
      >
        <template #dropdownicon>
          <i class="pi pi-search text-slate-400" aria-hidden="true" />
        </template>
      </AutoComplete>
    </div>

    <div class="w-full">
      <label
        class="mb-1.5 block text-[0.72rem] font-extrabold tracking-[0.12em] uppercase text-slate-500"
        for="result-list-match-date"
      >
        {{ matchDateLabel }}
      </label>

      <InputText
        id="result-list-match-date"
        :model-value="matchDate"
        type="date"
        class="w-full rounded-xl border-slate-300 bg-white py-3 text-sm text-slate-800 shadow-sm transition-colors placeholder:text-slate-400 focus:border-brand-400"
        :placeholder="matchDatePlaceholder"
        @update:model-value="emit('update:matchDate', $event)"
      />
    </div>

    <div class="w-full">
      <label
        class="mb-1.5 block text-[0.72rem] font-extrabold tracking-[0.12em] uppercase text-slate-500"
        for="result-list-match-type"
      >
        {{ matchTypeLabel }}
      </label>

      <Select
        id="result-list-match-type"
        :model-value="matchType"
        :options="matchTypeOptions"
        option-label="label"
        option-value="value"
        class="w-full rounded-xl border-slate-300 bg-white text-sm text-slate-800 shadow-sm transition-colors focus:border-brand-400"
        :placeholder="matchTypePlaceholder"
        @update:model-value="emit('update:matchType', $event)"
      />
    </div>

    <div class="flex lg:justify-end">
      <Button
        type="button"
        variant="outline"
        rounded="xl"
        size="sm"
        class="w-full lg:w-auto"
        :disabled="!hasActiveFilters"
        @click="onClear"
      >
        <template #iconLeft>
          <i class="pi pi-filter-slash" aria-hidden="true" />
        </template>
        {{ clearLabel }}
      </Button>
    </div>
  </div>
</template>

<script setup>
/**
 * ResultListFilters
 * Controlled filters: the parent owns all state and clears through emits.
 */
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Button from '@/components/buttons/Button.vue'

defineOptions({
  name: 'ResultListFilters',
})

defineProps({
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

function onClear() {
  // The filter state is owned by the parent, so the child only requests a reset.
  emit('clear')
}
</script>

<template>
  <div class="grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_180px_220px_auto] lg:items-end">
    <div class="w-full">
      <label class="mb-1.5 block text-[0.72rem] font-extrabold tracking-[0.12em] uppercase text-slate-500" for="result-list-search-team">
        {{ searchTeamNameLabel }}
      </label>

      <span class="p-input-icon-left block w-full">
        <i class="pi pi-search text-slate-400" aria-hidden="true" />
        <InputText
          id="result-list-search-team"
          :model-value="searchTeamName"
          class="w-full rounded-xl border-slate-300 bg-white py-3 pl-10 text-sm text-slate-800 shadow-sm transition-colors placeholder:text-slate-400 focus:border-brand-400"
          :placeholder="searchTeamNamePlaceholder"
          @update:model-value="emit('update:searchTeamName', $event)"
        />
      </span>
    </div>

    <div class="w-full">
      <label class="mb-1.5 block text-[0.72rem] font-extrabold tracking-[0.12em] uppercase text-slate-500" for="result-list-match-date">
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
      <label class="mb-1.5 block text-[0.72rem] font-extrabold tracking-[0.12em] uppercase text-slate-500" for="result-list-match-type">
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
      <Button type="button" variant="outline" rounded="xl" size="sm" class="w-full lg:w-auto" @click="onClear">
        {{ clearLabel }}
      </Button>
    </div>
  </div>
</template>

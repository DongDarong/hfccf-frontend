<script setup>
/**
 * ResultListCard
 * Composes header + filters + table. Parent owns filtering logic and passes `matches`.
 */
import { computed } from 'vue'
import ResultListFilters from '@/modules/sport/admin/components/match-results/result-list/ResultListFilters.vue'
import ResultListHeader from '@/modules/sport/admin/components/match-results/result-list/ResultListHeader.vue'
import ResultListTable from '@/modules/sport/admin/components/match-results/result-list/ResultListTable.vue'

defineOptions({
  name: 'ResultListCard',
})

const props = defineProps({
  matches: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  filters: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  exportLabel: {
    type: String,
    required: true,
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
  emptyText: {
    type: String,
    required: true,
  },
  tableLabels: {
    type: Object,
    required: true,
  },
  actionLabel: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:filters', 'update-match'])

const normalizedFilters = computed(() => ({
  searchTeamName: String(props.filters?.searchTeamName || ''),
  matchDate: String(props.filters?.matchDate || ''),
  matchType: String(props.filters?.matchType || ''),
}))

function updateFilters(patch) {
  // Important: we always emit a new object to keep v-model patterns predictable.
  emit('update:filters', { ...props.filters, ...patch })
}

function clearFilters() {
  updateFilters({ searchTeamName: '', matchDate: '', matchType: '' })
}
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_25px_55px_-48px_rgba(29,29,27,0.38)]">
    <ResultListHeader :title="title" :export-label="exportLabel" />

    <div class="mt-4">
      <ResultListFilters
        :search-team-name="normalizedFilters.searchTeamName"
        :match-date="normalizedFilters.matchDate"
        :match-type="normalizedFilters.matchType"
        :search-team-name-label="searchTeamNameLabel"
        :search-team-name-placeholder="searchTeamNamePlaceholder"
        :match-date-label="matchDateLabel"
        :match-date-placeholder="matchDatePlaceholder"
        :match-type-label="matchTypeLabel"
        :match-type-placeholder="matchTypePlaceholder"
        :match-type-options="matchTypeOptions"
        :clear-label="clearLabel"
        @update:search-team-name="updateFilters({ searchTeamName: $event })"
        @update:match-date="updateFilters({ matchDate: $event })"
        @update:match-type="updateFilters({ matchType: $event })"
        @clear="clearFilters"
      />
    </div>

    <div class="mt-4">
      <ResultListTable
        :matches="matches"
        :loading="loading"
        :empty-text="emptyText"
        :labels="tableLabels"
        :action-label="actionLabel"
        @update-match="$emit('update-match', $event)"
      />
    </div>
  </section>
</template>

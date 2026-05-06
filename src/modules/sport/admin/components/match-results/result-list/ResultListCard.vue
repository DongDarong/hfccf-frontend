<script setup>
/**
 * ResultListCard
 * Composes header + filters + table. Parent owns filtering logic and passes `matches`.
 */
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

function updateFilters(patch) {
  // Important: we always emit a new object to keep v-model patterns predictable.
  emit('update:filters', { ...props.filters, ...patch })
}
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_25px_55px_-48px_rgba(29,29,27,0.38)]">
    <ResultListHeader :title="title" :export-label="exportLabel" />

    <div class="mt-4">
      <ResultListFilters
        :search="filters.search"
        :status="filters.status"
        :search-placeholder="searchPlaceholder"
        :search-label="searchLabel"
        :status-label="statusLabel"
        :status-options="statusOptions"
        @update:search="updateFilters({ search: $event })"
        @update:status="updateFilters({ status: $event })"
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

<script setup>
/**
 * ResultListTable
 * Presentation-only list: parent handles filtering/pagination and passes `matches`.
 */
import ProgressSpinner from 'primevue/progressspinner'
import ResultListRow from '@/modules/sport/admin/components/match-results/result-list/ResultListRow.vue'

defineOptions({
  name: 'ResultListTable',
})

defineProps({
  matches: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  emptyText: {
    type: String,
    required: true,
  },
  labels: {
    type: Object,
    required: true,
  },
  actionLabel: {
    type: String,
    required: true,
  },
})

defineEmits(['update-match'])
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_45px_-40px_rgba(29,29,27,0.38)]">
    <div
      class="hidden grid-cols-[minmax(220px,1.2fr)_140px_minmax(220px,1.2fr)_190px_140px_110px] gap-3 border-b border-slate-200 bg-slate-50/70 px-4 py-3 text-[0.72rem] font-extrabold tracking-[0.12em] uppercase text-slate-500 md:grid"
    >
      <div>{{ labels.match }}</div>
      <div class="text-center">{{ labels.score }}</div>
      <div>{{ labels.report }}</div>
      <div>{{ labels.schedule }}</div>
      <div>{{ labels.status }}</div>
      <div class="text-right">{{ labels.actions }}</div>
    </div>

    <div v-if="loading" class="flex items-center justify-center px-4 py-12">
      <ProgressSpinner style="width: 42px; height: 42px" strokeWidth="4" />
    </div>

    <div v-else-if="!matches.length" class="px-4 py-10 text-center text-sm text-slate-500">
      {{ emptyText }}
    </div>

    <div v-else>
      <ResultListRow
        v-for="match in matches"
        :key="match.id"
        :match="match"
        :labels="labels"
        :action-label="actionLabel"
        @update-match="$emit('update-match', $event)"
      />
    </div>
  </div>
</template>

<script setup>
/**
 * ResultListTable
 * Presentation-only list: parent handles filtering/pagination and passes `matches`.
 */
import { computed } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'
import ResultListRow from '@/modules/sport/admin/components/match-results/result-list/ResultListRow.vue'

defineOptions({
  name: 'ResultListTable',
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

const hasMatches = computed(() => props.matches.length > 0)
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
    <!-- Header -->
    <div
      class="hidden grid-cols-[minmax(240px,1.3fr)_100px_minmax(240px,1.1fr)_180px_130px_100px] items-center gap-3 border-b border-slate-100 bg-slate-50/80 px-4 py-3.5 text-[0.7rem] font-bold tracking-[0.1em] uppercase text-slate-500 md:grid"
    >
      <div>{{ labels.match }}</div>
      <div class="text-center">{{ labels.score }}</div>
      <div>{{ labels.report }}</div>
      <div>{{ labels.schedule }}</div>
      <div>{{ labels.status }}</div>
      <div class="text-right">{{ labels.actions }}</div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center space-y-4 px-4 py-16">
      <ProgressSpinner style="width: 38px; height: 38px" strokeWidth="4" />
      <p class="animate-pulse text-xs font-medium text-slate-400">Loading results...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasMatches" class="flex flex-col items-center justify-center px-4 py-14 text-center">
      <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-300">
        <i class="pi pi-inbox text-2xl"></i>
      </div>
      <p class="text-sm font-medium text-slate-500">
        {{ emptyText }}
      </p>
    </div>

    <!-- Content -->
    <div v-else class="divide-y divide-slate-100">
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


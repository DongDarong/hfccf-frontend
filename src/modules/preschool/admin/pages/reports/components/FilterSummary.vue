<script setup>
import { computed } from 'vue'

defineProps({
  academicYearLabel: {
    type: String,
    default: '',
  },
  classLabel: {
    type: String,
    default: '',
  },
  reportPeriod: {
    type: String,
    default: 'monthly',
  },
  monthLabel: {
    type: String,
    default: '',
  },
  year: {
    type: [Number, String],
    default: '',
  },
})

const emit = defineEmits(['clear-filters'])

const activeFiltersCount = computed(() => {
  let count = 0
  if (props.academicYearLabel) count++
  if (props.classLabel) count++
  if (props.monthLabel && props.reportPeriod === 'monthly') count++
  if (props.year) count++
  return count
})

const hasFilters = computed(() => activeFiltersCount.value > 0)
</script>

<template>
  <div v-if="hasFilters" class="rounded-xl border border-blue-200 bg-blue-50 p-4">
    <div class="flex items-center justify-between">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-xs font-semibold uppercase tracking-wide text-blue-700">
          {{ activeFiltersCount }} Active Filter{{ activeFiltersCount !== 1 ? 's' : '' }}
        </span>
        <div class="flex flex-wrap gap-2">
          <span v-if="academicYearLabel" class="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            📚 {{ academicYearLabel }}
          </span>
          <span v-if="classLabel" class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            🏫 {{ classLabel }}
          </span>
          <span v-if="reportPeriod === 'monthly' && monthLabel" class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
            📅 {{ monthLabel }}
          </span>
          <span v-if="year" class="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
            📆 {{ year }}
          </span>
        </div>
      </div>
      <button
        type="button"
        @click="emit('clear-filters')"
        class="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800"
      >
        <i class="pi pi-times text-xs" />
        Clear
      </button>
    </div>
  </div>
</template>

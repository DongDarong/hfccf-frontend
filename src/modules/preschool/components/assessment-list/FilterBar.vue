<script setup>
import { computed } from 'vue'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Button from '@/components/buttons/Button.vue'

defineOptions({
  name: 'AssessmentFilterBar',
})

const props = defineProps({
  studentFilter: {
    type: [String, Number],
    default: null,
  },
  classFilter: {
    type: [String, Number],
    default: null,
  },
  categoryFilter: {
    type: [String, Number],
    default: null,
  },
  periodFilter: {
    type: String,
    default: null,
  },
  statusFilter: {
    type: String,
    default: 'all',
  },
  searchFilter: {
    type: String,
    default: '',
  },
  studentOptions: {
    type: Array,
    required: true,
  },
  classOptions: {
    type: Array,
    required: true,
  },
  categoryOptions: {
    type: Array,
    required: true,
  },
  activeFilterCount: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits([
  'update:studentFilter',
  'update:classFilter',
  'update:categoryFilter',
  'update:periodFilter',
  'update:statusFilter',
  'update:searchFilter',
  'clear-all',
])

const statusOptions = [
  { label: 'All Statuses', value: 'all' },
  { label: '✏️ Draft', value: 'draft' },
  { label: '✅ Finalized', value: 'finalized' },
]

const periodOptions = [
  { label: 'All Periods', value: null },
  { label: 'Q1', value: 'Q1' },
  { label: 'Q2', value: 'Q2' },
  { label: 'Q3', value: 'Q3' },
  { label: 'Q4', value: 'Q4' },
  { label: 'Midterm', value: 'Midterm' },
  { label: 'Final', value: 'Final' },
]

const showAdvanced = ref(false)

// Compact view - show only main filters, advanced filters below
const mainFilters = computed(() => ['search', 'status'])
const advancedFilters = computed(() => ['student', 'class', 'category', 'period'])
</script>

<template>
  <div class="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-gray-900">🔍 Filters</h3>
      <div class="flex items-center gap-2">
        <span v-if="activeFilterCount > 0" class="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
          {{ activeFilterCount }}
          <span v-if="activeFilterCount === 1">filter</span>
          <span v-else>filters</span>
        </span>
        <button
          v-if="activeFilterCount > 0"
          type="button"
          class="text-xs text-gray-600 hover:text-gray-900"
          @click="emit('clear-all')"
        >
          Clear all
        </button>
      </div>
    </div>

    <!-- Main Filters Row -->
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Search Filter -->
      <div class="space-y-1">
        <label class="text-xs font-medium text-gray-700">Search</label>
        <InputText
          :model-value="searchFilter"
          placeholder="Student name, class..."
          class="w-full"
          @update:model-value="emit('update:searchFilter', $event)"
        />
      </div>

      <!-- Status Filter -->
      <div class="space-y-1">
        <label class="text-xs font-medium text-gray-700">Status</label>
        <Select
          :model-value="statusFilter"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          class="w-full"
          @update:model-value="emit('update:statusFilter', $event)"
        />
      </div>

      <!-- Toggle Advanced -->
      <div class="flex items-end">
        <button
          type="button"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
          @click="showAdvanced = !showAdvanced"
        >
          {{ showAdvanced ? '⬆️ Hide Filters' : '⬇️ More Filters' }}
        </button>
      </div>
    </div>

    <!-- Advanced Filters -->
    <div v-if="showAdvanced" class="border-t border-gray-200 pt-4">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Student Filter -->
        <div class="space-y-1">
          <label class="text-xs font-medium text-gray-700">Student</label>
          <Select
            :model-value="studentFilter"
            :options="studentOptions"
            option-label="label"
            option-value="value"
            placeholder="All students"
            show-clear
            filter
            class="w-full"
            @update:model-value="emit('update:studentFilter', $event)"
          />
        </div>

        <!-- Class Filter -->
        <div class="space-y-1">
          <label class="text-xs font-medium text-gray-700">Class</label>
          <Select
            :model-value="classFilter"
            :options="classOptions"
            option-label="label"
            option-value="value"
            placeholder="All classes"
            show-clear
            class="w-full"
            @update:model-value="emit('update:classFilter', $event)"
          />
        </div>

        <!-- Category Filter -->
        <div class="space-y-1">
          <label class="text-xs font-medium text-gray-700">Category</label>
          <Select
            :model-value="categoryFilter"
            :options="categoryOptions"
            option-label="label"
            option-value="value"
            placeholder="All categories"
            show-clear
            class="w-full"
            @update:model-value="emit('update:categoryFilter', $event)"
          />
        </div>

        <!-- Period Filter -->
        <div class="space-y-1">
          <label class="text-xs font-medium text-gray-700">Period</label>
          <Select
            :model-value="periodFilter"
            :options="periodOptions"
            option-label="label"
            option-value="value"
            placeholder="All periods"
            show-clear
            class="w-full"
            @update:model-value="emit('update:periodFilter', $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const showAdvanced = ref(false)
    return { showAdvanced }
  },
}
</script>

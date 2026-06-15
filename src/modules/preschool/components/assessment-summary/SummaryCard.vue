<script setup>
defineOptions({
  name: 'AssessmentSummaryCard',
})

defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  stats: {
    type: Array,
    required: true,
    // Expected format: [{ icon, label, value, unit, color }, ...]
  },
  progress: {
    type: Object,
    default: null,
    // Expected format: { current, total, label, color }
  },
  compact: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['stat-click'])

const gridClass = computed(() => {
  if (props.compact) return 'grid-cols-2 sm:grid-cols-4'
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
})
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white p-6">
    <!-- Header -->
    <div class="mb-6">
      <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
      <p v-if="subtitle" class="mt-1 text-sm text-gray-600">{{ subtitle }}</p>
    </div>

    <!-- Progress Bar -->
    <div v-if="progress" class="mb-6">
      <ProgressIndicator
        :current="progress.current"
        :total="progress.total"
        :label="progress.label"
        :color="progress.color"
      />
    </div>

    <!-- Stats Grid -->
    <div :class="['grid gap-4', gridClass]">
      <StatCard
        v-for="(stat, index) in stats"
        :key="index"
        :icon="stat.icon"
        :label="stat.label"
        :value="stat.value"
        :unit="stat.unit"
        :color="stat.color"
        :clickable="stat.clickable"
        @click="stat.clickable && emit('stat-click', stat)"
      />
    </div>
  </div>
</template>

<script>
import StatCard from './StatCard.vue'
import ProgressIndicator from './ProgressIndicator.vue'
import { computed } from 'vue'

export default {
  components: {
    StatCard,
    ProgressIndicator,
  },
}
</script>

<script setup>
defineOptions({
  name: 'DashboardInsightCard',
})

defineProps({
  card: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="preschool-dashboard-page__insight-card">
    <div class="preschool-dashboard-page__insight-topline">
      <p class="preschool-dashboard-page__insight-title">{{ card.title }}</p>
      <div v-if="card.sparkline.length > 0" class="preschool-dashboard-page__sparkline" aria-hidden="true">
        <span
          v-for="point in card.sparkline"
          :key="point.id"
          class="preschool-dashboard-page__sparkline-bar"
          :style="{ height: `${point.height}%` }"
        />
      </div>
      <p v-else class="preschool-dashboard-page__sparkline-fallback">{{ card.sparklineFallback }}</p>
    </div>
    <p class="preschool-dashboard-page__insight-value">{{ card.value }}</p>
    <p class="preschool-dashboard-page__insight-label">{{ card.label }}</p>
    <p class="preschool-dashboard-page__insight-note">{{ card.note }}</p>
    <ul class="preschool-dashboard-page__insight-list">
      <li v-for="metric in card.metrics" :key="metric.label">
        <span>{{ metric.label }}</span>
        <strong>{{ metric.value }}</strong>
      </li>
    </ul>
  </article>
</template>


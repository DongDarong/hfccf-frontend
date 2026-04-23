<script setup>
import CommandCenterSummaryCard from './CommandCenterSummaryCard.vue'

defineOptions({
  name: 'CommandCenterSummaryCards',
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
  cards: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="flex flex-col gap-3">
    <header class="flex flex-col gap-1">
      <h2 class="text-[0.94rem] font-bold uppercase tracking-[0.08em] text-surface-500">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="text-[0.92rem] leading-6 text-slate-600">
        {{ subtitle }}
      </p>
    </header>

    <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <CommandCenterSummaryCard
        v-for="card in cards"
        :key="card.id"
        :title="card.title"
        :value="card.value"
        :trend="card.trend"
        :status="card.status"
        :action-label="card.actionLabel"
      />
    </div>
  </section>
</template>

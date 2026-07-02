<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    default: () => [],
  },
  emptyText: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="mb-4">
      <h3 class="text-sm font-semibold text-slate-900">{{ title }}</h3>
      <p v-if="subtitle" class="text-sm text-slate-500">{{ subtitle }}</p>
    </div>

    <div v-if="!items.length" class="text-sm text-slate-500">
      {{ emptyText }}
    </div>

    <ul v-else class="space-y-2">
      <li v-for="item in items" :key="item.label || item.name || JSON.stringify(item)" class="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 text-sm">
        <div class="min-w-0">
          <p class="truncate font-medium text-slate-900">{{ item.label || item.name || item.title }}</p>
          <p v-if="item.caption" class="truncate text-xs text-slate-500">{{ item.caption }}</p>
        </div>
        <span class="shrink-0 font-semibold text-slate-700">{{ item.value ?? item.count ?? item.total ?? '—' }}</span>
      </li>
    </ul>
  </section>
</template>

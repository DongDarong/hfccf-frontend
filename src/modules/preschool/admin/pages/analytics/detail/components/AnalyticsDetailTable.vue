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
  columns: {
    type: Array,
    default: () => [],
  },
  rows: {
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

    <div v-if="!rows.length" class="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-sm text-slate-500">
      {{ emptyText }}
    </div>

    <div v-else class="overflow-hidden rounded-xl border border-slate-200">
      <table class="min-w-full divide-y divide-slate-200 text-sm">
        <thead class="bg-slate-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-3 text-left font-semibold text-slate-700"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 bg-white">
          <tr v-for="(row, rowIndex) in rows" :key="row.id || rowIndex">
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-3 text-slate-700"
            >
              {{ row[column.key] ?? '—' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

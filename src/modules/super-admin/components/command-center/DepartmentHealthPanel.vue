<script setup>
import Card from 'primevue/card'
import DepartmentHealthItem from './DepartmentHealthItem.vue'

defineOptions({
  name: 'DepartmentHealthPanel',
})

defineProps({
  title: {
    type: String,
    required: true,
  },
  departments: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <Card class="command-center-panel">
    <template #title>
      <h3 class="text-[1.02rem] font-extrabold text-slate-900">
        {{ title }}
      </h3>
    </template>

    <template #content>
      <div class="flex flex-col gap-3">
        <DepartmentHealthItem
          v-for="department in departments"
          :key="department.id"
          :department="department"
        />
      </div>
    </template>
  </Card>
</template>

<style scoped>
:deep(.command-center-panel.p-card) {
  border-radius: 1.1rem;
  border: 1px solid #e7eaf3;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 22px 50px -38px rgba(15, 23, 42, 0.46);
}
</style>

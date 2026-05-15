<script setup>
defineOptions({
  name: 'PreschoolDashboardActionList',
})

defineProps({
  title: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="preschool-dashboard-action-list">
    <h3 class="preschool-dashboard-action-list__title">{{ title }}</h3>
    <ul class="preschool-dashboard-action-list__list">
      <li
        v-for="item in items"
        :key="item"
        class="preschool-dashboard-action-list__item"
      >
        <span class="preschool-dashboard-action-list__bullet" aria-hidden="true"></span>
        <span>{{ item }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.preschool-dashboard-action-list {
  padding: 1.35rem;
  border-radius: 1.35rem;
  border: 1px solid #dbe6f2;
  background: #ffffff;
  box-shadow: 0 18px 45px -36px rgba(15, 23, 42, 0.45);
}

.preschool-dashboard-action-list__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
}

.preschool-dashboard-action-list__list {
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.preschool-dashboard-action-list__item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: #334155;
  line-height: 1.6;
}

.preschool-dashboard-action-list__bullet {
  width: 0.7rem;
  height: 0.7rem;
  margin-top: 0.35rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%);
  flex-shrink: 0;
}
</style>

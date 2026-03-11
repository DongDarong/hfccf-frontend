<script setup>
import { computed } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/layout/HeaderSection.vue'
import StatsCards from '@/components/common/StatsCards.vue'
import { getCurrentUser } from '@/services/auth'

defineOptions({
  name: 'RoleDashboardLayout',
})

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  cards: {
    type: Array,
    default: () => [],
  },
  spotlightTitle: {
    type: String,
    required: true,
  },
  spotlightText: {
    type: String,
    required: true,
  },
  actions: {
    type: Array,
    default: () => [],
  },
})

const currentUser = computed(() => getCurrentUser() || {})
const roleLabel = computed(() => String(currentUser.value?.role || 'unknown'))
const permissionPreview = computed(() =>
  Array.isArray(currentUser.value?.role_permission) && currentUser.value.role_permission.length
    ? currentUser.value.role_permission.join(', ')
    : 'No explicit permissions assigned.',
)
</script>

<template>
  <MainLayout>
    <section class="dashboard-page">
      <HeaderSection :title="props.title" :subtitle="props.subtitle" />

      <StatsCards :cards="props.cards" />

      <section class="dashboard-page__details">
        <article class="dashboard-page__panel">
          <h2 class="dashboard-page__panel-title">{{ props.spotlightTitle }}</h2>
          <p class="dashboard-page__panel-copy">{{ props.spotlightText }}</p>
        </article>

        <article class="dashboard-page__panel">
          <h2 class="dashboard-page__panel-title">Priority actions</h2>
          <ul class="dashboard-page__actions">
            <li v-for="action in props.actions" :key="action">{{ action }}</li>
          </ul>
        </article>
      </section>

      <section class="dashboard-page__identity">
        <p><strong>Role:</strong> {{ roleLabel }}</p>
        <p><strong>Permissions:</strong> {{ permissionPreview }}</p>
      </section>
    </section>
  </MainLayout>
</template>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dashboard-page__details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 0.9rem;
}

.dashboard-page__panel {
  border: 1px solid #dbe7f2;
  border-radius: 0.85rem;
  background: #fbfdff;
  color: #334155;
  padding: 1rem;
}

.dashboard-page__panel-title {
  margin: 0 0 0.45rem;
  font-size: 1rem;
  font-weight: 700;
}

.dashboard-page__panel-copy {
  margin: 0;
  color: #475569;
}

.dashboard-page__actions {
  margin: 0;
  padding-left: 1.1rem;
  display: grid;
  gap: 0.35rem;
}

.dashboard-page__identity {
  border: 1px dashed #cbd5e1;
  border-radius: 0.85rem;
  background: #f8fafc;
  color: #475569;
  padding: 0.9rem 1rem;
  font-size: 0.9rem;
}

.dashboard-page__identity p {
  margin: 0.2rem 0;
}
</style>

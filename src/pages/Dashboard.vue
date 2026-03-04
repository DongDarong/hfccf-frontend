<script setup>
import { useI18n } from 'vue-i18n'
import MainLayout from '@/layouts/MainLayout.vue'

const { t } = useI18n()
</script>

<template>
  <MainLayout>
    <section class="dashboard-page">
      <header class="dashboard-page__header">
        <h1 class="dashboard-page__title">{{ t('nav.dashboard') }}</h1>
        <p class="dashboard-page__subtitle">{{ t('pages.homeDescription') }}</p>
      </header>

      <div class="dashboard-page__placeholder">
        <p>{{ t('common.dashboardStats.empty') }}</p>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dashboard-page__header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dashboard-page__title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f172a;
}

.dashboard-page__subtitle {
  margin: 0;
  color: #64748b;
  font-size: 0.92rem;
}

.dashboard-page__placeholder {
  border: 1px dashed #cbd5e1;
  border-radius: 0.85rem;
  background: #f8fafc;
  color: #475569;
  padding: 1rem;
}
</style>

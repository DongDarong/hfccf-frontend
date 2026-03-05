<script setup>
import { useI18n } from 'vue-i18n'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/layout/HeaderSection.vue'
import StatsCards from '@/components/common/StatsCards.vue'

defineOptions({
  name: 'DashboardPage',
})

const { t } = useI18n()
const statsCards = [
  { title: 'Programs', value: 12, label: 'In progress', status: 'success' },
  { title: 'New referrals', value: 38, label: 'Last 7 days', status: 'info' },
  { title: 'Pending approvals', value: 5, label: 'Awaiting review', status: 'warning' },
  { title: 'Critical alerts', value: 1, label: 'Immediate follow-up', status: 'error' },
]
</script>

<template>
  <MainLayout>
    <section class="dashboard-page">
      <HeaderSection :title="t('nav.dashboard')" :subtitle="t('pages.homeDescription')" />

      <StatsCards :cards="statsCards" />

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

.dashboard-page__placeholder {
  border: 1px dashed #cbd5e1;
  border-radius: 0.85rem;
  background: #f8fafc;
  color: #475569;
  padding: 1rem;
}
</style>

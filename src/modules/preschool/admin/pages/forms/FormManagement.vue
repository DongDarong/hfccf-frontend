<script setup>
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'
import FormsDashboardCard from '@/modules/preschool/admin/components/form-management/FormsDashboardCard.vue'
import { FM_HUB_SECTIONS } from './formManagementData'

defineOptions({ name: 'PreschoolAdminFormManagementPage' })

const { t } = useLanguage()
</script>

<template>
  <MainLayout>
    <section class="forms-dashboard">
      <HeaderSection
        :title="t('formsModuleDashboard.title')"
        :subtitle="t('formsModuleDashboard.subtitle')"
      />

      <div class="forms-dashboard__sections">
        <section
          v-for="section in FM_HUB_SECTIONS"
          :key="section.id"
          class="forms-dashboard__section"
          :aria-labelledby="`forms-section-${section.id}`"
        >
          <header class="forms-dashboard__section-header">
            <h2 :id="`forms-section-${section.id}`">
              {{ t(section.labelKey) }}
            </h2>
            <span aria-hidden="true" />
            <p>{{ t(section.captionKey) }}</p>
          </header>

          <div class="forms-dashboard__grid">
            <FormsDashboardCard
              v-for="card in section.cards"
              :key="card.key"
              :card="card"
              :title="t(card.titleKey)"
              :description="t(card.descriptionKey)"
            />
          </div>
        </section>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.forms-dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.forms-dashboard__sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.forms-dashboard__section {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.forms-dashboard__section-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.forms-dashboard__section-header h2 {
  margin: 0;
  color: #94a3b8;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.075em;
  text-transform: uppercase;
  white-space: nowrap;
}

.forms-dashboard__section-header span {
  flex: 1;
  height: 1px;
  background: #f1f5f9;
}

.forms-dashboard__section-header p {
  margin: 0;
  color: #cbd5e1;
  font-size: 0.75rem;
  white-space: nowrap;
}

.forms-dashboard__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 1100px) {
  .forms-dashboard__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 580px) {
  .forms-dashboard__grid {
    grid-template-columns: 1fr;
  }

  .forms-dashboard__section-header span,
  .forms-dashboard__section-header p {
    display: none;
  }
}
</style>

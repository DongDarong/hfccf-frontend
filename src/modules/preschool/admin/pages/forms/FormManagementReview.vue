<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'
import FormManagementHero from '@/modules/preschool/admin/components/form-management/FormManagementHero.vue'
import FormManagementSection from '@/modules/preschool/admin/components/form-management/FormManagementSection.vue'
import { groupFormManagementActionCards } from './formManagementData'

defineOptions({
  name: 'PreschoolAdminFormManagementReviewPage',
})

const { t, te } = useLanguage()
const router = useRouter()
const { review } = groupFormManagementActionCards()

function safeText(key, fallback) {
  return te(key) ? t(key) : fallback
}

const heroSummary = computed(() =>
  safeText(
    'preschoolScaffold.formManagement.pages.review.description',
    'Review submission and reporting outputs.',
  ),
)

const quickLinks = computed(() => [
  {
    label: safeText('breadcrumb.forms', 'Forms'),
    action: () => router.push({ name: 'dashboard-preschool-admin-forms' }),
    icon: 'pi pi-arrow-left',
  },
  {
    label: safeText('preschoolScaffold.formManagement.cards.submissions.title', 'Submissions'),
    action: () => router.push({ name: 'assessment-submission-list' }),
    icon: 'pi pi-inbox',
  },
  {
    label: safeText('preschoolScaffold.formManagement.cards.reports.title', 'Reports'),
    action: () => router.push({ name: 'assessment-reports' }),
    icon: 'pi pi-chart-pie',
  },
])
</script>

<template>
  <MainLayout>
    <section class="preschool-form-management-page">
      <HeaderSection
        :title="safeText('preschoolScaffold.formManagement.pages.review.title', 'Review Forms')"
        :subtitle="safeText('preschoolScaffold.formManagement.pages.review.subtitle', 'Review submission and reporting outputs.')"
      />

      <FormManagementHero
        :eyebrow="safeText('preschoolScaffold.formManagement.pages.review.eyebrow', 'Form review')"
        :title="safeText('preschoolScaffold.formManagement.pages.review.title', 'Review Forms')"
        :description="safeText('preschoolScaffold.formManagement.pages.review.description', 'Review submission and reporting outputs.')"
        :meta-label="safeText('preschoolScaffold.formManagement.hero.metricForms', 'Workspace')"
        :meta-note="heroSummary"
        :quick-links="quickLinks"
      />

      <FormManagementSection
        :eyebrow="safeText('preschoolScaffold.formManagement.pages.review.eyebrow', 'Form review')"
        :title="safeText('preschoolScaffold.formManagement.pages.review.title', 'Review Forms')"
        :badge="safeText('preschoolScaffold.formManagement.hero.openLabel', 'Open')"
        grid-class="preschool-form-management-section__grid--two"
        card-class="preschool-form-management-card__surface--review"
        :cards="review"
      />
    </section>
  </MainLayout>
</template>

<style scoped>
.preschool-form-management-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>

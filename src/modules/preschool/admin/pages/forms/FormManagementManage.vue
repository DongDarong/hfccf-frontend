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
  name: 'PreschoolAdminFormManagementManagePage',
})

const { t, te } = useLanguage()
const router = useRouter()
const { manage } = groupFormManagementActionCards()

function safeText(key, fallback) {
  return te(key) ? t(key) : fallback
}

const heroSummary = computed(() =>
  safeText(
    'preschoolScaffold.formManagement.pages.manage.description',
    'Open the form catalog and review related records.',
  ),
)

const quickLinks = computed(() => [
  {
    label: safeText('breadcrumb.forms', 'Forms'),
    action: () => router.push({ name: 'dashboard-preschool-admin-forms' }),
    icon: 'pi pi-arrow-left',
  },
  {
    label: safeText('preschoolScaffold.formManagement.cards.forms.title', 'Forms'),
    action: () => router.push({ name: 'assessment-form-list' }),
    icon: 'pi pi-folder-open',
  },
  {
    label: safeText('preschoolScaffold.formManagement.cards.auditLogs.title', 'Audit Logs'),
    action: () => router.push({ name: 'assessment-audit-logs' }),
    icon: 'pi pi-history',
  },
])
</script>

<template>
  <MainLayout>
    <section class="preschool-form-management-page">
      <HeaderSection
        :title="safeText('preschoolScaffold.formManagement.pages.manage.title', 'Manage Forms')"
        :subtitle="safeText('preschoolScaffold.formManagement.pages.manage.subtitle', 'Open the form catalog and related records.')"
      />

      <FormManagementHero
        :eyebrow="safeText('preschoolScaffold.formManagement.pages.manage.eyebrow', 'Form management')"
        :title="safeText('preschoolScaffold.formManagement.pages.manage.title', 'Manage Forms')"
        :description="safeText('preschoolScaffold.formManagement.pages.manage.description', 'Open the form catalog and related records.')"
        :meta-label="safeText('preschoolScaffold.formManagement.hero.metricForms', 'Workspace')"
        :meta-note="heroSummary"
        :quick-links="quickLinks"
      />

      <FormManagementSection
        :eyebrow="safeText('preschoolScaffold.formManagement.pages.manage.eyebrow', 'Form management')"
        :title="safeText('preschoolScaffold.formManagement.pages.manage.title', 'Manage Forms')"
        :badge="safeText('preschoolScaffold.formManagement.hero.openLabel', 'Open')"
        grid-class="preschool-form-management-section__grid--two"
        card-class="preschool-form-management-card__surface--manage"
        :cards="manage"
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

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
  name: 'PreschoolAdminFormManagementBuildPage',
})

const { t, te } = useLanguage()
const router = useRouter()
const { build } = groupFormManagementActionCards()

function safeText(key, fallback) {
  return te(key) ? t(key) : fallback
}

const heroSummary = computed(() =>
  safeText(
    'preschoolScaffold.formManagement.pages.build.description',
    'Create and refine forms with the guided tools.',
  ),
)

const quickLinks = computed(() => [
  {
    label: safeText('breadcrumb.forms', 'Forms'),
    action: () => router.push({ name: 'dashboard-preschool-admin-forms' }),
    icon: 'pi pi-arrow-left',
  },
  {
    label: safeText('preschoolScaffold.formManagement.cards.newForm.title', 'New Form'),
    action: () => router.push({ name: 'assessment-form-create' }),
    icon: 'pi pi-plus',
  },
  {
    label: safeText('preschoolScaffold.formManagement.cards.wizard.title', 'Wizard'),
    action: () => router.push({ name: 'assessment-wizard' }),
    icon: 'pi pi-sparkles',
  },
])
</script>

<template>
  <MainLayout>
    <section class="preschool-form-management-page">
      <HeaderSection
        :title="safeText('preschoolScaffold.formManagement.pages.build.title', 'Build Forms')"
        :subtitle="safeText('preschoolScaffold.formManagement.pages.build.subtitle', 'Create and refine forms with the guided tools.')"
      />

      <FormManagementHero
        :eyebrow="safeText('preschoolScaffold.formManagement.pages.build.eyebrow', 'Form builder')"
        :title="safeText('preschoolScaffold.formManagement.pages.build.title', 'Build Forms')"
        :description="safeText('preschoolScaffold.formManagement.pages.build.description', 'Create and refine forms with the guided tools.')"
        :meta-label="safeText('preschoolScaffold.formManagement.hero.metricForms', 'Workspace')"
        :meta-note="heroSummary"
        :quick-links="quickLinks"
      />

      <FormManagementSection
        :eyebrow="safeText('preschoolScaffold.formManagement.pages.build.eyebrow', 'Form builder')"
        :title="safeText('preschoolScaffold.formManagement.pages.build.title', 'Build Forms')"
        :badge="safeText('preschoolScaffold.formManagement.hero.openLabel', 'Open')"
        grid-class="preschool-form-management-section__grid--two"
        card-class="preschool-form-management-card__surface--build"
        :cards="build"
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

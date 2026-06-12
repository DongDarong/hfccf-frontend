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

      <div class="workflow-guidance">
        <p class="workflow-guidance__step">
          <span class="workflow-guidance__icon">🔧</span>
          <strong>Start here:</strong> Create a new form or edit an existing one
        </p>
        <p class="workflow-guidance__step">
          <span class="workflow-guidance__icon">⚙️</span>
          <strong>Then configure:</strong> Set up fields, scoring, and printing options
        </p>
        <p class="workflow-guidance__step">
          <span class="workflow-guidance__icon">✅</span>
          <strong>Finally publish:</strong> Deploy and activate forms for use
        </p>
      </div>

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

.workflow-guidance {
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.workflow-guidance__step {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: #475569;
}

.workflow-guidance__icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}
</style>

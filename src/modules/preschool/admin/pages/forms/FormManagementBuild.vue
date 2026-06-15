<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import Button from '@/components/buttons/Button.vue'
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
    'assessmentFormBuilder.subtitle',
    'Design assessment forms, scoring rubrics, and reusable question layouts.',
  ),
)

const quickLinks = computed(() => [
  {
    label: safeText('breadcrumb.forms', 'Forms'),
    action: () => router.push({ name: 'dashboard-preschool-admin-forms' }),
    icon: 'pi pi-arrow-left',
  },
  {
    label: safeText('assessmentFormBuilder.actions.saveDraft', 'Save Draft'),
    action: () => {},
    icon: 'pi pi-save',
  },
  {
    label: safeText('assessmentFormBuilder.actions.preview', 'Preview'),
    action: () => {},
    icon: 'pi pi-eye',
  },
])
</script>

<template>
  <MainLayout>
    <section class="preschool-form-management-page">
      <HeaderSection
        :title="safeText('assessmentFormBuilder.title', 'Form Builder')"
        :subtitle="safeText('assessmentFormBuilder.subtitle', 'Design assessment forms, scoring rubrics, and reusable question layouts.')"
      />

      <div class="workflow-guidance">
        <p class="workflow-guidance__step">
          <span class="workflow-guidance__icon">🧩</span>
          <strong>{{ safeText('assessmentFormBuilder.guidance.start', 'Start here:') }}</strong>
          <span>{{ safeText('assessmentFormBuilder.guidance.startDescription', 'Create a new form or edit an existing one') }}</span>
        </p>
        <p class="workflow-guidance__step">
          <span class="workflow-guidance__icon">⚙️</span>
          <strong>{{ safeText('assessmentFormBuilder.guidance.configure', 'Then configure:') }}</strong>
          <span>{{ safeText('assessmentFormBuilder.guidance.configureDescription', 'Set up fields, scoring, and printing options') }}</span>
        </p>
        <p class="workflow-guidance__step">
          <span class="workflow-guidance__icon">✅</span>
          <strong>{{ safeText('assessmentFormBuilder.guidance.publish', 'Finally publish:') }}</strong>
          <span>{{ safeText('assessmentFormBuilder.guidance.publishDescription', 'Deploy and activate forms for use') }}</span>
        </p>
      </div>

      <FormManagementHero
        :eyebrow="safeText('assessmentFormBuilder.badge', 'Preschool Assessment')"
        :title="safeText('assessmentFormBuilder.title', 'Form Builder')"
        :description="safeText('assessmentFormBuilder.subtitle', 'Design assessment forms, scoring rubrics, and reusable question layouts.')"
        :meta-label="safeText('assessmentFormBuilder.metaLabel', 'Workspace')"
        :meta-note="heroSummary"
        :quick-links="quickLinks"
      />

      <div class="builder-launch">
        <Button
          :label="safeText('assessmentFormBuilder.actions.launch', 'Open Form Builder')"
          icon="pi pi-arrow-right"
          @click="router.push({ name: 'preschool-assessment-form-builder' })"
        />
      </div>

      <FormManagementSection
        :eyebrow="safeText('assessmentFormBuilder.sections.title', 'Build Workspace')"
        :title="safeText('assessmentFormBuilder.sections.title', 'Build Workspace')"
        :badge="safeText('assessmentFormBuilder.actions.open', 'Open')"
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
  border: 1px solid #bfdbfe;
  background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
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
  flex-wrap: wrap;
}

.workflow-guidance__step strong {
  color: #1e3a8a;
}

.workflow-guidance__icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.builder-launch {
  display: flex;
  justify-content: flex-end;
}
</style>

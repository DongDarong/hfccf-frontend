<script setup>
import { computed } from 'vue'
import Card from 'primevue/card'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'PreschoolAdminFormManagementPage',
})

const { t, te } = useLanguage()

function safeText(key, fallback) {
  return te(key) ? t(key) : fallback
}

const launchCards = computed(() => [
  {
    key: 'dashboard',
    title: t('assessmentDashboard.title'),
    description: safeText(
      'preschoolScaffold.formManagement.cards.dashboard.description',
      'Open the assessment overview and quick metrics.',
    ),
    to: { name: 'assessment-dashboard' },
    icon: 'pi pi-chart-line',
  },
  {
    key: 'forms',
    title: t('formBuilder.title'),
    description: safeText(
      'preschoolScaffold.formManagement.cards.forms.description',
      'Manage templates, versions, sections, and questions.',
    ),
    to: { name: 'assessment-form-list' },
    icon: 'pi pi-file-edit',
  },
  {
    key: 'new-form',
    title: t('formBuilder.newForm'),
    description: safeText(
      'preschoolScaffold.formManagement.cards.newForm.description',
      'Create a new assessment template from scratch.',
    ),
    to: { name: 'assessment-form-create' },
    icon: 'pi pi-plus-circle',
  },
  {
    key: 'submissions',
    title: t('submissions.title'),
    description: safeText(
      'preschoolScaffold.formManagement.cards.submissions.description',
      'Review submitted assessments and open individual records.',
    ),
    to: { name: 'assessment-submission-list' },
    icon: 'pi pi-inbox',
  },
  {
    key: 'wizard',
    title: t('assessmentWizard.title'),
    description: safeText(
      'preschoolScaffold.formManagement.cards.wizard.description',
      'Launch the guided assessment entry workflow.',
    ),
    to: { name: 'assessment-wizard' },
    icon: 'pi pi-sitemap',
  },
  {
    key: 'scoring',
    title: t('scoring.title'),
    description: safeText(
      'preschoolScaffold.formManagement.cards.scoring.description',
      'Configure scoring rules and risk levels.',
    ),
    to: { name: 'assessment-scoring' },
    icon: 'pi pi-sliders-h',
  },
  {
    key: 'print-designer',
    title: t('printDesigner.title'),
    description: safeText(
      'preschoolScaffold.formManagement.cards.printDesigner.description',
      'Design Khmer-friendly print layouts and templates.',
    ),
    to: { name: 'assessment-print-designer' },
    icon: 'pi pi-print',
  },
  {
    key: 'reports',
    title: t('assessmentReports.title'),
    description: safeText(
      'preschoolScaffold.formManagement.cards.reports.description',
      'Analyze trends, risk breakdowns, and completion rates.',
    ),
    to: { name: 'assessment-reports' },
    icon: 'pi pi-chart-bar',
  },
  {
    key: 'audit-logs',
    title: t('assessmentReports.auditLogs.title'),
    description: safeText(
      'preschoolScaffold.formManagement.cards.auditLogs.description',
      'Inspect assessment action history and changes.',
    ),
    to: { name: 'assessment-audit-logs' },
    icon: 'pi pi-history',
  },
])
</script>

<template>
  <MainLayout>
    <section class="preschool-form-management-page">
      <HeaderSection
        title="Assessment Workspace"
        subtitle="Choose a card below to open the assessment page you need."
      />

      <div class="rounded-2xl border border-cyan-100 bg-cyan-50/70 px-4 py-3 text-sm leading-6 text-cyan-900 shadow-sm">
        Click any card to jump directly into the matching Assessment page.
      </div>

      <div class="preschool-form-management-page__grid">
        <RouterLink
          v-for="card in launchCards"
          :key="card.key"
          :to="card.to"
          class="preschool-form-management-page__link group"
        >
          <Card class="preschool-form-management-page__card h-full">
            <template #content>
              <div class="preschool-form-management-page__card-inner">
                <div class="flex items-start justify-between gap-4">
                  <div class="min-w-0 space-y-1">
                    <p class="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Preschool Assessment
                    </p>
                    <h2 class="text-lg font-black leading-tight text-slate-900 transition-colors group-hover:text-cyan-700">
                      {{ card.title }}
                    </h2>
                  </div>

                  <span class="preschool-form-management-page__icon">
                    <i :class="card.icon" aria-hidden="true" />
                  </span>
                </div>

                <p class="text-sm leading-6 text-slate-600">
                  {{ card.description }}
                </p>

                <div class="mt-auto flex items-center justify-between pt-2 text-sm font-semibold text-cyan-700">
                  <span>{{ t('common.actions.view') }}</span>
                  <i class="pi pi-arrow-right transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </div>
            </template>
          </Card>
        </RouterLink>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.preschool-form-management-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preschool-form-management-page__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.preschool-form-management-page__link {
  display: block;
  min-width: 0;
  text-decoration: none;
  outline: none;
}

.preschool-form-management-page__link:focus-visible {
  box-shadow: 0 0 0 2px rgba(8, 145, 178, 0.28);
  border-radius: 1rem;
}

.preschool-form-management-page__card {
  border: 1px solid #dbeafe;
  border-radius: 1.25rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 249, 255, 0.92) 100%);
  box-shadow: 0 18px 36px -28px rgba(15, 23, 42, 0.35);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.preschool-form-management-page__link:hover .preschool-form-management-page__card {
  transform: translateY(-2px);
  border-color: #67e8f9;
  box-shadow: 0 26px 50px -32px rgba(15, 23, 42, 0.42);
}

.preschool-form-management-page__card :deep(.p-card-body) {
  height: 100%;
  padding: 1.15rem;
}

.preschool-form-management-page__card-inner {
  display: flex;
  height: 100%;
  min-height: 13rem;
  flex-direction: column;
  gap: 0.9rem;
}

.preschool-form-management-page__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.95rem;
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  color: #ffffff;
  flex-shrink: 0;
}

@media (max-width: 1100px) {
  .preschool-form-management-page__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .preschool-form-management-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>

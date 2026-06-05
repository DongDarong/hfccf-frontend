<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import Button from '@/components/buttons/Button.vue'
import Card from 'primevue/card'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'PreschoolAdminFormManagementPage',
})

const { t, te } = useLanguage()
const router = useRouter()

const launcherCards = [
  {
    key: 'dashboard',
    group: 'overview',
    icon: 'pi pi-chart-bar',
    titleFallback: 'Dashboard',
    titleKey: 'preschoolScaffold.formManagement.cards.dashboard.title',
    descriptionKey: 'preschoolScaffold.formManagement.cards.dashboard.description',
    fallbackDescription: 'View the module overview and jump into the most important areas.',
    to: { name: 'assessment-dashboard' },
  },
  {
    key: 'forms',
    group: 'manage',
    icon: 'pi pi-folder-open',
    titleFallback: 'Forms',
    titleKey: 'preschoolScaffold.formManagement.cards.forms.title',
    descriptionKey: 'preschoolScaffold.formManagement.cards.forms.description',
    fallbackDescription: 'Review and organize the current assessment form catalog.',
    to: { name: 'assessment-form-list' },
  },
  {
    key: 'new-form',
    group: 'build',
    icon: 'pi pi-plus-circle',
    titleFallback: 'New Form',
    titleKey: 'preschoolScaffold.formManagement.cards.newForm.title',
    descriptionKey: 'preschoolScaffold.formManagement.cards.newForm.description',
    fallbackDescription: 'Create a new form for a workflow or data collection flow.',
    to: { name: 'assessment-form-create' },
  },
  {
    key: 'submissions',
    group: 'review',
    icon: 'pi pi-inbox',
    titleFallback: 'Submissions',
    titleKey: 'preschoolScaffold.formManagement.cards.submissions.title',
    descriptionKey: 'preschoolScaffold.formManagement.cards.submissions.description',
    fallbackDescription: 'Track submissions and monitor their processing status.',
    to: { name: 'assessment-submission-list' },
  },
  {
    key: 'wizard',
    group: 'build',
    icon: 'pi pi-sparkles',
    titleFallback: 'Wizard',
    titleKey: 'preschoolScaffold.formManagement.cards.wizard.title',
    descriptionKey: 'preschoolScaffold.formManagement.cards.wizard.description',
    fallbackDescription: 'Build forms step by step with guided assistance.',
    to: { name: 'assessment-wizard' },
  },
  {
    key: 'scoring',
    group: 'build',
    icon: 'pi pi-sliders-h',
    titleFallback: 'Scoring',
    titleKey: 'preschoolScaffold.formManagement.cards.scoring.title',
    descriptionKey: 'preschoolScaffold.formManagement.cards.scoring.description',
    fallbackDescription: 'Define and manage scoring rules for the active form.',
    to: { name: 'assessment-form-list' },
  },
  {
    key: 'print-designer',
    group: 'build',
    icon: 'pi pi-print',
    titleFallback: 'Print Designer',
    titleKey: 'preschoolScaffold.formManagement.cards.printDesigner.title',
    descriptionKey: 'preschoolScaffold.formManagement.cards.printDesigner.description',
    fallbackDescription: 'Arrange print layouts and present forms cleanly.',
    to: { name: 'assessment-form-list' },
  },
  {
    key: 'reports',
    group: 'review',
    icon: 'pi pi-chart-pie',
    titleFallback: 'Reports',
    titleKey: 'preschoolScaffold.formManagement.cards.reports.title',
    descriptionKey: 'preschoolScaffold.formManagement.cards.reports.description',
    fallbackDescription: 'View summary data and reports for forms.',
    to: { name: 'assessment-reports' },
  },
  {
    key: 'audit-logs',
    group: 'overview',
    icon: 'pi pi-history',
    titleFallback: 'Audit Logs',
    titleKey: 'preschoolScaffold.formManagement.cards.auditLogs.title',
    descriptionKey: 'preschoolScaffold.formManagement.cards.auditLogs.description',
    fallbackDescription: 'Review activity and the history of changes.',
    to: { name: 'assessment-audit-logs' },
  },
]

function safeText(key, fallback) {
  return te(key) ? t(key) : fallback
}

const heroSummary = computed(() =>
  safeText(
    'preschoolScaffold.formManagement.hero.summaryNoForms',
    'Use the launcher below to open assessment forms, submissions, reports, and tools.',
  ),
)

const heroActionLabel = computed(() =>
  safeText('preschoolScaffold.formManagement.hero.openLabel', 'Open'),
)

const resolvedCards = computed(() =>
  launcherCards.map((card) => ({
    ...card,
    description: safeText(card.descriptionKey, card.fallbackDescription),
    to: card.to,
  })),
)

const groupedCards = computed(() => ({
  overview: resolvedCards.value.filter((card) => card.group === 'overview'),
  manage: resolvedCards.value.filter((card) => card.group === 'manage'),
  build: resolvedCards.value.filter((card) => card.group === 'build'),
  review: resolvedCards.value.filter((card) => card.group === 'review'),
}))

const quickLinks = computed(() => [
  { label: safeText('preschoolScaffold.formManagement.cards.dashboard.title', 'Dashboard'), to: { name: 'assessment-dashboard' }, icon: 'pi pi-chart-bar' },
  { label: safeText('preschoolScaffold.formManagement.cards.forms.title', 'Forms'), to: { name: 'assessment-form-list' }, icon: 'pi pi-folder-open' },
  { label: safeText('preschoolScaffold.formManagement.cards.newForm.title', 'New Form'), to: { name: 'assessment-form-create' }, icon: 'pi pi-plus' },
])

</script>

<template>
  <MainLayout>
    <section class="preschool-form-management-page">
      <HeaderSection
        :title="safeText('preschoolScaffold.formManagement.title', 'Form Management')"
        :subtitle="safeText('preschoolScaffold.formManagement.subtitle', 'Create, organize, review, and manage Preschool forms.')"
      />

      <div class="preschool-form-management-page__hero">
        <div class="preschool-form-management-page__hero-copy">
          <p class="preschool-form-management-page__eyebrow">
            {{ safeText('preschoolScaffold.formManagement.eyebrow', 'Form overview') }}
          </p>
          <h2 class="preschool-form-management-page__title">
            {{ safeText('preschoolScaffold.formManagement.title', 'Form Management') }}
          </h2>
          <p class="preschool-form-management-page__description">
            {{ safeText('preschoolScaffold.formManagement.description', 'Manage the launch points for form builders, recent forms, submissions, and review tools.') }}
          </p>

          <div class="preschool-form-management-page__meta">
            <span class="preschool-form-management-page__meta-label">
              {{ safeText('preschoolScaffold.formManagement.hero.metricForms', 'Launcher ready') }}
            </span>
            <span class="preschool-form-management-page__meta-note">
              {{ heroSummary }}
            </span>
          </div>
        </div>

        <div class="preschool-form-management-page__hero-actions">
          <Button
            v-for="link in quickLinks"
            :key="link.label"
            :label="link.label"
            :icon="link.icon"
            rounded="xl"
            size="md"
            variant="secondary"
            @click="router.push(link.to)"
          />
        </div>
      </div>

      <div class="preschool-form-management-page__section">
        <div class="preschool-form-management-page__section-header">
          <div>
            <p class="preschool-form-management-page__section-eyebrow">
              {{ safeText('preschoolScaffold.formManagement.eyebrow', 'Form overview') }}
            </p>
            <h3>Overview</h3>
          </div>
          <span class="preschool-form-management-page__section-badge">
            {{ heroActionLabel }}
          </span>
        </div>

        <div class="preschool-form-management-page__grid preschool-form-management-page__grid--three">
          <RouterLink
            v-for="card in groupedCards.overview"
            :key="card.key"
            :to="card.to"
            class="preschool-form-management-page__link group"
          >
            <Card class="preschool-form-management-page__card">
              <template #content>
                <div class="preschool-form-management-page__card-content">
                  <div class="preschool-form-management-page__card-icon">
                    <i :class="card.icon" aria-hidden="true" />
                  </div>

                  <div class="preschool-form-management-page__card-copy">
                    <div class="preschool-form-management-page__card-topline">
                      <h4>{{ safeText(card.titleKey, card.titleFallback) }}</h4>
                      <span>{{ heroActionLabel }}</span>
                    </div>
                    <p>{{ card.description }}</p>
                  </div>
                </div>
              </template>
            </Card>
          </RouterLink>
        </div>
      </div>

      <div class="preschool-form-management-page__section">
        <div class="preschool-form-management-page__section-header">
          <div>
            <p class="preschool-form-management-page__section-eyebrow">Manage</p>
            <h3>{{ safeText('preschoolScaffold.formManagement.cards.forms.title', 'Forms') }}</h3>
          </div>
        </div>

        <div class="preschool-form-management-page__grid preschool-form-management-page__grid--two">
          <RouterLink
            v-for="card in groupedCards.manage"
            :key="card.key"
            :to="card.to"
            class="preschool-form-management-page__link group"
          >
            <Card class="preschool-form-management-page__card preschool-form-management-page__card--manage">
              <template #content>
                <div class="preschool-form-management-page__card-content">
                  <div class="preschool-form-management-page__card-icon">
                    <i :class="card.icon" aria-hidden="true" />
                  </div>

                  <div class="preschool-form-management-page__card-copy">
                    <div class="preschool-form-management-page__card-topline">
                      <h4>{{ safeText(card.titleKey, card.titleFallback) }}</h4>
                      <span>{{ safeText('preschoolScaffold.formManagement.hero.openLabel', 'Open') }}</span>
                    </div>
                    <p>{{ card.description }}</p>
                  </div>
                </div>
              </template>
            </Card>
          </RouterLink>

          <RouterLink
            v-for="card in groupedCards.build"
            :key="card.key"
            :to="card.to"
            class="preschool-form-management-page__link group"
          >
            <Card class="preschool-form-management-page__card preschool-form-management-page__card--build">
              <template #content>
                <div class="preschool-form-management-page__card-content">
                  <div class="preschool-form-management-page__card-icon">
                    <i :class="card.icon" aria-hidden="true" />
                  </div>

                  <div class="preschool-form-management-page__card-copy">
                    <div class="preschool-form-management-page__card-topline">
                      <h4>{{ safeText(card.titleKey, card.titleFallback) }}</h4>
                      <span>{{ heroActionLabel }}</span>
                    </div>
                    <p>{{ card.description }}</p>
                  </div>
                </div>
              </template>
            </Card>
          </RouterLink>
        </div>
      </div>

      <div class="preschool-form-management-page__section">
        <div class="preschool-form-management-page__section-header">
          <div>
            <p class="preschool-form-management-page__section-eyebrow">Review</p>
            <h3>{{ safeText('preschoolScaffold.formManagement.cards.reports.title', 'Reports') }}</h3>
          </div>
        </div>

        <div class="preschool-form-management-page__grid preschool-form-management-page__grid--two">
          <RouterLink
            v-for="card in groupedCards.review"
            :key="card.key"
            :to="card.to"
            class="preschool-form-management-page__link group"
          >
            <Card class="preschool-form-management-page__card preschool-form-management-page__card--review">
              <template #content>
                <div class="preschool-form-management-page__card-content">
                  <div class="preschool-form-management-page__card-icon">
                    <i :class="card.icon" aria-hidden="true" />
                  </div>

                  <div class="preschool-form-management-page__card-copy">
                    <div class="preschool-form-management-page__card-topline">
                      <h4>{{ safeText(card.titleKey, card.titleFallback) }}</h4>
                      <span>{{ safeText('preschoolScaffold.formManagement.hero.openLabel', 'Open') }}</span>
                    </div>
                    <p>{{ card.description }}</p>
                  </div>
                </div>
              </template>
            </Card>
          </RouterLink>
        </div>
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

.preschool-form-management-page__hero {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.8fr);
  padding: 1.35rem;
  border: 1px solid #dbeafe;
  border-radius: 1.5rem;
  background:
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.14), transparent 22%),
    linear-gradient(180deg, rgba(239, 246, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%);
  box-shadow: 0 25px 55px -38px rgba(15, 23, 42, 0.45);
}

.preschool-form-management-page__eyebrow,
.preschool-form-management-page__section-eyebrow {
  margin: 0 0 0.25rem;
  color: #2563eb;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.preschool-form-management-page__title,
.preschool-form-management-page__section h3 {
  margin: 0;
  color: #0f172a;
  font-size: 1.45rem;
  font-weight: 900;
  line-height: 1.2;
}

.preschool-form-management-page__description {
  margin: 0.7rem 0 0;
  color: #475569;
  font-size: 0.96rem;
  line-height: 1.65;
  max-width: 54rem;
}

.preschool-form-management-page__meta {
  display: grid;
  gap: 0.1rem;
  margin-top: 1.05rem;
  padding: 0.95rem 1rem;
  border-radius: 1.15rem;
  border: 1px solid rgba(191, 219, 254, 0.9);
  background: rgba(255, 255, 255, 0.75);
}

.preschool-form-management-page__meta-label {
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.preschool-form-management-page__meta-value {
  color: #0f172a;
  font-size: 2rem;
  font-weight: 900;
  line-height: 1.1;
}

.preschool-form-management-page__meta-note {
  color: #1d4ed8;
  font-size: 0.92rem;
  font-weight: 600;
}

.preschool-form-management-page__hero-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 1.25rem;
  border: 1px solid #dbeafe;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(239, 246, 255, 0.85) 100%);
}

.preschool-form-management-page__loading {
  border-radius: 1rem;
  border: 1px dashed #cbd5e1;
  background: #fff;
  color: #475569;
  padding: 1rem;
}

.preschool-form-management-page__section {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.preschool-form-management-page__section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
}

.preschool-form-management-page__section-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
}

.preschool-form-management-page__grid {
  display: grid;
  gap: 1rem;
}

.preschool-form-management-page__grid--three {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.preschool-form-management-page__grid--two {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.preschool-form-management-page__link {
  display: block;
  text-decoration: none;
}

.preschool-form-management-page__card {
  height: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 1.15rem;
  background: #fff;
  box-shadow: 0 18px 40px -34px rgba(15, 23, 42, 0.35);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease;
}

.preschool-form-management-page__card--build {
  border-color: rgba(191, 219, 254, 0.95);
}

.preschool-form-management-page__card--review {
  border-color: rgba(221, 214, 254, 0.9);
}

.preschool-form-management-page__link:hover .preschool-form-management-page__card,
.preschool-form-management-page__link:focus-visible .preschool-form-management-page__card {
  transform: translateY(-2px);
  border-color: #93c5fd;
  box-shadow: 0 22px 50px -34px rgba(37, 99, 235, 0.45);
}

.preschool-form-management-page__card-content {
  display: flex;
  gap: 0.9rem;
  align-items: flex-start;
}

.preschool-form-management-page__card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 0.95rem;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #2563eb;
  flex: none;
}

.preschool-form-management-page__card-copy {
  min-width: 0;
  width: 100%;
}

.preschool-form-management-page__card-topline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.35rem;
}

.preschool-form-management-page__card-topline h4 {
  margin: 0;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 850;
}

.preschool-form-management-page__card-topline span {
  flex: none;
  padding: 0.28rem 0.62rem;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.preschool-form-management-page__card-copy p {
  margin: 0;
  color: #475569;
  font-size: 0.92rem;
  line-height: 1.5;
}

@media (max-width: 900px) {
  .preschool-form-management-page__hero {
    grid-template-columns: 1fr;
  }

  .preschool-form-management-page__hero-actions {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

@media (max-width: 640px) {
  .preschool-form-management-page__section-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .preschool-form-management-page__hero,
  .preschool-form-management-page__hero-actions {
    padding: 1rem;
  }
}
</style>

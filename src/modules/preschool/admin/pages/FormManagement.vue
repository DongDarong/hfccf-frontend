<script setup>
// This page is an assessment launcher inside the Preschool admin shell.
// It deliberately routes into the assessment module rather than duplicating
// the underlying assessment CRUD and reporting workflows here.
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import Card from 'primevue/card'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'
import { assessmentFormApi } from '@/modules/assessment/services/assessmentFormApi'

defineOptions({
  name: 'PreschoolAdminFormManagementPage',
})

const { t, te } = useLanguage()

const assessmentForms = ref([])
const isLoading = ref(false)

const launcherCards = [
  {
    key: 'dashboard',
    icon: 'pi-chart-line',
    tone: 'blue',
    titleKey: 'preschoolScaffold.formManagement.cards.dashboard.title',
    descriptionKey: 'preschoolScaffold.formManagement.cards.dashboard.description',
    fallbackDescription: 'Review the overall assessment progress and quick metrics.',
    to: { name: 'assessment-dashboard' },
  },
  {
    key: 'forms',
    icon: 'pi-list-check',
    tone: 'indigo',
    titleKey: 'preschoolScaffold.formManagement.cards.forms.title',
    descriptionKey: 'preschoolScaffold.formManagement.cards.forms.description',
    fallbackDescription: 'Open the form library to manage assessment templates.',
    to: { name: 'assessment-form-list' },
  },
  {
    key: 'new-form',
    icon: 'pi-plus-circle',
    tone: 'emerald',
    titleKey: 'preschoolScaffold.formManagement.cards.newForm.title',
    descriptionKey: 'preschoolScaffold.formManagement.cards.newForm.description',
    fallbackDescription: 'Start a new assessment form from scratch.',
    to: { name: 'assessment-form-create' },
  },
  {
    key: 'submissions',
    icon: 'pi-inbox',
    tone: 'slate',
    titleKey: 'preschoolScaffold.formManagement.cards.submissions.title',
    descriptionKey: 'preschoolScaffold.formManagement.cards.submissions.description',
    fallbackDescription: 'Inspect assessment submissions and completion records.',
    to: { name: 'assessment-submission-list' },
  },
  {
    key: 'wizard',
    icon: 'pi-sparkles',
    tone: 'amber',
    titleKey: 'preschoolScaffold.formManagement.cards.wizard.title',
    descriptionKey: 'preschoolScaffold.formManagement.cards.wizard.description',
    fallbackDescription: 'Launch the guided assessment workflow.',
    to: { name: 'assessment-wizard' },
  },
  {
    key: 'scoring',
    icon: 'pi-sliders-h',
    tone: 'rose',
    titleKey: 'preschoolScaffold.formManagement.cards.scoring.title',
    descriptionKey: 'preschoolScaffold.formManagement.cards.scoring.description',
    fallbackDescription: 'Adjust scoring rules for the selected assessment form.',
    requiresFormId: true,
    routeName: 'assessment-scoring',
  },
  {
    key: 'print-designer',
    icon: 'pi-print',
    tone: 'cyan',
    titleKey: 'preschoolScaffold.formManagement.cards.printDesigner.title',
    descriptionKey: 'preschoolScaffold.formManagement.cards.printDesigner.description',
    fallbackDescription: 'Design the printable output for the selected assessment form.',
    requiresFormId: true,
    routeName: 'assessment-print-designer',
  },
  {
    key: 'reports',
    icon: 'pi-chart-bar',
    tone: 'violet',
    titleKey: 'preschoolScaffold.formManagement.cards.reports.title',
    descriptionKey: 'preschoolScaffold.formManagement.cards.reports.description',
    fallbackDescription: 'Review reporting insights and generated summaries.',
    to: { name: 'assessment-reports' },
  },
  {
    key: 'audit-logs',
    icon: 'pi-history',
    tone: 'slate',
    titleKey: 'preschoolScaffold.formManagement.cards.auditLogs.title',
    descriptionKey: 'preschoolScaffold.formManagement.cards.auditLogs.description',
    fallbackDescription: 'Track changes and activity across the assessment module.',
    to: { name: 'assessment-audit-logs' },
  },
]

function safeText(key, fallback) {
  return te(key) ? t(key) : fallback
}

const primaryFormId = computed(() => String(assessmentForms.value[0]?.id || '').trim())
const assessmentFormCount = computed(() => assessmentForms.value.length)

const launchCards = computed(() =>
  launcherCards.map((card) => {
    if (!card.requiresFormId) {
      return {
        ...card,
        title: safeText(card.titleKey, card.titleKey.split('.').at(-1) || ''),
        description: safeText(card.descriptionKey, card.fallbackDescription),
        to: card.to,
      }
    }

    const id = primaryFormId.value
    return {
      ...card,
      title: safeText(card.titleKey, card.titleKey.split('.').at(-1) || ''),
      description: safeText(card.descriptionKey, card.fallbackDescription),
      to: id ? { name: card.routeName, params: { id } } : { name: 'assessment-form-list' },
    }
  }),
)

const pageTitle = computed(() => safeText('preschoolScaffold.formManagement.title', 'Assessment Workspace'))
const pageSubtitle = computed(() => safeText('preschoolScaffold.formManagement.subtitle', 'Choose a card below to open the Assessment page you need.'))
const pageEyebrow = computed(() => safeText('preschoolScaffold.formManagement.eyebrow', 'Assessment'))
const pageDescription = computed(() => safeText('preschoolScaffold.formManagement.description', 'These cards act as shortcuts into the Preschool assessment workflow.'))
const loadingLabel = computed(() => safeText('preschoolScaffold.formManagement.loading', 'Loading assessment tools...'))
const heroSummary = computed(() => {
  const count = assessmentFormCount.value
  if (count > 0) {
    return safeText(
      'preschoolScaffold.formManagement.hero.summaryWithForms',
      `${count} form${count === 1 ? '' : 's'} available for scoring and print tools.`,
    ).replace('{count}', String(count))
  }

  return safeText(
    'preschoolScaffold.formManagement.hero.summaryNoForms',
    'No assessment forms are available yet, so form-dependent tools will route back to the library.',
  )
})

async function loadAssessmentForms() {
  isLoading.value = true
  try {
    const response = await assessmentFormApi.list({
      page: 1,
      perPage: 1,
      search: '',
      status: '',
    })
    assessmentForms.value = Array.isArray(response?.data) ? response.data : response?.items || []
  } catch {
    assessmentForms.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  void loadAssessmentForms()
})
</script>

<template>
  <MainLayout>
    <section class="preschool-form-management-page">
      <div class="preschool-form-management-page__hero">
        <HeaderSection :title="pageTitle" :subtitle="pageSubtitle" />

        <div class="preschool-form-management-page__hero-panel">
          <div class="preschool-form-management-page__hero-copy">
            <span class="preschool-form-management-page__eyebrow">{{ pageEyebrow }}</span>
            <p>{{ pageDescription }}</p>
          </div>

          <div class="preschool-form-management-page__hero-metrics">
            <div class="preschool-form-management-page__metric">
              <span class="preschool-form-management-page__metric-value">{{ assessmentFormCount }}</span>
              <span class="preschool-form-management-page__metric-label">
                {{ safeText('preschoolScaffold.formManagement.hero.metricForms', 'Available forms') }}
              </span>
            </div>

            <div class="preschool-form-management-page__hero-note">
              {{ heroSummary }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="preschool-form-management-page__loading">
        {{ loadingLabel }}
      </div>

      <div class="preschool-form-management-page__grid" :class="{ 'is-loading': isLoading }">
        <RouterLink
          v-for="card in launchCards"
          :key="card.key"
          :to="card.to"
          class="preschool-form-management-page__link group"
        >
          <Card class="preschool-form-management-page__card">
            <template #content>
              <div class="preschool-form-management-page__card-content">
                <div class="preschool-form-management-page__card-icon" :class="`tone-${card.tone}`">
                  <i :class="['pi', card.icon]" aria-hidden="true"></i>
                </div>

                <div class="preschool-form-management-page__card-copy">
                  <h3>{{ card.title }}</h3>
                  <p>{{ card.description }}</p>
                </div>
              </div>

              <div class="preschool-form-management-page__card-footer">
                <span>
                  {{
                    card.requiresFormId && !primaryFormId
                      ? safeText('preschoolScaffold.formManagement.hero.formRequired', 'Needs a selected assessment form')
                      : safeText('preschoolScaffold.formManagement.hero.openLabel', 'Open workspace')
                  }}
                </span>
                <i class="pi pi-arrow-right" aria-hidden="true"></i>
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
  gap: 1.25rem;
}

.preschool-form-management-page__hero {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preschool-form-management-page__hero-panel {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(240px, 0.9fr);
  gap: 1rem;
  padding: 1.15rem 1.25rem;
  border-radius: 1.35rem;
  border: 1px solid rgba(59, 130, 246, 0.14);
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.13), transparent 36%),
    linear-gradient(180deg, #eff6ff 0%, #ffffff 100%);
  box-shadow: 0 18px 40px -32px rgba(37, 99, 235, 0.35);
}

.preschool-form-management-page__hero-copy {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preschool-form-management-page__eyebrow {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.1);
  color: #1d4ed8;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.35rem 0.7rem;
}

.preschool-form-management-page__hero-copy p {
  margin: 0;
  max-width: 56rem;
  color: #334155;
  line-height: 1.6;
}

.preschool-form-management-page__hero-metrics {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.preschool-form-management-page__metric {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(148, 163, 184, 0.2);
  padding: 0.85rem 0.95rem;
}

.preschool-form-management-page__metric-value {
  color: #0f172a;
  font-size: 1.55rem;
  font-weight: 800;
  line-height: 1;
}

.preschool-form-management-page__metric-label {
  color: #64748b;
  font-size: 0.85rem;
}

.preschool-form-management-page__hero-note {
  border-radius: 1rem;
  background: rgba(15, 23, 42, 0.04);
  color: #334155;
  font-size: 0.92rem;
  line-height: 1.55;
  padding: 0.9rem 0.95rem;
}

.preschool-form-management-page__intro {
  border-radius: 1.25rem;
  border: 1px solid #dbeafe;
  background: linear-gradient(180deg, #eff6ff 0%, #ffffff 100%);
  padding: 1rem 1.1rem;
  color: #1e3a8a;
  font-size: 0.95rem;
  line-height: 1.55;
}

.preschool-form-management-page__loading {
  border-radius: 1rem;
  border: 1px dashed #cbd5e1;
  background: #fff;
  color: #475569;
  padding: 1rem;
}

.preschool-form-management-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.preschool-form-management-page__grid.is-loading {
  opacity: 0.85;
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
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 0.9rem;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #2563eb;
  flex: none;
}

.preschool-form-management-page__card-icon.tone-indigo {
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  color: #4f46e5;
}

.preschool-form-management-page__card-icon.tone-emerald {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  color: #059669;
}

.preschool-form-management-page__card-icon.tone-slate {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  color: #334155;
}

.preschool-form-management-page__card-icon.tone-amber {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  color: #d97706;
}

.preschool-form-management-page__card-icon.tone-rose {
  background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%);
  color: #e11d48;
}

.preschool-form-management-page__card-icon.tone-cyan {
  background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%);
  color: #0891b2;
}

.preschool-form-management-page__card-icon.tone-violet {
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
  color: #7c3aed;
}

.preschool-form-management-page__card-copy h3 {
  margin: 0 0 0.35rem;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 800;
}

.preschool-form-management-page__card-copy p {
  margin: 0;
  color: #475569;
  font-size: 0.92rem;
  line-height: 1.5;
}

.preschool-form-management-page__card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 0.8rem;
  border-top: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 0.82rem;
  font-weight: 700;
}
</style>

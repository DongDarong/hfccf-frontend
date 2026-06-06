<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'
import FormManagementHero from '@/modules/preschool/admin/components/form-management/FormManagementHero.vue'
import FormManagementSection from '@/modules/preschool/admin/components/form-management/FormManagementSection.vue'
import { assessmentFormApi } from '@/modules/assessment/services/assessmentFormApi'
import { assessmentPrintApi } from '@/modules/assessment/services/assessmentPrintApi'
import { groupFormManagementActionCards } from './formManagementData'

defineOptions({
  name: 'PreschoolAdminFormManagementBuildPage',
})

const { t, te } = useLanguage()
const router = useRouter()
const { build } = groupFormManagementActionCards()
const forms = ref([])
const selectedFormId = ref(null)
const selectedDetails = ref(createEmptyDetails())
const loading = ref(true)
const detailsLoading = ref(false)
const loadWarning = ref(false)

function safeText(key, fallback) {
  return te(key) ? t(key) : fallback
}

const heroSummary = computed(() =>
  safeText(
    'preschoolScaffold.formManagement.pages.build.description',
    'Create and refine forms with the guided tools.',
  ),
)

const selectedForm = computed(() =>
  forms.value.find((form) => String(form.id) === String(selectedFormId.value)) ?? null,
)

const drafts = computed(() =>
  forms.value
    .filter((form) => form.status === 'draft')
    .sort((a, b) => new Date(b.updated_at ?? 0) - new Date(a.updated_at ?? 0))
    .slice(0, 5),
)

const statusCounts = computed(() =>
  forms.value.reduce(
    (counts, form) => {
      counts.total += 1
      if (form.status === 'draft') counts.draft += 1
      if (form.status === 'published') counts.published += 1
      return counts
    },
    { total: 0, draft: 0, published: 0 },
  ),
)

const readinessChecks = computed(() => [
  {
    key: 'identity',
    label: safeText('formsModuleDashboard.buildWorkspace.checks.identity', 'Name and description'),
    complete: Boolean(selectedForm.value?.name && selectedForm.value?.description),
  },
  {
    key: 'sections',
    label: safeText('formsModuleDashboard.buildWorkspace.checks.sections', 'At least one section'),
    complete: selectedDetails.value.sections > 0,
  },
  {
    key: 'questions',
    label: safeText('formsModuleDashboard.buildWorkspace.checks.questions', 'Assessment questions'),
    complete: selectedDetails.value.questions > 0,
  },
  {
    key: 'scoring',
    label: safeText('formsModuleDashboard.buildWorkspace.checks.scoring', 'Scoring and risk rules'),
    complete: selectedDetails.value.scoringRules > 0 || selectedDetails.value.riskLevels > 0,
  },
  {
    key: 'print',
    label: safeText('formsModuleDashboard.buildWorkspace.checks.print', 'Print layout'),
    complete: selectedDetails.value.printTemplates > 0,
  },
])

const readiness = computed(() => {
  if (!selectedForm.value) return 0
  const complete = readinessChecks.value.filter((check) => check.complete).length
  return Math.round((complete / readinessChecks.value.length) * 100)
})

const summaryCards = computed(() => [
  {
    key: 'total',
    icon: 'pi pi-file',
    value: statusCounts.value.total,
    label: safeText('formsModuleDashboard.buildWorkspace.totalTemplates', 'Templates'),
  },
  {
    key: 'draft',
    icon: 'pi pi-pencil',
    value: statusCounts.value.draft,
    label: safeText('formsModuleDashboard.buildWorkspace.drafts', 'Drafts in progress'),
  },
  {
    key: 'published',
    icon: 'pi pi-check-circle',
    value: statusCounts.value.published,
    label: safeText('formsModuleDashboard.buildWorkspace.published', 'Published'),
  },
  {
    key: 'readiness',
    icon: 'pi pi-chart-pie',
    value: selectedForm.value ? `${readiness.value}%` : '—',
    label: safeText('formsModuleDashboard.buildWorkspace.readiness', 'Selected readiness'),
  },
])

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
    label: safeText('formsModuleDashboard.buildWorkspace.openCatalog', 'Open catalog'),
    action: () => router.push({ name: 'assessment-form-list' }),
    icon: 'pi pi-folder-open',
  },
])

function createEmptyDetails() {
  return {
    sections: 0,
    questions: 0,
    scoringRules: 0,
    riskLevels: 0,
    printTemplates: 0,
  }
}

function formatDate(value) {
  if (!value) return safeText('common.notAvailable', 'Not available')
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
}

function openSelected(routeName) {
  if (!selectedForm.value) return
  router.push({ name: routeName, params: { id: selectedForm.value.id } })
}

async function loadSelectedDetails(id) {
  if (!id) {
    selectedDetails.value = createEmptyDetails()
    return
  }

  detailsLoading.value = true
  const [sectionsResult, questionsResult, scoringResult, printResult] = await Promise.allSettled([
    assessmentFormApi.listSections(id),
    assessmentFormApi.listQuestions(id),
    assessmentFormApi.getScoring(id),
    assessmentPrintApi.list({ form_template_id: id, per_page: 100 }),
  ])

  const scoring = scoringResult.status === 'fulfilled'
    ? scoringResult.value.data?.data ?? {}
    : {}

  selectedDetails.value = {
    sections: sectionsResult.status === 'fulfilled'
      ? (sectionsResult.value.data?.data ?? []).length
      : 0,
    questions: questionsResult.status === 'fulfilled'
      ? (questionsResult.value.data?.data ?? []).length
      : 0,
    scoringRules: (scoring.scoring_rules ?? []).length,
    riskLevels: (scoring.risk_levels ?? []).length,
    printTemplates: printResult.status === 'fulfilled'
      ? (printResult.value.data?.data ?? []).length
      : 0,
  }

  if ([sectionsResult, questionsResult, scoringResult, printResult].some((result) => result.status === 'rejected')) {
    loadWarning.value = true
  }

  detailsLoading.value = false
}

async function loadWorkspace() {
  loading.value = true
  loadWarning.value = false

  try {
    const response = await assessmentFormApi.list({ module: 'preschool', per_page: 100 })
    forms.value = response.data?.data ?? []
    selectedFormId.value = drafts.value[0]?.id ?? forms.value[0]?.id ?? null
  } catch {
    forms.value = []
    loadWarning.value = true
  } finally {
    loading.value = false
  }
}

watch(selectedFormId, (id) => loadSelectedDetails(id))
onMounted(loadWorkspace)
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
        grid-class="preschool-form-management-section__grid--three"
        card-class="preschool-form-management-card__surface--build"
        :cards="build"
      />

      <div v-if="loadWarning" class="build-workspace__warning" role="status">
        <i class="pi pi-exclamation-circle" aria-hidden="true" />
        {{ safeText('formsModuleDashboard.buildWorkspace.partialData', 'Some readiness data could not be loaded. Available builder actions remain usable.') }}
      </div>

      <section class="build-workspace__summary" :aria-busy="loading">
        <article v-for="item in summaryCards" :key="item.key" class="build-workspace__metric">
          <span class="build-workspace__metric-icon"><i :class="item.icon" aria-hidden="true" /></span>
          <div>
            <strong>{{ loading ? '—' : item.value }}</strong>
            <span>{{ item.label }}</span>
          </div>
        </article>
      </section>

      <section class="build-workspace__context">
        <div class="build-workspace__context-copy">
          <span>{{ safeText('formsModuleDashboard.workspaces.build', 'Build workspace') }}</span>
          <h3>{{ safeText('formsModuleDashboard.buildWorkspace.activeTemplate', 'Active template') }}</h3>
          <p>{{ safeText('formsModuleDashboard.buildWorkspace.activeTemplateHelp', 'Select one template before editing structure, scoring, or print settings.') }}</p>
        </div>

        <label class="build-workspace__selector">
          <span>{{ safeText('formsModuleDashboard.buildWorkspace.selectTemplate', 'Select template') }}</span>
          <select v-model="selectedFormId" :disabled="loading || !forms.length">
            <option :value="null" disabled>
              {{ safeText('formsModuleDashboard.buildWorkspace.selectPlaceholder', 'Choose a template') }}
            </option>
            <option v-for="form in forms" :key="form.id" :value="form.id">
              {{ form.name }} · {{ safeText(`formBuilder.statuses.${form.status}`, form.status) }}
            </option>
          </select>
        </label>
      </section>

      <div class="build-workspace__main">
        <section class="build-workspace__panel">
          <header class="build-workspace__panel-header">
            <div>
              <span>{{ safeText('formsModuleDashboard.buildWorkspace.configuration', 'Configuration') }}</span>
              <h3>{{ selectedForm?.name || safeText('formsModuleDashboard.buildWorkspace.noSelection', 'No template selected') }}</h3>
            </div>
            <span v-if="selectedForm" :class="['build-workspace__status', `build-workspace__status--${selectedForm.status}`]">
              {{ safeText(`formBuilder.statuses.${selectedForm.status}`, selectedForm.status) }}
            </span>
          </header>

          <div v-if="!selectedForm" class="build-workspace__empty">
            {{ safeText('formsModuleDashboard.buildWorkspace.emptyCatalog', 'Create a template to begin building an assessment.') }}
          </div>

          <template v-else>
            <div class="build-workspace__template-meta">
              <span>
                {{ safeText('formBuilder.version', 'Version') }}
                <strong>{{ selectedForm.current_version ?? 1 }}</strong>
              </span>
              <span>
                {{ safeText('formsModuleDashboard.buildWorkspace.updated', 'Updated') }}
                <strong>{{ formatDate(selectedForm.updated_at) }}</strong>
              </span>
            </div>

            <div class="build-workspace__tool-grid">
              <button type="button" @click="openSelected('assessment-form-edit')">
                <i class="pi pi-pencil" aria-hidden="true" />
                <span>
                  <strong>{{ safeText('formsModuleDashboard.buildWorkspace.editStructure', 'Edit form structure') }}</strong>
                  <small>{{ selectedDetails.sections }} {{ safeText('formsModuleDashboard.buildWorkspace.sections', 'sections') }} · {{ selectedDetails.questions }} {{ safeText('formsModuleDashboard.buildWorkspace.questions', 'questions') }}</small>
                </span>
                <i class="pi pi-arrow-right" aria-hidden="true" />
              </button>

              <button type="button" @click="openSelected('assessment-scoring')">
                <i class="pi pi-sliders-h" aria-hidden="true" />
                <span>
                  <strong>{{ safeText('formsModuleDashboard.buildWorkspace.configureScoring', 'Configure scoring') }}</strong>
                  <small>{{ selectedDetails.scoringRules }} {{ safeText('formsModuleDashboard.buildWorkspace.rules', 'rules') }} · {{ selectedDetails.riskLevels }} {{ safeText('formsModuleDashboard.buildWorkspace.riskLevels', 'risk levels') }}</small>
                </span>
                <i class="pi pi-arrow-right" aria-hidden="true" />
              </button>

              <button type="button" @click="openSelected('assessment-print-designer')">
                <i class="pi pi-print" aria-hidden="true" />
                <span>
                  <strong>{{ safeText('formsModuleDashboard.buildWorkspace.designPrint', 'Design print layout') }}</strong>
                  <small>{{ selectedDetails.printTemplates }} {{ safeText('formsModuleDashboard.buildWorkspace.layouts', 'layouts') }}</small>
                </span>
                <i class="pi pi-arrow-right" aria-hidden="true" />
              </button>
            </div>
          </template>
        </section>

        <section class="build-workspace__panel">
          <header class="build-workspace__panel-header">
            <div>
              <span>{{ safeText('formsModuleDashboard.buildWorkspace.quality', 'Quality check') }}</span>
              <h3>{{ safeText('formsModuleDashboard.buildWorkspace.readinessChecklist', 'Readiness checklist') }}</h3>
            </div>
            <strong class="build-workspace__readiness">{{ detailsLoading ? '—' : `${readiness}%` }}</strong>
          </header>

          <div class="build-workspace__progress" aria-hidden="true">
            <span :style="{ width: `${readiness}%` }" />
          </div>

          <div v-if="!selectedForm" class="build-workspace__empty">
            {{ safeText('formsModuleDashboard.buildWorkspace.selectForReadiness', 'Select a template to inspect readiness.') }}
          </div>
          <div v-else class="build-workspace__checklist">
            <div v-for="check in readinessChecks" :key="check.key" :class="{ 'is-complete': check.complete }">
              <i :class="check.complete ? 'pi pi-check-circle' : 'pi pi-circle'" aria-hidden="true" />
              <span>{{ check.label }}</span>
            </div>
          </div>
        </section>
      </div>

      <section class="build-workspace__panel">
        <header class="build-workspace__panel-header">
          <div>
            <span>{{ safeText('formsModuleDashboard.buildWorkspace.continueBuilding', 'Continue building') }}</span>
            <h3>{{ safeText('formsModuleDashboard.buildWorkspace.recentDrafts', 'Recent drafts') }}</h3>
          </div>
          <button class="build-workspace__header-action" type="button" @click="router.push({ name: 'assessment-form-create' })">
            <i class="pi pi-plus" aria-hidden="true" />
            {{ safeText('formBuilder.newForm', 'New form') }}
          </button>
        </header>

        <div v-if="loading" class="build-workspace__empty">
          {{ safeText('common.loading', 'Loading...') }}
        </div>
        <div v-else-if="!drafts.length" class="build-workspace__empty">
          {{ safeText('formsModuleDashboard.buildWorkspace.noDrafts', 'No draft templates are waiting for updates.') }}
        </div>
        <button
          v-for="form in drafts"
          v-else
          :key="form.id"
          type="button"
          class="build-workspace__draft"
          @click="router.push({ name: 'assessment-form-edit', params: { id: form.id } })"
        >
          <span class="build-workspace__draft-icon"><i class="pi pi-file-edit" aria-hidden="true" /></span>
          <span>
            <strong>{{ form.name }}</strong>
            <small>{{ safeText('formsModuleDashboard.buildWorkspace.updated', 'Updated') }} {{ formatDate(form.updated_at) }}</small>
          </span>
          <span>{{ safeText('formsModuleDashboard.buildWorkspace.continue', 'Continue') }}</span>
          <i class="pi pi-arrow-right" aria-hidden="true" />
        </button>
      </section>
    </section>
  </MainLayout>
</template>

<style scoped>
.preschool-form-management-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.build-workspace__warning {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1rem;
  border: 1px solid #fde68a;
  border-radius: 0.9rem;
  background: #fffbeb;
  color: #92400e;
  font-size: 0.85rem;
}

.build-workspace__summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
}

.build-workspace__metric {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 1.15rem;
  background: #fff;
  box-shadow: 0 16px 36px -30px rgba(15, 23, 42, 0.4);
}

.build-workspace__metric-icon,
.build-workspace__draft-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  border-radius: 0.8rem;
  background: #ecfdf5;
  color: #047857;
}

.build-workspace__metric-icon {
  width: 2.6rem;
  height: 2.6rem;
}

.build-workspace__metric div {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.build-workspace__metric strong {
  color: #0f172a;
  font-size: 1.35rem;
  line-height: 1;
}

.build-workspace__metric span:last-child {
  margin-top: 0.3rem;
  color: #64748b;
  font-size: 0.78rem;
}

.build-workspace__context {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.15rem;
  border: 1px solid #a7f3d0;
  border-radius: 1.2rem;
  background: linear-gradient(135deg, #ecfdf5 0%, #fff 65%);
}

.build-workspace__context-copy > span,
.build-workspace__panel-header > div > span {
  color: #047857;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.build-workspace__context h3,
.build-workspace__panel-header h3 {
  margin: 0.15rem 0 0;
  color: #0f172a;
  font-size: 1rem;
}

.build-workspace__context p {
  margin: 0.35rem 0 0;
  color: #64748b;
  font-size: 0.8rem;
}

.build-workspace__selector {
  display: grid;
  min-width: min(100%, 22rem);
  gap: 0.35rem;
}

.build-workspace__selector span {
  color: #475569;
  font-size: 0.72rem;
  font-weight: 700;
}

.build-workspace__selector select {
  width: 100%;
  min-height: 2.65rem;
  padding: 0 2.5rem 0 0.8rem;
  border: 1px solid #a7f3d0;
  border-radius: 0.8rem;
  background: #fff;
  color: #1e293b;
}

.build-workspace__main {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(18rem, 0.6fr);
  gap: 1rem;
}

.build-workspace__panel {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 1.25rem;
  background: #fff;
  box-shadow: 0 20px 45px -36px rgba(15, 23, 42, 0.4);
}

.build-workspace__panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.1rem;
  border-bottom: 1px solid #f1f5f9;
}

.build-workspace__status {
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  background: #f1f5f9;
  color: #475569;
  font-size: 0.66rem;
  font-weight: 800;
  text-transform: capitalize;
}

.build-workspace__status--draft {
  background: #fef3c7;
  color: #92400e;
}

.build-workspace__status--published {
  background: #dcfce7;
  color: #15803d;
}

.build-workspace__template-meta {
  display: flex;
  gap: 1.5rem;
  padding: 0.75rem 1.1rem;
  background: #f8fafc;
  color: #64748b;
  font-size: 0.72rem;
}

.build-workspace__template-meta strong {
  margin-left: 0.25rem;
  color: #334155;
}

.build-workspace__tool-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  padding: 1rem;
}

.build-workspace__tool-grid button {
  display: grid;
  min-height: 8.5rem;
  grid-template-columns: auto 1fr auto;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.9rem;
  border: 1px solid #d1fae5;
  border-radius: 1rem;
  background: #fff;
  color: #047857;
  cursor: pointer;
  text-align: left;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.build-workspace__tool-grid button:hover,
.build-workspace__tool-grid button:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 16px 30px -24px rgba(4, 120, 87, 0.6);
}

.build-workspace__tool-grid button span {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.35rem;
}

.build-workspace__tool-grid strong {
  color: #0f172a;
  font-size: 0.82rem;
}

.build-workspace__tool-grid small {
  color: #94a3b8;
  font-size: 0.7rem;
  line-height: 1.4;
}

.build-workspace__readiness {
  color: #047857;
  font-size: 1.25rem;
}

.build-workspace__progress {
  height: 0.35rem;
  background: #f1f5f9;
}

.build-workspace__progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #34d399, #059669);
  transition: width 0.2s ease;
}

.build-workspace__checklist {
  display: grid;
  gap: 0.75rem;
  padding: 1rem 1.1rem;
}

.build-workspace__checklist div {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #94a3b8;
  font-size: 0.8rem;
}

.build-workspace__checklist .is-complete {
  color: #047857;
}

.build-workspace__header-action {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 0.75rem;
  border: 1px solid #a7f3d0;
  border-radius: 0.75rem;
  background: #ecfdf5;
  color: #047857;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 800;
}

.build-workspace__draft {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.1rem;
  border: 0;
  border-bottom: 1px solid #f1f5f9;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.build-workspace__draft:hover,
.build-workspace__draft:focus-visible {
  background: #f8fafc;
}

.build-workspace__draft-icon {
  width: 2.2rem;
  height: 2.2rem;
}

.build-workspace__draft > span:nth-child(2) {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 0.15rem;
}

.build-workspace__draft strong {
  overflow: hidden;
  color: #1e293b;
  font-size: 0.84rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.build-workspace__draft small {
  color: #94a3b8;
  font-size: 0.72rem;
}

.build-workspace__draft > span:nth-child(3) {
  color: #047857;
  font-size: 0.72rem;
  font-weight: 800;
}

.build-workspace__draft > i {
  color: #cbd5e1;
  font-size: 0.72rem;
}

.build-workspace__empty {
  padding: 2rem 1.1rem;
  color: #94a3b8;
  font-size: 0.84rem;
  text-align: center;
}

@media (max-width: 1050px) {
  .build-workspace__summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .build-workspace__main {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .build-workspace__context {
    align-items: stretch;
    flex-direction: column;
  }

  .build-workspace__tool-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .build-workspace__summary {
    grid-template-columns: 1fr;
  }

  .build-workspace__draft > span:nth-child(3) {
    display: none;
  }
}
</style>

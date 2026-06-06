<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'
import FormManagementHero from '@/modules/preschool/admin/components/form-management/FormManagementHero.vue'
import FormManagementSection from '@/modules/preschool/admin/components/form-management/FormManagementSection.vue'
import { assessmentFormApi } from '@/modules/assessment/services/assessmentFormApi'
import { assessmentReportApi } from '@/modules/assessment/services/assessmentReportApi'
import { groupFormManagementActionCards } from './formManagementData'

defineOptions({
  name: 'PreschoolAdminFormManagementManagePage',
})

const { t, te } = useLanguage()
const router = useRouter()
const { manage } = groupFormManagementActionCards()
const forms = ref([])
const auditLogs = ref([])
const loading = ref(true)
const loadWarning = ref(false)

function safeText(key, fallback) {
  return te(key) ? t(key) : fallback
}

const heroSummary = computed(() =>
  safeText(
    'preschoolScaffold.formManagement.pages.manage.description',
    'Open the form catalog and review related records.',
  ),
)

const statusCounts = computed(() => {
  const counts = { all: forms.value.length, draft: 0, published: 0, archived: 0 }

  forms.value.forEach((form) => {
    if (Object.hasOwn(counts, form.status)) counts[form.status] += 1
  })

  return counts
})

const summaryCards = computed(() => [
  {
    key: 'all',
    icon: 'pi pi-folder-open',
    value: statusCounts.value.all,
    label: safeText('formsModuleDashboard.manageWorkspace.totalTemplates', 'Total templates'),
  },
  {
    key: 'draft',
    icon: 'pi pi-pencil',
    value: statusCounts.value.draft,
    label: safeText('formsModuleDashboard.manageWorkspace.drafts', 'Drafts'),
  },
  {
    key: 'published',
    icon: 'pi pi-check-circle',
    value: statusCounts.value.published,
    label: safeText('formsModuleDashboard.manageWorkspace.published', 'Published'),
  },
  {
    key: 'archived',
    icon: 'pi pi-inbox',
    value: statusCounts.value.archived,
    label: safeText('formsModuleDashboard.manageWorkspace.archived', 'Archived'),
  },
])

const recentForms = computed(() => forms.value.slice(0, 5))
const recentLogs = computed(() => auditLogs.value.slice(0, 5))

const quickLinks = computed(() => [
  {
    label: safeText('breadcrumb.forms', 'Forms'),
    action: () => router.push({ name: 'dashboard-preschool-admin-forms' }),
    icon: 'pi pi-arrow-left',
  },
  {
    label: safeText('formsModuleDashboard.manageWorkspace.openCatalog', 'Open catalog'),
    action: () => router.push({ name: 'assessment-form-list' }),
    icon: 'pi pi-folder-open',
  },
  {
    label: safeText('formBuilder.newForm', 'New form'),
    action: () => router.push({ name: 'assessment-form-create' }),
    icon: 'pi pi-plus',
  },
])

function formatDate(value) {
  if (!value) return safeText('common.notAvailable', 'Not available')

  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
}

function openForm(form) {
  router.push({ name: 'assessment-form-edit', params: { id: form.id } })
}

async function loadWorkspace() {
  loading.value = true
  loadWarning.value = false

  const [formsResult, logsResult] = await Promise.allSettled([
    assessmentFormApi.list({ module: 'preschool', per_page: 100 }),
    assessmentReportApi.auditLogs({ per_page: 5 }),
  ])

  if (formsResult.status === 'fulfilled') {
    forms.value = formsResult.value.data?.data ?? []
  } else {
    loadWarning.value = true
  }

  if (logsResult.status === 'fulfilled') {
    auditLogs.value = logsResult.value.data?.data ?? []
  } else {
    loadWarning.value = true
  }

  loading.value = false
}

onMounted(loadWorkspace)
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
        grid-class="preschool-form-management-section__grid--three"
        card-class="preschool-form-management-card__surface--manage"
        :cards="manage"
      />

      <div v-if="loadWarning" class="manage-workspace__warning" role="status">
        <i class="pi pi-exclamation-circle" aria-hidden="true" />
        {{ safeText('formsModuleDashboard.manageWorkspace.partialData', 'Some workspace data could not be loaded. Navigation remains available.') }}
      </div>

      <section class="manage-workspace__summary" :aria-busy="loading">
        <article v-for="item in summaryCards" :key="item.key" class="manage-workspace__metric">
          <span class="manage-workspace__metric-icon">
            <i :class="item.icon" aria-hidden="true" />
          </span>
          <div>
            <strong>{{ loading ? '—' : item.value }}</strong>
            <span>{{ item.label }}</span>
          </div>
        </article>
      </section>

      <div class="manage-workspace__panels">
        <section class="manage-workspace__panel">
          <header class="manage-workspace__panel-header">
            <div>
              <span>{{ safeText('formsModuleDashboard.workspaces.manage', 'Manage workspace') }}</span>
              <h3>{{ safeText('formsModuleDashboard.manageWorkspace.recentTemplates', 'Recent templates') }}</h3>
            </div>
            <button type="button" @click="router.push({ name: 'assessment-form-list' })">
              {{ safeText('formsModuleDashboard.manageWorkspace.viewAll', 'View all') }}
              <i class="pi pi-arrow-right" aria-hidden="true" />
            </button>
          </header>

          <div v-if="loading" class="manage-workspace__empty">
            {{ safeText('common.loading', 'Loading...') }}
          </div>
          <div v-else-if="!recentForms.length" class="manage-workspace__empty">
            {{ safeText('formsModuleDashboard.manageWorkspace.noTemplates', 'No assessment templates have been created yet.') }}
          </div>
          <button
            v-for="form in recentForms"
            v-else
            :key="form.id"
            type="button"
            class="manage-workspace__row"
            @click="openForm(form)"
          >
            <span class="manage-workspace__row-icon"><i class="pi pi-file" aria-hidden="true" /></span>
            <span class="manage-workspace__row-copy">
              <strong>{{ form.name }}</strong>
              <small>{{ safeText('formBuilder.version', 'Version') }} {{ form.current_version ?? 1 }}</small>
            </span>
            <span :class="['manage-workspace__status', `manage-workspace__status--${form.status}`]">
              {{ safeText(`formBuilder.statuses.${form.status}`, form.status) }}
            </span>
            <i class="pi pi-chevron-right manage-workspace__row-arrow" aria-hidden="true" />
          </button>
        </section>

        <section class="manage-workspace__panel">
          <header class="manage-workspace__panel-header">
            <div>
              <span>{{ safeText('formsModuleDashboard.sections.manage.label', 'Manage & Organize') }}</span>
              <h3>{{ safeText('formsModuleDashboard.manageWorkspace.recentActivity', 'Recent activity') }}</h3>
            </div>
            <button type="button" @click="router.push({ name: 'assessment-audit-logs' })">
              {{ safeText('formsModuleDashboard.manageWorkspace.viewLogs', 'View logs') }}
              <i class="pi pi-arrow-right" aria-hidden="true" />
            </button>
          </header>

          <div v-if="loading" class="manage-workspace__empty">
            {{ safeText('common.loading', 'Loading...') }}
          </div>
          <div v-else-if="!recentLogs.length" class="manage-workspace__empty">
            {{ safeText('formsModuleDashboard.manageWorkspace.noActivity', 'No recent form activity was found.') }}
          </div>
          <div v-for="log in recentLogs" v-else :key="log.id" class="manage-workspace__activity">
            <span class="manage-workspace__activity-icon"><i class="pi pi-history" aria-hidden="true" /></span>
            <span class="manage-workspace__row-copy">
              <strong>{{ log.description || log.event }}</strong>
              <small>{{ log.actor?.name || safeText('formsModuleDashboard.manageWorkspace.systemActor', 'System') }} · {{ formatDate(log.created_at) }}</small>
            </span>
          </div>
        </section>
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

.manage-workspace__warning {
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

.manage-workspace__summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
}

.manage-workspace__metric {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 1.15rem;
  background: #fff;
  box-shadow: 0 16px 36px -30px rgba(15, 23, 42, 0.4);
}

.manage-workspace__metric-icon,
.manage-workspace__row-icon,
.manage-workspace__activity-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  border-radius: 0.8rem;
  background: #eff6ff;
  color: #2563eb;
}

.manage-workspace__metric-icon {
  width: 2.6rem;
  height: 2.6rem;
}

.manage-workspace__metric div {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.manage-workspace__metric strong {
  color: #0f172a;
  font-size: 1.35rem;
  line-height: 1;
}

.manage-workspace__metric span:last-child {
  margin-top: 0.3rem;
  color: #64748b;
  font-size: 0.78rem;
}

.manage-workspace__panels {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.manage-workspace__panel {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 1.25rem;
  background: #fff;
  box-shadow: 0 20px 45px -36px rgba(15, 23, 42, 0.4);
}

.manage-workspace__panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.1rem;
  border-bottom: 1px solid #f1f5f9;
}

.manage-workspace__panel-header span {
  color: #2563eb;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.manage-workspace__panel-header h3 {
  margin: 0.15rem 0 0;
  color: #0f172a;
  font-size: 1rem;
}

.manage-workspace__panel-header button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: 0;
  background: transparent;
  color: #2563eb;
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 700;
}

.manage-workspace__row,
.manage-workspace__activity {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.1rem;
  border: 0;
  border-bottom: 1px solid #f1f5f9;
  background: transparent;
  text-align: left;
}

.manage-workspace__row {
  cursor: pointer;
  transition: background 0.15s ease;
}

.manage-workspace__row:hover,
.manage-workspace__row:focus-visible {
  background: #f8fafc;
}

.manage-workspace__row-icon,
.manage-workspace__activity-icon {
  width: 2.2rem;
  height: 2.2rem;
}

.manage-workspace__row-copy {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 0.15rem;
}

.manage-workspace__row-copy strong {
  overflow: hidden;
  color: #1e293b;
  font-size: 0.84rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.manage-workspace__row-copy small {
  color: #94a3b8;
  font-size: 0.72rem;
}

.manage-workspace__status {
  padding: 0.28rem 0.55rem;
  border-radius: 999px;
  background: #f1f5f9;
  color: #475569;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: capitalize;
}

.manage-workspace__status--published {
  background: #dcfce7;
  color: #15803d;
}

.manage-workspace__status--draft {
  background: #fef3c7;
  color: #92400e;
}

.manage-workspace__row-arrow {
  color: #cbd5e1;
  font-size: 0.7rem;
}

.manage-workspace__empty {
  padding: 2rem 1.1rem;
  color: #94a3b8;
  font-size: 0.84rem;
  text-align: center;
}

@media (max-width: 900px) {
  .manage-workspace__summary,
  .manage-workspace__panels {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .manage-workspace__panels {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .manage-workspace__summary {
    grid-template-columns: 1fr;
  }

  .manage-workspace__panel-header {
    align-items: flex-start;
  }
}
</style>

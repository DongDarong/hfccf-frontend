<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import Button from '@/components/buttons/Button.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'
import { fetchPreschoolSettingsDashboard } from '@/modules/preschool/services/preschoolApi'
import PreschoolSettingsSectionCard from '@/modules/preschool/shared/components/settings/PreschoolSettingsSectionCard.vue'

defineOptions({
  name: 'PreschoolSettingsDashboardPage',
})

const { t } = useLanguage()
const router = useRouter()

const loading = ref(true)
const errorMessage = ref('')
const dashboard = ref(createEmptyDashboard())

const sectionDefinitions = computed(() => [
  {
    key: 'academic',
    routeName: 'dashboard-preschool-admin-settings-academic',
    eyebrow: t('preschoolSettingsPage.dashboard.sections.academic.eyebrow'),
    title: t('preschoolSettingsPage.dashboard.sections.academic.title'),
    subtitle: t('preschoolSettingsPage.dashboard.sections.academic.subtitle'),
    actionLabel: t('preschoolSettingsPage.dashboard.sections.academic.action'),
    fields: [
      {
        label: t('preschoolSettingsPage.dashboard.fields.activeAcademicYear'),
        value: formatValue(dashboard.value.academic?.activeAcademicYear, t('preschoolSettingsPage.dashboard.emptyStates.academicYear')),
      },
      {
        label: t('preschoolSettingsPage.dashboard.fields.activeTerm'),
        value: formatValue(dashboard.value.academic?.activeTerm, t('preschoolSettingsPage.dashboard.emptyStates.term')),
      },
      {
        label: t('preschoolSettingsPage.dashboard.fields.academicStatus'),
        value: formatValue(dashboard.value.academic?.academicStatus, t('preschoolSettingsPage.dashboard.emptyStates.academicStatus')),
      },
    ],
    status: dashboard.value.academic?.isConfigured
      ? t('preschoolSettingsPage.dashboard.statuses.configured')
      : t('preschoolSettingsPage.dashboard.statuses.notConfigured'),
    configured: Boolean(dashboard.value.academic?.isConfigured),
  },
  {
    key: 'attendance',
    routeName: 'dashboard-preschool-admin-settings-attendance',
    eyebrow: t('preschoolSettingsPage.dashboard.sections.attendance.eyebrow'),
    title: t('preschoolSettingsPage.dashboard.sections.attendance.title'),
    subtitle: t('preschoolSettingsPage.dashboard.sections.attendance.subtitle'),
    actionLabel: t('preschoolSettingsPage.dashboard.sections.attendance.action'),
    fields: [
      {
        label: t('preschoolSettingsPage.dashboard.fields.currentAttendanceRules'),
        value: formatValue(dashboard.value.attendance?.currentAttendanceRules, t('preschoolSettingsPage.dashboard.emptyStates.attendanceRules')),
      },
      {
        label: t('preschoolSettingsPage.dashboard.fields.lastUpdated'),
        value: formatValue(dashboard.value.attendance?.lastUpdated, t('preschoolSettingsPage.dashboard.emptyStates.lastUpdated')),
      },
    ],
    status: dashboard.value.attendance?.isConfigured
      ? t('preschoolSettingsPage.dashboard.statuses.configured')
      : t('preschoolSettingsPage.dashboard.statuses.notConfigured'),
    configured: Boolean(dashboard.value.attendance?.isConfigured),
  },
  {
    key: 'payments',
    routeName: 'dashboard-preschool-admin-settings-payments',
    eyebrow: t('preschoolSettingsPage.dashboard.sections.payments.eyebrow'),
    title: t('preschoolSettingsPage.dashboard.sections.payments.title'),
    subtitle: t('preschoolSettingsPage.dashboard.sections.payments.subtitle'),
    actionLabel: t('preschoolSettingsPage.dashboard.sections.payments.action'),
    fields: [
      {
        label: t('preschoolSettingsPage.dashboard.fields.currency'),
        value: formatValue(dashboard.value.payments?.currency, t('preschoolSettingsPage.dashboard.emptyStates.currency')),
      },
      {
        label: t('preschoolSettingsPage.dashboard.fields.invoicePrefix'),
        value: formatValue(dashboard.value.payments?.invoicePrefix, t('preschoolSettingsPage.dashboard.emptyStates.invoicePrefix')),
      },
      {
        label: t('preschoolSettingsPage.dashboard.fields.receiptPrefix'),
        value: formatValue(dashboard.value.payments?.receiptPrefix, t('preschoolSettingsPage.dashboard.emptyStates.receiptPrefix')),
      },
    ],
    status: dashboard.value.payments?.isConfigured
      ? t('preschoolSettingsPage.dashboard.statuses.configured')
      : t('preschoolSettingsPage.dashboard.statuses.notConfigured'),
    configured: Boolean(dashboard.value.payments?.isConfigured),
  },
  {
    key: 'assessments',
    routeName: 'dashboard-preschool-admin-settings-assessments',
    eyebrow: t('preschoolSettingsPage.dashboard.sections.assessments.eyebrow'),
    title: t('preschoolSettingsPage.dashboard.sections.assessments.title'),
    subtitle: t('preschoolSettingsPage.dashboard.sections.assessments.subtitle'),
    actionLabel: t('preschoolSettingsPage.dashboard.sections.assessments.action'),
    fields: [
      {
        label: t('preschoolSettingsPage.dashboard.fields.activeGradingScale'),
        value: formatValue(dashboard.value.assessments?.activeGradingScale, t('preschoolSettingsPage.dashboard.emptyStates.activeGradingScale')),
      },
      {
        label: t('preschoolSettingsPage.dashboard.fields.assessmentCategories'),
        value: formatValue(dashboard.value.assessments?.assessmentCategories, t('preschoolSettingsPage.dashboard.emptyStates.assessmentCategories')),
      },
    ],
    status: dashboard.value.assessments?.isConfigured
      ? t('preschoolSettingsPage.dashboard.statuses.configured')
      : t('preschoolSettingsPage.dashboard.statuses.notConfigured'),
    configured: Boolean(dashboard.value.assessments?.isConfigured),
  },
  {
    key: 'health',
    routeName: 'dashboard-preschool-admin-settings-health',
    eyebrow: t('preschoolSettingsPage.dashboard.sections.health.eyebrow'),
    title: t('preschoolSettingsPage.dashboard.sections.health.title'),
    subtitle: t('preschoolSettingsPage.dashboard.sections.health.subtitle'),
    actionLabel: t('preschoolSettingsPage.dashboard.sections.health.action'),
    fields: [
      {
        label: t('preschoolSettingsPage.dashboard.fields.alertSeverityLevels'),
        value: formatValue(dashboard.value.health?.alertSeverityLevels, t('preschoolSettingsPage.dashboard.emptyStates.alertSeverityLevels')),
      },
      {
        label: t('preschoolSettingsPage.dashboard.fields.healthCategories'),
        value: formatValue(dashboard.value.health?.healthCategories, t('preschoolSettingsPage.dashboard.emptyStates.healthCategories')),
      },
    ],
    status: dashboard.value.health?.isConfigured
      ? t('preschoolSettingsPage.dashboard.statuses.configured')
      : t('preschoolSettingsPage.dashboard.statuses.notConfigured'),
    configured: Boolean(dashboard.value.health?.isConfigured),
  },
  {
    key: 'preferences',
    routeName: 'dashboard-preschool-admin-settings-preferences',
    eyebrow: t('preschoolSettingsPage.dashboard.sections.preferences.eyebrow'),
    title: t('preschoolSettingsPage.dashboard.sections.preferences.title'),
    subtitle: t('preschoolSettingsPage.dashboard.sections.preferences.subtitle'),
    actionLabel: t('preschoolSettingsPage.dashboard.sections.preferences.action'),
    fields: [
      {
        label: t('preschoolSettingsPage.dashboard.fields.organizationName'),
        value: formatValue(dashboard.value.preferences?.organizationName, t('preschoolSettingsPage.dashboard.emptyStates.organizationName')),
      },
      {
        label: t('preschoolSettingsPage.dashboard.fields.language'),
        value: formatValue(dashboard.value.preferences?.language, t('preschoolSettingsPage.dashboard.emptyStates.language')),
      },
      {
        label: t('preschoolSettingsPage.dashboard.fields.brandingStatus'),
        value: formatValue(dashboard.value.preferences?.brandingStatus, t('preschoolSettingsPage.dashboard.emptyStates.brandingStatus')),
      },
    ],
    status: dashboard.value.preferences?.isConfigured
      ? t('preschoolSettingsPage.dashboard.statuses.configured')
      : t('preschoolSettingsPage.dashboard.statuses.notConfigured'),
    configured: Boolean(dashboard.value.preferences?.isConfigured),
  },
])

const isDashboardEmpty = computed(() =>
  sectionDefinitions.value.every((section) => section.configured === false),
)

onMounted(loadDashboard)

function createEmptyDashboard() {
  return {
    academic: {
      activeAcademicYear: '',
      activeTerm: '',
      academicStatus: '',
      isConfigured: false,
    },
    attendance: {
      currentAttendanceRules: '',
      lastUpdated: '',
      isConfigured: false,
    },
    payments: {
      currency: '',
      invoicePrefix: '',
      receiptPrefix: '',
      isConfigured: false,
    },
    assessments: {
      activeGradingScale: '',
      assessmentCategories: [],
      isConfigured: false,
    },
    health: {
      alertSeverityLevels: [],
      healthCategories: [],
      isConfigured: false,
    },
    preferences: {
      organizationName: '',
      language: '',
      brandingStatus: '',
      isConfigured: false,
    },
  }
}

function formatValue(value, emptyLabel) {
  if (Array.isArray(value)) {
    return value.length ? value.join(', ') : emptyLabel
  }

  if (value === null || value === undefined) {
    return emptyLabel
  }

  if (typeof value === 'number') {
    return String(value)
  }

  const text = String(value).trim()
  return text !== '' ? text : emptyLabel
}

async function loadDashboard() {
  loading.value = true
  errorMessage.value = ''

  try {
    dashboard.value = await fetchPreschoolSettingsDashboard()
  } catch (error) {
    dashboard.value = createEmptyDashboard()
    errorMessage.value = error?.message || t('preschoolSettingsPage.dashboard.messages.loadFailed')
  } finally {
    loading.value = false
  }
}

function openSection(routeName) {
  router.push({ name: routeName })
}

function retryLoad() {
  void loadDashboard()
}
</script>

<template>
  <MainLayout>
    <div class="space-y-6">
      <HeaderSection
        :title="t('preschoolSettingsPage.dashboard.pageTitle')"
        :subtitle="t('preschoolSettingsPage.dashboard.pageSubtitle')"
      />

      <div
        v-if="loading"
        class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        data-testid="settings-dashboard-loading"
      >
        <div
          v-for="index in 6"
          :key="index"
          class="rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div class="h-3 w-32 animate-pulse rounded-full bg-slate-100" />
          <div class="mt-4 h-6 w-48 animate-pulse rounded-full bg-slate-100" />
          <div class="mt-3 h-4 w-72 max-w-full animate-pulse rounded-full bg-slate-100" />
          <div class="mt-6 space-y-3">
            <div class="h-4 w-full animate-pulse rounded-full bg-slate-100" />
            <div class="h-4 w-11/12 animate-pulse rounded-full bg-slate-100" />
            <div class="h-4 w-5/6 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>
      </div>

      <div
        v-else
        class="space-y-6"
      >
        <div
          v-if="errorMessage"
          class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
          data-testid="settings-dashboard-error"
        >
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p>{{ errorMessage }}</p>
            <Button
              variant="outline"
              size="sm"
              :label="t('common.states.retry')"
              @click="retryLoad"
            />
          </div>
        </div>

        <div
          v-if="isDashboardEmpty"
          class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800"
          data-testid="settings-dashboard-empty"
        >
          {{ t('preschoolSettingsPage.dashboard.emptyDashboard') }}
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <PreschoolSettingsSectionCard
            v-for="section in sectionDefinitions"
            :key="section.key"
            :eyebrow="section.eyebrow"
            :title="section.title"
            :subtitle="section.subtitle"
          >
            <div class="flex items-start justify-between gap-3">
              <span
                :class="[
                  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                  section.configured ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600',
                ]"
              >
                {{ section.status }}
              </span>
            </div>

            <dl class="mt-4 space-y-4">
              <div
                v-for="field in section.fields"
                :key="field.label"
                class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <dt class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {{ field.label }}
                </dt>
                <dd class="mt-1 text-sm font-semibold text-slate-900">
                  {{ field.value }}
                </dd>
              </div>
            </dl>

            <div class="mt-5 flex items-center justify-end">
              <Button
                variant="outline"
                size="sm"
                :label="section.actionLabel"
                @click="openSection(section.routeName)"
              />
            </div>
          </PreschoolSettingsSectionCard>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

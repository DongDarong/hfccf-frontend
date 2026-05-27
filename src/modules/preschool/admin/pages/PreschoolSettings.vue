<script setup>
import { computed, onMounted, ref } from 'vue'
import Button from '@/components/buttons/Button.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useLanguage } from '@/composables/useLanguage'
import {
  createDefaultClassConfiguration,
  createEmptyTermDraft,
  usePreschoolSettings,
  validatePreschoolTermDraft,
} from '@/modules/preschool/composables/usePreschoolSettings'
import PreschoolAssessmentConfiguration from '@/modules/preschool/shared/components/settings/PreschoolAssessmentConfiguration.vue'
import PreschoolAcademicYearSettings from '@/modules/preschool/shared/components/settings/PreschoolAcademicYearSettings.vue'
import PreschoolAttendanceConfiguration from '@/modules/preschool/shared/components/settings/PreschoolAttendanceConfiguration.vue'
import PreschoolClassConfiguration from '@/modules/preschool/shared/components/settings/PreschoolClassConfiguration.vue'
import PreschoolEnrollmentConfiguration from '@/modules/preschool/shared/components/settings/PreschoolEnrollmentConfiguration.vue'
import PreschoolPaymentConfiguration from '@/modules/preschool/shared/components/settings/PreschoolPaymentConfiguration.vue'
import PreschoolScheduleConfiguration from '@/modules/preschool/shared/components/settings/PreschoolScheduleConfiguration.vue'
import PreschoolSettingsSectionCard from '@/modules/preschool/shared/components/settings/PreschoolSettingsSectionCard.vue'
import PreschoolTermSetup from '@/modules/preschool/shared/components/settings/PreschoolTermSetup.vue'

// Parent owns the full settings snapshot so the reusable section components can
// stay presentation-focused and preserve a single validation source of truth.
// This page is the admin-only academic backbone for Preschool reporting,
// assignments, attendance, schedules, and assessment defaults.
defineOptions({
  name: 'PreschoolSettings',
})

const { t, language } = useLanguage()
const {
  settings,
  validationErrors,
  lastSavedAt,
  issueCount,
  hasValidationIssues,
  loading,
  saving,
  reportPeriods,
  loadSettings,
  loadReportPeriods,
  saveSettings,
  resetSettings,
  addTerm,
  updateTerm,
  removeTerm,
  addClassConfiguration,
  updateClassConfiguration,
  removeClassConfiguration,
} = usePreschoolSettings()

const termDialogVisible = ref(false)
const termDialogMode = ref('create')
const termDraft = ref(createEmptyTermDraft())
const termDraftErrors = ref({})
const editingTermIndex = ref(-1)

const statusOptions = computed(() => [
  { label: t('preschoolSettingsPage.statusOptions.active'), value: 'active' },
  { label: t('preschoolSettingsPage.statusOptions.inactive'), value: 'inactive' },
])

const classLevelOptions = computed(() => [
  { label: t('preschoolSettingsPage.classLevels.nursery'), value: 'nursery' },
  { label: t('preschoolSettingsPage.classLevels.kindergarten1'), value: 'kindergarten-1' },
  { label: t('preschoolSettingsPage.classLevels.kindergarten2'), value: 'kindergarten-2' },
  { label: t('preschoolSettingsPage.classLevels.prep'), value: 'prep' },
])

const teacherOptions = computed(() => [
  { label: t('preschoolSettingsPage.teacherOptions.leadTeacher'), value: 'lead-teacher' },
  { label: t('preschoolSettingsPage.teacherOptions.assistantTeacher'), value: 'assistant-teacher' },
  { label: t('preschoolSettingsPage.teacherOptions.floatingTeacher'), value: 'floating-teacher' },
])

const absenceRuleOptions = computed(() => [
  { label: t('preschoolSettingsPage.absenceRules.windowAndThreshold'), value: 'window-and-threshold' },
  { label: t('preschoolSettingsPage.absenceRules.strict'), value: 'strict' },
])

const paymentCycleOptions = computed(() => [
  { label: t('preschoolSettingsPage.paymentCycles.monthly'), value: 'monthly' },
  { label: t('preschoolSettingsPage.paymentCycles.term'), value: 'term' },
  { label: t('preschoolSettingsPage.paymentCycles.quarterly'), value: 'quarterly' },
])

const lateFeeRuleOptions = computed(() => [
  { label: t('preschoolSettingsPage.lateFeeRules.fixed'), value: 'fixed' },
  { label: t('preschoolSettingsPage.lateFeeRules.perDay'), value: 'per-day' },
  { label: t('preschoolSettingsPage.lateFeeRules.percentage'), value: 'percentage' },
])

const assessmentCycleOptions = computed(() => [
  { label: t('preschoolSettingsPage.assessmentCycles.term'), value: 'term' },
  { label: t('preschoolSettingsPage.assessmentCycles.semester'), value: 'semester' },
  { label: t('preschoolSettingsPage.assessmentCycles.monthly'), value: 'monthly' },
])

const finalizationModeOptions = computed(() => [
  { label: t('preschoolSettingsPage.finalizationModes.publishOnly'), value: 'publish-only' },
  { label: t('preschoolSettingsPage.finalizationModes.manualReview'), value: 'manual-review' },
  { label: t('preschoolSettingsPage.finalizationModes.draftOnly'), value: 'draft-only' },
])

const weeklyModeOptions = computed(() => [
  { label: t('preschoolSettingsPage.weeklyModes.fiveDay'), value: 'five-day' },
  { label: t('preschoolSettingsPage.weeklyModes.sixDay'), value: 'six-day' },
])

const planningWindowOptions = computed(() => [
  { label: t('preschoolSettingsPage.planningWindows.weekly'), value: 'weekly' },
  { label: t('preschoolSettingsPage.planningWindows.term'), value: 'term' },
  { label: t('preschoolSettingsPage.planningWindows.monthly'), value: 'monthly' },
])

const enrollmentCycleOptions = computed(() => [
  { label: t('preschoolSettingsPage.enrollmentCycles.term'), value: 'term' },
  { label: t('preschoolSettingsPage.enrollmentCycles.yearly'), value: 'yearly' },
  { label: t('preschoolSettingsPage.enrollmentCycles.rolling'), value: 'rolling' },
])

const transferPolicyOptions = computed(() => [
  { label: t('preschoolSettingsPage.transferPolicies.adminOnly'), value: 'admin-only' },
  { label: t('preschoolSettingsPage.transferPolicies.adminPlusTeacher'), value: 'admin-plus-teacher' },
  { label: t('preschoolSettingsPage.transferPolicies.teacherRequest'), value: 'teacher-request' },
])

const capacityReviewOptions = computed(() => [
  { label: t('preschoolSettingsPage.capacityReviewModes.manual'), value: 'manual' },
  { label: t('preschoolSettingsPage.capacityReviewModes.automatic'), value: 'automatic' },
])

const operationalState = computed(() => {
  if (hasValidationIssues.value) {
    return {
      label: t('preschoolSettingsPage.operationalStates.needsAttention'),
      tone: 'warning',
    }
  }

  if (lastSavedAt.value) {
    return {
      label: t('preschoolSettingsPage.operationalStates.saved'),
      tone: 'success',
    }
  }

  return {
    label: t('preschoolSettingsPage.operationalStates.ready'),
    tone: 'info',
  }
})

const lastSavedLabel = computed(() => {
  if (!lastSavedAt.value) {
    return t('preschoolSettingsPage.emptyStates.unsaved')
  }

  return new Intl.DateTimeFormat(language.value === 'KH' ? 'km-KH' : 'en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(lastSavedAt.value)
})

const reportPeriodPreview = computed(() => reportPeriods.value.slice(0, 3))

function formatPreviewDate(value) {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat(language.value === 'KH' ? 'km-KH' : 'en-GB', {
    dateStyle: 'medium',
  }).format(date)
}

function openCreateTerm() {
  termDialogMode.value = 'create'
  termDialogVisible.value = true
  termDraft.value = createEmptyTermDraft()
  termDraftErrors.value = {}
  editingTermIndex.value = -1
}

function openEditTerm(index) {
  const nextTerm = settings.value.terms[index]

  if (!nextTerm) return

  termDialogMode.value = 'edit'
  termDialogVisible.value = true
  editingTermIndex.value = index
  termDraft.value = {
    ...nextTerm,
    startDate: nextTerm.startDate ? new Date(nextTerm.startDate) : null,
    endDate: nextTerm.endDate ? new Date(nextTerm.endDate) : null,
  }
  termDraftErrors.value = {}
}

function closeTermDialog() {
  termDialogVisible.value = false
  termDraftErrors.value = {}
}

function saveTermDraft() {
  const result = validatePreschoolTermDraft(termDraft.value)
  termDraftErrors.value = result.errors

  if (!result.isValid) {
    return
  }

  if (termDialogMode.value === 'edit' && editingTermIndex.value > -1) {
    updateTerm(editingTermIndex.value, termDraft.value)
  } else {
    addTerm(termDraft.value)
  }

  closeTermDialog()
}

function handleReset() {
  resetSettings()
  termDialogVisible.value = false
  termDraftErrors.value = {}
  editingTermIndex.value = -1
}

function addClass() {
  addClassConfiguration(createDefaultClassConfiguration(`class-${settings.value.classConfigurations.length + 1}`))
}

function updateClass(item) {
  updateClassConfiguration(item.index, item.field, item.value)
}

async function handleSave() {
  await saveSettings()
}

onMounted(async () => {
  try {
    await loadSettings()
  } catch {
    // Keep the local draft visible if the backbone endpoint is temporarily
    // unavailable. Preschool admins can still review the fallback config.
  }

  try {
    await loadReportPeriods()
  } catch {
    // Report periods are read-only context, so loading failures should not
    // block the rest of the settings backbone UI.
  }
})
</script>

<template>
  <MainLayout>
    <section class="preschool-settings">
      <HeaderSection
        :title="t('preschoolSettingsPage.pageTitle')"
        :subtitle="t('preschoolSettingsPage.pageSubtitle')"
      />

      <!-- status strip -->
      <div class="preschool-settings__strip">
        <div class="space-y-1">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
            {{ t('preschoolSettingsPage.statusEyebrow') }}
          </p>
          <h2 class="text-base font-semibold text-slate-900">{{ operationalState.label }}</h2>
          <p class="text-sm text-slate-500">{{ t('preschoolSettingsPage.statusDescription') }}</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <span
            class="rounded-full px-3 py-1 text-xs font-semibold"
            :class="{
              'bg-emerald-100 text-emerald-700': operationalState.tone === 'success',
              'bg-amber-100 text-amber-700': operationalState.tone === 'warning',
              'bg-sky-100 text-sky-700': operationalState.tone === 'info',
            }"
          >
            {{ operationalState.label }}
          </span>
          <p class="text-sm text-slate-500">{{ lastSavedLabel }}</p>
        </div>
      </div>

      <!-- summary stat cards -->
      <PreschoolSettingsSectionCard
        :eyebrow="t('preschoolSettingsPage.sections.summary.eyebrow')"
        :title="t('preschoolSettingsPage.sections.summary.title')"
        :subtitle="t('preschoolSettingsPage.sections.summary.subtitle')"
      >
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div class="preschool-settings__stat-card">
            <p class="preschool-settings__stat-label">{{ t('preschoolSettingsPage.summary.academicYear') }}</p>
            <p class="preschool-settings__stat-value">{{ settings.academicYear.currentAcademicYear || '-' }}</p>
          </div>
          <div class="preschool-settings__stat-card">
            <p class="preschool-settings__stat-label">{{ t('preschoolSettingsPage.summary.terms') }}</p>
            <p class="preschool-settings__stat-value">{{ settings.terms.length }}</p>
          </div>
          <div class="preschool-settings__stat-card">
            <p class="preschool-settings__stat-label">{{ t('preschoolSettingsPage.summary.reportPeriods') }}</p>
            <p class="preschool-settings__stat-value">{{ reportPeriods.length }}</p>
          </div>
          <div class="preschool-settings__stat-card">
            <p class="preschool-settings__stat-label">{{ t('preschoolSettingsPage.summary.classes') }}</p>
            <p class="preschool-settings__stat-value">{{ settings.classConfigurations.length }}</p>
          </div>
          <div
            class="preschool-settings__stat-card"
            :class="issueCount > 0 ? 'preschool-settings__stat-card--warn' : ''"
          >
            <p class="preschool-settings__stat-label">{{ t('preschoolSettingsPage.summary.issues') }}</p>
            <p class="preschool-settings__stat-value">{{ issueCount }}</p>
          </div>
        </div>
      </PreschoolSettingsSectionCard>

      <!-- reporting context -->
      <PreschoolSettingsSectionCard
        :eyebrow="t('preschoolSettingsPage.sections.reporting.eyebrow')"
        :title="t('preschoolSettingsPage.sections.reporting.title')"
        :subtitle="t('preschoolSettingsPage.sections.reporting.subtitle')"
      >
        <div class="grid gap-4 md:grid-cols-3">
          <article
            v-for="period in reportPeriodPreview"
            :key="period.label"
            class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <p class="text-sm font-semibold text-slate-900">{{ period.label }}</p>
            <p class="mt-1 text-sm text-slate-600">
              {{ formatPreviewDate(period.fromDate) }} - {{ formatPreviewDate(period.toDate) }}
            </p>
            <p class="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {{ period.assessmentCount }} {{ t('preschoolSettingsPage.reporting.assessments') }}
            </p>
          </article>

          <div v-if="!reportPeriodPreview.length" class="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500 md:col-span-3">
            {{ t('preschoolSettingsPage.emptyStates.reportPeriods') }}
          </div>
        </div>
      </PreschoolSettingsSectionCard>

      <!-- two-column section grid -->
      <div class="grid gap-6 xl:grid-cols-2">
        <PreschoolAcademicYearSettings
          :model-value="settings.academicYear"
          :status-options="statusOptions"
          :errors="validationErrors.academicYear"
          @update:model-value="settings.academicYear = $event"
        />

        <PreschoolTermSetup
          :terms="settings.terms"
          :status-options="statusOptions"
          :dialog-visible="termDialogVisible"
          :dialog-title="termDialogMode === 'edit'
            ? t('preschoolSettingsPage.termDialog.editTitle')
            : t('preschoolSettingsPage.termDialog.createTitle')"
          :dialog-draft="termDraft"
          :dialog-errors="termDraftErrors"
          @open-add="openCreateTerm"
          @open-edit="openEditTerm"
          @remove="removeTerm"
          @cancel="closeTermDialog"
          @save="saveTermDraft"
          @update:dialogDraft="termDraft = $event"
        />

        <PreschoolEnrollmentConfiguration
          :model-value="settings.enrollment"
          :cycle-options="enrollmentCycleOptions"
          :class-level-options="classLevelOptions"
          :transfer-policy-options="transferPolicyOptions"
          :capacity-review-options="capacityReviewOptions"
          :errors="validationErrors.enrollment"
          @update:model-value="settings.enrollment = $event"
        />

        <PreschoolClassConfiguration
          :items="settings.classConfigurations"
          :level-options="classLevelOptions"
          :teacher-options="teacherOptions"
          :status-options="statusOptions"
          :errors="validationErrors.classConfigurations"
          @add="addClass"
          @update:item="updateClass"
          @remove="removeClassConfiguration"
        />

        <PreschoolAttendanceConfiguration
          :model-value="settings.attendance"
          :absence-rule-options="absenceRuleOptions"
          :errors="validationErrors.attendance"
          @update:model-value="settings.attendance = $event"
        />

        <PreschoolAssessmentConfiguration
          :model-value="settings.assessment"
          :cycle-options="assessmentCycleOptions"
          :finalization-options="finalizationModeOptions"
          :errors="validationErrors.assessment"
          @update:model-value="settings.assessment = $event"
        />

        <PreschoolScheduleConfiguration
          :model-value="settings.schedule"
          :weekly-mode-options="weeklyModeOptions"
          :planning-window-options="planningWindowOptions"
          :errors="validationErrors.schedule"
          @update:model-value="settings.schedule = $event"
        />

        <PreschoolPaymentConfiguration
          class="xl:col-span-2"
          :model-value="settings.payment"
          :payment-cycle-options="paymentCycleOptions"
          :late-fee-rule-options="lateFeeRuleOptions"
          :errors="validationErrors.payment"
          @update:model-value="settings.payment = $event"
        />
      </div>

      <!-- save / reset footer -->
      <div class="preschool-settings__footer">
        <div class="space-y-1">
          <p class="text-sm font-semibold text-slate-900">{{ t('preschoolSettingsPage.footer.title') }}</p>
          <p class="text-sm text-slate-500">{{ t('preschoolSettingsPage.footer.subtitle') }}</p>
          <p v-if="hasValidationIssues" class="text-xs font-medium text-rose-600">
            {{ t('preschoolSettingsPage.footer.validationNotice') }}
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <Button variant="ghost" rounded="xl" @click="handleReset">
            {{ t('preschoolSettingsPage.actions.reset') }}
          </Button>
          <Button variant="primary" rounded="xl" :disabled="loading || saving" @click="handleSave">
            {{ t('preschoolSettingsPage.actions.saveChanges') }}
          </Button>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.preschool-settings {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* status strip */
.preschool-settings__strip {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: 1.25rem;
  border: 1px solid #dbe4ef;
  background: linear-gradient(135deg, rgba(240, 249, 255, 0.9), rgba(255, 255, 255, 0.95));
  box-shadow: 0 18px 45px -34px rgba(15, 23, 42, 0.45);
}

/* summary stat cards */
.preschool-settings__stat-card {
  padding: 1rem 1.1rem;
  border-radius: 1rem;
  border: 1px solid #e2eaf3;
  background: #f8fafc;
}

.preschool-settings__stat-card--warn {
  border-color: #fde68a;
  background: #fffbeb;
}

.preschool-settings__stat-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #64748b;
}

.preschool-settings__stat-value {
  margin-top: 0.4rem;
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}

/* save / reset footer */
.preschool-settings__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: 1.25rem;
  border: 1px solid #dbe4ef;
  background: #fff;
  box-shadow: 0 18px 45px -34px rgba(15, 23, 42, 0.45);
}
</style>

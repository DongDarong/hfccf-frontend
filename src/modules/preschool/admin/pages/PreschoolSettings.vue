<script setup>
import { computed, ref } from 'vue'
import Card from 'primevue/card'
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
import PreschoolAcademicYearSettings from '@/modules/preschool/shared/components/settings/PreschoolAcademicYearSettings.vue'
import PreschoolAttendanceConfiguration from '@/modules/preschool/shared/components/settings/PreschoolAttendanceConfiguration.vue'
import PreschoolClassConfiguration from '@/modules/preschool/shared/components/settings/PreschoolClassConfiguration.vue'
import PreschoolPaymentConfiguration from '@/modules/preschool/shared/components/settings/PreschoolPaymentConfiguration.vue'
import PreschoolSettingsSectionCard from '@/modules/preschool/shared/components/settings/PreschoolSettingsSectionCard.vue'
import PreschoolTermSetup from '@/modules/preschool/shared/components/settings/PreschoolTermSetup.vue'

// Parent owns the full settings snapshot so the reusable section components can
// stay presentation-focused and preserve a single validation source of truth.
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
</script>

<template>
  <MainLayout>
    <div class="min-h-screen bg-slate-50 px-4 py-6 md:px-6 lg:px-8">
      <div class="mx-auto flex max-w-7xl flex-col gap-6">
        <HeaderSection
          :title="t('preschoolSettingsPage.pageTitle')"
          :subtitle="t('preschoolSettingsPage.pageSubtitle')"
        />

        <Card class="preschool-settings-status-card">
          <template #content>
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div class="space-y-1">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">{{ t('preschoolSettingsPage.statusEyebrow') }}</p>
                <h2 class="text-lg font-semibold text-slate-900">{{ operationalState.label }}</h2>
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
          </template>
        </Card>

        <div class="grid gap-6 xl:grid-cols-2">
          <PreschoolSettingsSectionCard
            :eyebrow="t('preschoolSettingsPage.sections.summary.eyebrow')"
            :title="t('preschoolSettingsPage.sections.summary.title')"
            :subtitle="t('preschoolSettingsPage.sections.summary.subtitle')"
            class="xl:col-span-2"
          >
            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{{ t('preschoolSettingsPage.summary.academicYear') }}</p>
                <p class="mt-2 text-base font-semibold text-slate-900">{{ settings.academicYear.currentAcademicYear }}</p>
              </div>
              <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{{ t('preschoolSettingsPage.summary.terms') }}</p>
                <p class="mt-2 text-base font-semibold text-slate-900">{{ settings.terms.length }}</p>
              </div>
              <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{{ t('preschoolSettingsPage.summary.classes') }}</p>
                <p class="mt-2 text-base font-semibold text-slate-900">{{ settings.classConfigurations.length }}</p>
              </div>
              <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{{ t('preschoolSettingsPage.summary.issues') }}</p>
                <p class="mt-2 text-base font-semibold text-slate-900">{{ issueCount }}</p>
              </div>
            </div>
          </PreschoolSettingsSectionCard>

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
            :dialog-title="termDialogMode === 'edit' ? t('preschoolSettingsPage.termDialog.editTitle') : t('preschoolSettingsPage.termDialog.createTitle')"
            :dialog-draft="termDraft"
            :dialog-errors="termDraftErrors"
            @open-add="openCreateTerm"
            @open-edit="openEditTerm"
            @remove="removeTerm"
            @cancel="closeTermDialog"
            @save="saveTermDraft"
            @update:dialogDraft="termDraft = $event"
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

          <PreschoolPaymentConfiguration
            :model-value="settings.payment"
            :payment-cycle-options="paymentCycleOptions"
            :late-fee-rule-options="lateFeeRuleOptions"
            :errors="validationErrors.payment"
            @update:model-value="settings.payment = $event"
          />
        </div>

        <Card class="preschool-settings-footer-card">
          <template #content>
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div class="space-y-1">
                <p class="text-sm font-semibold text-slate-900">{{ t('preschoolSettingsPage.footer.title') }}</p>
                <p class="text-sm text-slate-500">{{ t('preschoolSettingsPage.footer.subtitle') }}</p>
                <p v-if="hasValidationIssues" class="text-xs font-medium text-rose-600">{{ t('preschoolSettingsPage.footer.validationNotice') }}</p>
              </div>

              <div class="flex flex-wrap gap-3">
                <Button variant="ghost" @click="handleReset">{{ t('preschoolSettingsPage.actions.reset') }}</Button>
                <Button variant="primary" @click="saveSettings()">{{ t('preschoolSettingsPage.actions.saveChanges') }}</Button>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
:deep(.preschool-settings-status-card .p-card),
:deep(.preschool-settings-footer-card .p-card) {
  border-radius: 1.25rem;
  border: 1px solid #dbe4ef;
  background: #fff;
  box-shadow: 0 18px 45px -34px rgba(15, 23, 42, 0.45);
}

:deep(.preschool-settings-status-card .p-card-body),
:deep(.preschool-settings-footer-card .p-card-body) {
  padding: 1.25rem;
}
</style>
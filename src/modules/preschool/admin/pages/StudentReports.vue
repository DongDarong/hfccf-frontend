<script setup>
// Keep the student report page focused on selection and loading so the report
// body can stay reusable and the finalized-data contract stays explicit.
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Select from 'primevue/select'
import { useLanguage } from '@/composables/useLanguage'
import { usePreschoolReports } from '@/modules/preschool/composables/usePreschoolReports'
import ReportPeriodSelector from '@/modules/preschool/shared/components/report/ReportPeriodSelector.vue'
import ReportPeriodStatusBadge from '@/modules/preschool/shared/components/report/ReportPeriodStatusBadge.vue'
import StudentProgressReport from '@/modules/preschool/shared/components/report/StudentProgressReport.vue'

defineOptions({
  name: 'PreschoolStudentReportsPage',
})

const route = useRoute()
const router = useRouter()
const { t } = useLanguage()

const {
  errorMessage,
  isTeacher,
  loadLookupData,
  loadStudentReport,
  loading,
  reportBundle,
  reportPeriods,
  reportPeriodLockMessage,
  selectedReportPeriod,
  selectedPeriodLabel,
  selectedStudentId,
  setSelectedPeriodLabel,
  setSelectedStudentId,
  studentOptions,
} = usePreschoolReports()

async function applyReport() {
  await loadStudentReport(selectedStudentId.value, selectedPeriodLabel.value)
}

async function handleStudentChange(studentId) {
  setSelectedStudentId(studentId)
  setSelectedPeriodLabel('')
  await loadStudentReport(studentId)
}

function goBack() {
  router.push({
    name: isTeacher.value ? 'dashboard-preschool-teacher' : 'dashboard-preschool-admin-reports',
  })
}

onMounted(async () => {
  const studentId = String(route.query.studentId || '').trim()
  const periodLabel = String(route.query.period || '').trim()

  if (studentId) {
    setSelectedStudentId(studentId)
  }

  if (periodLabel) {
    setSelectedPeriodLabel(periodLabel)
  }

  await loadLookupData()

  if (selectedStudentId.value) {
    await loadStudentReport(selectedStudentId.value, selectedPeriodLabel.value)
  }
})
</script>

<template>
  <MainLayout>
    <section class="space-y-4">
      <HeaderSection
        :title="t('preschoolStudentReportsPage.title')"
        :subtitle="t('preschoolStudentReportsPage.subtitle')"
      />

      <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
            <label class="space-y-2 text-sm font-medium text-slate-700">
              <span>{{ t('preschoolStudentReportsPage.filters.student') }}</span>
              <Select
                :model-value="selectedStudentId"
                :options="studentOptions"
                option-label="label"
                option-value="value"
                class="w-full"
                :placeholder="t('preschoolStudentReportsPage.placeholders.student')"
                @update:model-value="handleStudentChange"
              />
            </label>

            <div class="flex items-end gap-2">
              <Button type="button" variant="ghost" size="md" rounded="xl" @click="goBack">
                {{ t('preschoolStudentReportsPage.actions.back') }}
              </Button>
            </div>
          </div>
        </div>

        <ReportPeriodSelector
          :label="t('preschoolStudentReportsPage.filters.period')"
          :periods="reportPeriods"
          :model-value="selectedPeriodLabel"
          :placeholder="t('preschoolStudentReportsPage.placeholders.period')"
          :loading="loading"
          @update:model-value="setSelectedPeriodLabel"
          @refresh="applyReport"
        />
      </div>

      <div v-if="selectedReportPeriod" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="space-y-1">
            <h3 class="text-sm font-semibold text-slate-900">{{ t('preschoolReportsPage.selectedPeriod.title') }}</h3>
            <p class="text-sm text-slate-500">{{ t('preschoolReportsPage.selectedPeriod.subtitle') }}</p>
          </div>
          <ReportPeriodStatusBadge :status="selectedReportPeriod.status" />
        </div>
        <div
          v-if="reportPeriodLockMessage"
          class="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          {{ reportPeriodLockMessage }}
        </div>
      </div>

      <div v-if="errorMessage" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ errorMessage }}
      </div>

      <StudentProgressReport :report="reportBundle.report" :loading="loading" />
    </section>
  </MainLayout>
</template>

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
import ReportPeriodStatusBadge from '@/modules/preschool/shared/components/report/ReportPeriodStatusBadge.vue'
import StudentProgressReport from '@/modules/preschool/shared/components/report/StudentProgressReport.vue'
import { buildReportCardHtml } from '@/modules/preschool/shared/utils/reportCardHtml'

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

/** Load the report whenever the user picks a period — no separate "Refresh" needed. */
async function handlePeriodChange(label) {
  setSelectedPeriodLabel(label)
  if (selectedStudentId.value && label) {
    await loadStudentReport(selectedStudentId.value, label)
  }
}

/** Reset period and reload the period list when a different student is picked. */
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

function printReportCard() {
  const p = (key) => t(`preschoolReportsShared.reportCard.${key}`)
  const labels = {
    institutionName: p('institutionName'),
    title: p('title'),
    student: p('student'),
    gender: p('gender'),
    dateOfBirth: p('dateOfBirth'),
    class: p('class'),
    teacher: p('teacher'),
    period: p('period'),
    academicYear: p('academicYear'),
    dateRange: p('dateRange'),
    notAvailable: p('notAvailable'),
    attendanceTitle: p('attendanceTitle'),
    categoryTitle: p('categoryTitle'),
    observationsTitle: p('observationsTitle'),
    emptyCategories: p('emptyCategories'),
    emptyObservations: p('emptyObservations'),
    assessedBy: p('assessedBy'),
    generatedAt: p('generatedAt'),
    officialRecord: p('officialRecord'),
    authorizedSignature: p('authorizedSignature'),
    columns: {
      category: p('columns.category'),
      assessments: p('columns.assessments'),
      avgScore: p('columns.avgScore'),
    },
    labels: {
      categoryFallback: t('preschoolReportsShared.labels.categoryFallback'),
    },
    dataSource: {
      liveNote: t('preschoolReportsShared.dataSource.liveNote'),
      snapshotNote: t('preschoolReportsShared.dataSource.snapshotNote'),
    },
    attendance: {
      total: t('preschoolReportsShared.attendance.total'),
      present: t('preschoolReportsShared.attendance.present'),
      late: t('preschoolReportsShared.attendance.late'),
      absent: t('preschoolReportsShared.attendance.absent'),
      excused: t('preschoolReportsShared.attendance.excused'),
    },
  }
  const html = buildReportCardHtml({
    student: reportBundle.value.student,
    period: reportBundle.value.period || selectedReportPeriod.value,
    classInfo: reportBundle.value.class,
    report: reportBundle.value.report,
    labels,
  })
  const win = window.open('', '_blank', 'width=900,height=1200,noopener=yes')
  if (!win) return
  win.document.write(html)
  win.document.close()
}

onMounted(async () => {
  const studentId = String(route.query.studentId || '').trim()
  const periodLabel = String(route.query.period || '').trim()

  if (studentId) setSelectedStudentId(studentId)
  if (periodLabel) setSelectedPeriodLabel(periodLabel)

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

      <!-- ── Unified filter bar ─────────────────────────────────────────────
           Student and period live in one card so the relationship is obvious.
           Period auto-loads the report on change — no separate Refresh step. -->
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">

          <!-- Student picker -->
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {{ t('preschoolStudentReportsPage.filters.student') }}
            </span>
            <Select
              :model-value="selectedStudentId"
              :options="studentOptions"
              option-label="label"
              option-value="value"
              class="w-full"
              :placeholder="t('preschoolStudentReportsPage.placeholders.student')"
              :disabled="loading"
              @update:model-value="handleStudentChange"
            />
          </label>

          <!-- Period picker — auto-loads on change -->
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {{ t('preschoolStudentReportsPage.filters.period') }}
            </span>
            <Select
              :model-value="selectedPeriodLabel"
              :options="reportPeriods"
              option-label="label"
              option-value="label"
              class="w-full"
              :placeholder="t('preschoolStudentReportsPage.placeholders.period')"
              :disabled="loading || !reportPeriods.length"
              @update:model-value="handlePeriodChange"
            />
          </label>

          <!-- Action buttons -->
          <div class="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
            <Button
              type="button"
              variant="primary"
              size="md"
              rounded="xl"
              :loading="loading"
              :disabled="!selectedStudentId || !selectedPeriodLabel"
              class="flex-1 lg:flex-none"
              @click="loadStudentReport(selectedStudentId, selectedPeriodLabel)"
            >
              {{ loading ? t('preschoolStudentReportsPage.actions.loading') : t('preschoolStudentReportsPage.actions.load') }}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              rounded="xl"
              :disabled="!reportBundle.report || loading"
              @click="printReportCard"
            >
              {{ t('preschoolStudentReportsPage.actions.printReportCard') }}
            </Button>
            <Button type="button" variant="ghost" size="md" rounded="xl" @click="goBack">
              {{ t('preschoolStudentReportsPage.actions.back') }}
            </Button>
          </div>
        </div>

        <!-- Period status — shown inline under the filters once a period is chosen -->
        <div v-if="selectedReportPeriod" class="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
          <ReportPeriodStatusBadge :status="selectedReportPeriod.status" />
          <span class="text-xs text-slate-500">
            {{ selectedReportPeriod.label }}
            <template v-if="selectedReportPeriod.fromDate && selectedReportPeriod.toDate">
              · {{ selectedReportPeriod.fromDate }} – {{ selectedReportPeriod.toDate }}
            </template>
          </span>
        </div>

        <!-- Lock / finalization warning — shown inline so it doesn't get lost -->
        <div
          v-if="reportPeriodLockMessage"
          class="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800"
        >
          {{ reportPeriodLockMessage }}
        </div>
      </div>

      <!-- Error banner -->
      <div
        v-if="errorMessage"
        class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
      >
        {{ errorMessage }}
      </div>

      <!-- Report body -->
      <StudentProgressReport :report="reportBundle.report" :loading="loading" />
    </section>
  </MainLayout>
</template>

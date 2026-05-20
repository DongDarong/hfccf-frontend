<script setup>
// Keep the Preschool report overview explicit so the sidebar routes to a real
// data-driven landing page instead of a placeholder shell.
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import { useLanguage } from '@/composables/useLanguage'
import { usePreschoolReports } from '@/modules/preschool/composables/usePreschoolReports'
import ReportSummaryCard from '@/modules/preschool/shared/components/report/ReportSummaryCard.vue'

defineOptions({
  name: 'PreschoolReportPeriodOverviewPage',
})

const router = useRouter()
const { t } = useLanguage()

const {
  errorMessage,
  loadLookupData,
  loadReportPeriodOptions,
  loading,
  reportPeriods,
  studentOptions,
} = usePreschoolReports()

const overviewCards = computed(() => [
  {
    title: t('preschoolReportsPage.overview.periods'),
    value: reportPeriods.value.length,
    caption: t('preschoolReportsPage.overview.periodsCaption'),
  },
  {
    title: t('preschoolReportsPage.overview.students'),
    value: studentOptions.value.length,
    caption: t('preschoolReportsPage.overview.studentsCaption'),
  },
  {
    title: t('preschoolReportsPage.overview.latestAssessments'),
    value: reportPeriods.value[0]?.assessmentCount ?? 0,
    caption: t('preschoolReportsPage.overview.latestAssessmentsCaption'),
  },
  {
    title: t('preschoolReportsPage.overview.latestPeriod'),
    value: reportPeriods.value[0]?.label || '-',
    caption: t('preschoolReportsPage.overview.latestPeriodCaption'),
  },
])

function goToStudentReports() {
  router.push({ name: 'dashboard-preschool-admin-student-reports' })
}

function goToClassroomReports() {
  router.push({ name: 'dashboard-preschool-admin-classroom-reports' })
}

onMounted(async () => {
  await loadLookupData()
  await loadReportPeriodOptions()
})
</script>

<template>
  <MainLayout>
    <section class="space-y-4">
      <HeaderSection
        :title="t('preschoolReportsPage.title')"
        :subtitle="t('preschoolReportsPage.subtitle')"
      />

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ReportSummaryCard
          v-for="card in overviewCards"
          :key="card.title"
          :title="card.title"
          :value="card.value"
          :caption="card.caption"
        />
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="space-y-1">
            <h3 class="text-sm font-semibold text-slate-900">{{ t('preschoolReportsPage.overview.listTitle') }}</h3>
            <p class="text-sm text-slate-500">{{ t('preschoolReportsPage.overview.listSubtitle') }}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <Button type="button" variant="primary" size="md" rounded="xl" @click="goToStudentReports">
              {{ t('preschoolReportsPage.actions.openStudentReports') }}
            </Button>
            <Button type="button" variant="secondary" size="md" rounded="xl" @click="goToClassroomReports">
              {{ t('preschoolReportsPage.actions.openClassroomReports') }}
            </Button>
          </div>
        </div>

        <div v-if="errorMessage" class="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {{ errorMessage }}
        </div>

        <div v-if="loading" class="mt-4 px-1 py-6 text-sm text-slate-500">
          {{ t('preschoolReportsPage.loading') }}
        </div>

        <div v-else-if="!reportPeriods.length" class="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-sm text-slate-500">
          {{ t('preschoolReportsPage.emptyOverview') }}
        </div>

        <div v-else class="mt-4 overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200 text-sm">
            <thead class="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th class="px-4 py-3">{{ t('preschoolReportsPage.periodColumns.label') }}</th>
                <th class="px-4 py-3">{{ t('preschoolReportsPage.periodColumns.dates') }}</th>
                <th class="px-4 py-3">{{ t('preschoolReportsPage.periodColumns.assessments') }}</th>
                <th class="px-4 py-3">{{ t('preschoolReportsPage.periodColumns.students') }}</th>
                <th class="px-4 py-3">{{ t('preschoolReportsPage.periodColumns.classes') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-for="period in reportPeriods" :key="period.label">
                <td class="px-4 py-3 font-medium text-slate-900">{{ period.label }}</td>
                <td class="px-4 py-3 text-slate-600">{{ period.fromDate || '-' }} - {{ period.toDate || '-' }}</td>
                <td class="px-4 py-3 text-slate-600">{{ period.assessmentCount ?? 0 }}</td>
                <td class="px-4 py-3 text-slate-600">{{ period.studentCount ?? 0 }}</td>
                <td class="px-4 py-3 text-slate-600">{{ period.classCount ?? 0 }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

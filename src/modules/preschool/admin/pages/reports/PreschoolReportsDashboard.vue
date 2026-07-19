<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'PreschoolReportsDashboardPage',
})

const { t } = useLanguage()
const router = useRouter()

const REPORT_TYPES = [
  {
    key: 'student-summary',
    label: 'Student Summary',
    icon: 'pi-user',
    routeName: 'dashboard-preschool-admin-reports-student-summary',
    description: 'Overview of a student\'s assessments and attendance',
  },
  {
    key: 'attendance',
    label: 'Attendance',
    icon: 'pi-calendar',
    routeName: 'dashboard-preschool-admin-reports-attendance',
    description: 'Monthly and yearly attendance records',
  },
  {
    key: 'assessment',
    label: 'Assessment',
    icon: 'pi-chart-bar',
    description: 'Individual and class assessment results',
  },
]

const reportTypeOptions = computed(() =>
  REPORT_TYPES.map(type => ({
    ...type,
    label: t(`preschoolReportsPage.reportTypes.${type.key}`) || type.label,
    description: t(`preschoolReportsPage.reportTypeDesc.${type.key}`) || type.description,
  })),
)

function navigateToReport(routeName) {
  router.push({ name: routeName })
}
</script>

<template>
  <MainLayout>
    <section class="space-y-6">
      <!-- Page Header -->
      <HeaderSection
        :title="t('preschoolReportsPage.title') || 'Reports'"
        :subtitle="t('preschoolReportsPage.subtitle') || 'Choose a report type'"
      />

      <!-- Report Type Selector Cards -->
      <div class="space-y-3">
        <p class="text-sm text-slate-600">
          {{ t('preschoolReportsPage.chooseReport') || 'Select a report to view and analyze data.' }}
        </p>
        <div class="grid gap-4 md:grid-cols-3">
          <button
            v-for="reportType in reportTypeOptions"
            :key="reportType.key"
            type="button"
            @click="navigateToReport(reportType.routeName)"
            class="group rounded-2xl border-2 border-slate-200 bg-white p-6 text-left transition-all duration-200 hover:border-slate-400 hover:shadow-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <div class="flex items-start gap-4">
              <div :class="`text-2xl ${reportType.icon}`" />
              <div class="flex-1">
                <h3 class="font-semibold text-slate-900 group-hover:text-blue-600">{{ reportType.label }}</h3>
                <p class="mt-1 text-xs text-slate-500">
                  {{ reportType.description }}
                </p>
              </div>
              <div class="text-slate-400 group-hover:text-slate-600">
                <i class="pi pi-chevron-right" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

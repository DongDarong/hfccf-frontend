<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'PreschoolReportsDashboardPage',
})

const { t } = useLanguage()
const router = useRouter()

const REPORT_TYPES = [
  {
    key: 'attendance',
    label: 'Attendance Report',
    icon: 'pi-calendar-check',
    routeName: 'dashboard-preschool-admin-reports-attendance',
    description: 'Track student attendance patterns',
    color: 'emerald',
  },
  {
    key: 'student-summary',
    label: 'Student Summary',
    icon: 'pi-user-check',
    routeName: 'dashboard-preschool-admin-reports-student-summary',
    description: 'Individual student overview',
    color: 'blue',
  },
]

const reportTypeOptions = computed(() =>
  REPORT_TYPES.map(type => ({
    ...type,
    label: t(`preschoolReportsPage.reportTypes.${type.key}`) || type.label,
    description: t(`preschoolReportsPage.reportTypeDesc.${type.key}`) || type.description,
  })),
)

const colorMap = {
  emerald: 'hover:from-emerald-50 hover:to-emerald-50/0 border-emerald-200 hover:border-emerald-300',
  blue: 'hover:from-blue-50 hover:to-blue-50/0 border-blue-200 hover:border-blue-300',
}

function navigateToReport(routeName) {
  router.push({ name: routeName })
}
</script>

<template>
  <MainLayout>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl">
        <!-- Header -->
        <div class="mb-12">
          <h1 class="text-4xl font-bold tracking-tight text-slate-900">
            {{ t('preschoolReportsPage.title') || 'Reports' }}
          </h1>
          <p class="mt-4 text-lg text-slate-600">
            {{ t('preschoolReportsPage.subtitle') || 'Generate and analyze reports' }}
          </p>
        </div>

        <!-- Report Grid -->
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          <button
            v-for="reportType in reportTypeOptions"
            :key="reportType.key"
            type="button"
            @click="navigateToReport(reportType.routeName)"
            :class="[
              'group relative overflow-hidden rounded-2xl border-2 bg-white p-8 text-left transition-all duration-300',
              'hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2',
              colorMap[reportType.color],
            ]"
          >
            <!-- Background gradient on hover -->
            <div :class="[
              'absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100',
              {
                'bg-gradient-to-br from-emerald-50 to-emerald-50/0': reportType.color === 'emerald',
                'bg-gradient-to-br from-blue-50 to-blue-50/0': reportType.color === 'blue',
              }
            ]" />

            <!-- Content -->
            <div class="relative space-y-4">
              <!-- Icon -->
              <div :class="[
                'inline-flex rounded-xl p-3 text-2xl transition-transform group-hover:scale-110',
                {
                  'bg-emerald-100 text-emerald-700': reportType.color === 'emerald',
                  'bg-blue-100 text-blue-700': reportType.color === 'blue',
                }
              ]">
                <i :class="`pi ${reportType.icon}`" />
              </div>

              <!-- Text -->
              <div>
                <h3 class="text-xl font-bold text-slate-900 group-hover:text-slate-900">
                  {{ reportType.label }}
                </h3>
                <p class="mt-2 text-sm text-slate-600">
                  {{ reportType.description }}
                </p>
              </div>

              <!-- Arrow -->
              <div class="flex items-center gap-2 pt-2 text-sm font-semibold transition-all group-hover:gap-3" :class="[
                {
                  'text-emerald-600': reportType.color === 'emerald',
                  'text-blue-600': reportType.color === 'blue',
                }
              ]">
                <span>{{ t('preschoolReportsPage.viewReport') || 'View Report' }}</span>
                <i class="pi pi-arrow-right transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </button>
        </div>

        <!-- Info Section -->
        <div class="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 class="text-lg font-semibold text-slate-900">💡 Tips</h2>
          <ul class="mt-4 space-y-3 text-sm text-slate-600">
            <li class="flex items-start gap-3">
              <span class="mt-1 flex-shrink-0 text-emerald-600">✓</span>
              <span>Use attendance reports to track student presence patterns and identify trends</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="mt-1 flex-shrink-0 text-blue-600">✓</span>
              <span>View individual student summaries to monitor progress and performance</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="mt-1 flex-shrink-0 text-slate-400">✓</span>
              <span>Export reports in multiple formats (PDF, Excel, CSV) for sharing and analysis</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

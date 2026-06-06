<script setup>
import { onMounted, ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import { useLanguage } from '@/composables/useLanguage'
import { assessmentReportApi } from '../services/assessmentReportApi'

defineOptions({ name: 'AssessmentReportsPage' })

const { t } = useLanguage()

const dashboard       = ref(null)
const riskDistribution = ref([])
const submissionTrend = ref([])
const isLoading       = ref(false)

async function load() {
  isLoading.value = true
  try {
    const [dRes, rRes, tRes] = await Promise.all([
      assessmentReportApi.dashboard(),
      assessmentReportApi.riskDistribution(),
      assessmentReportApi.submissionTrend(),
    ])
    dashboard.value       = dRes.data.data
    riskDistribution.value = rRes.data.data
    submissionTrend.value  = tRes.data.data
  } finally {
    isLoading.value = false
  }
}

onMounted(load)
</script>

<template>
  <MainLayout>
    <div class="flex flex-col gap-6">
      <HeaderSection :title="t('assessmentReports.title')">
        <template #actions>
          <Button :label="t('assessmentReports.exportReport')" icon="pi pi-download" severity="secondary" />
        </template>
      </HeaderSection>

      <div v-if="isLoading" class="flex justify-center py-20 text-slate-400">
        <i class="pi pi-spin pi-spinner text-3xl" />
      </div>

      <template v-else>
        <!-- KPI stats -->
        <div v-if="dashboard" class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div class="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ t('assessmentReports.totalAssessments') }}</span>
            <span class="text-3xl font-bold text-slate-800">{{ dashboard.stats?.total_assessments ?? 0 }}</span>
          </div>
          <div class="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ t('assessmentReports.averageScore') }}</span>
            <span class="text-3xl font-bold text-slate-800">{{ dashboard.stats?.average_score ?? '—' }}</span>
          </div>
          <div class="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ t('assessmentReports.completionRate') }}</span>
            <span class="text-3xl font-bold text-slate-800">{{ dashboard.stats?.completion_rate ?? '—' }}%</span>
          </div>
        </div>

        <!-- Risk distribution -->
        <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div class="border-b border-slate-100 px-5 py-3.5">
            <h3 class="text-sm font-semibold text-slate-800">{{ t('assessmentReports.riskDistribution') }}</h3>
          </div>
          <div class="p-5">
            <div v-if="!riskDistribution.length" class="py-8 text-center text-sm text-slate-400">
              <i class="pi pi-chart-bar mb-3 block text-3xl" />
              {{ t('assessmentReports.noData') }}
            </div>
            <div v-else class="flex flex-col gap-2.5">
              <div
                v-for="item in riskDistribution"
                :key="item.level"
                class="flex items-center gap-3"
              >
                <span
                  class="inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold text-white"
                  :style="{ background: item.color }"
                >{{ item.level_name }}</span>
                <div class="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    class="h-full rounded-full transition-all"
                    :style="{ width: `${item.percentage ?? 0}%`, background: item.color }"
                  />
                </div>
                <span class="w-8 text-right text-sm font-medium text-slate-700">{{ item.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </MainLayout>
</template>

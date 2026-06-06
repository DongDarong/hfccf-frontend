<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import { dsamCoreApi } from '../services/dsamCoreApi'
import RiskBadge from '../components/shared/RiskBadge.vue'

defineOptions({ name: 'DsamDashboardPage' })

const router = useRouter()
const { t }  = useLanguage()
const data    = ref(null)
const loading = ref(false)

const yearOptions   = ref([])
const selectedYear  = ref(null)

const statusSeverity = {
  draft: 'secondary', in_progress: 'warn', submitted: 'info',
  under_review: 'warn', approved: 'success', rejected: 'danger',
}

const kpiCards = computed(() => [
  { label: t('dsamDashboard.kpi.totalStudents'),  value: data.value?.kpi?.total_students,  icon: 'pi-users',       color: 'text-blue-600 bg-blue-50' },
  { label: t('dsamDashboard.kpi.assessed'),       value: data.value?.kpi?.total_assessed,  icon: 'pi-file-check',  color: 'text-emerald-600 bg-emerald-50' },
  {
    label: t('dsamDashboard.kpi.assessmentRate'),
    value: data.value?.kpi?.assessment_rate != null ? data.value.kpi.assessment_rate + '%' : '—',
    icon: 'pi-chart-pie', color: 'text-violet-600 bg-violet-50',
  },
  { label: t('dsamDashboard.kpi.pendingReview'),  value: data.value?.kpi?.pending_review,  icon: 'pi-clock',       color: 'text-amber-600 bg-amber-50' },
])

const riskColors = { low: '#16a34a', medium: '#d97706', high: '#ea580c', critical: '#dc2626' }

function studentName(row) {
  return row.student?.full_name
    ?? [row.student?.first_name, row.student?.last_name].filter(Boolean).join(' ')
    || '—'
}

function fmtScore(v) {
  return v != null ? v.toFixed(1) + '%' : '—'
}

async function load() {
  loading.value = true
  try {
    const params = selectedYear.value ? { academic_year_id: selectedYear.value } : {}
    const res = await dsamCoreApi.dashboard(params)
    data.value = res.data.data
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const yearsRes = await dsamCoreApi.academicYears()
  yearOptions.value = (yearsRes.data.data ?? []).map(y => ({ label: y.name, value: y.id }))
  await load()
})
</script>

<template>
  <MainLayout>
    <div class="flex flex-col gap-6">

      <HeaderSection :title="t('dsamDashboard.title')">
        <template #actions>
          <Select
            v-model="selectedYear"
            :options="yearOptions"
            option-label="label"
            option-value="value"
            :placeholder="t('dsamDashboard.allYears')"
            show-clear
            class="w-44"
            @change="load"
          />
          <Button
            :label="t('dsamDashboard.newAssessment')"
            icon="pi pi-plus"
            @click="router.push({ name: 'dsam-submission-list' })"
          />
        </template>
      </HeaderSection>

      <!-- KPI Row -->
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div
          v-for="card in kpiCards"
          :key="card.label"
          class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs font-medium text-slate-500">{{ card.label }}</p>
              <p class="mt-1 text-2xl font-bold text-slate-900">
                {{ loading ? '…' : (card.value ?? '—') }}
              </p>
            </div>
            <span :class="['flex h-10 w-10 items-center justify-center rounded-lg text-lg', card.color]">
              <i :class="['pi', card.icon]" />
            </span>
          </div>
        </div>
      </div>

      <!-- Risk distribution + Critical students -->
      <div class="grid gap-4 lg:grid-cols-2">

        <!-- Risk distribution -->
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 class="mb-4 text-sm font-semibold text-slate-800">{{ t('dsamDashboard.riskDistribution') }}</h3>
          <div v-if="data?.risk_distribution && data.kpi.total_assessed > 0" class="space-y-3">
            <div
              v-for="level in ['critical','high','medium','low']"
              :key="level"
              class="flex items-center gap-3"
            >
              <div :style="{ background: riskColors[level] }" class="h-2.5 w-2.5 rounded-full shrink-0" />
              <span class="w-20 text-sm capitalize text-slate-600">{{ t('dsamShared.riskLevels.' + level) }}</span>
              <div class="flex-1 overflow-hidden rounded-full bg-slate-100 h-2">
                <div
                  class="h-full rounded-full transition-all"
                  :style="{
                    width: (data.risk_distribution[level] ?? 0) / data.kpi.total_assessed * 100 + '%',
                    background: riskColors[level],
                  }"
                />
              </div>
              <span class="w-8 text-right text-sm font-medium text-slate-700">
                {{ data.risk_distribution[level] ?? 0 }}
              </span>
            </div>
          </div>
          <p v-else-if="!loading" class="text-sm text-slate-400">{{ t('dsamDashboard.noApprovedAssessments') }}</p>
        </div>

        <!-- Critical students -->
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 class="mb-4 text-sm font-semibold text-slate-800">{{ t('dsamDashboard.criticalStudents') }}</h3>
          <DataTable :value="data?.critical_students ?? []" :loading="loading" size="sm">
            <template #empty>
              <p class="py-4 text-center text-xs text-slate-400">{{ t('dsamDashboard.noCritical') }}</p>
            </template>
            <Column :header="t('dsamShared.cols.student')">
              <template #body="{ data: row }">
                <button
                  class="text-left text-sm font-medium text-slate-700 hover:text-violet-700 hover:underline transition-colors"
                  @click="row.student?.id && router.push({ name: 'dsam-student-profile', params: { id: row.student.id } })"
                >
                  {{ studentName(row) }}
                </button>
              </template>
            </Column>
            <Column :header="t('dsamShared.cols.score')">
              <template #body="{ data: row }">
                <span class="text-sm text-slate-600">{{ fmtScore(row.score_percentage) }}</span>
              </template>
            </Column>
            <Column :header="t('dsamShared.cols.risk')">
              <template #body="{ data: row }">
                <RiskBadge :level="row.risk_level" size="sm" />
              </template>
            </Column>
            <Column header="">
              <template #body="{ data: row }">
                <button
                  class="text-violet-600 hover:underline text-xs"
                  @click="router.push({ name: 'dsam-submission-detail', params: { id: row.uuid } })"
                >
                  {{ t('dsamShared.actions.view') }}
                </button>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>

      <!-- Recent submissions -->
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 class="mb-4 text-sm font-semibold text-slate-800">{{ t('dsamDashboard.recentSubmissions') }}</h3>
        <DataTable :value="data?.recent_submissions ?? []" :loading="loading" size="sm">
          <template #empty>
            <p class="py-4 text-center text-xs text-slate-400">{{ t('dsamDashboard.noSubmissions') }}</p>
          </template>
          <Column :header="t('dsamShared.cols.student')">
            <template #body="{ data: row }">
              <button
                class="text-left text-sm font-medium text-slate-700 hover:text-violet-700 hover:underline transition-colors"
                @click="row.student?.id && router.push({ name: 'dsam-student-profile', params: { id: row.student.id } })"
              >
                {{ studentName(row) }}
              </button>
            </template>
          </Column>
          <Column :header="t('dsamShared.cols.status')">
            <template #body="{ data: row }">
              <Tag
                :severity="statusSeverity[row.status] ?? 'secondary'"
                :value="t('dsamShared.statuses.' + row.status) || row.status?.replace('_', ' ')"
              />
            </template>
          </Column>
          <Column :header="t('dsamShared.cols.risk')">
            <template #body="{ data: row }">
              <RiskBadge :level="row.risk_level" size="sm" />
            </template>
          </Column>
          <Column :header="t('dsamShared.cols.score')">
            <template #body="{ data: row }">
              {{ fmtScore(row.score_percentage) }}
            </template>
          </Column>
          <Column header="">
            <template #body="{ data: row }">
              <button
                class="text-violet-600 hover:underline text-xs"
                @click="router.push({ name: 'dsam-submission-detail', params: { id: row.uuid } })"
              >
                {{ t('dsamShared.actions.view') }}
              </button>
            </template>
          </Column>
        </DataTable>
      </div>

    </div>
  </MainLayout>
</template>

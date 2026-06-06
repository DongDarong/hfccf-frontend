<script setup>
import { computed, onMounted, ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Tag from 'primevue/tag'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useRouter } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'
import { assessmentReportApi } from '../services/assessmentReportApi'

defineOptions({ name: 'AssessmentDashboardPage' })

const router = useRouter()
const { t } = useLanguage()

const stats = ref({ totalForms: 0, activeSubmissions: 0, pendingReview: 0, completedThisMonth: 0 })
const recentSubmissions = ref([])
const riskDistribution = ref([])
const isLoading = ref(false)

const kpiCards = computed(() => [
  { label: t('assessmentDashboard.stats.totalForms'),         value: stats.value.totalForms,          icon: 'pi-file-edit',    bg: 'bg-blue-50',    color: 'text-blue-600' },
  { label: t('assessmentDashboard.stats.activeSubmissions'),  value: stats.value.activeSubmissions,    icon: 'pi-users',        bg: 'bg-violet-50',  color: 'text-violet-600' },
  { label: t('assessmentDashboard.stats.pendingReview'),      value: stats.value.pendingReview,        icon: 'pi-clock',        bg: 'bg-amber-50',   color: 'text-amber-600' },
  { label: t('assessmentDashboard.stats.completedThisMonth'), value: stats.value.completedThisMonth,  icon: 'pi-check-circle', bg: 'bg-emerald-50', color: 'text-emerald-600' },
])

const statusSeverity = {
  draft: 'secondary', submitted: 'info', under_review: 'warn', approved: 'success', rejected: 'danger',
}

async function load() {
  isLoading.value = true
  try {
    const res = await assessmentReportApi.dashboard()
    const d = res.data.data
    stats.value = d.stats ?? stats.value
    recentSubmissions.value = d.recent_submissions ?? []
    riskDistribution.value = d.risk_distribution ?? []
  } finally {
    isLoading.value = false
  }
}

onMounted(load)
</script>

<template>
  <MainLayout>
    <div class="flex flex-col gap-6">
      <HeaderSection :title="t('assessmentDashboard.title')" :subtitle="t('assessmentDashboard.subtitle')">
        <template #actions>
          <Button
            :label="t('assessmentDashboard.quickActions.newAssessment')"
            icon="pi pi-plus"
            @click="router.push({ name: 'assessment-wizard' })"
          />
        </template>
      </HeaderSection>

      <!-- KPI cards -->
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div
          v-for="card in kpiCards"
          :key="card.label"
          class="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ card.label }}</span>
            <div :class="['flex h-9 w-9 items-center justify-center rounded-lg', card.bg, card.color]">
              <i :class="['pi text-base', card.icon]" />
            </div>
          </div>
          <span class="text-3xl font-bold text-slate-800">
            <i v-if="isLoading" class="pi pi-spin pi-spinner text-xl text-slate-300" />
            <template v-else>{{ card.value }}</template>
          </span>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="flex gap-3">
        <Button
          :label="t('assessmentDashboard.quickActions.manageTemplates')"
          severity="secondary"
          icon="pi pi-file-edit"
          @click="router.push({ name: 'assessment-form-list' })"
        />
        <Button
          :label="t('assessmentDashboard.quickActions.viewReports')"
          severity="secondary"
          icon="pi pi-chart-bar"
          @click="router.push({ name: 'assessment-reports' })"
        />
      </div>

      <!-- Recent submissions -->
      <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <h3 class="text-sm font-semibold text-slate-800">{{ t('assessmentDashboard.recentSubmissions') }}</h3>
        </div>
        <DataTable :value="recentSubmissions" :loading="isLoading">
          <template #empty>
            <div class="py-10 text-center text-sm text-slate-400">
              <i class="pi pi-inbox mb-3 block text-3xl" />
              {{ t('submissions.noSubmissions') }}
            </div>
          </template>
          <Column :header="t('submissions.student')">
            <template #body="{ data }">
              <p class="font-medium text-slate-800">{{ data.student?.full_name ?? '—' }}</p>
              <p class="text-xs text-slate-400">{{ data.student?.student_code }}</p>
            </template>
          </Column>
          <Column :header="t('submissions.form')">
            <template #body="{ data }">
              <span class="text-sm text-slate-700">{{ data.form_template?.name ?? '—' }}</span>
            </template>
          </Column>
          <Column :header="t('submissions.status')">
            <template #body="{ data }">
              <Tag :severity="statusSeverity[data.status] ?? 'secondary'" :value="t(`submissions.statuses.${data.status}`)" />
            </template>
          </Column>
          <Column :header="t('submissions.submittedAt')">
            <template #body="{ data }">
              <span class="text-xs text-slate-400">{{ data.submitted_at ? new Date(data.submitted_at).toLocaleDateString() : '—' }}</span>
            </template>
          </Column>
          <Column :header="t('common.table.actions')">
            <template #body="{ data }">
              <Button
                icon="pi pi-eye"
                size="sm"
                severity="secondary"
                @click="router.push({ name: 'assessment-submission-detail', params: { id: data.id } })"
              />
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Risk distribution -->
      <div v-if="riskDistribution.length" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 class="mb-4 text-sm font-semibold text-slate-800">{{ t('assessmentDashboard.riskDistribution') }}</h3>
        <div class="flex flex-col gap-2">
          <div
            v-for="item in riskDistribution"
            :key="item.level"
            class="flex items-center gap-3"
          >
            <span
              class="inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold text-white"
              :style="{ background: item.color }"
            >{{ item.level_name }}</span>
            <span class="text-sm font-medium text-slate-700">{{ item.count }}</span>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

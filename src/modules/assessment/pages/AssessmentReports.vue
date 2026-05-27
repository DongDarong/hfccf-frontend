<script setup>
import { onMounted, ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import { useLanguage } from '@/composables/useLanguage'
import { assessmentReportApi } from '../services/assessmentReportApi'

defineOptions({ name: 'AssessmentReportsPage' })

const { t } = useLanguage()

const dashboard = ref(null)
const riskDistribution = ref([])
const submissionTrend = ref([])
const isLoading = ref(false)

async function load() {
  isLoading.value = true
  try {
    const [dRes, rRes, tRes] = await Promise.all([
      assessmentReportApi.dashboard(),
      assessmentReportApi.riskDistribution(),
      assessmentReportApi.submissionTrend(),
    ])
    dashboard.value = dRes.data.data
    riskDistribution.value = rRes.data.data
    submissionTrend.value = tRes.data.data
  } finally {
    isLoading.value = false
  }
}

onMounted(load)
</script>

<template>
  <MainLayout>
    <div class="assessment-reports">
      <HeaderSection :title="t('assessmentReports.title')">
        <template #actions>
          <Button :label="t('assessmentReports.exportReport')" icon="pi pi-download" severity="secondary" />
        </template>
      </HeaderSection>

      <div v-if="isLoading" class="assessment-reports__loading">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem" />
      </div>

      <template v-else>
        <div class="assessment-reports__stats" v-if="dashboard">
          <div class="assessment-reports__stat-card">
            <div class="assessment-reports__stat-value">{{ dashboard.stats?.total_assessments ?? 0 }}</div>
            <div class="assessment-reports__stat-label">{{ t('assessmentReports.totalAssessments') }}</div>
          </div>
          <div class="assessment-reports__stat-card">
            <div class="assessment-reports__stat-value">{{ dashboard.stats?.average_score ?? '—' }}</div>
            <div class="assessment-reports__stat-label">{{ t('assessmentReports.averageScore') }}</div>
          </div>
          <div class="assessment-reports__stat-card">
            <div class="assessment-reports__stat-value">{{ dashboard.stats?.completion_rate ?? '—' }}%</div>
            <div class="assessment-reports__stat-label">{{ t('assessmentReports.completionRate') }}</div>
          </div>
        </div>

        <div class="assessment-reports__section">
          <h3>{{ t('assessmentReports.riskDistribution') }}</h3>
          <div v-if="riskDistribution.length === 0" class="assessment-reports__empty">
            {{ t('assessmentReports.noData') }}
          </div>
          <div v-else class="assessment-reports__risk-list">
            <div
              v-for="item in riskDistribution"
              :key="item.level"
              class="assessment-reports__risk-item"
            >
              <span class="assessment-reports__risk-badge" :style="{ background: item.color }">
                {{ item.level_name }}
              </span>
              <span>{{ item.count }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </MainLayout>
</template>

<style scoped>
.assessment-reports {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.assessment-reports__loading {
  display: flex;
  justify-content: center;
  padding: 4rem;
}

.assessment-reports__stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.assessment-reports__stat-card {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  padding: 1.25rem;
  text-align: center;
}

.assessment-reports__stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary-color);
}

.assessment-reports__stat-label {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  margin-top: 0.25rem;
}

.assessment-reports__section {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  padding: 1.25rem;
}

.assessment-reports__section h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
  font-weight: 600;
}

.assessment-reports__empty {
  color: var(--text-color-secondary);
  font-size: 0.875rem;
}

.assessment-reports__risk-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.assessment-reports__risk-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.assessment-reports__risk-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
}
</style>

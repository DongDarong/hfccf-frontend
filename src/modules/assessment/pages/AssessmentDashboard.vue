<script setup>
import { onMounted, ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
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
    <div class="assessment-dashboard">
      <HeaderSection :title="t('assessmentDashboard.title')" :subtitle="t('assessmentDashboard.subtitle')">
        <template #actions>
          <Button
            :label="t('assessmentDashboard.quickActions.newAssessment')"
            icon="pi pi-plus"
            @click="router.push({ name: 'assessment-wizard' })"
          />
        </template>
      </HeaderSection>

      <div class="assessment-dashboard__stats">
        <div class="assessment-dashboard__stat-card">
          <div class="assessment-dashboard__stat-value">{{ stats.totalForms }}</div>
          <div class="assessment-dashboard__stat-label">{{ t('assessmentDashboard.stats.totalForms') }}</div>
        </div>
        <div class="assessment-dashboard__stat-card">
          <div class="assessment-dashboard__stat-value">{{ stats.activeSubmissions }}</div>
          <div class="assessment-dashboard__stat-label">{{ t('assessmentDashboard.stats.activeSubmissions') }}</div>
        </div>
        <div class="assessment-dashboard__stat-card">
          <div class="assessment-dashboard__stat-value">{{ stats.pendingReview }}</div>
          <div class="assessment-dashboard__stat-label">{{ t('assessmentDashboard.stats.pendingReview') }}</div>
        </div>
        <div class="assessment-dashboard__stat-card">
          <div class="assessment-dashboard__stat-value">{{ stats.completedThisMonth }}</div>
          <div class="assessment-dashboard__stat-label">{{ t('assessmentDashboard.stats.completedThisMonth') }}</div>
        </div>
      </div>

      <div class="assessment-dashboard__quick-actions">
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
    </div>
  </MainLayout>
</template>

<style scoped>
.assessment-dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.assessment-dashboard__stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.assessment-dashboard__stat-card {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  padding: 1.25rem;
  text-align: center;
}

.assessment-dashboard__stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
}

.assessment-dashboard__stat-label {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  margin-top: 0.25rem;
}

.assessment-dashboard__quick-actions {
  display: flex;
  gap: 0.75rem;
}
</style>

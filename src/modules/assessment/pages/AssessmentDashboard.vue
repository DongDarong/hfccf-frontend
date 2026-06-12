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

      <div class="workflow-guidance">
        <p class="workflow-guidance__step">
          <span class="workflow-guidance__icon">📋</span>
          <strong>Step 1 — Create:</strong> Build forms using templates or the wizard
        </p>
        <p class="workflow-guidance__step">
          <span class="workflow-guidance__icon">📥</span>
          <strong>Step 2 — Collect:</strong> Track active submissions and responses
        </p>
        <p class="workflow-guidance__step">
          <span class="workflow-guidance__icon">📊</span>
          <strong>Step 3 — Analyze:</strong> Review reports and identify insights
        </p>
        <p class="workflow-guidance__step">
          <span class="workflow-guidance__icon">✅</span>
          <strong>Step 4 — Act:</strong> Make decisions based on assessment data
        </p>
      </div>

      <div class="assessment-dashboard__section">
        <h2 class="assessment-dashboard__section-title">📈 Dashboard Overview</h2>
        <p class="assessment-dashboard__section-subtitle">Current status and key metrics</p>
      </div>

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

      <div class="assessment-dashboard__section">
        <h2 class="assessment-dashboard__section-title">🚀 Quick Actions</h2>
        <p class="assessment-dashboard__section-subtitle">Frequently used tools and operations</p>
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

.workflow-guidance {
  border-radius: 1rem;
  border: 1px solid #dbeafe;
  background: #eff6ff;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.workflow-guidance__step {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: #1e40af;
}

.workflow-guidance__icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.assessment-dashboard__section {
  margin-top: 0.5rem;
  margin-bottom: 0rem;
}

.assessment-dashboard__section-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.assessment-dashboard__section-subtitle {
  margin: 0;
  font-size: 0.85rem;
  color: #64748b;
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
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .workflow-guidance {
    gap: 0.5rem;
    padding: 1rem;
  }

  .workflow-guidance__step {
    font-size: 0.9rem;
  }

  .assessment-dashboard__quick-actions {
    flex-direction: column;
  }
}
</style>

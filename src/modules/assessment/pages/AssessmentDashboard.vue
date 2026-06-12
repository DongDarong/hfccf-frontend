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
          <div class="assessment-dashboard__stat-icon">📋</div>
          <div class="assessment-dashboard__stat-value">{{ stats.totalForms }}</div>
          <div class="assessment-dashboard__stat-label">{{ t('assessmentDashboard.stats.totalForms') }}</div>
        </div>
        <div class="assessment-dashboard__stat-card">
          <div class="assessment-dashboard__stat-icon">📥</div>
          <div class="assessment-dashboard__stat-value">{{ stats.activeSubmissions }}</div>
          <div class="assessment-dashboard__stat-label">{{ t('assessmentDashboard.stats.activeSubmissions') }}</div>
        </div>
        <div class="assessment-dashboard__stat-card assessment-dashboard__stat-card--warning">
          <div class="assessment-dashboard__stat-icon">⏳</div>
          <div class="assessment-dashboard__stat-value">{{ stats.pendingReview }}</div>
          <div class="assessment-dashboard__stat-label">{{ t('assessmentDashboard.stats.pendingReview') }}</div>
        </div>
        <div class="assessment-dashboard__stat-card assessment-dashboard__stat-card--success">
          <div class="assessment-dashboard__stat-icon">✅</div>
          <div class="assessment-dashboard__stat-value">{{ stats.completedThisMonth }}</div>
          <div class="assessment-dashboard__stat-label">{{ t('assessmentDashboard.stats.completedThisMonth') }}</div>
        </div>
      </div>

      <div class="assessment-dashboard__zone">
        <div class="assessment-dashboard__zone-header">
          <h2 class="assessment-dashboard__zone-title">📊 Data & Insights</h2>
          <p class="assessment-dashboard__zone-subtitle">Recent activity and risk distribution</p>
        </div>

        <div class="assessment-dashboard__insights-grid">
          <div class="assessment-dashboard__insight-card">
            <h3 class="assessment-dashboard__insight-title">📈 Recent Submissions</h3>
            <div v-if="recentSubmissions.length === 0" class="assessment-dashboard__empty">
              No recent submissions yet
            </div>
            <div v-else class="assessment-dashboard__submission-list">
              <div
                v-for="(submission, idx) in recentSubmissions.slice(0, 3)"
                :key="idx"
                class="assessment-dashboard__submission-item"
              >
                <span class="assessment-dashboard__submission-name">
                  {{ submission.student?.full_name || submission.form_name || '—' }}
                </span>
                <span class="assessment-dashboard__submission-date">
                  {{ submission.submitted_at || '—' }}
                </span>
              </div>
            </div>
          </div>

          <div class="assessment-dashboard__insight-card">
            <h3 class="assessment-dashboard__insight-title">⚠️ Risk Distribution</h3>
            <div v-if="riskDistribution.length === 0" class="assessment-dashboard__empty">
              No risk data available
            </div>
            <div v-else class="assessment-dashboard__risk-list">
              <div
                v-for="risk in riskDistribution.slice(0, 3)"
                :key="risk.level"
                class="assessment-dashboard__risk-item"
              >
                <span
                  class="assessment-dashboard__risk-badge"
                  :style="{ backgroundColor: risk.color }"
                >
                  {{ risk.level_name }}
                </span>
                <span class="assessment-dashboard__risk-count">{{ risk.count }} students</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="assessment-dashboard__zone">
        <div class="assessment-dashboard__zone-header">
          <h2 class="assessment-dashboard__zone-title">🚀 Quick Actions</h2>
          <p class="assessment-dashboard__zone-subtitle">Access frequently used tools</p>
        </div>

        <div class="assessment-dashboard__action-grid">
          <div
            class="assessment-dashboard__action-card"
            @click="router.push({ name: 'assessment-form-list' })"
          >
            <div class="assessment-dashboard__action-icon">📋</div>
            <div class="assessment-dashboard__action-title">Manage Templates</div>
            <div class="assessment-dashboard__action-desc">Create, edit, and organize forms</div>
          </div>

          <div
            class="assessment-dashboard__action-card"
            @click="router.push({ name: 'assessment-submission-list' })"
          >
            <div class="assessment-dashboard__action-icon">📥</div>
            <div class="assessment-dashboard__action-title">View Submissions</div>
            <div class="assessment-dashboard__action-desc">Monitor responses and status</div>
          </div>

          <div
            class="assessment-dashboard__action-card"
            @click="router.push({ name: 'assessment-reports' })"
          >
            <div class="assessment-dashboard__action-icon">📊</div>
            <div class="assessment-dashboard__action-title">View Reports</div>
            <div class="assessment-dashboard__action-desc">Analyze trends and insights</div>
          </div>

          <div
            class="assessment-dashboard__action-card"
            @click="router.push({ name: 'assessment-wizard' })"
          >
            <div class="assessment-dashboard__action-icon">✨</div>
            <div class="assessment-dashboard__action-title">New Assessment</div>
            <div class="assessment-dashboard__action-desc">Start a new assessment wizard</div>
          </div>
        </div>
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
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  position: relative;
  transition: all 0.2s ease;
}

.assessment-dashboard__stat-card:hover {
  border-color: #bfdbfe;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.assessment-dashboard__stat-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.assessment-dashboard__stat-value {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--primary-color);
  margin: 0.5rem 0;
}

.assessment-dashboard__stat-label {
  font-size: 0.85rem;
  color: var(--text-color-secondary);
  margin: 0;
  font-weight: 500;
}

.assessment-dashboard__stat-card--warning {
  border-left: 4px solid #f59e0b;
}

.assessment-dashboard__stat-card--success {
  border-left: 4px solid #10b981;
}

.assessment-dashboard__zone {
  margin-top: 1rem;
}

.assessment-dashboard__zone-header {
  margin-bottom: 1rem;
}

.assessment-dashboard__zone-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.assessment-dashboard__zone-subtitle {
  margin: 0;
  font-size: 0.85rem;
  color: #64748b;
}

.assessment-dashboard__insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.assessment-dashboard__insight-card {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 1rem;
  padding: 1.25rem;
}

.assessment-dashboard__insight-title {
  margin: 0 0 0.75rem 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
}

.assessment-dashboard__empty {
  color: var(--text-color-secondary);
  font-size: 0.85rem;
  padding: 1rem 0;
  text-align: center;
}

.assessment-dashboard__submission-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.assessment-dashboard__submission-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  font-size: 0.85rem;
}

.assessment-dashboard__submission-name {
  font-weight: 500;
  color: #0f172a;
}

.assessment-dashboard__submission-date {
  color: var(--text-color-secondary);
  font-size: 0.75rem;
}

.assessment-dashboard__risk-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.assessment-dashboard__risk-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
}

.assessment-dashboard__risk-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}

.assessment-dashboard__risk-count {
  color: var(--text-color-secondary);
}

.assessment-dashboard__action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.assessment-dashboard__action-card {
  background: linear-gradient(135deg, #f0f9ff 0%, #eff6ff 100%);
  border: 1px solid #bfdbfe;
  border-radius: 1rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.assessment-dashboard__action-card:hover {
  border-color: #93c5fd;
  background: linear-gradient(135deg, #e0f2fe 0%, #e0e7ff 100%);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  transform: translateY(-2px);
}

.assessment-dashboard__action-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  display: block;
}

.assessment-dashboard__action-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.35rem;
}

.assessment-dashboard__action-desc {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
}

@media (max-width: 768px) {
  .workflow-guidance {
    gap: 0.5rem;
    padding: 1rem;
  }

  .workflow-guidance__step {
    font-size: 0.9rem;
  }

  .assessment-dashboard__insights-grid {
    grid-template-columns: 1fr;
  }

  .assessment-dashboard__action-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .assessment-dashboard__stat-card {
    padding: 1.25rem;
  }

  .assessment-dashboard__stat-value {
    font-size: 1.75rem;
  }
}
</style>

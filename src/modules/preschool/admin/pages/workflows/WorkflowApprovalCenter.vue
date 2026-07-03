<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useUserStore } from '@/store/userStore'
import { useWorkflowData } from './composables/useWorkflowData'
import { useWorkflowFilters } from './composables/useWorkflowFilters'
import WorkflowHeaderSection from './sections/WorkflowHeaderSection.vue'
import WorkflowSummarySection from './sections/WorkflowSummarySection.vue'
import PendingApprovalsSection from './sections/PendingApprovalsSection.vue'
import WorkflowQueueSection from './sections/WorkflowQueueSection.vue'
import OverdueWorkflowsSection from './sections/OverdueWorkflowsSection.vue'
import MyAssignmentsSection from './sections/MyAssignmentsSection.vue'
import RecentlyUpdatedWorkflowsSection from './sections/RecentlyUpdatedWorkflowsSection.vue'
import WorkflowTimelinePreviewSection from './sections/WorkflowTimelinePreviewSection.vue'
import { useWorkflowActions } from './composables/useWorkflowActions'

defineOptions({
  name: 'PreschoolWorkflowApprovalCenter',
})

const router = useRouter()
const { t } = useLanguage()
const userStore = useUserStore()
const { cloneFilters } = useWorkflowFilters()
const {
  loading,
  errorMessage,
  summary,
  workflows,
  approvals,
  overdueWorkflows,
  myAssignments,
  recentlyUpdatedWorkflows,
  recentTimelineEvents,
  generatedAt,
  loadWorkflows,
} = useWorkflowData()
const {
  approveApproval,
  rejectApproval,
  returnApproval,
  cancelApproval,
} = useWorkflowActions()

const labels = computed(() => ({
  title: t('preschoolWorkflowsPage.title'),
  subtitle: t('preschoolWorkflowsPage.subtitle'),
  refresh: t('preschoolWorkflowsPage.refresh'),
  generatedAt: t('preschoolWorkflowsPage.generatedAt'),
  totalWorkflows: t('preschoolWorkflowsPage.summary.totalWorkflows'),
  pendingApprovals: t('preschoolWorkflowsPage.summary.pendingApprovals'),
  overdueWorkflows: t('preschoolWorkflowsPage.summary.overdueWorkflows'),
  escalatedWorkflows: t('preschoolWorkflowsPage.summary.escalatedWorkflows'),
  myAssignments: t('preschoolWorkflowsPage.summary.myAssignments'),
  completedRecently: t('preschoolWorkflowsPage.summary.completedRecently'),
  workflowQueue: t('preschoolWorkflowsPage.workflowQueue'),
  approvalQueue: t('preschoolWorkflowsPage.approvalQueue'),
  pendingApprovalsSection: t('preschoolWorkflowsPage.pendingApprovals'),
  overdueWorkflowsSection: t('preschoolWorkflowsPage.overdueWorkflows'),
  recentlyUpdated: t('preschoolWorkflowsPage.recentlyUpdated'),
  timeline: t('preschoolWorkflowsPage.timeline'),
  currentStep: t('preschoolWorkflowsPage.currentStep'),
  sourceEntity: t('preschoolWorkflowsPage.sourceEntity'),
  assignee: t('preschoolWorkflowsPage.assignee'),
  dueDate: t('preschoolWorkflowsPage.dueDate'),
  sla: t('preschoolWorkflowsPage.sla'),
  viewWorkflow: t('preschoolWorkflowsPage.viewWorkflow'),
  viewSource: t('preschoolWorkflowsPage.viewSource'),
  approve: t('preschoolWorkflowsPage.approve'),
  reject: t('preschoolWorkflowsPage.reject'),
  return: t('preschoolWorkflowsPage.return'),
  assign: t('preschoolWorkflowsPage.assign'),
  transition: t('preschoolWorkflowsPage.transition'),
  completeWorkflow: t('preschoolWorkflowsPage.completeWorkflow'),
  cancelWorkflow: t('preschoolWorkflowsPage.cancelWorkflow'),
  escalateWorkflow: t('preschoolWorkflowsPage.escalateWorkflow'),
  noWorkflows: t('preschoolWorkflowsPage.noWorkflows'),
  noPendingApprovals: t('preschoolWorkflowsPage.noPendingApprovals'),
  noTimeline: t('preschoolWorkflowsPage.noTimeline'),
  emptyWorkflows: t('preschoolWorkflowsPage.empty.workflows'),
  emptyApprovals: t('preschoolWorkflowsPage.empty.approvals'),
  emptyTimeline: t('preschoolWorkflowsPage.empty.timeline'),
  workflow: t('preschoolWorkflowsPage.workflow'),
}))

const currentRole = computed(() => String(userStore.currentUser?.role_code ?? userStore.currentUser?.role ?? ''))

async function refreshWorkflows() {
  await loadWorkflows(cloneFilters())
}

function openWorkflow(workflow) {
  if (!workflow?.id || !router.hasRoute('dashboard-preschool-admin-workflow-details')) {
    return
  }

  router.push({
    name: 'dashboard-preschool-admin-workflow-details',
    params: { id: workflow.id },
  })
}

async function approvePendingApproval(approval) {
  if (!approval?.id) {
    return
  }

  await approveApproval(approval.id, {}, refreshWorkflows)
}

async function rejectPendingApproval(approval) {
  if (!approval?.id) {
    return
  }

  await rejectApproval(approval.id, {}, refreshWorkflows)
}

async function returnPendingApproval(approval) {
  if (!approval?.id) {
    return
  }

  await returnApproval(approval.id, {}, refreshWorkflows)
}

async function cancelPendingApproval(approval) {
  if (!approval?.id) {
    return
  }

  await cancelApproval(approval.id, {}, refreshWorkflows)
}

onMounted(refreshWorkflows)
</script>

<template>
  <MainLayout>
    <section class="workflow-center">
      <WorkflowHeaderSection
        :title="labels.title"
        :subtitle="labels.subtitle"
        :generated-at="generatedAt ? `${labels.generatedAt}: ${generatedAt}` : ''"
        :loading="loading"
        :refresh-label="labels.refresh"
        @refresh="refreshWorkflows"
      />

      <div
        v-if="errorMessage"
        class="workflow-center__error"
      >
        {{ errorMessage }}
      </div>

      <div
        v-if="loading"
        class="workflow-center__loading"
      >
        {{ t('preschoolWorkflowsPage.loading') }}
      </div>

      <WorkflowSummarySection
        :summary="summary"
        :labels="labels"
      />

      <PendingApprovalsSection
        :approvals="approvals"
        :labels="labels"
        :can-act="currentRole === 'superadmin' || currentRole === 'adminpreschool'"
        @approve="approvePendingApproval"
        @reject="rejectPendingApproval"
        @return="returnPendingApproval"
        @cancel="cancelPendingApproval"
        @view-workflow="openWorkflow"
      />

      <WorkflowQueueSection
        :workflows="workflows"
        :labels="labels"
        @view-workflow="openWorkflow"
      />

      <OverdueWorkflowsSection
        :workflows="overdueWorkflows"
        :labels="labels"
        @view-workflow="openWorkflow"
      />

      <MyAssignmentsSection
        :workflows="myAssignments"
        :labels="labels"
        @view-workflow="openWorkflow"
      />

      <RecentlyUpdatedWorkflowsSection
        :workflows="recentlyUpdatedWorkflows"
        :labels="labels"
        @view-workflow="openWorkflow"
      />

      <WorkflowTimelinePreviewSection
        :events="recentTimelineEvents"
        :labels="labels"
      />
    </section>
  </MainLayout>
</template>

<style scoped>
.workflow-center {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.workflow-center__error,
.workflow-center__loading {
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  font-size: 0.9rem;
}

.workflow-center__error {
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
}

.workflow-center__loading {
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #475569;
}
</style>

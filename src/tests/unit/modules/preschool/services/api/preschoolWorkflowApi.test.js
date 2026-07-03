import { beforeEach, describe, expect, it, vi } from 'vitest'
import http from '@/services/http'
import {
  approvePreschoolWorkflowApproval,
  assignPreschoolWorkflow,
  cancelPreschoolWorkflow,
  cancelPreschoolWorkflowApproval,
  completePreschoolWorkflow,
  createPreschoolWorkflow,
  escalatePreschoolWorkflow,
  fetchPreschoolWorkflow,
  fetchPreschoolWorkflowApprovals,
  fetchPreschoolWorkflowDefinitions,
  fetchPreschoolWorkflowSummary,
  fetchPreschoolWorkflowTimeline,
  fetchPreschoolWorkflows,
  rejectPreschoolWorkflowApproval,
  requestPreschoolWorkflowApproval,
  returnPreschoolWorkflowApproval,
  transitionPreschoolWorkflow,
} from '@/modules/preschool/services/api/preschoolWorkflowApi'

vi.mock('@/services/http', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}))

function stubResponse(data) {
  return { data: { success: true, message: 'ok', data } }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('preschool workflow api', () => {
  it('sends supported workflow filters and normalizes the list payload', async () => {
    http.get.mockResolvedValueOnce(
      stubResponse({
        summary: {
          total: 4,
          pending_approval: 2,
          overdue: 1,
          my_assignments: 1,
        },
        items: [
          {
            id: 'wf-1',
            workflow_definition_id: 'def-1',
            workflow_definition_key: 'enrollment_admission',
            workflow_definition_name: 'Enrollment Admission',
            source_type: 'enrollment_application',
            source_id: 'app-1',
            source_label: 'Application #1',
            current_step: {
              id: 'step-1',
              key: 'submitted',
              name: 'Submitted',
              step_type: 'review',
              assigned_role: 'adminpreschool',
              sla_hours: 6,
            },
            status: 'in_progress',
            priority: 'high',
            assigned_to_user_id: 'user-1',
            assigned_role: 'adminpreschool',
            due_at: '2026-07-03T10:00:00Z',
            approvals_count: 2,
            events_count: 3,
            created_at: '2026-07-03T08:00:00Z',
            updated_at: '2026-07-03T09:00:00Z',
          },
        ],
        pagination: {
          current_page: 2,
          last_page: 5,
          per_page: 20,
          total: 100,
        },
      }),
    )

    await expect(fetchPreschoolWorkflows({
      page: 2,
      perPage: 20,
      status: 'in_progress',
      priority: 'high',
      search: 'application',
      sourceType: 'enrollment_application',
      workflowDefinitionKey: 'enrollment_admission',
      assignedToUserId: 'user-1',
      assignedRole: 'adminpreschool',
      ignored: 'value',
    })).resolves.toMatchObject({
      summary: {
        total: 4,
        pendingApproval: 2,
        overdue: 1,
        myAssignments: 1,
      },
      items: [
        {
          id: 'wf-1',
          workflowDefinitionKey: 'enrollment_admission',
          workflowDefinitionName: 'Enrollment Admission',
          sourceType: 'enrollment_application',
          sourceId: 'app-1',
          sourceLabel: 'Application #1',
          currentStep: {
            id: 'step-1',
            key: 'submitted',
            name: 'Submitted',
            stepType: 'review',
            assignedRole: 'adminpreschool',
            slaHours: 6,
          },
          status: 'in_progress',
          priority: 'high',
        },
      ],
      pagination: {
        currentPage: 2,
        lastPage: 5,
        perPage: 20,
        total: 100,
      },
    })

    expect(http.get).toHaveBeenCalledWith('/preschool/workflows', {
      params: {
        page: 2,
        per_page: 20,
        status: 'in_progress',
        priority: 'high',
        search: 'application',
        source_type: 'enrollment_application',
        workflow_definition_key: 'enrollment_admission',
        assigned_to_user_id: 'user-1',
        assigned_role: 'adminpreschool',
      },
      signal: undefined,
    })
  })

  it('normalizes definitions, workflow details, approvals, summary, and timeline payloads', async () => {
    http.get
      .mockResolvedValueOnce(
        stubResponse({
          definitions: [
            {
              id: 'def-1',
              key: 'health_alert_resolution',
              name: 'Health Alert Resolution',
              description: 'Resolve health alert',
              domain: 'health',
              is_active: true,
              steps: [
                {
                  id: 'step-1',
                  workflow_definition_id: 'def-1',
                  key: 'created',
                  name: 'Created',
                  sort_order: 1,
                  step_type: 'start',
                  assigned_role: 'adminpreschool',
                  sla_hours: 4,
                },
              ],
            },
          ],
        }),
      )
      .mockResolvedValueOnce(
        stubResponse({
          workflow: {
            id: 'wf-1',
            workflow_definition_key: 'health_alert_resolution',
            workflow_definition_name: 'Health Alert Resolution',
            source_type: 'health_alert',
            source_id: 'health-1',
            source_label: 'Health Alert #1',
            current_step: {
              id: 'step-1',
              key: 'created',
              name: 'Created',
            },
            status: 'pending_approval',
            priority: 'normal',
            assigned_to_user_id: 'user-1',
            assigned_role: 'adminpreschool',
            approvals: [
              {
                id: 'approval-1',
                workflow_instance_id: 'wf-1',
                status: 'pending',
                requested_to_role: 'adminpreschool',
                due_at: '2026-07-03T11:00:00Z',
              },
            ],
            timeline: [
              {
                id: 'event-1',
                event_type: 'created',
                title: 'Workflow created',
                actor: {
                  id: 'user-1',
                  first_name: 'Test',
                  last_name: 'User',
                  role_code: 'adminpreschool',
                },
                created_at: '2026-07-03T08:00:00Z',
              },
            ],
          },
        }),
      )
      .mockResolvedValueOnce(
        stubResponse({
          items: [
            {
              id: 'approval-1',
              workflow_instance_id: 'wf-1',
              status: 'pending',
              requested_to_role: 'adminpreschool',
              due_at: '2026-07-03T11:00:00Z',
            },
          ],
          pagination: {
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 1,
          },
        }),
      )
      .mockResolvedValueOnce(
        stubResponse({
          total: 4,
          pending_approval: 1,
          overdue: 1,
        }),
      )
      .mockResolvedValueOnce(
        stubResponse({
          items: [
            {
              id: 'event-1',
              event_type: 'created',
              title: 'Workflow created',
              created_at: '2026-07-03T08:00:00Z',
            },
          ],
        }),
      )

    await expect(fetchPreschoolWorkflowDefinitions()).resolves.toMatchObject({
      definitions: [
        {
          key: 'health_alert_resolution',
          name: 'Health Alert Resolution',
          steps: [
            {
              key: 'created',
              stepType: 'start',
              assignedRole: 'adminpreschool',
              slaHours: 4,
            },
          ],
        },
      ],
    })

    await expect(fetchPreschoolWorkflow('wf-1')).resolves.toMatchObject({
      workflow: {
        id: 'wf-1',
        workflowDefinitionKey: 'health_alert_resolution',
        sourceType: 'health_alert',
        sourceId: 'health-1',
        sourceLabel: 'Health Alert #1',
        currentStep: {
          key: 'created',
          name: 'Created',
        },
        approvals: [
          {
            id: 'approval-1',
            workflowInstanceId: 'wf-1',
            status: 'pending',
            requestedToRole: 'adminpreschool',
          },
        ],
        timeline: [
          {
            id: 'event-1',
            eventType: 'created',
            title: 'Workflow created',
            actor: {
              firstName: 'Test',
              lastName: 'User',
              roleCode: 'adminpreschool',
            },
          },
        ],
      },
    })

    await expect(fetchPreschoolWorkflowApprovals({ status: 'pending' })).resolves.toMatchObject({
      items: [
        {
          id: 'approval-1',
          workflowInstanceId: 'wf-1',
          status: 'pending',
          requestedToRole: 'adminpreschool',
        },
      ],
      pagination: {
        currentPage: 1,
        lastPage: 1,
        perPage: 10,
        total: 1,
      },
    })

    await expect(fetchPreschoolWorkflowSummary({ status: 'pending' })).resolves.toMatchObject({
      total: 4,
      pendingApproval: 1,
      overdue: 1,
    })

    await expect(fetchPreschoolWorkflowTimeline('wf-1')).resolves.toMatchObject({
      timeline: [
        {
          id: 'event-1',
          eventType: 'created',
          title: 'Workflow created',
        },
      ],
    })
  })

  it('calls the workflow and approval action endpoints', async () => {
    http.post.mockResolvedValue(stubResponse({ workflow: { id: 'wf-2' }, approval: { id: 'approval-2' } }))
    http.patch.mockResolvedValue(stubResponse({ workflow: { id: 'wf-2' }, approval: { id: 'approval-2' } }))

    await createPreschoolWorkflow({ workflowDefinitionKey: 'invoice_collection' })
    await assignPreschoolWorkflow('wf-2', { assignedRole: 'adminpreschool' })
    await transitionPreschoolWorkflow('wf-2', { nextStepKey: 'review' })
    await completePreschoolWorkflow('wf-2', { decisionNotes: 'Done' })
    await cancelPreschoolWorkflow('wf-2', { decisionNotes: 'Cancelled' })
    await escalatePreschoolWorkflow('wf-2', { decisionNotes: 'Escalate' })
    await requestPreschoolWorkflowApproval('wf-2', { requestedToRole: 'adminpreschool' })
    await approvePreschoolWorkflowApproval('approval-2', { decisionNotes: 'Approved' })
    await rejectPreschoolWorkflowApproval('approval-2', { decisionNotes: 'Rejected' })
    await returnPreschoolWorkflowApproval('approval-2', { decisionNotes: 'Return' })
    await cancelPreschoolWorkflowApproval('approval-2', { decisionNotes: 'Cancel' })

    expect(http.post).toHaveBeenCalledWith('/preschool/workflows', { workflowDefinitionKey: 'invoice_collection' })
    expect(http.patch).toHaveBeenCalledWith('/preschool/workflows/wf-2/assign', { assignedRole: 'adminpreschool' })
    expect(http.patch).toHaveBeenCalledWith('/preschool/workflows/wf-2/transition', { nextStepKey: 'review' })
    expect(http.patch).toHaveBeenCalledWith('/preschool/workflows/wf-2/complete', { decisionNotes: 'Done' })
    expect(http.patch).toHaveBeenCalledWith('/preschool/workflows/wf-2/cancel', { decisionNotes: 'Cancelled' })
    expect(http.patch).toHaveBeenCalledWith('/preschool/workflows/wf-2/escalate', { decisionNotes: 'Escalate' })
    expect(http.post).toHaveBeenCalledWith('/preschool/workflows/wf-2/approvals', { requestedToRole: 'adminpreschool' })
    expect(http.patch).toHaveBeenCalledWith('/preschool/workflows/approvals/approval-2/approve', { decisionNotes: 'Approved' })
    expect(http.patch).toHaveBeenCalledWith('/preschool/workflows/approvals/approval-2/reject', { decisionNotes: 'Rejected' })
    expect(http.patch).toHaveBeenCalledWith('/preschool/workflows/approvals/approval-2/return', { decisionNotes: 'Return' })
    expect(http.patch).toHaveBeenCalledWith('/preschool/workflows/approvals/approval-2/cancel', { decisionNotes: 'Cancel' })
  })
})

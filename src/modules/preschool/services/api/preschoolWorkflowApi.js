import http from '@/services/http'
import { buildQueryParams, normalizePerPage, unwrapApiData } from '@/services/api'

function normalizeText(value) {
  return String(value ?? '').trim()
}

function normalizeNumber(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function normalizePrimitive(value) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizePrimitive(item))
  }

  if (!isObject(value)) {
    return value
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [key.replace(/[_-](\w)/g, (_, letter) => letter.toUpperCase()), normalizePrimitive(entry)]),
  )
}

function normalizeDefinitionStep(step = {}) {
  return {
    id: step.id ?? '',
    workflowDefinitionId: step.workflowDefinitionId ?? step.workflow_definition_id ?? '',
    key: normalizeText(step.key),
    name: normalizeText(step.name),
    sortOrder: normalizeNumber(step.sortOrder ?? step.sort_order, 0),
    stepType: normalizeText(step.stepType || step.step_type),
    assignedRole: normalizeText(step.assignedRole || step.assigned_role),
    slaHours: step.slaHours ?? step.sla_hours ?? null,
    config: normalizePrimitive(step.config || {}),
    createdAt: step.createdAt || step.created_at || '',
    updatedAt: step.updatedAt || step.updated_at || '',
  }
}

function normalizeDefinition(definition = {}) {
  return {
    id: definition.id ?? '',
    key: normalizeText(definition.key),
    name: normalizeText(definition.name),
    description: normalizeText(definition.description),
    domain: normalizeText(definition.domain),
    isActive: Boolean(definition.isActive ?? definition.is_active),
    config: normalizePrimitive(definition.config || {}),
    steps: Array.isArray(definition.steps) ? definition.steps.map(normalizeDefinitionStep) : [],
    createdAt: definition.createdAt || definition.created_at || '',
    updatedAt: definition.updatedAt || definition.updated_at || '',
  }
}

function normalizeUser(user = {}) {
  if (!isObject(user)) {
    return null
  }

  return {
    id: user.id ?? '',
    firstName: normalizeText(user.firstName || user.first_name),
    lastName: normalizeText(user.lastName || user.last_name),
    username: normalizeText(user.username),
    email: normalizeText(user.email),
    roleCode: normalizeText(user.roleCode || user.role_code),
    status: normalizeText(user.status),
  }
}

function normalizeStep(step = {}) {
  if (!isObject(step)) {
    return null
  }

  return {
    id: step.id ?? '',
    key: normalizeText(step.key),
    name: normalizeText(step.name),
    stepType: normalizeText(step.stepType || step.step_type),
    assignedRole: normalizeText(step.assignedRole || step.assigned_role),
    slaHours: step.slaHours ?? step.sla_hours ?? null,
    sortOrder: normalizeNumber(step.sortOrder ?? step.sort_order, 0),
  }
}

function normalizeInstance(instance = {}) {
  if (!isObject(instance)) {
    return null
  }

  return {
    id: instance.id ?? '',
    workflowDefinitionId: instance.workflowDefinitionId ?? instance.workflow_definition_id ?? '',
    workflowDefinitionKey: normalizeText(instance.workflowDefinitionKey || instance.workflow_definition_key),
    workflowDefinitionName: normalizeText(instance.workflowDefinitionName || instance.workflow_definition_name),
    workflowDefinitionDomain: normalizeText(instance.workflowDefinitionDomain || instance.workflow_definition_domain),
    sourceType: normalizeText(instance.sourceType || instance.source_type),
    sourceId: normalizeText(instance.sourceId || instance.source_id),
    sourceLabel: normalizeText(instance.sourceLabel || instance.source_label),
    currentStepId: instance.currentStepId ?? instance.current_step_id ?? null,
    currentStep: normalizeStep(instance.currentStep || instance.current_step || null),
    status: normalizeText(instance.status),
    priority: normalizeText(instance.priority || 'normal'),
    assignedToUserId: normalizeText(instance.assignedToUserId || instance.assigned_to_user_id),
    assignedRole: normalizeText(instance.assignedRole || instance.assigned_role),
    dueAt: instance.dueAt || instance.due_at || '',
    startedAt: instance.startedAt || instance.started_at || '',
    completedAt: instance.completedAt || instance.completed_at || '',
    cancelledAt: instance.cancelledAt || instance.cancelled_at || '',
    escalatedAt: instance.escalatedAt || instance.escalated_at || '',
    metadata: normalizePrimitive(instance.metadata || {}),
    assignee: normalizeUser(instance.assignee || null),
    approvalsCount: normalizeNumber(instance.approvalsCount ?? instance.approvals_count, 0),
    eventsCount: normalizeNumber(instance.eventsCount ?? instance.events_count, 0),
    definitions: Array.isArray(instance.definitions) ? instance.definitions.map(normalizeDefinitionStep) : [],
    approvals: Array.isArray(instance.approvals) ? instance.approvals.map(normalizeApproval) : [],
    timeline: Array.isArray(instance.timeline) ? instance.timeline.map(normalizeTimelineEvent) : [],
    createdAt: instance.createdAt || instance.created_at || '',
    updatedAt: instance.updatedAt || instance.updated_at || '',
  }
}

function normalizeApprovalStep(step = {}) {
  if (!isObject(step)) {
    return null
  }

  return {
    id: step.id ?? '',
    key: normalizeText(step.key),
    name: normalizeText(step.name),
    stepType: normalizeText(step.stepType || step.step_type),
  }
}

function normalizeApproval(approval = {}) {
  if (!isObject(approval)) {
    return null
  }

  return {
    id: approval.id ?? '',
    workflowInstanceId: approval.workflowInstanceId ?? approval.workflow_instance_id ?? '',
    workflowStepId: approval.workflowStepId ?? approval.workflow_step_id ?? null,
    requestedByUserId: normalizeText(approval.requestedByUserId || approval.requested_by_user_id),
    requestedToUserId: normalizeText(approval.requestedToUserId || approval.requested_to_user_id),
    requestedToRole: normalizeText(approval.requestedToRole || approval.requested_to_role),
    status: normalizeText(approval.status),
    decisionNotes: normalizeText(approval.decisionNotes || approval.decision_notes),
    decidedByUserId: normalizeText(approval.decidedByUserId || approval.decided_by_user_id),
    decidedAt: approval.decidedAt || approval.decided_at || '',
    dueAt: approval.dueAt || approval.due_at || '',
    metadata: normalizePrimitive(approval.metadata || {}),
    instance: normalizeInstance(approval.instance || null),
    step: normalizeApprovalStep(approval.step || null),
    requestedBy: normalizeUser(approval.requestedBy || approval.requested_by || null),
    requestedTo: normalizeUser(approval.requestedTo || approval.requested_to || null),
    decidedBy: normalizeUser(approval.decidedBy || approval.decided_by || null),
    createdAt: approval.createdAt || approval.created_at || '',
    updatedAt: approval.updatedAt || approval.updated_at || '',
  }
}

function normalizeTimelineActor(actor = {}) {
  if (!isObject(actor)) {
    return null
  }

  return {
    id: actor.id ?? '',
    firstName: normalizeText(actor.firstName || actor.first_name),
    lastName: normalizeText(actor.lastName || actor.last_name),
    username: normalizeText(actor.username),
    email: normalizeText(actor.email),
    roleCode: normalizeText(actor.roleCode || actor.role_code),
  }
}

function normalizeTimelineStep(step = {}) {
  if (!isObject(step)) {
    return null
  }

  return {
    id: step.id ?? '',
    key: normalizeText(step.key),
    name: normalizeText(step.name),
  }
}

function normalizeTimelineEvent(event = {}) {
  if (!isObject(event)) {
    return null
  }

  return {
    id: event.id ?? '',
    eventType: normalizeText(event.eventType || event.event_type),
    title: normalizeText(event.title),
    description: normalizeText(event.description),
    actor: normalizeTimelineActor(event.actor || null),
    fromStatus: normalizeText(event.fromStatus || event.from_status),
    toStatus: normalizeText(event.toStatus || event.to_status),
    fromStep: normalizeTimelineStep(event.fromStep || event.from_step || null),
    toStep: normalizeTimelineStep(event.toStep || event.to_step || null),
    metadata: normalizePrimitive(event.metadata || {}),
    createdAt: event.createdAt || event.created_at || '',
  }
}

function normalizeSummary(summary = {}) {
  return {
    total: normalizeNumber(summary.total, 0),
    open: normalizeNumber(summary.open, 0),
    inProgress: normalizeNumber(summary.inProgress ?? summary.in_progress, 0),
    pendingApproval: normalizeNumber(summary.pendingApproval ?? summary.pending_approval, 0),
    approved: normalizeNumber(summary.approved, 0),
    rejected: normalizeNumber(summary.rejected, 0),
    returned: normalizeNumber(summary.returned, 0),
    completed: normalizeNumber(summary.completed, 0),
    cancelled: normalizeNumber(summary.cancelled, 0),
    escalated: normalizeNumber(summary.escalated, 0),
    overdue: normalizeNumber(summary.overdue, 0),
    myAssignments: normalizeNumber(summary.myAssignments ?? summary.my_assignments, 0),
    myApprovals: normalizeNumber(summary.myApprovals ?? summary.my_approvals, 0),
  }
}

function normalizePagination(pagination = {}) {
  return {
    currentPage: normalizeNumber(pagination.currentPage ?? pagination.current_page, 1),
    lastPage: normalizeNumber(pagination.lastPage ?? pagination.last_page, 1),
    perPage: normalizeNumber(pagination.perPage ?? pagination.per_page, 10),
    total: normalizeNumber(pagination.total, 0),
  }
}

function normalizeListPayload(payload = {}) {
  const items = Array.isArray(payload.items)
    ? payload.items
    : Array.isArray(payload.workflows)
      ? payload.workflows
      : Array.isArray(payload.approvals)
        ? payload.approvals
        : []

  return {
    summary: normalizeSummary(payload.summary || {}),
    items: items.map(normalizeInstance).filter(Boolean),
    approvals: Array.isArray(payload.approvals) ? payload.approvals.map(normalizeApproval).filter(Boolean) : [],
    timeline: Array.isArray(payload.timeline) ? payload.timeline.map(normalizeTimelineEvent).filter(Boolean) : [],
    definitions: Array.isArray(payload.definitions) ? payload.definitions.map(normalizeDefinition).filter(Boolean) : [],
    pagination: payload.pagination ? normalizePagination(payload.pagination) : null,
  }
}

function pickFilter(filters = {}, snakeKey, camelKey) {
  return filters[snakeKey] ?? filters[camelKey] ?? filters[camelKey.charAt(0).toLowerCase() + camelKey.slice(1)] ?? undefined
}

function buildWorkflowQuery(filters = {}) {
  return buildQueryParams({
    page: filters.page ?? 1,
    per_page: normalizePerPage(filters.perPage ?? filters.per_page, 10, 100),
    status: pickFilter(filters, 'status', 'status'),
    priority: pickFilter(filters, 'priority', 'priority'),
    search: pickFilter(filters, 'search', 'search'),
    source_type: pickFilter(filters, 'source_type', 'sourceType'),
    workflow_definition_key: pickFilter(filters, 'workflow_definition_key', 'workflowDefinitionKey'),
    assigned_to_user_id: pickFilter(filters, 'assigned_to_user_id', 'assignedToUserId'),
    assigned_role: pickFilter(filters, 'assigned_role', 'assignedRole'),
  })
}

function buildApprovalQuery(filters = {}) {
  return buildQueryParams({
    page: filters.page ?? 1,
    per_page: normalizePerPage(filters.perPage ?? filters.per_page, 10, 100),
    status: pickFilter(filters, 'status', 'status'),
    search: pickFilter(filters, 'search', 'search'),
  })
}

async function unwrapListResponse(request, options = {}) {
  const response = await request(options)
  return normalizeListPayload(unwrapApiData(response) || {})
}

export async function fetchPreschoolWorkflowDefinitions(options = {}) {
  const response = await http.get('/preschool/workflows/definitions', { signal: options.signal })
  const payload = unwrapApiData(response) || {}
  const definitions = Array.isArray(payload.items)
    ? payload.items
    : Array.isArray(payload.definitions)
      ? payload.definitions
      : Array.isArray(payload.data)
        ? payload.data
        : []

  return {
    definitions: definitions.map(normalizeDefinition).filter(Boolean),
  }
}

export async function fetchPreschoolWorkflows(filters = {}, options = {}) {
  return unwrapListResponse(
    (requestOptions) => http.get('/preschool/workflows', {
      params: buildWorkflowQuery(filters),
      signal: requestOptions.signal,
    }),
    options,
  )
}

export async function fetchPreschoolWorkflowSummary(filters = {}, options = {}) {
  const response = await http.get('/preschool/workflows/summary', {
    params: buildWorkflowQuery(filters),
    signal: options.signal,
  })

  return normalizeSummary(unwrapApiData(response) || {})
}

export async function fetchPreschoolWorkflow(id, options = {}) {
  const response = await http.get(`/preschool/workflows/${id}`, { signal: options.signal })
  const payload = unwrapApiData(response) || {}
  return { workflow: normalizeInstance(payload.workflow || payload) }
}

export async function createPreschoolWorkflow(payload = {}) {
  const response = await http.post('/preschool/workflows', payload)
  const data = unwrapApiData(response) || {}
  return { workflow: normalizeInstance(data.workflow || data) }
}

export async function assignPreschoolWorkflow(id, payload = {}) {
  const response = await http.patch(`/preschool/workflows/${id}/assign`, payload)
  const data = unwrapApiData(response) || {}
  return { workflow: normalizeInstance(data.workflow || data) }
}

export async function transitionPreschoolWorkflow(id, payload = {}) {
  const response = await http.patch(`/preschool/workflows/${id}/transition`, payload)
  const data = unwrapApiData(response) || {}
  return { workflow: normalizeInstance(data.workflow || data) }
}

export async function completePreschoolWorkflow(id, payload = {}) {
  const response = await http.patch(`/preschool/workflows/${id}/complete`, payload)
  const data = unwrapApiData(response) || {}
  return { workflow: normalizeInstance(data.workflow || data) }
}

export async function cancelPreschoolWorkflow(id, payload = {}) {
  const response = await http.patch(`/preschool/workflows/${id}/cancel`, payload)
  const data = unwrapApiData(response) || {}
  return { workflow: normalizeInstance(data.workflow || data) }
}

export async function escalatePreschoolWorkflow(id, payload = {}) {
  const response = await http.patch(`/preschool/workflows/${id}/escalate`, payload)
  const data = unwrapApiData(response) || {}
  return { workflow: normalizeInstance(data.workflow || data) }
}

export async function fetchPreschoolWorkflowApprovals(filters = {}, options = {}) {
  const response = await http.get('/preschool/workflows/approvals', {
    params: buildApprovalQuery(filters),
    signal: options.signal,
  })
  const payload = unwrapApiData(response) || {}

  return {
    summary: normalizeSummary(payload.summary || {}),
    items: Array.isArray(payload.items) ? payload.items.map(normalizeApproval).filter(Boolean) : [],
    approvals: Array.isArray(payload.approvals) ? payload.approvals.map(normalizeApproval).filter(Boolean) : [],
    timeline: Array.isArray(payload.timeline) ? payload.timeline.map(normalizeTimelineEvent).filter(Boolean) : [],
    definitions: Array.isArray(payload.definitions) ? payload.definitions.map(normalizeDefinition).filter(Boolean) : [],
    pagination: payload.pagination ? normalizePagination(payload.pagination) : null,
  }
}

export async function requestPreschoolWorkflowApproval(id, payload = {}) {
  const response = await http.post(`/preschool/workflows/${id}/approvals`, payload)
  const data = unwrapApiData(response) || {}
  return { approval: normalizeApproval(data.approval || data) }
}

export async function approvePreschoolWorkflowApproval(id, payload = {}) {
  const response = await http.patch(`/preschool/workflows/approvals/${id}/approve`, payload)
  const data = unwrapApiData(response) || {}
  return { approval: normalizeApproval(data.approval || data) }
}

export async function rejectPreschoolWorkflowApproval(id, payload = {}) {
  const response = await http.patch(`/preschool/workflows/approvals/${id}/reject`, payload)
  const data = unwrapApiData(response) || {}
  return { approval: normalizeApproval(data.approval || data) }
}

export async function returnPreschoolWorkflowApproval(id, payload = {}) {
  const response = await http.patch(`/preschool/workflows/approvals/${id}/return`, payload)
  const data = unwrapApiData(response) || {}
  return { approval: normalizeApproval(data.approval || data) }
}

export async function cancelPreschoolWorkflowApproval(id, payload = {}) {
  const response = await http.patch(`/preschool/workflows/approvals/${id}/cancel`, payload)
  const data = unwrapApiData(response) || {}
  return { approval: normalizeApproval(data.approval || data) }
}

export async function fetchPreschoolWorkflowTimeline(id, options = {}) {
  const response = await http.get(`/preschool/workflows/${id}/timeline`, { signal: options.signal })
  const payload = unwrapApiData(response) || {}
  const items = Array.isArray(payload.items)
    ? payload.items
    : Array.isArray(payload.timeline)
      ? payload.timeline
      : Array.isArray(payload.data)
        ? payload.data
        : []

  return {
    timeline: items.map(normalizeTimelineEvent).filter(Boolean),
  }
}

export {
  buildWorkflowQuery,
  normalizeApproval,
  normalizeDefinition,
  normalizeInstance,
  normalizeListPayload,
  normalizeSummary,
  normalizeTimelineEvent,
}

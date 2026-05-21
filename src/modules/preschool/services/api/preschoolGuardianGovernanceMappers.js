export function normalizeGovernanceIssue(raw = {}) {
  return {
    id: raw.id ?? null,
    issueType: raw.issueType ?? raw.issue_type ?? '',
    issueKey: raw.issueKey ?? raw.issue_key ?? null,
    severity: raw.severity ?? 'info',
    priority: raw.priority ?? 'low',
    status: raw.status ?? 'detected',
    studentId: raw.studentId ?? raw.student_id ?? null,
    guardianId: raw.guardianId ?? raw.guardian_id ?? null,
    relationshipId: raw.relationshipId ?? raw.relationship_id ?? null,
    assignedToUserId: raw.assignedToUserId ?? raw.assigned_to_user_id ?? null,
    assignedToName: raw.assignedToName ?? raw.assigned_to_name ?? null,
    detectedAt: raw.detectedAt ?? raw.detected_at ?? null,
    acknowledgedAt: raw.acknowledgedAt ?? raw.acknowledged_at ?? null,
    resolvedAt: raw.resolvedAt ?? raw.resolved_at ?? null,
    dismissedAt: raw.dismissedAt ?? raw.dismissed_at ?? null,
    recurrenceCount: raw.recurrenceCount ?? raw.recurrence_count ?? 0,
    latestSnapshot: raw.latestSnapshot ?? raw.latest_snapshot ?? null,
    resolutionNotes: raw.resolutionNotes ?? raw.resolution_notes ?? null,
    metadata: raw.metadata ?? null,
    isStale: raw.isStale ?? raw.is_stale ?? false,
    isRecurring: raw.isRecurring ?? raw.is_recurring ?? false,
    daysSinceDetection: raw.daysSinceDetection ?? raw.days_since_detection ?? 0,
    staleThresholdDays: raw.staleThresholdDays ?? raw.stale_threshold_days ?? 14,
    createdAt: raw.createdAt ?? raw.created_at ?? null,
    updatedAt: raw.updatedAt ?? raw.updated_at ?? null,
  }
}

export function normalizeGovernanceIssueList(items = []) {
  if (!Array.isArray(items)) return []
  return items.map(normalizeGovernanceIssue)
}

export const SEVERITY_LABELS = {
  critical: 'Critical',
  warning: 'Warning',
  info: 'Info',
}

export const PRIORITY_LABELS = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export const STATUS_LABELS = {
  detected: 'Detected',
  acknowledged: 'Acknowledged',
  assigned: 'Assigned',
  in_review: 'In Review',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
}

export const SEVERITY_PRIMEVUE = {
  critical: 'danger',
  warning: 'warn',
  info: 'info',
}

export const PRIORITY_PRIMEVUE = {
  urgent: 'danger',
  high: 'warn',
  medium: 'info',
  low: 'secondary',
}

export const STATUS_PRIMEVUE = {
  detected: 'secondary',
  acknowledged: 'info',
  assigned: 'warn',
  in_review: 'warn',
  resolved: 'success',
  dismissed: 'secondary',
}

export const ACTIVE_STATUSES = ['detected', 'acknowledged', 'assigned', 'in_review']

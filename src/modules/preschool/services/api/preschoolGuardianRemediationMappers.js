// Normalize the remediation log shape so components never access raw snake_case
// fields directly and the backend contract stays decoupled from the UI.
export function normalizeRemediationLog(raw = {}) {
  return {
    id: raw.id ?? null,
    issueType: raw.issueType ?? raw.issue_type ?? '',
    issueKey: raw.issueKey ?? raw.issue_key ?? null,
    studentId: raw.studentId ?? raw.student_id ?? null,
    guardianId: raw.guardianId ?? raw.guardian_id ?? null,
    relatedGuardianId: raw.relatedGuardianId ?? raw.related_guardian_id ?? null,
    relationshipId: raw.relationshipId ?? raw.relationship_id ?? null,
    action: raw.action ?? '',
    beforeSnapshot: raw.beforeSnapshot ?? raw.before_snapshot ?? null,
    afterSnapshot: raw.afterSnapshot ?? raw.after_snapshot ?? null,
    notes: raw.notes ?? null,
    performedByUserId: raw.performedByUserId ?? raw.performed_by_user_id ?? null,
    performedByName: raw.performedByName ?? raw.performed_by_name ?? null,
    performedAt: raw.performedAt ?? raw.performed_at ?? null,
    createdAt: raw.createdAt ?? raw.created_at ?? null,
  }
}

export function normalizeRemediationLogList(items = []) {
  if (!Array.isArray(items)) return []
  return items.map(normalizeRemediationLog)
}

export const ACTION_LABELS = {
  mark_reviewed: 'Marked Reviewed',
  set_primary: 'Set Primary',
  clear_invalid_primary: 'Clear Invalid Primary',
  clear_invalid_emergency_contact: 'Clear Emergency Contact',
  reconcile_legacy_fields: 'Reconcile Legacy Fields',
  archive_duplicate_candidate: 'Archive Duplicate Candidate',
  archive_orphan_guardian: 'Archive Orphan Guardian',
}

export const ISSUE_TYPE_SEVERITY = {
  student_no_active_guardian: 'critical',
  multiple_active_primary_guardians: 'critical',
  archived_primary_relationship: 'warning',
  inactive_emergency_contact: 'warning',
  pickup_permission_issue: 'warning',
  legacy_guardian_mismatch: 'warning',
  guardian_without_students: 'info',
  duplicate_guardian_candidate: 'warning',
}

// Keep guardian integrity mapping isolated so the staff-only review page can
// stay stable even if the backend adds more consistency signals later.
import { normalizeGuardianRow } from './preschoolGuardianMappers'

function normalizeText(value) {
  return String(value ?? '').trim()
}

function normalizeNumber(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function normalizeStringList(values = []) {
  return Array.isArray(values) ? values.map((value) => normalizeText(value)).filter(Boolean) : []
}

function normalizeStudentSnapshot(row = {}) {
  return {
    id: row.id ?? '',
    studentCode: normalizeText(row.studentCode || row.student_code),
    fullName: normalizeText(row.fullName || row.full_name),
    status: normalizeText(row.status),
    guardianName: normalizeText(row.guardianName || row.guardian_name),
    guardianPhone: normalizeText(row.guardianPhone || row.guardian_phone),
    guardianSource: normalizeText(row.guardianSource || row.guardian_source || 'legacy'),
    activeRelationshipCount: normalizeNumber(row.activeRelationshipCount ?? row.active_relationship_count),
    classesCount: normalizeNumber(row.classesCount ?? row.classes_count),
    raw: row,
  }
}

function normalizeGuardianSnapshot(row = {}) {
  return normalizeGuardianRow(row)
}

function normalizePreferredGuardianSnapshot(row = {}) {
  return {
    guardianId: row.guardianId ?? row.guardian_id ?? '',
    guardianName: normalizeText(row.guardianName || row.guardian_name),
    guardianPhone: normalizeText(row.guardianPhone || row.guardian_phone),
    guardianSecondaryPhone: normalizeText(row.guardianSecondaryPhone || row.guardian_secondary_phone),
    guardianEmail: normalizeText(row.guardianEmail || row.guardian_email),
    relationshipId: row.relationshipId ?? row.relationship_id ?? '',
    relationshipType: normalizeText(row.relationshipType || row.relationship_type),
    isPrimary: Boolean(row.isPrimary ?? row.is_primary),
    canPickup: Boolean(row.canPickup ?? row.can_pickup),
    emergencyPriority: row.emergencyPriority ?? row.emergency_priority ?? null,
    relationshipStatus: normalizeText(row.relationshipStatus || row.relationship_status),
    source: normalizeText(row.source || 'normalized'),
    raw: row,
  }
}

export function normalizeIntegrityDuplicateGroup(row = {}) {
  return {
    guardianIds: Array.isArray(row.guardianIds) ? row.guardianIds.map((value) => String(value ?? '').trim()).filter(Boolean) : [],
    guardians: Array.isArray(row.guardians) ? row.guardians.map(normalizeGuardianSnapshot) : [],
    signals: normalizeStringList(row.signals),
    severity: normalizeText(row.severity || 'info'),
    title: normalizeText(row.title),
    message: normalizeText(row.message),
    raw: row,
  }
}

export function normalizeIntegrityDuplicateSummary(row = {}) {
  return {
    candidateGroups: normalizeNumber(row.candidateGroups ?? row.candidate_groups),
    matchedGuardians: normalizeNumber(row.matchedGuardians ?? row.matched_guardians),
    strongSignalGroups: normalizeNumber(row.strongSignalGroups ?? row.strong_signal_groups),
    reviewRecommended: Boolean(row.reviewRecommended ?? row.review_recommended),
  }
}

export function normalizeIntegrityIssue(row = {}) {
  return {
    id: normalizeText(row.id),
    type: normalizeText(row.type),
    severity: normalizeText(row.severity || 'info'),
    title: normalizeText(row.title),
    message: normalizeText(row.message),
    student: row.student ? normalizeStudentSnapshot(row.student) : null,
    guardian: row.guardian ? normalizeGuardianSnapshot(row.guardian) : null,
    relationship: row.relationship || null,
    difference: row.difference || null,
    preferredGuardian: row.preferredGuardian ? normalizePreferredGuardianSnapshot(row.preferredGuardian) : null,
    raw: row,
  }
}

export function normalizeIntegrityReport(row = {}) {
  const summary = row.summary || {}
  const sourceIssues = row.issues || row.items || row.data?.issues || row.data?.items || []
  const items = Array.isArray(sourceIssues) ? sourceIssues.map(normalizeIntegrityIssue) : []
  return {
    summary: {
      studentsWithoutActiveGuardian: normalizeNumber(summary.studentsWithoutActiveGuardian ?? summary.students_without_active_guardian),
      multiplePrimaryGuardianStudents: normalizeNumber(summary.multiplePrimaryGuardianStudents ?? summary.multiple_primary_guardian_students),
      guardiansWithoutStudents: normalizeNumber(summary.guardiansWithoutStudents ?? summary.guardians_without_students),
      pickupPermissionIssues: normalizeNumber(summary.pickupPermissionIssues ?? summary.pickup_permission_issues),
      archivedPrimaryRelationships: normalizeNumber(summary.archivedPrimaryRelationships ?? summary.archived_primary_relationships),
      inactiveEmergencyContacts: normalizeNumber(summary.inactiveEmergencyContacts ?? summary.inactive_emergency_contacts),
      legacyMismatches: normalizeNumber(summary.legacyMismatches ?? summary.legacy_mismatches),
      criticalCount: normalizeNumber(summary.criticalCount ?? summary.critical_count),
      warningCount: normalizeNumber(summary.warningCount ?? summary.warning_count),
      infoCount: normalizeNumber(summary.infoCount ?? summary.info_count),
      issueCount: normalizeNumber(summary.issueCount ?? summary.issue_count),
    },
    items,
    generatedAt: normalizeText(row.generatedAt || row.generated_at),
    raw: row,
  }
}

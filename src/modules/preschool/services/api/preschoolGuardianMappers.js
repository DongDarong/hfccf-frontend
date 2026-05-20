// Keep guardian normalization isolated so the UI can reuse the same contact
// shape across guardian management, student relationships, and emergency views.
function normalizeText(value) {
  return String(value ?? '').trim()
}

function normalizeTimestamp(value) {
  return value || ''
}

export function normalizeGuardianRow(row = {}) {
  return {
    id: row.id ?? '',
    fullName: normalizeText(row.fullName || row.full_name),
    phone: normalizeText(row.phone),
    secondaryPhone: normalizeText(row.secondaryPhone || row.secondary_phone),
    email: normalizeText(row.email),
    address: normalizeText(row.address),
    occupation: normalizeText(row.occupation),
    nationalId: normalizeText(row.nationalId || row.national_id),
    status: normalizeText(row.status || 'active'),
    notes: normalizeText(row.notes),
    relationshipsCount: Number(row.relationshipsCount ?? row.relationships_count ?? 0),
    activeRelationshipsCount: Number(row.activeRelationshipsCount ?? row.active_relationships_count ?? 0),
    createdByUserId: normalizeText(row.createdByUserId || row.created_by_user_id),
    updatedByUserId: normalizeText(row.updatedByUserId || row.updated_by_user_id),
    createdAt: normalizeTimestamp(row.createdAt || row.created_at),
    updatedAt: normalizeTimestamp(row.updatedAt || row.updated_at),
    deletedAt: normalizeTimestamp(row.deletedAt || row.deleted_at),
    raw: row,
  }
}

export function normalizeGuardianRows(rows = []) {
  return Array.isArray(rows) ? rows.map(normalizeGuardianRow) : []
}

export function normalizeStudentGuardianRow(row = {}) {
  const guardian = normalizeGuardianRow(row.guardian || {})

  return {
    id: row.id ?? '',
    studentId: row.studentId ?? row.student_id ?? '',
    guardianId: row.guardianId ?? row.guardian_id ?? guardian.id,
    relationshipType: normalizeText(row.relationshipType || row.relationship_type),
    isPrimary: Boolean(row.isPrimary ?? row.is_primary),
    canPickup: Boolean(row.canPickup ?? row.can_pickup),
    emergencyPriority: row.emergencyPriority ?? row.emergency_priority ?? null,
    status: normalizeText(row.status || 'active'),
    startsAt: row.startsAt || row.starts_at || '',
    endsAt: row.endsAt || row.ends_at || '',
    notes: normalizeText(row.notes),
    guardianName: normalizeText(row.guardianName || row.guardian_name || guardian.fullName),
    guardianPhone: normalizeText(row.guardianPhone || row.guardian_phone || guardian.phone),
    guardianSecondaryPhone: normalizeText(row.guardianSecondaryPhone || row.guardian_secondary_phone || guardian.secondaryPhone),
    guardianEmail: normalizeText(row.guardianEmail || row.guardian_email || guardian.email),
    guardian,
    createdByUserId: normalizeText(row.createdByUserId || row.created_by_user_id),
    updatedByUserId: normalizeText(row.updatedByUserId || row.updated_by_user_id),
    createdAt: normalizeTimestamp(row.createdAt || row.created_at),
    updatedAt: normalizeTimestamp(row.updatedAt || row.updated_at),
    deletedAt: normalizeTimestamp(row.deletedAt || row.deleted_at),
    raw: row,
  }
}

export function normalizeStudentGuardianRows(rows = []) {
  return Array.isArray(rows) ? rows.map(normalizeStudentGuardianRow) : []
}

export function normalizeEmergencyContactRows(rows = []) {
  return normalizeStudentGuardianRows(rows).sort((left, right) => {
    const leftPrimary = left.isPrimary ? 0 : 1
    const rightPrimary = right.isPrimary ? 0 : 1

    if (leftPrimary !== rightPrimary) return leftPrimary - rightPrimary

    const leftPriority = Number(left.emergencyPriority ?? Number.MAX_SAFE_INTEGER)
    const rightPriority = Number(right.emergencyPriority ?? Number.MAX_SAFE_INTEGER)

    if (leftPriority !== rightPriority) return leftPriority - rightPriority

    return left.guardianName.localeCompare(right.guardianName)
  })
}

import { mapUser } from '@/services/mappers/userMapper'

function normalizeText(value) {
  return String(value ?? '').trim()
}

/**
 * Guardian portal payloads are normalized here so portal pages can stay
 * read-only and avoid coupling to raw backend snapshots.
 */
export function mapGuardianPortalAccount(raw = {}) {
  return {
    id: raw.id ?? '',
    guardianId: raw.guardianId ?? raw.guardian_id ?? '',
    userId: raw.userId ?? raw.user_id ?? '',
    email: normalizeText(raw.email),
    status: normalizeText(raw.status),
    isActive: Boolean(raw.isActive ?? raw.is_active ?? raw.status === 'active'),
    invitedAt: raw.invitedAt || raw.invited_at || '',
    activatedAt: raw.activatedAt || raw.activated_at || '',
    revokedAt: raw.revokedAt || raw.revoked_at || '',
    lastLoginAt: raw.lastLoginAt || raw.last_login_at || '',
    activationExpiresAt:
      raw.activationExpiresAt ||
      raw.activation_expires_at ||
      raw.metadata?.activation_token_expires_at ||
      '',
    guardian: raw.guardian ? mapUser(raw.guardian) : null,
    user: raw.user ? mapUser(raw.user) : null,
    invitedBy: raw.invitedBy ? mapUser(raw.invitedBy) : null,
    raw,
  }
}

export function mapGuardianPortalStudent(raw = {}) {
  const firstName = normalizeText(raw.firstName || raw.first_name)
  const lastName = normalizeText(raw.lastName || raw.last_name)

  return {
    id: raw.id ?? '',
    studentCode: normalizeText(raw.studentCode || raw.student_code),
    firstName,
    lastName,
    fullName: normalizeText(raw.fullName || raw.full_name || `${firstName} ${lastName}`),
    gender: normalizeText(raw.gender),
    dateOfBirth: raw.dateOfBirth || raw.date_of_birth || '',
    guardianName: normalizeText(raw.guardianName || raw.guardian_name),
    guardianPhone: normalizeText(raw.guardianPhone || raw.guardian_phone),
    status: normalizeText(raw.status),
    classes: Array.isArray(raw.classes)
      ? raw.classes.map((classRow) => ({
          id: classRow.id ?? '',
          code: normalizeText(classRow.code || classRow.classCode),
          name: normalizeText(classRow.name || classRow.className),
          room: normalizeText(classRow.room),
          teacherDisplayName: normalizeText(classRow.teacherDisplayName || classRow.teacher_display_name),
        }))
      : [],
    raw,
  }
}

export function mapGuardianPortalSummary(raw = {}) {
  return {
    summary: raw.summary || {},
    items: Array.isArray(raw.items) ? raw.items : [],
    periods: Array.isArray(raw.periods) ? raw.periods : [],
    period: raw.period || null,
    report: raw.report || null,
    attendanceSummary: raw.attendanceSummary || null,
    scheduleSummary: raw.scheduleSummary || null,
    progressSummary: raw.progressSummary || null,
    reports: raw.reports || null,
    generatedAt: raw.generatedAt || raw.generated_at || '',
    raw,
  }
}

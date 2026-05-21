import { beforeEach, describe, expect, it, vi } from 'vitest'
import http from '@/services/http'
import {
  fetchGuardianConsistencyReport,
  fetchGuardianDuplicates,
} from '@/modules/preschool/services/api/preschoolGuardianIntegrityApi'

// Keep the guardian integrity HTTP contract tested so the staff-only review
// page cannot drift onto the wrong endpoint or lose response normalization.
vi.mock('@/services/http', () => ({
  default: {
    get: vi.fn(),
  },
}))

function stubResponse(data) {
  return { data: { success: true, message: 'ok', data } }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('preschool guardian integrity api', () => {
  it('calls the duplicate and consistency endpoints with normalized payloads', async () => {
    http.get.mockResolvedValueOnce(stubResponse({
      summary: {
        candidate_groups: 1,
        matched_guardians: 2,
        strong_signal_groups: 1,
        review_recommended: true,
      },
      items: [
        {
          guardianIds: [1, 2],
          guardians: [{ id: 1, full_name: 'Guardian One', phone: '012345678' }],
          signals: ['same_phone'],
          severity: 'warning',
        },
      ],
    }))

    await expect(fetchGuardianDuplicates()).resolves.toMatchObject({
      summary: {
        candidateGroups: 1,
        matchedGuardians: 2,
        strongSignalGroups: 1,
        reviewRecommended: true,
      },
      items: [
        {
          guardianIds: ['1', '2'],
          guardians: [{ id: 1, fullName: 'Guardian One' }],
          signals: ['same_phone'],
          severity: 'warning',
        },
      ],
    })
    expect(http.get).toHaveBeenCalledWith('/preschool/guardians/duplicates', { signal: undefined })

    http.get.mockResolvedValueOnce(stubResponse({
      summary: {
        students_without_active_guardian: 1,
        multiple_primary_guardian_students: 1,
        guardians_without_students: 1,
        pickup_permission_issues: 1,
        archived_primary_relationships: 1,
        inactive_emergency_contacts: 1,
        legacy_mismatches: 1,
        critical_count: 2,
        warning_count: 4,
        info_count: 1,
        issue_count: 7,
      },
      issues: [],
    }))

    await expect(fetchGuardianConsistencyReport()).resolves.toMatchObject({
      summary: {
        studentsWithoutActiveGuardian: 1,
        multiplePrimaryGuardianStudents: 1,
        guardiansWithoutStudents: 1,
        pickupPermissionIssues: 1,
        archivedPrimaryRelationships: 1,
        inactiveEmergencyContacts: 1,
        legacyMismatches: 1,
        criticalCount: 2,
        warningCount: 4,
        infoCount: 1,
        issueCount: 7,
      },
    })
    expect(http.get).toHaveBeenCalledWith('/preschool/guardians/consistency-report', { signal: undefined })
  })
})

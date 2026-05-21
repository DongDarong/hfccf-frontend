// Keep remediation copy separate from integrity so the two staff workflows
// stay independently translatable and searchable in the locale tree.
export default {
  preschoolGuardianRemediation: {
    page: {
      title: 'Guardian Remediation Center',
      subtitle:
        'Manually review and resolve guardian data issues. All actions are logged and irreversible without another remediation entry.',
      loadingIssues: 'Loading guardian integrity issues...',
      noIssues: 'No guardian integrity issues found.',
    },
    tabs: {
      issues: 'Integrity Issues',
      logs: 'Remediation Logs',
    },
    warning: {
      title: 'Manual action required',
      body: 'This action directly modifies guardian or relationship data. Review all details before confirming. Every action is permanently logged with your user account.',
    },
    actions: {
      markReviewed: 'Mark Reviewed',
      setPrimary: 'Set as Primary',
      clearInvalidPrimary: 'Clear Invalid Primary',
      clearInvalidEmergencyContact: 'Clear Emergency Flags',
      reconcileLegacyFields: 'Reconcile Legacy Fields',
      archiveOrphanGuardian: 'Archive Orphan Guardian',
      archiveDuplicateCandidate: 'Archive Duplicate Candidate',
      refreshIssues: 'Refresh Issues',
      cancel: 'Cancel',
      confirm: 'Confirm Action',
    },
    dialogTitles: {
      markReviewed: 'Mark Issue as Reviewed',
      setPrimary: 'Set Primary Guardian',
      clearInvalidPrimary: 'Clear Invalid Primary Flag',
      clearInvalidEmergencyContact: 'Clear Emergency Contact Flags',
      reconcileLegacyFields: 'Reconcile Legacy Guardian Fields',
      archiveOrphanGuardian: 'Archive Orphan Guardian',
      archiveDuplicateCandidate: 'Archive Duplicate Candidate',
    },
    dialogDescriptions: {
      markReviewed:
        'Log that this issue has been reviewed. No data will be changed. A note is recommended.',
      setPrimary:
        'Set this relationship as the primary guardian for the student. All other primary flags for this student will be cleared.',
      clearInvalidPrimary:
        'Remove the primary flag from this archived relationship. The guardian record will not be deleted.',
      clearInvalidEmergencyContact:
        'Clear the primary, pickup, and emergency flags from this inactive relationship.',
      reconcileLegacyFields:
        'Overwrite the student legacy fields (guardian_name, guardian_phone) with the current normalized primary guardian data. This cannot be automatically reversed.',
      archiveOrphanGuardian:
        'Archive this guardian record. Only possible if no student relationships exist. The record is preserved.',
      archiveDuplicateCandidate:
        'Archive this student-guardian relationship. The guardian record is not deleted or merged.',
    },
    issueTypes: {
      studentNoActiveGuardian: 'Student has no active guardian',
      multipleActivePrimaryGuardians: 'Student has multiple primary guardians',
      archivedPrimaryRelationship: 'Archived relationship still marked primary',
      inactiveEmergencyContact: 'Inactive relationship still has contact flags',
      pickupPermissionIssue: 'Emergency contact cannot pick up student',
      legacyGuardianMismatch: 'Legacy guardian fields differ from normalized data',
      guardianWithoutStudents: 'Guardian is not linked to any students',
      duplicateGuardianCandidate: 'Duplicate guardian candidate',
    },
    issueDescriptions: {
      studentNoActiveGuardian:
        'This student does not have an active normalized guardian relationship.',
      multipleActivePrimaryGuardians: 'Only one active primary guardian should exist per student.',
      archivedPrimaryRelationship:
        'Primary flags should be cleared when a relationship is archived.',
      inactiveEmergencyContact:
        'Inactive relationships should not remain primary or emergency contacts.',
      pickupPermissionIssue:
        'Emergency contacts should have explicit pickup permission when active.',
      legacyGuardianMismatch:
        'The legacy compatibility fields on the student record differ from the normalized guardian.',
      guardianWithoutStudents:
        'This guardian record has no linked student relationships.',
      duplicateGuardianCandidate:
        'This guardian record shares signals with another record.',
    },
    labels: {
      student: 'Student',
      guardian: 'Guardian',
      relationship: 'Relationship',
      notes: 'Notes',
      before: 'Before',
      after: 'After',
      snapshots: 'Before / After Snapshots',
      legacyDifferences: 'Legacy field differences',
    },
    placeholders: {
      notes: 'Optional notes about this remediation action...',
    },
    table: {
      performedAt: 'Performed At',
      issueType: 'Issue Type',
      action: 'Action',
      performedBy: 'Performed By',
      notes: 'Notes',
      snapshots: 'Snapshots',
      viewSnapshots: 'View',
      empty: 'No remediation logs found.',
    },
    success: {
      markReviewed: 'Issue marked as reviewed.',
      setPrimary: 'Primary guardian updated.',
      clearInvalidPrimary: 'Invalid primary flag cleared.',
      clearInvalidEmergencyContact: 'Emergency contact flags cleared.',
      reconcileLegacyFields: 'Legacy fields reconciled from normalized data.',
      archiveOrphanGuardian: 'Orphan guardian archived.',
      archiveDuplicateCandidate: 'Duplicate candidate relationship archived.',
    },
    errors: {
      loadLogsFailed: 'Failed to load remediation logs.',
      actionFailed: 'Remediation action failed. Please review the details and try again.',
    },
  },
}

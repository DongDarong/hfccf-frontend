// Keep integrity copy separate from the core guardian pages so the staff
// review workflow stays searchable and does not mix with CRUD labels.
export default {
  preschoolGuardianIntegrityPage: {
    title: 'Guardian Integrity',
    subtitle: 'Review duplicate guardian records and relationship consistency before staff rely on them.',
    loading: 'Loading guardian integrity data...',
    empty: 'No guardian integrity issues were found.',
    actions: {
      refresh: 'Refresh checks',
    },
    sections: {
      summary: 'Summary',
      duplicates: 'Possible duplicates',
      issues: 'Consistency issues',
    },
    summary: {
      duplicateGroups: 'Possible duplicate groups',
      matchedGuardians: 'Guardians in duplicate groups',
      issueCount: 'Total issues',
      criticalCount: 'Critical issues',
      warningCount: 'Warning issues',
      infoCount: 'Info items',
      studentsWithoutActiveGuardian: 'Students without active guardian',
      multiplePrimaryGuardianStudents: 'Students with multiple primary guardians',
      guardiansWithoutStudents: 'Guardians not linked to students',
      archivedPrimaryRelationships: 'Archived primary relationships',
      inactiveEmergencyContacts: 'Inactive emergency contact flags',
      pickupPermissionIssues: 'Pickup permission issues',
      legacyMismatches: 'Legacy field mismatches',
    },
    duplicateGroup: {
      title: 'Possible duplicate group #{index}',
      heading: 'Review before linking or archiving anything',
      message: 'These guardian records share one or more matching signals. Staff should compare them manually.',
    },
    signalLabels: {
      samePhone: 'Same phone',
      sameEmail: 'Same email',
      sameNamePhone: 'Same name + phone',
      sameNameRelationshipType: 'Same name + relationship',
    },
    issueTypes: {
      studentNoActiveGuardian: 'Student has no active guardian',
      multipleActivePrimaryGuardians: 'Student has multiple primary guardians',
      guardianWithoutStudents: 'Guardian is not linked to students',
      archivedPrimaryRelationship: 'Archived relationship still marked primary',
      inactiveEmergencyContact: 'Inactive relationship still marked as contact',
      pickupPermissionIssue: 'Emergency contact cannot pick up',
      legacyGuardianMismatch: 'Legacy guardian fields differ from normalized data',
    },
    issueDescriptions: {
      studentNoActiveGuardian: 'This student does not currently have an active normalized guardian relationship.',
      multipleActivePrimaryGuardians: 'Only one active primary guardian should exist for each student.',
      guardianWithoutStudents: 'This guardian record exists, but no active student relationships are attached.',
      archivedPrimaryRelationship: 'Primary flags should be cleared when a relationship is archived.',
      inactiveEmergencyContact: 'Inactive relationships should not remain primary or emergency contacts.',
      pickupPermissionIssue: 'Emergency contacts should have explicit pickup permission when the relationship is active.',
      legacyGuardianMismatch: 'The compatibility fields on the student record should match the normalized guardian snapshot.',
    },
    labels: {
      student: 'Student',
      guardian: 'Guardian',
      relationship: 'Relationship',
      preferredGuardian: 'Preferred guardian',
      legacyDifferences: 'Legacy differences',
      relationshipsCount: 'Relationships',
      activeRelationshipsCount: 'Active relationships',
    },
    guardianSources: {
      normalized: 'Normalized',
      legacy: 'Legacy',
    },
    legacyDifferenceLabels: {
      guardianName: 'Guardian name',
      guardianPhone: 'Guardian phone',
    },
    emptyDuplicates: 'No duplicate guardian records were detected.',
    emptyIssues: 'No relationship consistency issues were detected.',
    errors: {
      loadFailed: 'Failed to load guardian integrity data.',
    },
  },
}

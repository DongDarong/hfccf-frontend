// Keep guardian shared labels isolated so create/update flows, relationship
// forms, and emergency-contact views all use the same vocabulary contract.
// Regression protection: the same keys are reused across admin and teacher
// pages, so we keep them in one file instead of duplicating text strings.
export default {
  preschoolGuardianShared: {
    loading: 'Loading guardian records...',
    emptyGuardians: 'No guardians have been recorded yet.',
    labels: {
      noDetails: 'No additional details',
    },
    statusLabels: {
      active: 'Active',
      inactive: 'Inactive',
      archived: 'Archived',
    },
    relationshipTypes: {
      mother: 'Mother',
      father: 'Father',
      guardian: 'Guardian',
      grandparent: 'Grandparent',
      sibling: 'Sibling',
      relative: 'Relative',
      other: 'Other',
    },
    pickupPermission: {
      allowed: 'Pickup allowed',
      blocked: 'Pickup not allowed',
    },
    primaryGuardian: {
      primary: 'Primary guardian',
      secondary: 'Secondary guardian',
    },
    errors: {
      loadGuardians: 'Failed to load Preschool guardians.',
      loadRelationships: 'Failed to load Preschool student guardians.',
      loadEmergencyContacts: 'Failed to load Preschool emergency contacts.',
      saveGuardian: 'Unable to save the Preschool guardian right now.',
      saveRelationship: 'Unable to save the Preschool student guardian right now.',
      archiveGuardian: 'Unable to archive the Preschool guardian right now.',
      archiveRelationship: 'Unable to archive the Preschool student guardian right now.',
    },
  },
}

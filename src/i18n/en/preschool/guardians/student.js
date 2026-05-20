// Keep student-guardian relationship copy isolated so the link/update flow can
// evolve without touching the guardian master-data page text.
export default {
  preschoolStudentGuardiansPage: {
    title: 'Student Guardians',
    subtitle: 'Link guardians to Preschool students, track pickup permissions, and preserve relationship history.',
    loading: 'Loading Preschool student guardians...',
    empty: 'No guardian relationships found for the selected student.',
    actions: {
      linkGuardian: 'Link Guardian',
      archive: 'Archive Relationship',
      link: 'Link Guardian',
      update: 'Update Relationship',
    },
    columns: {
      guardian: 'Guardian',
      relationship: 'Relationship',
      flags: 'Flags',
      priority: 'Priority',
      status: 'Status',
      actions: 'Actions',
    },
    fields: {
      guardian: 'Guardian',
      relationshipType: 'Relationship type',
      priority: 'Emergency priority',
      status: 'Status',
      startsAt: 'Starts at',
      endsAt: 'Ends at',
      notes: 'Notes',
    },
    placeholders: {
      student: 'Select a student',
      guardian: 'Select a guardian',
      priority: '1 = highest priority',
      notes: 'Add optional relationship notes',
    },
    dialog: {
      createTitle: 'Link Guardian',
      editTitle: 'Edit Relationship',
    },
    alerts: {
      archiveTitle: 'Archive this relationship?',
      archiveMessage: 'This will keep the history but remove the relationship from active guardian lists.',
      archiveFallback: 'the selected relationship',
      successTitle: 'Student guardian updated',
      close: 'Close',
    },
    messages: {
      linkedSuccess: 'Guardian "{name}" was linked successfully.',
      updatedSuccess: 'Relationship for "{name}" was updated successfully.',
      archivedSuccess: 'Student guardian relationship was archived successfully.',
    },
    paginationHint: 'Page {page} of {total}',
    errors: {
      loadLookup: 'Failed to load Preschool guardian lookup data.',
      loadData: 'Failed to load Preschool student guardian data.',
      save: 'Unable to save the Preschool student guardian right now.',
      archive: 'Unable to archive the Preschool student guardian right now.',
    },
  },
}

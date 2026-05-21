// Keep guardian summary text separate from list and relationship copy so the
// read-only details view can evolve without changing the management screens.
// Regression protection: the detail route must stay admin-only and read-only.
export default {
  preschoolGuardianDetailsPage: {
    title: 'Guardian Details',
    subtitle: 'Review the reusable guardian record, relationship counts, and staff-managed metadata.',
    loading: 'Loading guardian details...',
    empty: 'No guardian record was found.',
    actions: {
      back: 'Back to guardians',
      manageRelationships: 'Manage relationships',
    },
    labels: {
      guardianRecord: 'Guardian record',
      phone: 'Phone',
      secondaryPhone: 'Secondary phone',
      email: 'Email',
      occupation: 'Occupation',
      address: 'Address',
      notes: 'Notes',
      summary: 'Summary',
      relationshipsCount: 'Total relationships',
      activeRelationshipsCount: 'Active relationships',
    },
    notes: {
      readOnly: 'This screen is read-only. Staff can review the guardian record, but edits stay on the management screens.',
    },
    errors: {
      load: 'Failed to load Preschool guardian details.',
    },
  },
}

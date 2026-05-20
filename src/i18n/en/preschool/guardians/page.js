// Keep the guardian master-data page copy separate from the relationship
// pages so admin workflows stay searchable and easy to audit later.
export default {
  preschoolGuardiansPage: {
    title: 'Preschool Guardians',
    subtitle: 'Manage reusable guardian records that can be linked to multiple Preschool students.',
    loading: 'Loading Preschool guardians...',
    empty: 'No guardian records found.',
    actions: {
      addGuardian: 'Add Guardian',
      archive: 'Archive',
      save: 'Save Guardian',
      update: 'Update Guardian',
    },
    filters: {
      searchPlaceholder: 'Search guardian name, phone, or email',
      allStatus: 'All statuses',
    },
    columns: {
      name: 'Guardian',
      phone: 'Phone',
      relationships: 'Relationships',
      status: 'Status',
      actions: 'Actions',
    },
    fields: {
      fullName: 'Full name',
      phone: 'Phone',
      secondaryPhone: 'Secondary phone',
      email: 'Email',
      address: 'Address',
      occupation: 'Occupation',
      nationalId: 'National ID',
      status: 'Status',
      notes: 'Notes',
    },
    placeholders: {
      fullName: 'Enter guardian full name',
      phone: 'Enter phone number',
      secondaryPhone: 'Enter secondary phone number',
      email: 'Enter email address',
      address: 'Enter address',
      occupation: 'Enter occupation',
      nationalId: 'Enter national ID',
      notes: 'Add optional notes',
    },
    dialog: {
      createTitle: 'Create Guardian',
      editTitle: 'Edit Guardian',
    },
    alerts: {
      archiveTitle: 'Archive this guardian?',
      archiveMessage: 'This keeps the historical record while removing the guardian from active Preschool use.',
      archiveFallback: 'the selected guardian',
      successTitle: 'Guardian updated',
      close: 'Close',
    },
    messages: {
      createdSuccess: 'Guardian "{name}" was created successfully.',
      updatedSuccess: 'Guardian "{name}" was updated successfully.',
      archivedSuccess: 'Guardian was archived successfully.',
    },
    errors: {
      loadFailed: 'Failed to load Preschool guardians.',
    },
  },
}

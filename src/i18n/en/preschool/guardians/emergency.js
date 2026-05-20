// Keep the read-only emergency-contact view separate so teacher-facing copy
// stays explicit and does not inherit admin edit wording.
export default {
  preschoolEmergencyContactsPage: {
    title: 'Emergency Contacts',
    subtitle: 'Review the active pickup order and emergency contacts for an assigned Preschool student.',
    loading: 'Loading Preschool emergency contacts...',
    empty: 'No emergency contacts are available for the selected student.',
    actions: {
      refresh: 'Refresh Contacts',
    },
    placeholders: {
      student: 'Select a student',
    },
    relationship: 'Relationship',
    priority: 'Priority',
    notes: 'Notes',
    errors: {
      loadStudents: 'Failed to load assigned Preschool students.',
      loadContacts: 'Failed to load Preschool emergency contacts.',
    },
  },
}

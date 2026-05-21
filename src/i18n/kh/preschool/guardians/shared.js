// Keep the Khmer guardian vocabulary in one shared file so admin and teacher
// screens reuse the same labels without duplicating text or breaking parity.
// Regression protection: these keys are consumed across list, form, and badge
// components, so they must stay stable and free of mojibake.
export default {
  preschoolGuardianShared: {
    loading: 'កំពុងផ្ទុកទិន្នន័យអាណាព្យាបាល...',
    emptyGuardians: 'មិនទាន់មានកំណត់ត្រាអាណាព្យាបាលនៅឡើយទេ។',
    labels: {
      noDetails: 'គ្មានព័ត៌មានបន្ថែម',
    },
    statusLabels: {
      active: 'សកម្ម',
      inactive: 'អសកម្ម',
      archived: 'បានរក្សាទុក',
    },
    relationshipTypes: {
      mother: 'ម្តាយ',
      father: 'ឪពុក',
      guardian: 'អាណាព្យាបាល',
      grandparent: 'ជីដូន/ជីតា',
      sibling: 'បងប្អូន',
      relative: 'ញាតិ',
      other: 'ផ្សេងទៀត',
    },
    pickupPermission: {
      allowed: 'អនុញ្ញាតឲ្យយកសិស្ស',
      blocked: 'មិនអនុញ្ញាតឲ្យយកសិស្ស',
    },
    primaryGuardian: {
      primary: 'អាណាព្យាបាលចម្បង',
      secondary: 'អាណាព្យាបាលបម្រុង',
    },
    integritySeverityLabels: {
      info: 'ព័ត៌មាន',
      warning: 'ការព្រមាន',
      critical: 'បន្ទាន់',
    },
    errors: {
      loadGuardians: 'ផ្ទុកអាណាព្យាបាល Preschool មិនបានទេ។',
      loadRelationships: 'ផ្ទុកទំនាក់ទំនងអាណាព្យាបាល Preschool មិនបានទេ។',
      loadEmergencyContacts: 'ផ្ទុកទំនាក់ទំនងបន្ទាន់ Preschool មិនបានទេ។',
      loadIntegrity: 'ផ្ទុកទិន្នន័យភាពត្រឹមត្រូវអាណាព្យាបាល Preschool មិនបានទេ។',
      saveGuardian: 'ពេលនេះមិនអាចរក្សាទុកអាណាព្យាបាល Preschool បានទេ។',
      saveRelationship: 'ពេលនេះមិនអាចរក្សាទុកទំនាក់ទំនងអាណាព្យាបាល Preschool បានទេ។',
      archiveGuardian: 'ពេលនេះមិនអាចរក្សាទុកអាណាព្យាបាល Preschool បានទេ។',
      archiveRelationship: 'ពេលនេះមិនអាចរក្សាទុកទំនាក់ទំនងអាណាព្យាបាល Preschool បានទេ។',
    },
  },
}

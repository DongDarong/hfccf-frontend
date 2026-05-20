// រក្សាស្លាករួមរបស់អាណាព្យាបាលដាច់ដោយឡែក ដើម្បីឲ្យទំព័រគ្រប់គ្រង និងមើល
// ទំនាក់ទំនងបន្ទាន់ប្រើពាក្យដូចគ្នា និងមិនបង្កើត double nesting ជាថ្មី។
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
      grandparent: 'ជីតា/ជីដូន',
      sibling: 'បងប្អូន',
      relative: 'ញាតិ',
      other: 'ផ្សេងទៀត',
    },
    pickupPermission: {
      allowed: 'អនុញ្ញាតយកសិស្ស',
      blocked: 'មិនអនុញ្ញាតយកសិស្ស',
    },
    primaryGuardian: {
      primary: 'អាណាព្យាបាលចម្បង',
      secondary: 'អាណាព្យាបាលបន្ថែម',
    },
    errors: {
      loadGuardians: 'បរាជ័យក្នុងការផ្ទុកអាណាព្យាបាល Preschool។',
      loadRelationships: 'បរាជ័យក្នុងការផ្ទុកទំនាក់ទំនងអាណាព្យាបាលសិស្ស Preschool។',
      loadEmergencyContacts: 'បរាជ័យក្នុងការផ្ទុកទំនាក់ទំនងបន្ទាន់ Preschool។',
      saveGuardian: 'មិនអាចរក្សាទុកអាណាព្យាបាល Preschool នៅពេលនេះបានទេ។',
      saveRelationship: 'មិនអាចរក្សាទុកទំនាក់ទំនងអាណាព្យាបាលសិស្ស Preschool នៅពេលនេះបានទេ។',
      archiveGuardian: 'មិនអាចរក្សាទុកជា archived អាណាព្យាបាល Preschool នៅពេលនេះបានទេ។',
      archiveRelationship: 'មិនអាចរក្សាទុកជា archived ទំនាក់ទំនងអាណាព្យាបាលសិស្ស Preschool នៅពេលនេះបានទេ។',
    },
  },
}

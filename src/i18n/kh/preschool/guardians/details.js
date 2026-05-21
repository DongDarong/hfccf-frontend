// Keep the Khmer guardian summary copy separate from the list screens so the
// read-only detail route can stay compact and easy to maintain.
// Regression protection: the detail screen remains staff-only and read-only.
export default {
  preschoolGuardianDetailsPage: {
    title: 'ព័ត៌មានអាណាព្យាបាល',
    subtitle: 'ពិនិត្យកំណត់ត្រាអាណាព្យាបាល ទំនាក់ទំនងសរុប និងព័ត៌មានដែលបុគ្គលិកគ្រប់គ្រង។',
    loading: 'កំពុងផ្ទុកព័ត៌មានអាណាព្យាបាល...',
    empty: 'មិនទាន់រកឃើញកំណត់ត្រាអាណាព្យាបាលទេ។',
    actions: {
      back: 'ត្រឡប់ទៅអាណាព្យាបាល',
      manageRelationships: 'គ្រប់គ្រងទំនាក់ទំនង',
    },
    labels: {
      guardianRecord: 'កំណត់ត្រាអាណាព្យាបាល',
      phone: 'លេខទូរស័ព្ទ',
      secondaryPhone: 'លេខទូរស័ព្ទបន្ថែម',
      email: 'អ៊ីមែល',
      occupation: 'មុខរបរ',
      address: 'អាសយដ្ឋាន',
      notes: 'កំណត់សម្គាល់',
      summary: 'សង្ខេប',
      relationshipsCount: 'ទំនាក់ទំនងសរុប',
      activeRelationshipsCount: 'ទំនាក់ទំនងសកម្ម',
    },
    notes: {
      readOnly: 'ទំព័រនេះសម្រាប់មើលតែប៉ុណ្ណោះ។ បុគ្គលិកអាចពិនិត្យព័ត៌មានអាណាព្យាបាលបាន ប៉ុន្តែការកែសម្រួលធ្វើនៅទំព័រគ្រប់គ្រង។',
    },
    errors: {
      load: 'ផ្ទុកព័ត៌មានអាណាព្យាបាល Preschool មិនបានទេ។',
    },
  },
}

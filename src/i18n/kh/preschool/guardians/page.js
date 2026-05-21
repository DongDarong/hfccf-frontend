// Keep the Khmer guardian master-data page copy separate from the
// relationship screens so admin flows stay searchable and easy to maintain.
export default {
  preschoolGuardiansPage: {
    title: 'អាណាព្យាបាល Preschool',
    subtitle: 'គ្រប់គ្រងកំណត់ត្រាអាណាព្យាបាលដែលអាចភ្ជាប់ទៅសិស្ស Preschool ច្រើននាក់បាន។',
    loading: 'កំពុងផ្ទុកអាណាព្យាបាល Preschool...',
    empty: 'មិនទាន់មានកំណត់ត្រាអាណាព្យាបាលនៅឡើយទេ។',
    actions: {
      addGuardian: 'បន្ថែមអាណាព្យាបាល',
      viewDetails: 'មើលព័ត៌មាន',
      archive: 'រក្សាទុក',
      save: 'រក្សាទុកអាណាព្យាបាល',
      update: 'ធ្វើបច្ចុប្បន្នភាព',
    },
    filters: {
      searchPlaceholder: 'ស្វែងរកឈ្មោះ លេខទូរស័ព្ទ ឬអ៊ីមែល',
      allStatus: 'ស្ថានភាពទាំងអស់',
    },
    columns: {
      name: 'អាណាព្យាបាល',
      phone: 'លេខទូរស័ព្ទ',
      relationships: 'ទំនាក់ទំនង',
      status: 'ស្ថានភាព',
      actions: 'សកម្មភាព',
    },
    fields: {
      fullName: 'ឈ្មោះពេញ',
      phone: 'លេខទូរស័ព្ទ',
      secondaryPhone: 'លេខទូរស័ព្ទបន្ថែម',
      email: 'អ៊ីមែល',
      address: 'អាសយដ្ឋាន',
      occupation: 'មុខរបរ',
      nationalId: 'លេខអត្តសញ្ញាណជាតិ',
      status: 'ស្ថានភាព',
      notes: 'កំណត់សម្គាល់',
    },
    placeholders: {
      fullName: 'បញ្ចូលឈ្មោះពេញរបស់អាណាព្យាបាល',
      phone: 'បញ្ចូលលេខទូរស័ព្ទ',
      secondaryPhone: 'បញ្ចូលលេខទូរស័ព្ទបន្ថែម',
      email: 'បញ្ចូលអ៊ីមែល',
      address: 'បញ្ចូលអាសយដ្ឋាន',
      occupation: 'បញ្ចូលមុខរបរ',
      nationalId: 'បញ្ចូលលេខអត្តសញ្ញាណជាតិ',
      notes: 'បន្ថែមកំណត់សម្គាល់ជាជម្រើស',
    },
    dialog: {
      createTitle: 'បង្កើតអាណាព្យាបាល',
      editTitle: 'កែសម្រួលអាណាព្យាបាល',
    },
    alerts: {
      archiveTitle: 'តើចង់រក្សាទុកអាណាព្យាបាលនេះទេ?',
      archiveMessage: 'វានឹងរក្សាប្រវត្តិទុក ប៉ុន្តែយកអាណាព្យាបាលនេះចេញពីការប្រើប្រាស់ Preschool ដែលសកម្ម។',
      archiveFallback: 'អាណាព្យាបាលដែលបានជ្រើស',
      successTitle: 'បានធ្វើបច្ចុប្បន្នភាពអាណាព្យាបាល',
      close: 'បិទ',
    },
    messages: {
      createdSuccess: 'បានបង្កើតអាណាព្យាបាល "{name}" ដោយជោគជ័យ។',
      updatedSuccess: 'បានធ្វើបច្ចុប្បន្នភាពអាណាព្យាបាល "{name}" ដោយជោគជ័យ។',
      archivedSuccess: 'បានរក្សាទុកអាណាព្យាបាលដោយជោគជ័យ។',
    },
    errors: {
      loadFailed: 'ផ្ទុកអាណាព្យាបាល Preschool មិនបានទេ។',
    },
  },
}

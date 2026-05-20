// រក្សាអត្ថបទទំព័រអាណាព្យាបាលដាច់ដោយឡែកពីទំព័រទំនាក់ទំនង ដើម្បីងាយស្រួល
// ត្រួតពិនិត្យ និងការពារកុំឲ្យសែលឡើងវិញទៅជា​អត្ថបទ hardcoded ภาษาอังกฤษ។
export default {
  preschoolGuardiansPage: {
    title: 'អាណាព្យាបាល Preschool',
    subtitle: 'គ្រប់គ្រងកំណត់ត្រាអាណាព្យាបាលដែលអាចភ្ជាប់ទៅសិស្ស Preschool បានច្រើននាក់។',
    loading: 'កំពុងផ្ទុកអាណាព្យាបាល Preschool...',
    empty: 'មិនទាន់រកឃើញកំណត់ត្រាអាណាព្យាបាលទេ។',
    actions: {
      addGuardian: 'បន្ថែមអាណាព្យាបាល',
      archive: 'រក្សាទុកជា archived',
      save: 'រក្សាទុកអាណាព្យាបាល',
      update: 'ធ្វើបច្ចុប្បន្នភាពអាណាព្យាបាល',
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
      editTitle: 'កែប្រែអាណាព្យាបាល',
    },
    alerts: {
      archiveTitle: 'រក្សាទុកអាណាព្យាបាលនេះជា archived ទេ?',
      archiveMessage: 'វានឹងរក្សាប្រវត្តិទុក និងដកអាណាព្យាបាលចេញពីការប្រើប្រាស់សកម្មនៅ Preschool។',
      archiveFallback: 'អាណាព្យាបាលដែលបានជ្រើស',
      successTitle: 'បានធ្វើបច្ចុប្បន្នភាពអាណាព្យាបាល',
      close: 'បិទ',
    },
    messages: {
      createdSuccess: 'បានបង្កើតអាណាព្យាបាល "{name}" ដោយជោគជ័យ។',
      updatedSuccess: 'បានធ្វើបច្ចុប្បន្នភាពអាណាព្យាបាល "{name}" ដោយជោគជ័យ។',
      archivedSuccess: 'បានរក្សាទុកអាណាព្យាបាលជា archived ដោយជោគជ័យ។',
    },
    errors: {
      loadFailed: 'បរាជ័យក្នុងការផ្ទុកអាណាព្យាបាល Preschool។',
    },
  },
}

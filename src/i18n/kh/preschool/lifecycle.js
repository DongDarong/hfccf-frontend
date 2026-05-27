export default {
  preschoolLifecyclePage: {
    sections: {
      academicYears: {
        eyebrow: 'វដ្តសិក្សា',
        title: 'គ្រប់គ្រងឆ្នាំសិក្សា',
        subtitle: 'បង្កើត បើកដំណើរការ និងបិទឆ្នាំសិក្សាដែលដឹកនាំការចូលរៀន កាលវិភាគ ការបែងចែក និងរបាយការណ៍ Preschool។',
        description: 'ឆ្នាំសិក្សាជាកំណត់ត្រាវដ្តដំបូងសម្រាប់ប្រតិបត្តិការរបស់ Preschool។',
        currentContext: 'ឆ្នាំសិក្សាបច្ចុប្បន្នគឺជាប្រភពទិន្នន័យដើមសម្រាប់ការសរសេរថ្មីៗ។',
      },
      terms: {
        eyebrow: 'វដ្តភាគ',
        title: 'គ្រប់គ្រងភាគ',
        subtitle: 'រក្សាភាគនៅក្រោមឆ្នាំសិក្សាដែលបានជ្រើស ដើម្បីឲ្យរបាយការណ៍ និងបង្អួចប្រតិបត្តិការស្របគ្នា។',
        description: 'ភាគស្ថិតនៅក្រោមមួយឆ្នាំសិក្សា ហើយអាចបើកដំណើរការ ឬបិទដោយឡែកបាន។',
      },
    },
    actions: {
      addAcademicYear: 'បន្ថែមឆ្នាំសិក្សា',
      saveAcademicYear: 'រក្សាទុកឆ្នាំសិក្សា',
      addTerm: 'បន្ថែមភាគ',
      saveTerm: 'រក្សាទុកភាគ',
      edit: 'កែប្រែ',
      activate: 'បើកដំណើរការ',
      close: 'បិទ',
    },
    status: {
      current: 'បច្ចុប្បន្ន',
      active: 'សកម្ម',
      closed: 'បិទ',
      archived: 'រក្សាទុក',
    },
    fields: {
      yearCode: 'កូដឆ្នាំ',
      yearLabel: 'ស្លាកឆ្នាំសិក្សា',
      academicYear: 'ឆ្នាំសិក្សា',
      currentYear: 'កំណត់ជាឆ្នាំបច្ចុប្បន្ន',
      termCode: 'កូដភាគ',
      sortOrder: 'លំដាប់',
      notes: 'ចំណាំ',
    },
    placeholders: {
      yearCode: 'ឧ. AY-2025-2026',
      yearLabel: 'ឧ. 2025 - 2026',
      academicYear: 'ជ្រើសរើសឆ្នាំសិក្សា',
      currentYear: 'កំណត់ឆ្នាំនេះជាបច្ចុប្បន្ន',
      termCode: 'ឧ. TERM-1',
      sortOrder: 'ឧ. 1',
      notes: 'ចំណាំបន្ថែមសម្រាប់អ្នកគ្រប់គ្រង',
    },
    dialogs: {
      academicYear: {
        subtitle: 'រក្សាកំណត់ត្រាឆ្នាំសិក្សាឲ្យស្របជាមួយ backbone រដ្ឋបាល។',
        createTitle: 'បន្ថែមឆ្នាំសិក្សា',
        editTitle: 'កែប្រែឆ្នាំសិក្សា',
      },
      term: {
        subtitle: 'ប្រើម្តងមួយភាគ ដើម្បីឲ្យបង្អួចប្រតិបត្តិការងាយស្រួលពិនិត្យ។',
        createTitle: 'បន្ថែមភាគ',
        editTitle: 'កែប្រែភាគ',
      },
    },
    labels: {
      currentContext: 'បរិបទវដ្តបច្ចុប្បន្ន',
      termsCount: '{count} ភាគ',
      sortOrder: 'លំដាប់: {value}',
    },
    help: {
      currentYear: 'គួរតែកំណត់បានតែឆ្នាំមួយជាឆ្នាំបច្ចុប្បន្ននៅពេលតែមួយ។',
    },
    validation: {
      required: 'តម្រូវឱ្យបំពេញវាលនេះ។',
      range: 'កាលបរិច្ឆេទបញ្ចប់ត្រូវតែស្មើ ឬក្រោយកាលបរិច្ឆេទចាប់ផ្តើម។',
      positive: 'សូមបញ្ចូលលេខវិជ្ជមាន។',
    },
    emptyStates: {
      academicYears: 'មិនទាន់មានឆ្នាំសិក្សាត្រូវបានបង្កើតទេ។',
      terms: 'មិនទាន់មានភាគត្រូវបានបង្កើតទេ។',
    },
  },
}

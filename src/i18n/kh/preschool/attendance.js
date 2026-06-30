export default {
  preschoolAttendanceStatus: {
    present: 'មានវត្តមាន',
    absent: 'អវត្តមាន',
    late: 'មកយឺត',
    excused: 'មានលិខិតអនុញ្ញាត',
    presentShort: 'ម',
    absentShort: 'អ',
    lateShort: 'យ',
    excusedShort: 'ល',
  },

  preschoolAttendanceHubPage: {
    title: 'ការគ្រប់គ្រងវត្តមាន',
    subtitle: 'កត់ត្រា ពិនិត្យ និងវិភាគវត្តមានសម្រាប់សិស្ស និងគ្រូ។',
    cards: {
      students: {
        title: 'វត្តមានសិស្សប្រចាំថ្ងៃ',
        description: 'កត់ត្រាវត្តមានសម្រាប់សិស្សក្នុងថ្នាក់នៅកាលបរិច្ឆេទដែលបានជ្រើស។',
      },
      teachers: {
        title: 'វត្តមានគ្រូប្រចាំថ្ងៃ',
        description: 'កត់ត្រាវត្តមានសម្រាប់បុគ្គលិកបង្រៀននៅកាលបរិច្ឆេទដែលបានជ្រើស។',
      },
      history: {
        title: 'ប្រវត្តិវត្តមាន',
        description: 'រក្សាទុកកំណត់ត្រាវត្តមានទាំងអស់ជាមួយតម្រង។',
      },
      dashboard: {
        title: 'ផ្ទាំងវត្តមាន',
        description: 'ទិដ្ឋភាពទូទៅអំពីអត្រាវត្តមាន ការបែងចែកតាមថ្នាក់ និងនិន្នាការប្រចាំខែ។',
      },
      alerts: {
        title: 'ការជូនដំណឹងអវត្តមាន',
        description: 'មើលការជូនដំណឹងអំពីអវត្តមានជាប់ដែលបង្កើតពីកំណត់ត្រាវត្តមាន។',
      },
      calendar: {
        title: 'ទិដ្ឋភាពប្រតិទិន',
        description: 'ទិដ្ឋភាពវត្តមានប្រចាំខែសម្រាប់ថ្នាក់រៀន។',
      },
      profile: {
        title: 'ប្រវត្តិសិស្ស',
        description: 'ប្រវត្តិវត្តមាន និងការបំបែកអត្រាសម្រាប់សិស្សតែម្នាក់។',
      },
      idCard: {
        title: 'ប័ណ្ណសម្គាល់',
        description: 'បង្កើត និងបោះពុម្ពប័ណ្ណសម្គាល់សិស្ស',
      },
    },
  },

  preschoolAdminAttendancePage: {
    title: 'វត្តមានសិស្សប្រចាំថ្ងៃ',
    subtitle: 'កត់ត្រា និងពិនិត្យវត្តមានប្រចាំថ្ងៃសម្រាប់ថ្នាក់រៀន។',
    filters: { class: 'ថ្នាក់', date: 'កាលបរិច្ឆេទ' },
    placeholders: { class: 'ជ្រើសថ្នាក់', note: 'កំណត់សម្គាល់ (ជាជម្រើស)' },
    columns: { student: 'សិស្ស', status: 'ស្ថានភាព', note: 'កំណត់សម្គាល់' },
    actions: {
      markAllPresent: 'ចុះឈ្មោះទាំងអស់ថាមានវត្តមាន',
      markAllAbsent: 'ចុះឈ្មោះទាំងអស់ថាអវត្តមាន',
      clearAll: 'សម្អាតទាំងអស់',
      save: 'រក្សាទុកវត្តមាន',
      saving: 'កំពុងរក្សាទុក…',
      prevDay: 'ថ្ងៃមុន',
      nextDay: 'ថ្ងៃបន្ទាប់',
      back: 'ត្រឡប់',
    },
    summary: '{marked} ក្នុង {total} សិស្សបានកត់ត្រា',
    messages: {
      selectClass: 'ជ្រើសថ្នាក់ និងកាលបរិច្ឆេទ ដើម្បីចាប់ផ្ដើមកត់ត្រាវត្តមាន។',
      noStudents: 'មិនមានសិស្សចុះឈ្មោះក្នុងថ្នាក់នេះទេ។',
      loadFailed: 'មិនអាចផ្ទុកទិន្នន័យវត្តមានបានទេ។',
      saved: 'វត្តមានបានរក្សាទុករួចរាល់។',
      saveFailed: 'កំណត់ត្រាមួយចំនួនមិនអាចរក្សាទុកបានទេ។',
      skippedNote: 'សិស្សដែលគ្មានស្ថានភាពជ្រើសនឹងត្រូវបានរំលង។',
    },
  },

  preschoolAdminTeacherAttendancePage: {
    title: 'វត្តមានគ្រូប្រចាំថ្ងៃ',
    subtitle: 'កត់ត្រាវត្តមានប្រចាំថ្ងៃសម្រាប់បុគ្គលិកបង្រៀន។',
    filters: { date: 'កាលបរិច្ឆេទ' },
    columns: { teacher: 'គ្រូ', status: 'ស្ថានភាព', note: 'កំណត់សម្គាល់' },
    placeholders: { note: 'កំណត់សម្គាល់ (ជាជម្រើស)' },
    actions: {
      markAllPresent: 'ចុះឈ្មោះទាំងអស់ថាមានវត្តមាន',
      markAllAbsent: 'ចុះឈ្មោះទាំងអស់ថាអវត្តមាន',
      clearAll: 'សម្អាតទាំងអស់',
      save: 'រក្សាទុកវត្តមាន',
      saving: 'កំពុងរក្សាទុក…',
      prevDay: 'ថ្ងៃមុន',
      nextDay: 'ថ្ងៃបន្ទាប់',
      back: 'ត្រឡប់',
    },
    summary: 'គ្រូ {marked} ក្នុង {total} នាក់បានកត់ត្រា',
    messages: {
      noTeachers: 'រកមិនឃើញគ្រូទេ។',
      loadFailed: 'មិនអាចផ្ទុកទិន្នន័យគ្រូបានទេ។',
      saved: 'វត្តមានគ្រូបានរក្សាទុក។',
      saveFailed: 'កំណត់ត្រាមួយចំនួនមិនអាចរក្សាទុកបានទេ។',
      skippedNote: 'គ្រូដែលគ្មានស្ថានភាពជ្រើសនឹងត្រូវបានរំលង។',
    },
  },

  preschoolAdminAttendanceHistoryPage: {
    title: 'ប្រវត្តិវត្តមាន',
    subtitle: 'រក្សា និងតម្រងកំណត់ត្រាវត្តមានទាំងអស់ដែលបានកន្លងទៅ។',
    filters: {
      search: 'ស្វែងរក',
      student: 'សិស្ស',
      class: 'ថ្នាក់',
      status: 'ស្ថានភាព',
      date: 'កាលបរិច្ឆេទ',
      allStatuses: 'ស្ថានភាពទាំងអស់',
      allClasses: 'ថ្នាក់ទាំងអស់',
    },
    placeholders: {
      search: 'ស្វែងរកតាមឈ្មោះសិស្ស…',
      searchStudent: 'ស្វែងរកតាមឈ្មោះសិស្ស…',
    },
    columns: {
      no: 'ល.រ.',
      student: 'សិស្ស',
      class: 'ថ្នាក់',
      date: 'កាលបរិច្ឆេទ',
      status: 'ស្ថានភាព',
      note: 'កំណត់សម្គាល់',
      recordedBy: 'កត់ត្រាដោយ',
    },
    actions: { apply: 'អនុវត្តតម្រង', back: 'ត្រឡប់' },
    messages: {
      empty: 'រកមិនឃើញកំណត់ត្រាវត្តមានទេ។',
      loadFailed: 'មិនអាចផ្ទុកកំណត់ត្រាវត្តមានបានទេ។',
    },
    pagination: {
      previous: 'មុន',
      next: 'បន្ទាប់',
      summary: 'ទំព័រ {page} ក្នុង {lastPage} · {total} កំណត់ត្រា',
    },
  },

  preschoolAttendanceDashboardPage: {
    title: 'ផ្ទាំងវត្តមាន',
    subtitle: 'ទិដ្ឋភាពទូទៅ អត្រាវត្តមាន ការបែងចែកតាមថ្នាក់ និងសង្ខេបប្រចាំខែ។',
    filters: { class: 'ថ្នាក់', dateFrom: 'ពី', dateTo: 'ដល់', allClasses: 'ថ្នាក់ទាំងអស់' },
    actions: { apply: 'អនុវត្ត', back: 'ត្រឡប់' },
    cards: {
      rate: 'អត្រាវត្តមាន',
      rateCaption: 'ចំនួនមកវិញ ÷ ចំនួនសរុប',
      total: 'កំណត់ត្រាសរុប',
      totalCaption: 'ការកត់ត្រាវត្តមានក្នុងជួរ',
      present: 'មានវត្តមាន',
      presentCaption: 'សិស្សដែលបានកត់ថាមក',
      absent: 'អវត្តមាន',
      absentCaption: 'សិស្សដែលបានកត់ថាអវត្តមាន',
      late: 'មកយឺត',
      lateCaption: 'សិស្សដែលបានកត់ថាមកយឺត',
      excused: 'មានលិខិត',
      excusedCaption: 'ការអវត្តមានដែលមានហេតុផល',
    },
    breakdown: {
      title: 'ការបែងចែកតាមថ្នាក់',
      columns: { class: 'ថ្នាក់', total: 'កំណត់ត្រា', present: 'មក', absent: 'អវត្តមាន', late: 'យឺត', rate: 'អត្រា' },
      empty: 'គ្មានទិន្នន័យសម្រាប់ជួរដែលបានជ្រើស។',
    },
    messages: {
      loadFailed: 'មិនអាចផ្ទុកទិន្នន័យវត្តមានបានទេ។',
      noData: 'រកមិនឃើញកំណត់ត្រាវត្តមានសម្រាប់តម្រងដែលបានជ្រើស។',
    },
    alertSummary: {
      title: 'សង្ខេបការជូនដំណឹងអវត្តមាន',
      subtitle: 'ការជូនដំណឹងអវត្តមានជាប់គ្នាដែលបង្កើតពីកំណត់ត្រាវត្តមាននៅ backend។',
      viewAllAttendanceAlerts: 'មើលការជូនដំណឹងអវត្តមានទាំងអស់',
      latestAttendanceAlert: 'ការជូនដំណឹងអវត្តមានចុងក្រោយ',
      recentRepeatedAbsences: 'អវត្តមានជាប់គ្នាថ្មីៗ',
      recentRepeatedAbsencesSubtitle: 'ការជូនដំណឹងអវត្តមានចុងក្រោយដែលបង្កើតពី backend។',
      noRepeatedAbsenceAlerts: 'មិនមានការជូនដំណឹងអវត្តមានជាប់គ្នាទេ។',
      detail: {
        open: 'មានការជូនដំណឹងអវត្តមានបើក {count}',
        overdue: 'មានការតាមដានអវត្តមានដែលហួសកំណត់ {count}',
      },
      cards: {
        open: {
          title: 'ការជូនដំណឹងបើក',
          label: 'ការជូនដំណឹងអវត្តមានដែលកំពុងបើក',
          caption: 'រង់ចាំការតាមដានពីអាណាព្យាបាល។',
        },
        acknowledged: {
          title: 'បានទទួលស្គាល់',
          label: 'ការជូនដំណឹងបានទទួលស្គាល់',
          caption: 'ការជូនដំណឹងដែលអាណាព្យាបាលបានទទួលស្គាល់រួច។',
        },
        overdue: {
          title: 'ហួសកំណត់',
          label: 'ការតាមដានហួសកំណត់',
          caption: 'ការជូនដំណឹងបើកដែលត្រូវការយកចិត្តទុកដាក់។',
        },
        recent: {
          title: 'ថ្មីៗ',
          label: 'អវត្តមានជាប់គ្នាថ្មីៗ',
          caption: 'ការជូនដំណឹងអវត្តមានចុងក្រោយដែលបង្កើតពី backend។',
        },
      },
    },
  },

  preschoolAttendanceAlertsPage: {
    title: 'ការជូនដំណឹងអវត្តមាន',
    subtitle: 'ការជូនដំណឹងដែលបង្កើតពីកំណត់ត្រាវត្តមាននៅខាង backend។',
    filters: {
      class: 'ថ្នាក់',
      allClasses: 'ថ្នាក់ទាំងអស់',
      dateFrom: 'ចាប់ពី',
      dateTo: 'ដល់',
    },
    actions: { apply: 'អនុវត្ត', reset: 'កំណត់ឡើងវិញ', back: 'ត្រឡប់' },
    columns: { student: 'សិស្ស', class: 'ថ្នាក់', guardian: 'អាណាព្យាបាល', alertType: 'ប្រភេទការជូនដំណឹង', status: 'ស្ថានភាព', consecutiveAbsences: 'អវត្តមានជាប់គ្នា', severity: 'កម្រិត', createdAt: 'បង្កើត', guardianFollowUp: 'តាមដានអាណាព្យាបាល' },
    messages: {
      loading: 'កំពុងផ្ទុកការជូនដំណឹងអវត្តមាន…',
      noAlerts: 'មិនមានការជូនដំណឹងអវត្តមានទេ។',
      loadFailed: 'មិនអាចផ្ទុកការជូនដំណឹងអវត្តមានបានទេ។',
      empty: 'ជ្រើសថ្នាក់ ដើម្បីពិនិត្យការជូនដំណឹងអវត្តមាន។',
    },
    labels: {
      attendanceAlerts: 'ការជូនដំណឹងអវត្តមាន',
      repeatedAbsence: 'អវត្តមានជាប់គ្នា',
      absenceAlert: 'ការជូនដំណឹងអំពីអវត្តមាន',
      noAttendanceAlerts: 'មិនមានការជូនដំណឹងអវត្តមាន',
      alertStatus: 'ស្ថានភាពការជូនដំណឹង',
      openAlerts: 'ការជូនដំណឹងបើក',
      acknowledgedAlerts: 'ការជូនដំណឹងបានទទួលស្គាល់',
      overdueAlerts: 'ការជូនដំណឹងយឺតពេល',
      guardianFollowUp: 'តាមដានអាណាព្យាបាល',
      alertCreatedFromAttendanceRecord: 'ការជូនដំណឹងនេះបង្កើតពីកំណត់ត្រាវត្តមាន',
      consecutiveAbsences: 'អវត្តមានជាប់គ្នា',
    },
  },

  preschoolAttendanceCalendarPage: {
    title: 'ប្រតិទិនវត្តមាន',
    subtitle: 'ទិដ្ឋភាពវត្តមានប្រចាំខែតាមថ្នាក់រៀន។ ចុចថ្ងៃណាមួយ ដើម្បីកត់ត្រាវត្តមាន។',
    filters: { class: 'ថ្នាក់' },
    placeholders: { class: 'ជ្រើសថ្នាក់' },
    actions: { prevMonth: 'ខែមុន', nextMonth: 'ខែបន្ទាប់', back: 'ត្រឡប់' },
    days: { sun: 'អា', mon: 'ច', tue: 'អ', wed: 'ព', thu: 'ព្រ', fri: 'សុ', sat: 'ស' },
    legend: { allPresent: 'ទាំងអស់មក', someAbsent: 'មួយចំនួនអវត្តមាន', mostlyAbsent: 'ភាគច្រើនអវត្តមាន', noRecords: 'គ្មានកំណត់ត្រា' },
    messages: {
      selectClass: 'ជ្រើសថ្នាក់ ដើម្បីមើលប្រតិទិនវត្តមាន។',
      loading: 'កំពុងផ្ទុកទិន្នន័យវត្តមាន…',
      noRecords: 'គ្មានកំណត់ត្រាវត្តមានខែនេះទេ។',
    },
  },

  preschoolAttendanceProfilePage: {
    title: 'ប្រវត្តិវត្តមានសិស្ស',
    subtitle: 'ប្រវត្តិវត្តមានពេញលេញ និងការបំបែកអត្រាសម្រាប់សិស្សតែម្នាក់។',
    filters: { class: 'ថ្នាក់', student: 'សិស្ស' },
    placeholders: { class: 'ជ្រើសថ្នាក់', student: 'ជ្រើសសិស្ស' },
    actions: { load: 'ផ្ទុកប្រវត្តិ', back: 'ត្រឡប់' },
    cards: { rate: 'អត្រាវត្តមាន', rateCaption: 'អត្រាមកជារួម', present: 'មានវត្តមាន', absent: 'អវត្តមាន', late: 'មកយឺត', excused: 'មានលិខិត' },
    breakdown: {
      title: 'ការបំបែកប្រចាំខែ',
      columns: { month: 'ខែ', total: 'ថ្ងៃ', present: 'មក', absent: 'អវត្តមាន', late: 'យឺត', rate: 'អត្រា' },
      empty: 'មិនទាន់មានកំណត់ត្រានៅឡើយទេ។',
    },
    history: {
      title: 'កំណត់ត្រាទាំងអស់',
      columns: { no: 'ល.រ.', date: 'កាលបរិច្ឆេទ', status: 'ស្ថានភាព', class: 'ថ្នាក់', note: 'កំណត់សម្គាល់' },
      empty: 'រកមិនឃើញកំណត់ត្រាវត្តមានសម្រាប់សិស្សនេះទេ។',
    },
    messages: {
      selectStudent: 'ជ្រើសសិស្ស ដើម្បីមើលប្រវត្តិវត្តមានរបស់គាត់។',
      loadFailed: 'មិនអាចផ្ទុកវត្តមានសិស្សបានទេ។',
    },
  },

  preschoolTeacherAttendanceHubPage: {
    title: 'វត្តមាន',
    subtitle: 'កត់ត្រាវត្តមានសម្រាប់សិស្ស ឬកត់ត្រាផ្ទាល់ខ្លួន។',
    cards: {
      students: { title: 'វត្តមានសិស្សរបស់ខ្ញុំ', description: 'កត់ត្រាវត្តមានប្រចាំថ្ងៃសម្រាប់សិស្សរបស់អ្នក។' },
      self: { title: 'វត្តមានរបស់ខ្ញុំ', description: 'កត់ត្រាវត្តមានផ្ទាល់ខ្លួនរបស់អ្នកសម្រាប់ថ្ងៃនេះ។' },
    },
  },

  preschoolTeacherStudentAttendancePage: {
    title: 'វត្តមានសិស្សរបស់ខ្ញុំ',
    subtitle: 'កត់ត្រាវត្តមានសម្រាប់សិស្សក្នុងថ្នាក់របស់អ្នក។',
    actions: { back: 'ត្រឡប់' },
  },

  preschoolTeacherSelfAttendancePage: {
    title: 'វត្តមានរបស់ខ្ញុំ',
    subtitle: 'កត់ត្រាវត្តមានផ្ទាល់ខ្លួនរបស់អ្នកសម្រាប់កាលបរិច្ឆេទដែលបានជ្រើស។',
    fields: { date: 'កាលបរិច្ឆេទ', status: 'ស្ថានភាព', note: 'កំណត់សម្គាល់' },
    placeholders: { note: 'បន្ថែមកំណត់សម្គាល់ (ជាជម្រើស)', status: 'ជ្រើសស្ថានភាព' },
    actions: { save: 'រក្សាទុក', saving: 'កំពុងរក្សាទុក…', back: 'ត្រឡប់' },
    messages: {
      saved: 'វត្តមានរបស់អ្នកត្រូវបានកត់ត្រា។',
      saveFailed: 'មិនអាចកត់ត្រាវត្តមានបានទេ។',
      selectStatus: 'សូមជ្រើសស្ថានភាពមុននឹងរក្សាទុក។',
    },
  },

  preschoolTeacherAttendancePage: {
    title: 'វត្តមានមត្តេយ្យសិក្សា',
    subtitle: 'តាមដានវត្តមានសម្រាប់ថ្នាក់ដែលបានចាត់តាំងឱ្យអ្នក។',
    searchPlaceholder: 'ស្វែងរកវត្តមាន',
    filters: { allStatus: 'ស្ថានភាពទាំងអស់' },
    columns: {
      no: 'ល.រ.',
      student: 'សិស្ស',
      class: 'ថ្នាក់',
      date: 'កាលបរិច្ឆេទ',
      status: 'ស្ថានភាព',
      note: 'កំណត់សម្គាល់',
    },
    options: { present: 'មានវត្តមាន', absent: 'អវត្តមាន', late: 'មកយឺត', excused: 'មានលិខិតអនុញ្ញាត' },
    messages: { loadFailed: 'មិនអាចផ្ទុកវត្តមានបានទេ។', noResults: 'មិនមានកំណត់ត្រាវត្តមានទេ។' },
  },
}

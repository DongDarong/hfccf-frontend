// Keep attendance copy separate so teacher attendance can be tested without
// relying on placeholders or hardcoded strings in the page template.
export default {
  preschoolAttendanceHubPage: {
    title: 'ការគ្រប់គ្រងវត្តមាន',
    subtitle: 'កត់ត្រា និងពិនិត្យវត្តមានសម្រាប់សិស្ស និងគ្រូ។',
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
        description: 'រក្សាប្រតិបត្តិការវត្តមានទាំងអស់ដែលបានកន្លងទៅ ជាមួយតម្រង។',
      },
    },
  },
  preschoolAdminTeacherAttendancePage: {
    title: 'វត្តមានគ្រូ',
    subtitle: 'កត់ត្រាវត្តមានប្រចាំថ្ងៃសម្រាប់បុគ្គលិកបង្រៀន។',
    filters: {
      date: 'កាលបរិច្ឆេទ',
    },
    columns: {
      teacher: 'គ្រូ',
      status: 'ស្ថានភាព',
      note: 'កំណត់សម្គាល់',
    },
    placeholders: {
      note: 'កំណត់សម្គាល់ (ជាជម្រើស)',
    },
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
      class: 'ថ្នាក់',
      status: 'ស្ថានភាព',
      date: 'កាលបរិច្ឆេទ',
      allStatuses: 'ស្ថានភាពទាំងអស់',
      allClasses: 'ថ្នាក់ទាំងអស់',
    },
    placeholders: {
      search: 'ស្វែងរកតាមឈ្មោះសិស្ស ឬគ្រូ…',
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
    actions: {
      apply: 'អនុវត្តតម្រង',
      back: 'ត្រឡប់',
    },
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
  preschoolTeacherAttendanceHubPage: {
    title: 'វត្តមាន',
    subtitle: 'កត់ត្រាវត្តមានសម្រាប់សិស្សរបស់អ្នក ឬកត់ត្រារបស់ខ្លួនអ្នក។',
    cards: {
      students: {
        title: 'វត្តមានសិស្សរបស់ខ្ញុំ',
        description: 'កត់ត្រាវត្តមានប្រចាំថ្ងៃសម្រាប់សិស្សក្នុងថ្នាក់ដែលបានចាត់តាំងឱ្យអ្នក។',
      },
      self: {
        title: 'វត្តមានរបស់ខ្ញុំ',
        description: 'កត់ត្រាវត្តមានផ្ទាល់ខ្លួនរបស់អ្នកសម្រាប់ថ្ងៃនេះ។',
      },
    },
  },
  preschoolTeacherStudentAttendancePage: {
    title: 'វត្តមានសិស្សរបស់ខ្ញុំ',
    subtitle: 'កត់ត្រាវត្តមានសម្រាប់សិស្សក្នុងថ្នាក់របស់អ្នក។',
    actions: {
      back: 'ត្រឡប់',
    },
  },
  preschoolTeacherSelfAttendancePage: {
    title: 'វត្តមានរបស់ខ្ញុំ',
    subtitle: 'កត់ត្រាវត្តមានផ្ទាល់ខ្លួនរបស់អ្នកសម្រាប់កាលបរិច្ឆេទដែលបានជ្រើស។',
    fields: {
      date: 'កាលបរិច្ឆេទ',
      status: 'ស្ថានភាព',
      note: 'កំណត់សម្គាល់',
    },
    placeholders: {
      note: 'បន្ថែមកំណត់សម្គាល់ (ជាជម្រើស)',
      status: 'ជ្រើសស្ថានភាព',
    },
    actions: {
      save: 'រក្សាទុក',
      saving: 'កំពុងរក្សាទុក…',
      back: 'ត្រឡប់',
    },
    messages: {
      saved: 'វត្តមានរបស់អ្នកត្រូវបានកត់ត្រា។',
      saveFailed: 'មិនអាចកត់ត្រាវត្តមានបានទេ។ សូមព្យាយាមម្ដងទៀត។',
      selectStatus: 'សូមជ្រើសស្ថានភាពមុននឹងរក្សាទុក។',
    },
  },
  preschoolTeacherAttendancePage: {
    title: 'វត្តមានមត្តេយ្យសិក្សា',
    subtitle: 'តាមដានវត្តមានសម្រាប់ថ្នាក់ដែលបានចាត់តាំងឱ្យអ្នក។',
    searchPlaceholder: 'ស្វែងរកវត្តមាន',
    filters: {
      allStatus: 'ស្ថានភាពទាំងអស់',
    },
    columns: {
      no: 'ល.រ.',
      student: 'សិស្ស',
      class: 'ថ្នាក់',
      date: 'កាលបរិច្ឆេទ',
      status: 'ស្ថានភាព',
      note: 'កំណត់សម្គាល់',
    },
    options: {
      present: 'មានវត្តមាន',
      absent: 'អវត្តមាន',
      late: 'មកយឺត',
      excused: 'មានលិខិតអនុញ្ញាត',
    },
    messages: {
      loadFailed: 'មិនអាចផ្ទុកវត្តមានបានទេ។',
      noResults: 'មិនមានកំណត់ត្រាវត្តមានទេ។',
    },
  },
  preschoolAdminAttendancePage: {
    title: 'ការគ្រប់គ្រងវត្តមាន',
    subtitle: 'កត់ត្រា និងពិនិត្យវត្តមានប្រចាំថ្ងៃសម្រាប់ថ្នាក់រៀន។',
    filters: {
      class: 'ថ្នាក់',
      date: 'កាលបរិច្ឆេទ',
    },
    placeholders: {
      class: 'ជ្រើសថ្នាក់',
      status: 'ស្ថានភាព',
      note: 'កំណត់សម្គាល់ (ជាជម្រើស)',
    },
    columns: {
      student: 'សិស្ស',
      status: 'ស្ថានភាព',
      note: 'កំណត់សម្គាល់',
    },
    status: {
      present: 'មានវត្តមាន',
      absent: 'អវត្តមាន',
      late: 'មកយឺត',
      excused: 'មានលិខិតអនុញ្ញាត',
      presentShort: 'ម',
      absentShort: 'អ',
      lateShort: 'យ',
      excusedShort: 'ល',
    },
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
      saveFailed: 'កំណត់ត្រាមួយចំនួនមិនអាចរក្សាទុកបានទេ។ សូមព្យាយាមម្ដងទៀត។',
      skippedNote: 'សិស្សដែលគ្មានស្ថានភាពជ្រើសនឹងត្រូវបានរំលង។',
    },
  },
}

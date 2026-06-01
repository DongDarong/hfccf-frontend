// Keep attendance copy separate so teacher attendance can be tested without
// relying on placeholders or hardcoded strings in the page template.
export default {
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

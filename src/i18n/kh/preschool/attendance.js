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
}

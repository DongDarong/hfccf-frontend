// Keep attendance copy separate so Khmer text remains aligned with the page
// contract and can be regression-tested like the English version.
export default {
  preschoolTeacherAttendancePage: {
    title: 'វត្តមានមត្តេយ្យ',
    subtitle: 'តាមដានវត្តមានសម្រាប់ថ្នាក់មត្តេយ្យដែលបានចាត់តាំង។',
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
      note: 'កំណត់ចំណាំ',
    },
    options: {
      present: 'មានវត្តមាន',
      absent: 'អវត្តមាន',
      late: 'មកយឺត',
      excused: 'បានអនុញ្ញាត',
    },
    messages: {
      loadFailed: 'ផ្ទុកវត្តមានមិនបានសម្រេច។',
      noResults: 'មិនមានកំណត់ត្រាវត្តមាន។',
    },
  },
}

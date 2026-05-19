// Keep teacher and admin dashboard copy in a dedicated module so Khmer stays
// aligned with EN and does not depend on hardcoded page text.
export default {
  preschoolDashboardPage: {
    title: 'ផ្ទាំងដំណើរការមត្តេយ្យ',
    subtitle: 'ត្រៀមចុះឈ្មោះ ចុះវត្តមាន និងរៀបចំបន្ទប់រៀន។',
    loading: 'កំពុងផ្ទុកផ្ទាំងមត្តេយ្យ...',
    cards: {
      students: {
        title: 'សិស្សសរុប',
        label: 'កំណត់ត្រាសិស្សសកម្ម',
      },
      classes: {
        title: 'ថ្នាក់សកម្ម',
        label: 'ក្រុមថ្នាក់បន្តផ្ទាល់',
      },
      teachers: {
        title: 'គ្រូបង្រៀន',
        label: 'គ្រូបង្រៀនមត្តេយ្យ',
      },
      attendance: {
        title: 'វត្តមានថ្ងៃនេះ',
        label: 'កំណត់ត្រាថ្ងៃនេះ',
      },
    },
    actions: {
      queueTitle: 'បញ្ជីកិច្ចការ',
      pendingPayments: 'ការបង់ប្រាក់រង់ចាំ: {count}',
      overduePayments: 'ការបង់ប្រាក់ហួសកំណត់: {count}',
      paidPayments: 'ការបង់ប្រាក់រួចរាល់: {count}',
      upcomingClasses: 'ថ្នាក់នឹងមកដល់: {count}',
    },
    notesTitle: 'កំណត់សម្គាល់ប្រតិបត្តិការ',
    spotlightEyebrow: 'ចំណុចអាទិភាព',
    noUpcomingClasses: 'មិនមានថ្នាក់មកដល់',
    nextClassSuffix: 'ជាថ្នាក់បន្ទាប់',
    assignedTeacher: 'គ្រូដែលបានចាត់តាំង',
    populateText: 'បង្កើតថ្នាក់ និងចាត់តាំងគ្រូ ដើម្បីបង្ហាញទិន្នន័យនៅទីនេះ។',
    errors: {
      loadFailed: 'ផ្ទុកផ្ទាំងមត្តេយ្យមិនបានសម្រេច។',
    },
  },
  preschoolTeacherDashboardPage: {
    title: 'កន្លែងធ្វើការគ្រូមត្តេយ្យ',
    subtitle: 'ជំនួយថ្នាក់រៀនប្រចាំថ្ងៃ ថែទាំសិស្ស និងផែនការសកម្មភាព។',
    loading: 'កំពុងផ្ទុកផ្ទាំងគ្រូ...',
    quickStats: 'ស្ថិតិសង្ខេប',
    cards: {
      students: {
        title: 'សិស្សរបស់ខ្ញុំ',
        label: 'សិស្សក្នុងថ្នាក់របស់អ្នក',
      },
      classes: {
        title: 'ថ្នាក់របស់ខ្ញុំ',
        label: 'ថ្នាក់ដែលបានចាត់តាំង',
      },
      attendance: {
        title: 'វត្តមានថ្ងៃនេះ',
        label: 'កំណត់ត្រាសម្រាប់ថ្ងៃនេះ',
      },
      payments: {
        title: 'ការបង់ប្រាក់រង់ចាំ',
        label: 'ការតាមដានថ្លៃសិក្សា',
      },
    },
    actions: {
      upcomingClasses: 'ថ្នាក់នឹងមកដល់: {count}',
      overduePayments: 'ការបង់ប្រាក់ហួសកំណត់: {count}',
      paidPayments: 'ការបង់ប្រាក់រួចរាល់: {count}',
    },
    spotlight: {
      nextSuffix: 'ជាថ្នាក់បន្ទាប់',
      noUpcomingClasses: 'មិនមានថ្នាក់មកដល់',
      assignedTeacher: 'គ្រូដែលបានចាត់តាំង',
      fallback: 'ថ្នាក់ដែលបានចាត់តាំងនឹងបង្ហាញនៅទីនេះនៅពេលបង្កើតរួច។',
    },
    activity: {
      title: 'សកម្មភាពថ្មីៗ',
      fallback: 'កំណត់ត្រាវត្តមាននឹងបង្ហាញនៅទីនេះនៅពេលបានចុះបញ្ជី។',
    },
    errors: {
      loadFailed: 'ផ្ទុកផ្ទាំងគ្រូមិនបានសម្រេច។',
    },
  },
}

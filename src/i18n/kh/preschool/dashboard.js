// Keep teacher and admin dashboard copy in a dedicated module so Khmer stays
// aligned with EN and does not depend on hardcoded page text.
export default {
  preschoolDashboardPage: {
    title: 'ផ្ទាំងដំណើរការមត្តេយ្យសិក្សា',
    subtitle: 'ត្រៀមចុះឈ្មោះ តាមដានវត្តមាន និងធនធានថ្នាក់រៀន។',
    loading: 'កំពុងផ្ទុកផ្ទាំងមត្តេយ្យសិក្សា...',
    cards: {
      students: {
        title: 'សិស្សសរុប',
        label: 'កំណត់ត្រាសិស្សសកម្ម',
      },
      classes: {
        title: 'ថ្នាក់សកម្ម',
        label: 'ក្រុមថ្នាក់ដែលកំពុងដំណើរការ',
      },
      teachers: {
        title: 'គ្រូបង្រៀន',
        label: 'គ្រូមត្តេយ្យសិក្សា',
      },
      attendance: {
        title: 'វត្តមានថ្ងៃនេះ',
        label: 'កំណត់ត្រាថ្ងៃនេះ',
      },
    },
    actions: {
      queueTitle: 'បញ្ជីសកម្មភាព',
      pendingPayments: 'ការទូទាត់កំពុងរង់ចាំ៖ {count}',
      overduePayments: 'ការទូទាត់ហួសកំណត់៖ {count}',
      paidPayments: 'ការទូទាត់បានបង់៖ {count}',
      upcomingClasses: 'ថ្នាក់រៀនខាងមុខ៖ {count}',
      scheduleManagement: 'គ្រប់គ្រងកាលវិភាគ',
    },
    notesTitle: 'កំណត់សម្គាល់ប្រតិបត្តិការ',
    spotlightEyebrow: 'ចំណុចផ្តោតសំខាន់',
    noUpcomingClasses: 'មិនមានថ្នាក់រៀនខាងមុខទេ',
    nextClassSuffix: 'គឺថ្នាក់បន្ទាប់',
    assignedTeacher: 'គ្រូដែលបានចាត់តាំង',
    populateText: 'បង្កើតថ្នាក់ និងចាត់តាំងគ្រូ ដើម្បីបំពេញផ្ទាំងនេះ។',
    errors: {
      loadFailed: 'មិនអាចផ្ទុកផ្ទាំងមត្តេយ្យសិក្សាបានទេ។',
    },
  },
  preschoolTeacherDashboardPage: {
    title: 'កន្លែងធ្វើការបង្រៀនមត្តេយ្យសិក្សា',
    subtitle: 'ជំនួយថ្នាក់រៀនប្រចាំថ្ងៃ ការថែទាំសិស្ស និងការរៀបចំសកម្មភាព។',
    loading: 'កំពុងផ្ទុកផ្ទាំងគ្រូ...',
    quickStats: 'ស្ថិតិរហ័ស',
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
        title: 'ការទូទាត់កំពុងរង់ចាំ',
        label: 'តាមដានថ្លៃសិក្សា',
      },
    },
    actions: {
      upcomingClasses: 'ថ្នាក់រៀនខាងមុខ៖ {count}',
      overduePayments: 'ការទូទាត់ហួសកំណត់៖ {count}',
      paidPayments: 'ការទូទាត់បានបង់៖ {count}',
      mySchedule: 'កាលវិភាគរបស់ខ្ញុំ',
    },
    spotlight: {
      nextSuffix: 'គឺថ្នាក់បន្ទាប់',
      noUpcomingClasses: 'មិនមានថ្នាក់រៀនខាងមុខទេ',
      assignedTeacher: 'គ្រូដែលបានចាត់តាំង',
      fallback: 'ថ្នាក់ដែលបានចាត់តាំងនឹងបង្ហាញទីនេះ នៅពេលបង្កើតរួច។',
      studentsEnrolled: 'សិស្ស {count} នាក់ចុះឈ្មោះ',
    },
    activity: {
      title: 'សកម្មភាពថ្មីៗ',
      fallback: 'កំណត់ត្រាវត្តមាននឹងបង្ហាញទីនេះ នៅពេលបានកត់ត្រា។',
    },
    classes: {
      title: 'ថ្នាក់របស់ខ្ញុំ',
      subtitle: 'ថ្នាក់ដែលបានចាត់តាំងឱ្យអ្នកក្នុងឆមាសនេះ។',
      noClasses: 'មិនទាន់មានថ្នាក់ចាត់តាំងឱ្យអ្នកនៅឡើយទេ។',
      studentsCount: 'សិស្ស {count} នាក់',
      level: 'កម្រិត',
      room: 'បន្ទប់',
      viewStudents: 'សិស្ស',
      viewAttendance: 'វត្តមាន',
    },
    quickNav: {
      title: 'ការចូលរហ័ស',
      schedule: 'កាលវិភាគរបស់ខ្ញុំ',
      students: 'សិស្សរបស់ខ្ញុំ',
      attendance: 'កំណត់ត្រាវត្តមាន',
      reports: 'របាយការណ៍សិស្ស',
    },
    errors: {
      loadFailed: 'មិនអាចផ្ទុកផ្ទាំងគ្រូបានទេ។',
    },
  },
}

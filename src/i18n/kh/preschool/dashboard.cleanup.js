export default {
  preschoolDashboardPage: {
    title: 'ផ្ទាំងគ្រប់គ្រងប្រតិបត្តិការរបស់ Preschool',
    subtitle: 'ទិដ្ឋភាពរួមអំពីការចុះឈ្មោះចូលរៀន វត្តមាន សុខភាព និងការត្រួតពិនិត្យថ្នាក់រៀន។',
    loading: 'កំពុងផ្ទុកផ្ទាំងគ្រប់គ្រង Preschool...',
    header: {
      scheduleManagement: 'គ្រប់គ្រងកាលវិភាគ',
      openReports: 'បើកមជ្ឈមណ្ឌលរបាយការណ៍',
    },
    summary: {
      activeStudents: {
        title: 'សិស្សសកម្ម',
        label: 'កំណត់ត្រាសិស្សកំពុងដំណើរការ',
      },
      attendanceToday: {
        title: 'វត្តមានថ្ងៃនេះ',
        label: 'កំណត់ត្រាដែលបានកត់ត្រាថ្ងៃនេះ',
      },
      healthAlerts: {
        title: 'ការជូនដំណឹងសុខភាពបើកចំហ',
        label: 'ត្រូវការតាមដានបន្ត',
      },
      pendingEnrollments: {
        title: 'ការចុះឈ្មោះចូលរៀនរង់ចាំ',
        label: 'ពាក្យស្នើសុំរង់ចាំពិនិត្យ',
      },
      outstandingPayments: {
        title: 'ការទូទាត់នៅសល់',
        label: 'វិក្កយបត្រមិនទាន់ទូទាត់',
      },
    },
    priority: {
      title: 'ថ្ងៃនេះ / ការងារត្រូវធ្វើ',
      subtitle: 'បង្ហាញតែអ្វីដែលត្រូវយកចិត្តទុកដាក់ឥឡូវនេះប៉ុណ្ណោះ។',
      cardTitle: 'បញ្ជីអាទិភាព',
      empty: 'ពេលនេះគ្មានធាតុបន្ទាន់ទេ។',
      health: 'ការជូនដំណឹងសុខភាពបន្ទាន់',
      healthDetail: 'ត្រូវការតាមដានវេជ្ជសាស្ត្រ',
      enrollment: 'ការសម្រេចចិត្តចុះឈ្មោះរង់ចាំ',
      enrollmentDetail: 'ពិនិត្យពាក្យស្នើសុំថ្មី',
      guardians: 'បញ្ហាអាណាព្យាបាលមិនទាន់ដោះស្រាយ',
      guardiansDetail: 'តាមដានជាមួយគ្រួសារ',
      payments: 'ការទូទាត់ហួសកំណត់',
      paymentsDetail: 'វិក្កយបត្រហួសថ្ងៃកំណត់',
      attendance: 'ករណីលើកលែងវត្តមាន',
      attendanceDetail: 'មកយឺត ឬខកចូល',
    },
    insights: {
      title: 'ការយល់ដឹងសំខាន់',
      subtitle: 'ទិន្នន័យសង្ខេបសម្រាប់ថ្ងៃបច្ចុប្បន្ន និងវដ្តរបាយការណ៍។',
      attendance: {
        title: 'ទិដ្ឋភាពទូទៅវត្តមាន',
        label: 'អត្រាវត្តមាន',
        note: 'អត្រាអវត្តមាន {absence} និងមកយឺត {late}។',
        metrics: {
          present: 'បានកត់ត្រាថ្ងៃនេះ',
          absent: 'អត្រាអវត្តមាន',
        },
      },
      enrollment: {
        title: 'និន្នាការចុះឈ្មោះចូលរៀន',
        label: 'ការចុះឈ្មោះថ្មី',
        note: 'បច្ចុប្បន្នមានសិស្សសកម្ម {active} នាក់។',
        metrics: {
          active: 'សិស្សសកម្ម',
          students: 'សិស្សសរុប',
        },
      },
      assessment: {
        title: 'ស្ថានភាពវាយតម្លៃ',
        label: 'អត្រាបញ្ចប់',
        note: 'មានសិស្ស {risk} នាក់កំពុងមានហានិភ័យ។',
        metrics: {
          risk: 'សិស្សមានហានិភ័យ',
          score: 'ពិន្ទុមធ្យម',
        },
      },
      payments: {
        title: 'ស្ថានភាពទូទាត់',
        label: 'ចំណូល',
        note: 'មានវិក្កយបត្រ {overdue} ចាំបាច់ត្រូវតាមដានបន្ត។',
        metrics: {
          outstanding: 'សមតុល្យនៅសល់',
          overdue: 'វិក្កយបត្រហួសកំណត់',
        },
      },
    },
    operations: {
      title: 'ផ្នែកប្រតិបត្តិការ',
      subtitle: 'ព័ត៌មានបន្ទាប់បន្សំ កាលវិភាគ និងផ្លូវកាត់នៅខាងក្រោមផ្នែកសំខាន់។',
      recentActivityEmpty: 'មិនទាន់មានសកម្មភាពវត្តមានណាមួយបានកត់ត្រាទេ។',
      upcomingSchedules: 'កាលវិភាគខាងមុខ',
      upcomingEmpty: 'មិនទាន់មានថ្នាក់ខាងមុខត្រូវបានកំណត់។',
      recentActivityFallback: 'សកម្មភាពសិស្ស',
      classFallback: 'ថ្នាក់',
      classroomSummary: {
        title: 'សង្ខេបថ្នាក់រៀន',
        students: 'សិស្ស',
        classes: 'ថ្នាក់',
        teachers: 'គ្រូបង្រៀន',
        attendance: 'វត្តមានថ្ងៃនេះ',
      },
      shortcuts: {
        title: 'ផ្លូវកាត់',
        schedule: 'គ្រប់គ្រងកាលវិភាគ',
        reports: 'បើកមជ្ឈមណ្ឌលរបាយការណ៍',
        settings: 'បើកការកំណត់',
        enrollments: 'បើកការចុះឈ្មោះ',
      },
    },
    spotlight: {
      eyebrow: 'បរិបទសិក្សាបច្ចុប្បន្ន',
      noUpcomingClasses: 'មិនមានថ្នាក់ខាងមុខទេ',
      nextClassSuffix: 'គឺបន្ទាប់',
      assignedTeacher: 'គ្រូបង្រៀនដែលបានចាត់តាំង',
      fallback: 'បង្កើតថ្នាក់ និងចាត់តាំងគ្រូបង្រៀន ដើម្បីបង្ហាញផ្នែកនេះ។',
      nextClassFallback: 'ថ្នាក់ខាងមុខ',
      nextClassText: '{teacher} បង្រៀនសិស្ស {students} នាក់',
    },
    errors: {
      coreLoadFailed: 'មិនអាចផ្ទុកផ្ទាំងគ្រប់គ្រង Preschool បានទេ។',
      reportsLoadFailed: 'មិនអាចផ្ទុកផ្ទាំងរបាយការណ៍បានទេ។',
      loadFailed: 'មិនអាចផ្ទុកផ្ទាំងគ្រប់គ្រង Preschool បានទេ។',
    },
  },
  preschoolDashboardActivity: {
    title: 'សកម្មភាពថ្មីៗ',
  },
  preschoolDashboardSpotlight: {
    eyebrow: 'បរិបទសិក្សាបច្ចុប្បន្ន',
  },
}

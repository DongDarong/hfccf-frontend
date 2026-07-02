import enPreschool from '@/i18n/en/preschool/analytics.js'

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function mergeDeep(base, overrides) {
  if (Array.isArray(base) && Array.isArray(overrides)) {
    return overrides.map((item) => (isPlainObject(item) ? mergeDeep({}, item) : item))
  }

  if (!isPlainObject(base) || !isPlainObject(overrides)) {
    return overrides === undefined ? base : overrides
  }

  const output = { ...base }

  for (const [key, value] of Object.entries(overrides)) {
    output[key] = mergeDeep(base[key], value)
  }

  return output
}

const overrides = {
  preschoolAnalyticsPage: {
    title: 'ផ្ទាំងវិភាគទិន្នន័យមត្តេយ្យសិក្សា',
    subtitle: 'វិភាគទិន្នន័យប្រតិបត្តិការ ប្រវត្តិសាស្ត្រ និងនិន្នាការ ដោយអាស្រ័យលើទិន្នន័យស្នូលមត្តេយ្យសិក្សា។',
    generatedAt: 'បានបង្កើតនៅ',
    refresh: 'ផ្ទុកឡើងវិញ',
    filters: {
      title: 'តម្រង',
      dateRange: 'ចន្លោះកាលបរិច្ឆេទ',
      academicYear: 'ឆ្នាំសិក្សា',
      class: 'ថ្នាក់',
      teacher: 'គ្រូបង្រៀន',
      status: 'ស្ថានភាព',
      apply: 'អនុវត្តតម្រង',
      reset: 'កំណត់តម្រងឡើងវិញ',
    },
    overview: 'ទិដ្ឋភាពទូទៅ',
    attendanceAnalytics: 'វិភាគវត្តមាន',
    sessionAnalytics: 'វិភាគវគ្គវត្តមាន',
    scheduleAnalytics: 'វិភាគកាលវិភាគ',
    alertAnalytics: 'វិភាគការជូនដំណឹង',
    guardianAnalytics: 'វិភាគការទាក់ទងអាណាព្យាបាល',
    studentAnalytics: 'វិភាគសិស្ស',
    teacherAnalytics: 'វិភាគគ្រូបង្រៀន',
    reportLauncher: 'ចូលទៅរបាយការណ៍',
    attendanceRate: 'អត្រាវត្តមាន',
    completionRate: 'អត្រាបញ្ចប់',
    attendanceTrend: 'និន្នាការវត្តមាន',
    sessionsGenerated: 'វគ្គដែលបានបង្កើត',
    sessionsCompleted: 'វគ្គដែលបានបញ្ចប់',
    missingSessions: 'វគ្គដែលខ្វះការកត់ត្រា',
    openAlerts: 'ការជូនដំណឹងកំពុងបើក',
    overdueAlerts: 'ការជូនដំណឹងហួសកំណត់',
    guardianContacts: 'ការទាក់ទងអាណាព្យាបាល',
    outstandingFollowUps: 'ការតាមដាននៅសល់',
    noAnalyticsData: 'មិនមានទិន្នន័យវិភាគទេ។',
    reportDataset: 'សំណុំទិន្នន័យរបាយការណ៍',
    attendanceReport: 'របាយការណ៍វត្តមាន',
    sessionReport: 'របាយការណ៍វគ្គវត្តមាន',
    scheduleReport: 'របាយការណ៍កាលវិភាគ',
    sections: {
      attendance: {
        title: 'វិភាគវត្តមាន',
        subtitle: 'អត្រាវត្តមាន សមាសភាពស្ថានភាព និងទិន្នន័យនិន្នាការ។',
      },
      sessions: {
        title: 'វិភាគវគ្គវត្តមាន',
        subtitle: 'វគ្គដែលបានបង្កើត បញ្ចប់ ចាក់សោ បោះបង់ និងខ្វះការកត់ត្រា។',
      },
      schedules: {
        title: 'វិភាគកាលវិភាគ',
        subtitle: 'បរិមាណកាលវិភាគ និងទិដ្ឋភាពប្រើប្រាស់។',
      },
      alerts: {
        title: 'វិភាគការជូនដំណឹង',
        subtitle: 'ស្ថានភាពការជូនដំណឹង និងការបែងចែកតាមកម្រិតធ្ងន់ធ្ងរ។',
      },
      guardians: {
        title: 'វិភាគការទាក់ទងអាណាព្យាបាល',
        subtitle: 'និន្នាការកំណត់ហេតុទំនាក់ទំនង និងស្ថានភាពតាមដាន។',
      },
      students: {
        title: 'វិភាគសិស្ស',
        subtitle: 'វិភាគប្រតិបត្តិការក្នុងកម្រិតសិស្ស។',
      },
      teachers: {
        title: 'វិភាគគ្រូបង្រៀន',
        subtitle: 'បន្ទុកការងារ និងដំណើរការវគ្គវត្តមានរបស់គ្រូបង្រៀន។',
      },
    },
  },
}

export default mergeDeep(enPreschool, overrides)

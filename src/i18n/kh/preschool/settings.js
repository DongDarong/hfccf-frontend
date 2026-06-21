import enPreschool from '@/i18n/en/preschool/settings.js'

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
  preschoolSettingsPageHealth: {
    pageTitle: 'ការកំណត់ Preschool',
    pageSubtitle: 'គ្រប់គ្រងក្របខណ្ឌកំណត់សម្រាប់ផ្នែកសិក្សា វត្តមាន ទូទាត់ វាយតម្លៃ សុខភាព និងចំណូលចិត្ត។',
    dashboard: {
      pageTitle: 'ផ្ទាំងកំណត់ Preschool',
      pageSubtitle: 'ពិនិត្យស្ថានភាពកំណត់រចនាសម្ព័ន្ធបច្ចុប្បន្នសម្រាប់ផ្នែកសិក្សា វត្តមាន ទូទាត់ វាយតម្លៃ សុខភាព និងចំណូលចិត្ត។',
      emptyDashboard: 'មិនទាន់មានការកំណត់ Preschool ទេ។ គំរូលំនាំដើមត្រូវបានបង្ហាញខាងក្រោម។',
      actions: {
        backToDashboard: 'ត្រឡប់ទៅផ្ទាំងត្រួតពិនិត្យ',
      },
      messages: {
        loadFailed: 'មិនអាចផ្ទុកផ្ទាំងកំណត់ Preschool បានទេ។',
      },
      statuses: {
        configured: 'បានកំណត់រួច',
        notConfigured: 'មិនទាន់កំណត់',
      },
      fields: {
        activeAcademicYear: 'ឆ្នាំសិក្សាសកម្ម',
        activeAcademicYearDateRange: 'ជួរកាលបរិច្ឆេទឆ្នាំសិក្សា',
        activeTerm: 'Term សកម្ម',
        activeTermDateRange: 'ជួរកាលបរិច្ឆេទ Term',
        academicStatus: 'ស្ថានភាពសិក្សា',
        lateThresholdMinutes: 'កម្រិតយឺត (នាទី)',
        absenceAlertDays: 'ចំនួនថ្ងៃអវត្តមានជាប់ៗគ្នា',
        schoolWeek: 'សប្ដាហ៍សិក្សា',
        calendarEventsCount: 'ចំនួនព្រឹត្តិការណ៍ប្រតិទិន',
        currency: 'រូបិយប័ណ្ណ',
        invoicePrefix: 'បុព្វបទវិក្កយបត្រ',
        receiptPrefix: 'បុព្វបទបង្កាន់ដៃ',
        assessmentPassingScore: 'ពិន្ទុឆ្លង',
        assessmentWeightingEnabled: 'បើកការថ្លឹងទម្ងន់',
        gradeBandsCount: 'ចំនួនកម្រិតពិន្ទុ',
        assessmentCategoriesCount: 'ចំនួនប្រភេទវាយតម្លៃ',
        reportPeriodsCount: 'ចំនួនរយៈពេលរបាយការណ៍',
        activeGradingScale: 'មាត្រដ្ឋានវាយតម្លៃសកម្ម',
        assessmentCategories: 'ប្រភេទវាយតម្លៃ',
        alertSeverityLevels: 'កម្រិតការជូនដំណឹង',
        healthCategories: 'ប្រភេទសុខភាព',
        organizationName: 'ឈ្មោះអង្គភាព',
        language: 'ភាសា',
        brandingStatus: 'ស្ថានភាពម៉ាក',
      },
      emptyStates: {
        academicYear: 'មិនទាន់មានឆ្នាំសិក្សា',
        term: 'មិនទាន់មាន Term',
        academicStatus: 'មិនទាន់មានស្ថានភាពសិក្សា',
        lateThresholdMinutes: 'មិនទាន់បានកំណត់កម្រិតយឺត',
        absenceAlertDays: 'មិនទាន់បានកំណត់ចំនួនថ្ងៃអវត្តមាន',
        schoolWeek: 'មិនទាន់បានកំណត់សប្ដាហ៍សិក្សា',
        calendarEventsCount: 'មិនទាន់មានព្រឹត្តិការណ៍ប្រតិទិន',
        currency: 'មិនទាន់មានរូបិយប័ណ្ណ',
        invoicePrefix: 'មិនទាន់មានបុព្វបទវិក្កយបត្រ',
        receiptPrefix: 'មិនទាន់មានបុព្វបទបង្កាន់ដៃ',
        assessmentPassingScore: 'មិនទាន់មានពិន្ទុឆ្លង',
        assessmentWeightingEnabled: 'មិនទាន់បានបើកការថ្លឹងទម្ងន់',
        gradeBandsCount: 'មិនទាន់មានកម្រិតពិន្ទុណាមួយ',
        assessmentCategoriesCount: 'មិនទាន់មានប្រភេទវាយតម្លៃណាមួយ',
        reportPeriodsCount: 'មិនទាន់មានរយៈពេលរបាយការណ៍ណាមួយ',
        activeGradingScale: 'មិនទាន់មានមាត្រដ្ឋានវាយតម្លៃសកម្ម',
        assessmentCategories: 'មិនទាន់មានប្រភេទវាយតម្លៃ',
        alertSeverityLevels: 'មិនទាន់មានកម្រិតការជូនដំណឹង',
        healthCategories: 'មិនទាន់មានប្រភេទសុខភាព',
        organizationName: 'មិនទាន់មានឈ្មោះអង្គភាព',
        language: 'មិនទាន់បានជ្រើសភាសា',
        brandingStatus: 'មិនទាន់មានស្ថានភាពម៉ាក',
      },
      sections: {
        academic: {
          title: 'ការកំណត់សិក្សា',
        },
        attendance: {
          title: 'ការកំណត់វត្តមាន',
        },
        payments: {
          title: 'ការកំណត់ទូទាត់',
        },
        assessments: {
          title: 'ការកំណត់វាយតម្លៃ',
        },
        health: {
          title: 'ការកំណត់សុខភាព',
        },
        preferences: {
          title: 'ចំណូលចិត្ត',
        },
      },
    },
  },
  preschoolAttendanceSettingsPage: {
    pageTitle: 'ការកំណត់វត្តមាន',
    pageSubtitle: 'គ្រប់គ្រងកម្រិតពេលយឺត ការជូនដំណឹង ថ្ងៃសិក្សា និងព្រឹត្តិការណ៍ប្រតិទិនសាលា។',
    sections: {
      thresholds: {
        eyebrow: 'ច្បាប់កម្រិត',
        title: 'ច្បាប់កម្រិតវត្តមាន',
        subtitle: 'កំណត់កម្រិតយឺត កម្រិតពាក់កណ្ដាលថ្ងៃ និងការជូនដំណឹងអវត្តមានសម្រាប់លំហូរការងារវត្តមាន។',
      },
      alerts: {
        eyebrow: 'ការផ្ញើសារ',
        title: 'ការកំណត់ការជូនដំណឹង',
        subtitle: 'ជ្រើសរើសក្រុមបុគ្គលិកណាដែលទទួលបានការជូនដំណឹងអវត្តមាន។',
      },
      schoolWeek: {
        eyebrow: 'សប្ដាហ៍សិក្សា',
        title: 'ការកំណត់សប្ដាហ៍សិក្សា',
        subtitle: 'ជ្រើសរើសថ្ងៃក្នុងសប្ដាហ៍ដែលគិតជាថ្ងៃសិក្សា។',
      },
      calendar: {
        eyebrow: 'ប្រតិទិនសាលា',
        title: 'ប្រតិទិនសាលា',
        subtitle: 'គ្រប់គ្រងថ្ងៃឈប់សម្រាក ការបិទសាលា ការបណ្ដុះបណ្ដាលគ្រូ ប្រឡង និងព្រឹត្តិការណ៍ពិសេស។',
      },
    },
    fields: {
      lateThresholdMinutes: 'កម្រិតយឺត (នាទី)',
      halfDayThresholdMinutes: 'កម្រិតពាក់កណ្ដាលថ្ងៃ (នាទី)',
      absenceAlertDays: 'ចំនួនថ្ងៃអវត្តមានបន្តបន្ទាប់សម្រាប់ជូនដំណឹង',
      guardianAlerts: 'ការជូនដំណឹងទៅអាណាព្យាបាល',
      teacherAlerts: 'ការជូនដំណឹងទៅគ្រូ',
      adminAlerts: 'ការជូនដំណឹងទៅអ្នកគ្រប់គ្រង',
      academicYearId: 'លេខសម្គាល់ឆ្នាំសិក្សា',
      title: 'ចំណងជើង',
      type: 'ប្រភេទ',
      startDate: 'កាលបរិច្ឆេទចាប់ផ្ដើម',
      endDate: 'កាលបរិច្ឆេទបញ្ចប់',
      status: 'ស្ថានភាព',
      description: 'ពិពណ៌នា',
    },
    weekDays: {
      monday: 'ថ្ងៃចន្ទ',
      tuesday: 'ថ្ងៃអង្គារ',
      wednesday: 'ថ្ងៃពុធ',
      thursday: 'ថ្ងៃព្រហស្បតិ៍',
      friday: 'ថ្ងៃសុក្រ',
      saturday: 'ថ្ងៃសៅរ៍',
      sunday: 'ថ្ងៃអាទិត្យ',
    },
    summary: {
      schoolWeek: 'សប្ដាហ៍សិក្សា',
      calendarEvents: 'ព្រឹត្តិការណ៍ប្រតិទិន',
    },
    calendar: {
      types: {
        holiday: 'ថ្ងៃឈប់សម្រាក',
        closure: 'បិទសាលា',
        teacherTraining: 'បណ្ដុះបណ្ដាលគ្រូ',
        examination: 'ប្រឡង',
        specialEvent: 'ព្រឹត្តិការណ៍ពិសេស',
      },
      statuses: {
        active: 'សកម្ម',
        archived: 'បានទុកជាប័ណ្ណសារ',
      },
    },
    table: {
      title: 'ចំណងជើង',
      type: 'ប្រភេទ',
      startDate: 'កាលបរិច្ឆេទចាប់ផ្ដើម',
      endDate: 'កាលបរិច្ឆេទបញ្ចប់',
      status: 'ស្ថានភាព',
      actions: 'សកម្មភាព',
    },
    actions: {
      saveSettings: 'រក្សាទុកការកំណត់',
      addEvent: 'បង្កើត',
      createEvent: 'បង្កើតព្រឹត្តិការណ៍',
      updateEvent: 'ធ្វើបច្ចុប្បន្នភាពព្រឹត្តិការណ៍',
      resetEvent: 'កំណត់ព្រឹត្តិការណ៍ឡើងវិញ',
      archive: 'ទុកជាប័ណ្ណសារ',
      edit: 'កែសម្រួល',
    },
    messages: {
      loadFailed: 'មិនអាចផ្ទុកការកំណត់វត្តមានបាននៅពេលនេះ។',
      saveFailed: 'មិនអាចរក្សាទុកការកំណត់វត្តមានបាន។',
      settingsSaved: 'ការកំណត់វត្តមានត្រូវបានរក្សាទុកដោយជោគជ័យ។',
      eventCreated: 'ព្រឹត្តិការណ៍ប្រតិទិនត្រូវបានបង្កើតដោយជោគជ័យ។',
      eventUpdated: 'ព្រឹត្តិការណ៍ប្រតិទិនត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ។',
      eventArchived: 'ព្រឹត្តិការណ៍ប្រតិទិនត្រូវបានទុកជាប័ណ្ណសារ។',
      validationFailed: 'សូមកែសម្រួលវាលដែលបានបន្លិចមុននឹងរក្សាទុក។',
    },
    validation: {
      required: 'វាលនេះគឺត្រូវការ។',
      range: 'កាលបរិច្ឆេទបញ្ចប់ត្រូវស្មើ ឬបន្ទាប់ពីកាលបរិច្ឆេទចាប់ផ្ដើម។',
      positive: 'សូមបញ្ចូលលេខវិជ្ជមាន។',
    },
  },
  preschoolAssessmentSettingsPage: {
    pageTitle: 'ការកំណត់ការវាយតម្លៃ',
    pageSubtitle: 'កំណត់ការវាយតម្លៃ កម្រិតពិន្ទុ ប្រភេទ រយៈពេលរបាយការណ៍ និងការថ្លឹងទម្ងន់សម្រាប់ Preschool។',
    sections: {
      settings: {
        eyebrow: 'ការកំណត់ការវាយតម្លៃ',
        title: 'ការកំណត់ការវាយតម្លៃ',
        subtitle: 'កំណត់កម្រិតឆ្លង និងបើក/បិទការថ្លឹងទម្ងន់។',
      },
      gradingScale: {
        eyebrow: 'មាត្រដ្ឋានពិន្ទុ',
        title: 'មាត្រដ្ឋានពិន្ទុ',
        subtitle: 'គ្រប់គ្រងជួរពិន្ទុសម្រាប់កម្រិតនីមួយៗ។',
        description: 'ជួយកំណត់ស្លាកកម្រិតសម្រាប់ការវាយតម្លៃ។',
      },
      categories: {
        eyebrow: 'ប្រភេទវាយតម្លៃ',
        title: 'ប្រភេទវាយតម្លៃ',
        subtitle: 'គ្រប់គ្រងប្រភេទដែលប្រើនៅក្នុង assessment builder។',
        description: 'ប្រភេទអាចកែសម្រួល និងទុកជាប័ណ្ណសារបាន។',
      },
      reportPeriods: {
        eyebrow: 'រយៈពេលរបាយការណ៍',
        title: 'រយៈពេលរបាយការណ៍',
        subtitle: 'កំណត់រយៈពេលសម្រាប់ការរាយការណ៍លទ្ធផល។',
        description: 'រយៈពេលនីមួយៗភ្ជាប់ជាមួយឆ្នាំសិក្សា និង term។',
      },
      weights: {
        eyebrow: 'ការថ្លឹងទម្ងន់',
        title: 'ការថ្លឹងទម្ងន់ការវាយតម្លៃ',
        subtitle: 'កំណត់ភាគរយសម្រាប់ប្រភេទនីមួយៗពេលបើកការថ្លឹងទម្ងន់។',
        description: 'ផលបូកត្រូវស្មើ 100% នៅពេលរក្សាទុក។',
      },
    },
    fields: {
      passingScore: 'ពិន្ទុឆ្លង',
      weightingEnabled: 'បើកការថ្លឹងទម្ងន់',
      grade: 'កម្រិត',
      minimumScore: 'ពិន្ទុអប្បបរមា',
      maximumScore: 'ពិន្ទុអតិបរមា',
      passing: 'ឆ្លង',
      color: 'ពណ៌',
      categoryName: 'ឈ្មោះប្រភេទ',
      categoryCode: 'កូដប្រភេទ',
      description: 'ពិពណ៌នា',
      status: 'ស្ថានភាព',
      sortOrder: 'លំដាប់',
      name: 'ឈ្មោះ',
      academicYear: 'ឆ្នាំសិក្សា',
      term: 'Term',
      startDate: 'កាលបរិច្ឆេទចាប់ផ្ដើម',
      endDate: 'កាលបរិច្ឆេទបញ្ចប់',
      percentage: 'ភាគរយ',
    },
    statuses: {
      active: 'សកម្ម',
      archived: 'បានទុកជាប័ណ្ណសារ',
      passing: 'ឆ្លង',
      notPassing: 'មិនឆ្លង',
    },
    summary: {
      totalWeight: 'សរុបទម្ងន់',
    },
    actions: {
      addGradeBand: 'បន្ថែមកម្រិត',
      addCategory: 'បង្កើតប្រភេទ',
      addReportPeriod: 'បង្កើតរយៈពេល',
      edit: 'កែសម្រួល',
      delete: 'លុប',
      archive: 'រក្សាទុក',
      saveSettings: 'រក្សាទុកការកំណត់',
      saveWeights: 'រក្សាទុកទម្ងន់',
      save: 'រក្សាទុក',
      cancel: 'បោះបង់',
    },
    dialogs: {
      gradeBand: {
        createTitle: 'បង្កើតកម្រិត',
        editTitle: 'កែសម្រួលកម្រិត',
        subtitle: 'កំណត់ជួរពិន្ទុ និងស្ថានភាពសម្រាប់កម្រិតនេះ។',
      },
      category: {
        createTitle: 'បង្កើតប្រភេទ',
        editTitle: 'កែសម្រួលប្រភេទ',
        subtitle: 'កែសម្រួលព័ត៌មានប្រភេទដែលប្រើក្នុងការវាយតម្លៃ។',
      },
      reportPeriod: {
        createTitle: 'បង្កើតរយៈពេលរបាយការណ៍',
        editTitle: 'កែសម្រួលរយៈពេលរបាយការណ៍',
        subtitle: 'ជ្រើសរើសឆ្នាំសិក្សា និង term សម្រាប់រយៈពេលនេះ។',
      },
    },
    help: {
      weightingEnabled: 'ពេលបើក តម្លៃទាំងអស់ត្រូវសរុបបាន 100% ។',
      passing: 'សម្គាល់ថា កម្រិតនេះគួរត្រូវបានចាត់ទុកថាឆ្លង។',
      categoryStatus: 'បើបិទ ប្រភេទនេះនឹងមិនត្រូវបានប្រើក្នុងការបង្កើតថ្មី។',
      reportPeriodStatus: 'រយៈពេលដែលរក្សាទុកអាចត្រូវបានបើក ឬទុកជាប័ណ្ណសារ។',
    },
    table: {
      actions: 'សកម្មភាព',
    },
    emptyStates: {
      gradingScale: 'មិនទាន់មានកម្រិតពិន្ទុណាមួយទេ។',
      categories: 'មិនទាន់មានប្រភេទវាយតម្លៃណាមួយទេ។',
      reportPeriods: 'មិនទាន់មានរយៈពេលរបាយការណ៍ណាមួយទេ។',
      weights: 'គ្មានប្រភេទសកម្មសម្រាប់ថ្លឹងទម្ងន់ទេ។',
    },
    messages: {
      loadFailed: 'មិនអាចផ្ទុកការកំណត់ការវាយតម្លៃបានទេ។',
      saveFailed: 'មិនអាចរក្សាទុកការកំណត់ការវាយតម្លៃបានទេ។',
      settingsSaved: 'ការកំណត់ការវាយតម្លៃត្រូវបានរក្សាទុកជោគជ័យ។',
      gradeBandCreated: 'កម្រិតត្រូវបានបង្កើតជោគជ័យ។',
      gradeBandUpdated: 'កម្រិតត្រូវបានកែសម្រួលជោគជ័យ។',
      gradeBandDeleted: 'កម្រិតត្រូវបានលុបជោគជ័យ។',
      deleteGradeBandConfirm: 'តើអ្នកពិតជាចង់លុបកម្រិតនេះមែនទេ?',
      categoryCreated: 'ប្រភេទត្រូវបានបង្កើតជោគជ័យ។',
      categoryUpdated: 'ប្រភេទត្រូវបានកែសម្រួលជោគជ័យ។',
      categoryArchived: 'ប្រភេទត្រូវបានទុកជាប័ណ្ណសារ។',
      archiveCategoryConfirm: 'តើអ្នកពិតជាចង់ទុកប្រភេទនេះជាប័ណ្ណសារមែនទេ?',
      reportPeriodCreated: 'រយៈពេលរបាយការណ៍ត្រូវបានបង្កើតជោគជ័យ។',
      reportPeriodUpdated: 'រយៈពេលរបាយការណ៍ត្រូវបានកែសម្រួលជោគជ័យ។',
      reportPeriodArchived: 'រយៈពេលរបាយការណ៍ត្រូវបានទុកជាប័ណ្ណសារ។',
      archiveReportPeriodConfirm: 'តើអ្នកពិតជាចង់ទុករយៈពេលនេះជាប័ណ្ណសារមែនទេ?',
      weightsSaved: 'ទម្ងន់ការវាយតម្លៃត្រូវបានរក្សាទុកជោគជ័យ។',
      weightTotalInvalid: 'សរុបទម្ងន់ត្រូវស្មើ 100% មុនពេលរក្សាទុក។',
    },
    validation: {
      required: 'វាលនេះគឺត្រូវការ។',
      range: 'បញ្ចូលតម្លៃពី 0 ដល់ 100 ហើយ minimum មិនអាចលើស maximum ។',
      total: 'សរុបទម្ងន់ត្រូវស្មើ 100% ។',
    },
  },
  preschoolAcademicSettingsPage: {
    pageTitle: 'ការកំណត់សិក្សា',
    pageSubtitle: 'គ្រប់គ្រងឆ្នាំសិក្សា និង term ដែលប្រើសម្រាប់ប្រតិទិន Preschool។',
    activeCards: {
      academicYear: {
        eyebrow: 'ឆ្នាំសិក្សាសកម្ម',
        title: 'ឆ្នាំសិក្សាសកម្ម',
        subtitle: 'ឆ្នាំដែលកំពុងប្រើសម្រាប់លំហូរការងារ Preschool។',
      },
      term: {
        eyebrow: 'Term សកម្ម',
        title: 'Term សកម្ម',
        subtitle: 'Term ដែលភ្ជាប់ជាមួយឆ្នាំសិក្សាសកម្ម។',
      },
    },
    statuses: {
      current: 'បច្ចុប្បន្ន',
      active: 'សកម្ម',
      draft: 'សេចក្តីព្រាង',
      closed: 'បានបិទ',
      archived: 'បានទុកជាប័ណ្ណសារ',
    },
  },
  preschoolSettingsPage: {
    dashboard: {
      fields: {
        criticalAlertsEnabled: 'ការជូនដំណឹងសំខាន់',
        severityLevelsCount: 'កម្រិតភាពធ្ងន់ធ្ងរ',
        incidentCategoriesCount: 'ប្រភេទឧប្បត្តិហេតុ',
        vaccinationCategoriesCount: 'ប្រភេទការចាក់វ៉ាក់សាំង',
        healthCheckCategoriesCount: 'ប្រភេទពិនិត្យសុខភាព',
        reminderStatus: 'ស្ថានភាពការរំលឹក',
        medicationReminders: 'ការរំលឹកថ្នាំ',
        vaccinationReminders: 'ការរំលឹកវ៉ាក់សាំង',
      },
      emptyStates: {
        severityLevelsCount: 'មិនទាន់មានកម្រិតភាពធ្ងន់ធ្ងរ',
        incidentCategoriesCount: 'មិនទាន់មានប្រភេទឧប្បត្តិហេតុ',
        vaccinationCategoriesCount: 'មិនទាន់មានប្រភេទការចាក់វ៉ាក់សាំង',
        healthCheckCategoriesCount: 'មិនទាន់មានប្រភេទពិនិត្យសុខភាព',
        reminderStatus: 'មិនទាន់មានការកំណត់ការរំលឹក',
      },
      sections: {
        health: {
          subtitle: 'ពិនិត្យកម្រិតភាពធ្ងន់ធ្ងរ ប្រភេទ និងការរំលឹកសម្រាប់ការថែទាំសុខភាពសិស្ស។',
          description: 'គ្រប់គ្រងការកំណត់សុខភាព ម៉េតាដាទំនាក់ទំនងនៃភាពធ្ងន់ធ្ងរ និងប្រភេទយោងសុខភាពដែលបានកំណត់។',
        },
      },
    },
  },
  preschoolHealthSettingsPage: {
    pageTitle: 'ការកំណត់សុខភាព',
    pageSubtitle: 'កំណត់អាកប្បកិរិយាការជូនដំណឹងសុខភាព បញ្ជីប្រភេទ និងច្បាប់រំលឹកសម្រាប់ដំណើរការថែទាំ Preschool។',
    sections: {
      settings: {
        eyebrow: 'ការកំណត់សុខភាព',
        title: 'ការកំណត់សុខភាព',
        subtitle: 'គ្រប់គ្រងការផ្ញើការជូនដំណឹង និងអាកប្បកិរិយាការរំលឹកសម្រាប់ដំណើរការសុខភាព។',
      },
      severityLevels: {
        eyebrow: 'កម្រិតភាពធ្ងន់ធ្ងរ',
        title: 'កម្រិតភាពធ្ងន់ធ្ងរ',
        subtitle: 'គ្រប់គ្រងស្លាកភាពធ្ងន់ធ្ងរដែលប្រើក្នុងការជូនដំណឹងសុខភាព និងឧប្បត្តិហេតុ។',
        description: 'កម្រិតភាពធ្ងន់ធ្ងរកំណត់ការជូនដំណឹង និងតម្រូវការទទួលស្គាល់។',
      },
      incidentCategories: {
        eyebrow: 'ប្រភេទឧប្បត្តិហេតុ',
        title: 'ប្រភេទឧប្បត្តិហេតុ',
        subtitle: 'ថែទាំបញ្ជីប្រភេទឧប្បត្តិហេតុខាងសុខភាពដែលប្រើដោយកំណត់ត្រា និងការជូនដំណឹង។',
        description: 'ប្រភេទឧប្បត្តិហេតុនៅតែអាចប្រើបានសម្រាប់កំណត់ត្រាថ្មីនៅពេលសកម្ម។',
      },
      vaccinationCategories: {
        eyebrow: 'ប្រភេទការចាក់វ៉ាក់សាំង',
        title: 'ប្រភេទការចាក់វ៉ាក់សាំង',
        subtitle: 'ថែទាំប្រភេទវ៉ាក់សាំងដែលប្រើដោយកំណត់ត្រាវ៉ាក់សាំង និងការរំលឹក។',
        description: 'ប្រភេទការចាក់វ៉ាក់សាំងនៅតែមានសុពលភាពសម្រាប់កំណត់ត្រាដែលមានស្រាប់នៅពេលផុតសកម្ម។',
      },
      healthCheckCategories: {
        eyebrow: 'ប្រភេទពិនិត្យសុខភាព',
        title: 'ប្រភេទពិនិត្យសុខភាព',
        subtitle: 'គ្រប់គ្រងប្រភេទដែលប្រើសម្រាប់ការពិនិត្យសុខភាពប្រចាំថ្ងៃ និងតាមកាលកំណត់។',
        description: 'ប្រភេទពិនិត្យសុខភាពនៅតែអាចប្រើបានសម្រាប់កំណត់ត្រាប្រវត្តិសាស្ត្រ។',
      },
    },
    fields: {
      criticalAlertsEnabled: 'បើកការជូនដំណឹងសំខាន់',
      guardianNotifications: 'ការជូនដំណឹងទៅអាណាព្យាបាល',
      teacherNotifications: 'ការជូនដំណឹងទៅគ្រូ',
      adminNotifications: 'ការជូនដំណឹងទៅអ្នកគ្រប់គ្រង',
      medicationReminders: 'ការរំលឹកថ្នាំ',
      vaccinationReminders: 'ការរំលឹកវ៉ាក់សាំង',
      overdueVaccinationAlertDays: 'ចំនួនថ្ងៃជូនដំណឹងវ៉ាក់សាំងហួសកំណត់',
      medicationReminderMinutesBefore: 'នាទីមុនសម្រាប់ការរំលឹកថ្នាំ',
      name: 'ឈ្មោះ',
      code: 'កូដ',
      priority: 'អាទិភាព',
      color: 'ពណ៌',
      requiresAcknowledgment: 'តម្រូវឱ្យទទួលស្គាល់',
      triggersNotification: 'បង្កើតការជូនដំណឹង',
      active: 'សកម្ម',
      sortOrder: 'លំដាប់',
      description: 'ពិពណ៌នា',
      defaultSeverity: 'ភាពធ្ងន់ធ្ងរលំនាំដើម',
      recommendedAgeMonths: 'អាយុណែនាំ (ខែ)',
      required: 'តម្រូវ',
    },
    table: {
      name: 'ឈ្មោះ',
      code: 'កូដ',
      priority: 'អាទិភាព',
      color: 'ពណ៌',
      requiresAcknowledgment: 'តម្រូវឱ្យទទួលស្គាល់',
      triggersNotification: 'បង្កើតការជូនដំណឹង',
      defaultSeverity: 'ភាពធ្ងន់ធ្ងរលំនាំដើម',
      recommendedAge: 'អាយុណែនាំ',
      required: 'តម្រូវ',
      status: 'ស្ថានភាព',
      actions: 'សកម្មភាព',
    },
    emptyStates: {
      severityLevels: 'មិនទាន់មានកម្រិតភាពធ្ងន់ធ្ងរទេ។',
      incidentCategories: 'មិនទាន់មានប្រភេទឧប្បត្តិហេតុទេ។',
      vaccinationCategories: 'មិនទាន់មានប្រភេទការចាក់វ៉ាក់សាំងទេ។',
      healthCheckCategories: 'មិនទាន់មានប្រភេទពិនិត្យសុខភាពទេ។',
    },
    actions: {
      saveSettings: 'រក្សាទុកការកំណត់',
      createSeverityLevel: 'បង្កើតកម្រិតភាពធ្ងន់ធ្ងរ',
      createIncidentCategory: 'បង្កើតប្រភេទឧប្បត្តិហេតុ',
      createVaccinationCategory: 'បង្កើតប្រភេទការចាក់វ៉ាក់សាំង',
      createHealthCheckCategory: 'បង្កើតប្រភេទពិនិត្យសុខភាព',
      save: 'រក្សាទុក',
      update: 'ធ្វើបច្ចុប្បន្នភាព',
      archive: 'ទុកក្នុងបណ្ណសារ',
    },
    messages: {
      loadFailed: 'មិនអាចផ្ទុកការកំណត់សុខភាពបាននៅពេលនេះទេ។',
      saveFailed: 'មិនអាចរក្សាទុកការកំណត់សុខភាពបានទេ។',
      settingsSaved: 'ការកំណត់សុខភាពត្រូវបានរក្សាទុកដោយជោគជ័យ។',
      severityLevelCreated: 'កម្រិតភាពធ្ងន់ធ្ងរត្រូវបានបង្កើតដោយជោគជ័យ។',
      severityLevelUpdated: 'កម្រិតភាពធ្ងន់ធ្ងរត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ។',
      severityLevelArchived: 'កម្រិតភាពធ្ងន់ធ្ងរត្រូវបានទុកក្នុងបណ្ណសារ។',
      archiveSeverityConfirm: 'ទុកកម្រិតភាពធ្ងន់ធ្ងរនេះក្នុងបណ្ណសារឬ?',
      incidentCategoryCreated: 'ប្រភេទឧប្បត្តិហេតុត្រូវបានបង្កើតដោយជោគជ័យ។',
      incidentCategoryUpdated: 'ប្រភេទឧប្បត្តិហេតុត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ។',
      incidentCategoryArchived: 'ប្រភេទឧប្បត្តិហេតុត្រូវបានទុកក្នុងបណ្ណសារ។',
      archiveIncidentConfirm: 'ទុកប្រភេទឧប្បត្តិហេតុនេះក្នុងបណ្ណសារឬ?',
      vaccinationCategoryCreated: 'ប្រភេទការចាក់វ៉ាក់សាំងត្រូវបានបង្កើតដោយជោគជ័យ។',
      vaccinationCategoryUpdated: 'ប្រភេទការចាក់វ៉ាក់សាំងត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ។',
      vaccinationCategoryArchived: 'ប្រភេទការចាក់វ៉ាក់សាំងត្រូវបានទុកក្នុងបណ្ណសារ។',
      archiveVaccinationConfirm: 'ទុកប្រភេទការចាក់វ៉ាក់សាំងនេះក្នុងបណ្ណសារឬ?',
      healthCheckCategoryCreated: 'ប្រភេទពិនិត្យសុខភាពត្រូវបានបង្កើតដោយជោគជ័យ។',
      healthCheckCategoryUpdated: 'ប្រភេទពិនិត្យសុខភាពត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ។',
      healthCheckCategoryArchived: 'ប្រភេទពិនិត្យសុខភាពត្រូវបានទុកក្នុងបណ្ណសារ។',
      archiveHealthCheckConfirm: 'ទុកប្រភេទពិនិត្យសុខភាពនេះក្នុងបណ្ណសារឬ?',
      validationFailed: 'សូមកែប្រែវាលដែលបានបន្លិចមុននឹងរក្សាទុក។',
    },
    validation: {
      required: 'វាលនេះត្រូវតែបំពេញ។',
      positive: 'សូមបញ្ចូលលេខវិជ្ជមាន។',
    },
  },
}

export default mergeDeep(enPreschool, overrides)

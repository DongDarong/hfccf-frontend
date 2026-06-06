export default {
  formsModuleDashboard: {
    title: 'Forms Management',
    subtitle: 'Create, manage, assess, score, review, and export student assessment forms.',
    step: 'Step',
    workspaces: {
      manage: 'Manage workspace',
      build: 'Build workspace',
      review: 'Review workspace',
    },
    manageWorkspace: {
      totalTemplates: 'Total templates',
      drafts: 'Drafts',
      published: 'Published',
      archived: 'Archived',
      openCatalog: 'Open catalog',
      recentTemplates: 'Recent templates',
      recentActivity: 'Recent activity',
      viewAll: 'View all',
      viewLogs: 'View logs',
      noTemplates: 'No assessment templates have been created yet.',
      noActivity: 'No recent form activity was found.',
      systemActor: 'System',
      partialData: 'Some workspace data could not be loaded. Navigation remains available.',
    },
    sections: {
      manage: { label: 'Manage & Organize', caption: 'Organize templates, reusable questions, and history' },
      build: { label: 'Build & Configure', caption: 'Create forms, scoring rules, and print layouts' },
      review: { label: 'Run, Review & Report', caption: 'Assess students, approve results, and analyze outcomes' },
    },
    cards: {
      templates: {
        title: 'Assessment Templates',
        description: 'Create, edit, duplicate, publish, and archive assessment templates.',
      },
      questionBank: {
        title: 'Question Bank',
        description: 'Manage reusable questions grouped by category, topic, and year.',
      },
      exerciseBuilder: {
        title: 'Exercise Builder',
        description: 'Create exercises, multi-step tasks, sub-questions, and evaluation activities.',
      },
      scoringRules: {
        title: 'Scoring Rules',
        description: 'Configure points, weights, grading rules, and automatic score calculation.',
      },
      sessions: {
        title: 'Assessment Sessions',
        description: 'Manage assessment submissions, student evaluations, and assessment workflows.',
      },
      submissionReview: {
        title: 'Submission Review',
        description: 'Review answers, verify scores, approve results, and manage revisions.',
      },
      printTemplates: {
        title: 'Print Templates',
        description: 'Design PDF and Excel layouts including logos, headers, signatures, and branding.',
      },
      exportCenter: {
        title: 'Export Center',
        description: 'Export questionnaires, answers, reports, PDFs, Excel files, and bulk downloads.',
      },
      analytics: {
        title: 'Reports & Analytics',
        description: 'View assessment statistics, score distributions, performance reports, and trends.',
      },
      auditLogs: {
        title: 'Audit Logs',
        description: 'Track template changes, scoring updates, exports, and user activities.',
      },
    },
  },
}

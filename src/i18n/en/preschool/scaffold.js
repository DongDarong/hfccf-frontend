export default {
  preschoolScaffold: {
    formManagement: {
      loading: 'Loading form data...',
      title: 'Form Management',
      subtitle: 'Create, organize, review, and manage Preschool forms.',
      eyebrow: 'Form overview',
      description:
        'Manage the launch points for form builders, recent forms, submissions, and review tools.',
      hero: {
        summaryWithForms: '{count} forms are currently active.',
        summaryNoForms: 'No forms have been created yet.',
        metricForms: 'Total Forms',
        formRequired: 'Form required',
        openLabel: 'Open',
      },
      pages: {
        overview: {
          summary: 'Choose a section below to open the forms, build, or review workspace.',
        },
        sections: {
          title: 'Sections',
        },
        manage: {
          title: 'Manage Forms',
          subtitle: 'Open the form catalog and related records.',
          eyebrow: 'Form management',
          description: 'Open the form catalog and related records.',
        },
        build: {
          title: 'Build Forms',
          subtitle: 'Create and refine forms with the guided tools.',
          eyebrow: 'Form builder',
          description: 'Create and refine forms with the guided tools.',
        },
        review: {
          title: 'Review Forms',
          subtitle: 'Review submission and reporting outputs.',
          eyebrow: 'Form review',
          description: 'Review submission and reporting outputs.',
        },
      },
      cards: {
        dashboard: {
          title: 'Dashboard',
          description: 'View overall status and quickly jump into key areas.',
        },
        forms: {
          title: 'Forms',
          description: 'Review and organize the current form catalog.',
        },
        newForm: {
          title: 'New Form',
          description: 'Create a new form for a workflow or data collection flow.',
        },
        submissions: {
          title: 'Submissions',
          description: 'Track submissions and monitor their processing status.',
        },
        wizard: {
          title: 'Wizard',
          description: 'Build forms step by step with guided assistance.',
        },
        scoring: {
          title: 'Scoring',
          description: 'Define and manage form scoring rules.',
        },
        printDesigner: {
          title: 'Print Designer',
          description: 'Arrange print layouts and present forms cleanly.',
        },
        reports: {
          title: 'Reports',
          description: 'View summary data and reports for forms.',
        },
        auditLogs: {
          title: 'Audit Logs',
          description: 'Review activity and the history of changes.',
        },
      },
      hub: {
        title: 'Forms Management',
        subtitle: 'Create, manage, assess, score, review, and export student assessment forms.',
        sections: {
          design:     { label: 'Assessment Design',     caption: 'Build, configure, and organize your assessment tools' },
          operations: { label: 'Assessment Operations', caption: 'Conduct assessments and manage student submissions' },
          reporting:  { label: 'Export & Reporting',    caption: 'Generate reports and export assessment data' },
          admin:      { label: 'Administration',        caption: 'Configure settings and monitor system activity' },
        },
        cards: {
          templates:       { title: 'Assessment Templates', description: 'Create, edit, duplicate, publish, and archive assessment templates.' },
          questionBank:    { title: 'Question Bank',        description: 'Manage reusable questions grouped by category, topic, and year.' },
          exerciseBuilder: { title: 'Exercise Builder',     description: 'Create exercises, activities, sub-questions, and evaluation workflows.' },
          scoringRules:    { title: 'Scoring Rules',        description: 'Configure points, weights, grading logic, and automatic score calculation.' },
          sessions:        { title: 'Assessment Sessions',  description: 'Manage student assessments, evaluations, and ongoing assessment activities.' },
          submissionReview:{ title: 'Submission Review',    description: 'Review answers, approve submissions, and verify assessment results.' },
          results:         { title: 'Results & Scores',     description: 'View section scores, total scores, grades, and student performance.' },
          printTemplates:  { title: 'Print Templates',      description: 'Design printable PDF and Excel layouts with branding and signatures.' },
          exportCenter:    { title: 'Export Center',        description: 'Export questionnaires, exercises, answers, reports, PDFs, and Excel files.' },
          analytics:       { title: 'Reports & Analytics',  description: 'View trends, statistics, score distributions, and assessment insights.' },
          auditLogs:       { title: 'Audit Logs',           description: 'Track template updates, scoring changes, exports, and user activities.' },
          settings:        { title: 'Settings',             description: 'Manage assessment configuration, academic years, and module preferences.' },
        },
      },
    },
  },
  preschoolAdminAttendancePage: {
    status: {
      present: 'Present',
      absent: 'Absent',
      late: 'Late',
      excused: 'Excused',
    },
  },
}

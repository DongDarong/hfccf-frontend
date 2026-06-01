// Keep placeholder copy explicit so unfinished Preschool routes stay visible
// without pretending that a real workflow is already implemented.
export default {
  preschoolScaffold: {
    attendanceManagement: {
      eyebrow: 'Scaffold',
      title: 'Attendance Management',
      subtitle: 'This Preschool attendance workspace is not implemented yet.',
      description: 'The route stays visible so the Preschool navigation remains stable while this workflow is still a scaffold.',
    },
    formManagement: {
      eyebrow: 'Assessment',
      title: 'Assessment Workspace',
      subtitle: 'Choose a card below to open the Assessment page you need.',
      description: 'These cards act as shortcuts into the Preschool assessment workflow.',
      intro: 'Scoring and print tools use the first available form template when one exists.',
      loading: 'Loading assessment tools…',
      noForms: 'No form templates yet. Create your first form to unlock scoring and print tools.',
      formsAvailable: '{count} form template available | {count} form templates available',
      cards: {
        dashboard: {
          title: 'Dashboard',
          description: 'Open the assessment overview and quick metrics.',
        },
        forms: {
          title: 'Form Library',
          description: 'Manage templates, versions, sections, and questions.',
        },
        newForm: {
          title: 'Create Form',
          description: 'Create a new assessment template from scratch.',
        },
        submissions: {
          title: 'Submissions',
          description: 'Review submitted assessments and open individual records.',
        },
        wizard: {
          title: 'Assessment Wizard',
          description: 'Launch the guided assessment entry workflow.',
        },
        scoring: {
          title: 'Scoring Manager',
          description: 'Configure scoring rules and risk levels.',
        },
        printDesigner: {
          title: 'Print Designer',
          description: 'Design Khmer-friendly print layouts and templates.',
        },
        reports: {
          title: 'Reports',
          description: 'Analyze trends, risk breakdowns, and completion rates.',
        },
        auditLogs: {
          title: 'Audit Logs',
          description: 'Inspect assessment action history and changes.',
        },
      },
    },
    classroomResources: {
      eyebrow: 'Scaffold',
      title: 'Classroom Resources',
      subtitle: 'This Preschool resource page is not implemented yet.',
      description: 'The placeholder makes the unfinished state explicit and avoids a fake production impression.',
    },
    reportManagement: {
      eyebrow: 'Scaffold',
      title: 'Report Management',
      subtitle: 'This Preschool reporting page is not implemented yet.',
      description: 'Reports stay visible in the sidebar, but the feature still needs a real backend workflow.',
    },
    teacherReport: {
      eyebrow: 'Scaffold',
      title: 'Teacher Report',
      subtitle: 'This teacher report page is not implemented yet.',
      description: 'The route remains available for future work without implying a completed workflow.',
    },
    teacherClassroomResources: {
      eyebrow: 'Scaffold',
      title: 'Classroom Resources',
      subtitle: 'This teacher resource page is not implemented yet.',
      description: 'Keeping the placeholder explicit reduces confusion while the route remains wired.',
    },
    healthy: {
      eyebrow: 'Scaffold',
      title: 'Healthy Habits',
      subtitle: 'This health guidance page is not implemented yet.',
      description: 'The route is preserved for navigation stability and future implementation.',
    },
  },
}

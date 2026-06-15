export const PRESCHOOL_ASSESSMENT_ROUTE_NAMES = {
  dashboard: 'preschool-assessment-dashboard',
  list: 'preschool-assessment-list',
  reports: 'preschool-assessment-reports',
  settings: 'preschool-assessment-settings',
}

export const PRESCHOOL_ASSESSMENT_PAGE_FLOW = [
  {
    key: 'overview',
    title: 'Overview',
    description: 'Review the current assessment state, key totals, and risk signals.',
    routeName: PRESCHOOL_ASSESSMENT_ROUTE_NAMES.dashboard,
  },
  {
    key: 'capture',
    title: 'Capture',
    description: 'Create and edit student assessments for the selected Preschool context.',
    routeName: PRESCHOOL_ASSESSMENT_ROUTE_NAMES.list,
  },
  {
    key: 'review',
    title: 'Review',
    description: 'Finalize, archive, and inspect assessment history before reporting.',
    routeName: PRESCHOOL_ASSESSMENT_ROUTE_NAMES.reports,
  },
  {
    key: 'configure',
    title: 'Configure',
    description: 'Manage scoring rules, thresholds, periods, and module preferences.',
    routeName: PRESCHOOL_ASSESSMENT_ROUTE_NAMES.settings,
  },
]

export const PRESCHOOL_ASSESSMENT_NAV_CARDS = [
  {
    group: 'Assessment Hub',
    title: 'Dashboard',
    description: 'Summary metrics, recent activity, and quick actions.',
    routeName: PRESCHOOL_ASSESSMENT_ROUTE_NAMES.dashboard,
    iconClass: 'pi pi-chart-bar',
  },
  {
    group: 'Assessment Hub',
    title: 'Assessment List',
    description: 'Create, edit, finalize, and archive student assessments.',
    routeName: PRESCHOOL_ASSESSMENT_ROUTE_NAMES.list,
    iconClass: 'pi pi-list-check',
  },
  {
    group: 'Analysis',
    title: 'Reports',
    description: 'Track trends, risk levels, and performance insights.',
    routeName: PRESCHOOL_ASSESSMENT_ROUTE_NAMES.reports,
    iconClass: 'pi pi-chart-line',
  },
  {
    group: 'Configuration',
    title: 'Settings',
    description: 'Maintain thresholds, ratings, and operational defaults.',
    routeName: PRESCHOOL_ASSESSMENT_ROUTE_NAMES.settings,
    iconClass: 'pi pi-cog',
  },
]

export const PRESCHOOL_ASSESSMENT_RATING_OPTIONS = [
  { label: 'Excellent', value: 'Excellent', scoreMin: 80, scoreMax: 100, riskLevel: 'excellent' },
  { label: 'Good', value: 'Good', scoreMin: 70, scoreMax: 79, riskLevel: 'good' },
  { label: 'Fair', value: 'Fair', scoreMin: 60, scoreMax: 69, riskLevel: 'fair' },
  { label: 'Needs Improvement', value: 'Needs Improvement', scoreMin: 0, scoreMax: 59, riskLevel: 'at-risk' },
]

export const PRESCHOOL_ASSESSMENT_STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Finalized', value: 'finalized' },
]

export const PRESCHOOL_ASSESSMENT_PERIOD_OPTIONS = [
  { label: 'All Periods', value: null },
  { label: 'Q1', value: 'Q1' },
  { label: 'Q2', value: 'Q2' },
  { label: 'Q3', value: 'Q3' },
  { label: 'Q4', value: 'Q4' },
  { label: 'Midterm', value: 'Midterm' },
  { label: 'Final', value: 'Final' },
]

export const PRESCHOOL_ASSESSMENT_DEFAULT_FILTERS = {
  studentId: null,
  classId: null,
  categoryId: null,
  periodLabel: null,
  status: 'all',
  searchQuery: '',
  dateFrom: null,
  dateTo: null,
}

export const PRESCHOOL_ASSESSMENT_DEFAULT_FORM = {
  classId: null,
  categoryId: null,
  periodLabel: null,
  assessmentDate: null,
  score: null,
  rating: null,
  observation: '',
  teacherComment: '',
}

import dashboard from './dashboard'
import classes from './classes'
import students from './students'
import payments from './payments'
import scaffold from './scaffold'
import attendance from './attendance'
import adminDashboard from './admin-dashboard'
import assessment from './assessment'
import progress from './progress'
import reports from './reports'
import schedules from './schedules'
import settings from './settings'
import settingsBackbone from './settings.backbone'
import lifecycle from './lifecycle'
import lifecycleAudit from './lifecycle-audit'
import lifecycleAnalytics from './lifecycle-analytics'
import classroomResources from './classroom-resources'
import assignments from './assignments'
import reportSnapshots from './report-snapshots'
import snapshotArchive from './snapshot-archive'
import exportGovernance from './export-governance'
import governance from './governance'
import governanceDiff from './governance-diff'
import governanceCases from './governance-cases'
import enrollment from './enrollment'
import formsDashboard from './forms-dashboard'

export default {
  // Keep Preschool copy split by concern so real pages can resolve stable keys
  // and scaffold-only routes can stay explicit without pretending they are built.
  ...dashboard,
  ...classes,
  ...students,
  ...payments,
  ...scaffold,
  ...attendance,
  ...adminDashboard,
  ...assessment,
  ...progress,
  ...reports,
  ...schedules,
  preschoolSettingsPage: {
    ...settings.preschoolSettingsPage,
    ...settingsBackbone.preschoolSettingsPage,
    sections: {
      ...settings.preschoolSettingsPage.sections,
      ...settingsBackbone.preschoolSettingsPage.sections,
    },
    fields: {
      ...settings.preschoolSettingsPage.fields,
      ...settingsBackbone.preschoolSettingsPage.fields,
    },
    placeholders: {
      ...settings.preschoolSettingsPage.placeholders,
      ...settingsBackbone.preschoolSettingsPage.placeholders,
    },
    summary: {
      ...settings.preschoolSettingsPage.summary,
      ...settingsBackbone.preschoolSettingsPage.summary,
    },
    emptyStates: {
      ...settings.preschoolSettingsPage.emptyStates,
      ...settingsBackbone.preschoolSettingsPage.emptyStates,
    },
  },
  ...lifecycle,
  ...lifecycleAudit,
  ...lifecycleAnalytics,
  ...classroomResources,
  ...assignments,
  ...reportSnapshots,
  ...snapshotArchive,
  ...exportGovernance,
  ...governance,
  ...governanceDiff,
  ...governanceCases,
  ...enrollment,
  ...formsDashboard,
}

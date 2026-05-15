export function translateKey(t, key, fallback = '') {
  if (!key) return fallback
  const resolved = t(key)
  return resolved !== key ? resolved : fallback
}

function mapSummaryCards(t, cards = []) {
  return cards.map((card) => ({
    ...card,
    title: translateKey(t, card.titleKey, card.titleFallback),
    label: translateKey(t, card.labelKey, card.labelFallback),
    trend: translateKey(t, card.trendKey, card.trendFallback),
    actionLabel: translateKey(t, card.actionLabelKey, card.actionLabelFallback),
    statusLabel: translateKey(t, `commandCenter.statusLevels.${card.status}`, card.status),
  }))
}

function mapPriorityActions(t, actions = []) {
  return actions.map((action) => ({
    ...action,
    title: translateKey(t, action.titleKey, action.titleFallback),
    priorityLabel: translateKey(t, action.priorityLabelKey, action.priorityLabelFallback),
    dueLabel: translateKey(t, action.dueLabelKey, action.dueLabelFallback),
    actionLabel: translateKey(t, action.actionLabelKey, action.actionLabelFallback),
  }))
}

function mapDepartmentHealth(t, departments = []) {
  return departments.map((department) => ({
    ...department,
    name: translateKey(t, department.nameKey, department.nameFallback),
    statusLabel: translateKey(t, department.statusLabelKey, department.statusLabelFallback),
    reportingLabel: translateKey(t, department.reportingLabelKey, department.reportingLabelFallback),
    actionLabel: translateKey(t, department.actionLabelKey, department.actionLabelFallback),
    issueLabel:
      department.issueCount === 1
        ? translateKey(
            t,
            department.issueLabelSingularKey,
            department.issueLabelSingularFallback,
          )
        : translateKey(t, department.issueLabelPluralKey, department.issueLabelPluralFallback),
  }))
}

function mapGovernanceMetrics(t, metrics = []) {
  return metrics.map((metric) => ({
    ...metric,
    title: translateKey(t, metric.titleKey, metric.titleFallback),
    label: translateKey(t, metric.labelKey, metric.labelFallback),
  }))
}

function mapEvents(t, events = []) {
  return events.map((event) => ({
    ...event,
    title: translateKey(t, event.titleKey, event.titleFallback),
    moduleLabel: translateKey(t, event.moduleKey, event.moduleFallback),
    severityLabel: translateKey(t, event.severityLabelKey, event.severityLabelFallback),
    timestampLabel: translateKey(t, event.timestampKey, event.timestampFallback),
  }))
}

function mapNextSteps(t, steps = []) {
  return steps.map((step) => ({
    ...step,
    text: translateKey(t, step.textKey, step.textFallback),
  }))
}

export function buildCommandCenterViewModel(t, data) {
  return {
    pageTitle: translateKey(t, data.page.titleKey, data.page.titleFallback),
    pageSubtitle: translateKey(t, data.page.subtitleKey, data.page.subtitleFallback),
    sections: {
      summary: {
        title: translateKey(t, data.sections.summary.titleKey, data.sections.summary.titleFallback),
        subtitle: translateKey(
          t,
          data.sections.summary.subtitleKey,
          data.sections.summary.subtitleFallback,
        ),
      },
      status: {
        title: translateKey(t, data.sections.status.titleKey, data.sections.status.titleFallback),
      },
      priorityActions: {
        title: translateKey(
          t,
          data.sections.priorityActions.titleKey,
          data.sections.priorityActions.titleFallback,
        ),
      },
      departmentHealth: {
        title: translateKey(
          t,
          data.sections.departmentHealth.titleKey,
          data.sections.departmentHealth.titleFallback,
        ),
      },
      governance: {
        title: translateKey(
          t,
          data.sections.governance.titleKey,
          data.sections.governance.titleFallback,
        ),
      },
      events: {
        title: translateKey(t, data.sections.events.titleKey, data.sections.events.titleFallback),
      },
      nextSteps: {
        title: translateKey(
          t,
          data.sections.nextSteps.titleKey,
          data.sections.nextSteps.titleFallback,
        ),
      },
    },
    summaryCards: mapSummaryCards(t, data.summaryCards),
    executiveStatus: {
      ...data.executiveStatus,
      topIssue: translateKey(t, data.executiveStatus.topIssueKey, data.executiveStatus.topIssueFallback),
      department: translateKey(
        t,
        data.executiveStatus.departmentKey,
        data.executiveStatus.departmentFallback,
      ),
      recommendedAction: translateKey(
        t,
        data.executiveStatus.recommendedActionKey,
        data.executiveStatus.recommendedActionFallback,
      ),
      levelLabel: translateKey(
        t,
        data.executiveStatus.levelLabelKey,
        data.executiveStatus.levelLabelFallback,
      ),
      topIssueLabel: translateKey(
        t,
        data.executiveStatus.topIssueLabelKey,
        data.executiveStatus.topIssueLabelFallback,
      ),
      departmentLabel: translateKey(
        t,
        data.executiveStatus.departmentLabelKey,
        data.executiveStatus.departmentLabelFallback,
      ),
      recommendedActionLabel: translateKey(
        t,
        data.executiveStatus.recommendedActionLabelKey,
        data.executiveStatus.recommendedActionLabelFallback,
      ),
      note: translateKey(t, data.executiveStatus.noteKey, data.executiveStatus.noteFallback),
    },
    priorityActions: mapPriorityActions(t, data.priorityActions),
    departmentHealth: mapDepartmentHealth(t, data.departmentHealth),
    governanceMetrics: mapGovernanceMetrics(t, data.governanceMetrics),
    recentEvents: mapEvents(t, data.recentEvents),
    nextSteps: mapNextSteps(t, data.nextSteps),
  }
}

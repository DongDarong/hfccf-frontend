export default {
  commandCenter: {
    page: {
      title: 'Executive Command Center',
      subtitle:
        'Cross-department control view for urgent escalations, approvals, governance, and critical events.',
    },
    sections: {
      summary: {
        title: 'Executive Summary',
        subtitle: 'Priority signals for the current operating window.',
      },
      status: {
        title: 'Executive Status Summary',
      },
      priorityActions: {
        title: 'Priority Actions',
      },
      departmentHealth: {
        title: 'Cross-Department Health',
      },
      governance: {
        title: 'Governance & Access Overview',
      },
      events: {
        title: 'Recent Critical Events',
      },
      nextSteps: {
        title: 'Recommended Next Steps',
      },
    },
    summaryCards: {
      openEscalations: {
        title: 'Open Escalations',
        label: 'Awaiting direct review',
        trend: '6 requests need action today',
        action: 'Review queue',
      },
      activePrograms: {
        title: 'Active Programs',
        label: 'Operating under supervision',
        trend: '4 programs are currently monitored',
        action: 'View programs',
      },
      pendingApprovals: {
        title: 'Pending Approvals',
        label: 'Waiting for sign-off',
        trend: '11 approvals remain in the queue',
        action: 'Approve queue',
      },
      complianceAlerts: {
        title: 'Compliance Alerts',
        label: 'Requires oversight',
        trend: '3 alerts include one overdue item',
        action: 'Open review',
      },
    },
    statusLevels: {
      stable: 'Stable',
      watch: 'Watch',
      critical: 'Critical',
    },
    executiveStatus: {
      topIssueLabel: 'Top issue',
      departmentLabel: 'Department needing attention',
      recommendedActionLabel: 'Recommended action',
      topIssue: 'Permission conflicts are blocking access updates in Sport and Scholarship.',
      department: 'Sport Program',
      recommendedAction:
        'Approve the pending access queue, assign an audit owner, and clear the oldest escalations before the next review cycle.',
      note: 'The system is stable overall, but the current queue needs direct intervention.',
    },
    priorityActions: {
      approveRequests: 'Approve admin and staff requests',
      reviewViolations: 'Review access violations',
      resolveEscalations: 'Resolve escalations with no owner',
      overdueItems: 'Review overdue compliance items',
    },
    priorityLabels: {
      urgent: 'Urgent',
      high: 'High',
      medium: 'Medium',
    },
    dueLabels: {
      today: 'Due today',
      immediate: 'Immediate',
      beforeNoon: 'Before noon',
      thisWeek: 'This week',
    },
    departments: {
      english: 'English Program',
      preschool: 'Preschool Program',
      scholarship: 'Scholarship Program',
      sport: 'Sport Program',
    },
    health: {
      reportingComplete: 'reporting complete',
      issueSingular: 'open issue',
      issuePlural: 'open issues',
    },
    governance: {
      pendingUserReviews: 'Pending user reviews',
      pendingUserReviewsLabel: 'Under review',
      permissionConflicts: 'Permission conflicts',
      permissionConflictsLabel: 'Needs intervention',
      inactiveAccounts: 'Inactive accounts',
      inactiveAccountsLabel: 'Pending review',
      recentAccessViolations: 'Recent access violations',
      recentAccessViolationsLabel: 'Audit queue',
    },
    events: {
      accessViolation: 'Access violation detected for admin account',
      approvalDelay: 'Approval queue delayed for scholarship review',
      escalationOpen: 'Escalation opened for sport reporting gap',
      compliancePass: 'Compliance checkpoint cleared for preschool',
    },
    modules: {
      superAdmin: 'Super Admin',
      english: 'English Program',
      preschool: 'Preschool Program',
      scholarship: 'Scholarship Program',
      sport: 'Sport Program',
    },
    timestamps: {
      tenMinutesAgo: '10 min ago',
      thirtyFiveMinutesAgo: '35 min ago',
      oneHourAgo: '1 hour ago',
      today0815: 'Today 08:15',
    },
    nextSteps: {
      reviewCriticalAccess: 'Review the critical access violations first.',
      approvePendingRequests: 'Approve the oldest admin requests in the queue.',
      confirmReportingGaps: 'Confirm the reporting gaps and assign ownership.',
      validateCompliance: 'Validate compliance blockers before the next update.',
    },
    actionLabels: {
      review: 'Review',
      open: 'Open',
      triage: 'Triage',
      inspect: 'Inspect',
      approve: 'Approve',
      assign: 'Assign',
      viewDetails: 'View details',
    },
  },
}

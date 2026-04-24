export default {
  sportAdminDashboard: {
    title: 'Sport Program Dashboard',
    subtitle: 'Session coverage, athlete readiness, and facility usage.',
    cards: {
      totalTeams: {
        title: 'Total Teams',
        label: 'Active rosters',
      },
      totalPlayers: {
        title: 'Total Players',
        label: 'Under observation',
      },
      upcomingMatches: {
        title: 'Upcoming Matches',
        label: 'Confirmed fixtures',
      },
      lowStockItems: {
        title: 'Low Stock Items',
        label: 'Reorder soon',
      },
      totalCoaches: {
        title: 'Total Coaches',
        label: 'Coverage target',
      },
      coachesRequests: {
        title: 'Coaches Requests',
        label: 'Pending approvals',
      },
    },
    quickPanels: {
      liveMatches: 'Live matches',
      todayMatches: 'Today matches',
      topScorers: 'Top scorers',
      standings: 'Standings preview',
      liveLabel: 'Competing',
    },
    tournamentBanner: {
      badge: 'Tournament Banner',
      title: 'No Tournament Selected',
      subtitle: 'Load data from JSON to see active tournament context.',
      action: 'View Tournament',
    },
  },
  sportCoachManagement: {
    title: 'Coach Management',
    subtitle: 'Track coaching staff, approvals, and roster readiness across the sport program.',
    addButton: 'Add Coach',
    addButtonCaption: 'Create coach profile',
    searchPlaceholder: 'Search coaches, emails, or permissions',
    tableEmpty: 'No coaches found.',
    toolbarEyebrow: 'Coach directory',
    toolbarSummary: '{count} coaches in view',
    visibleRange: 'Showing {start}-{end} of {total} coaches',
    noResults: 'No coaches match the current filters.',
    activeRateLabel: 'Active rate',
    highlights: {
      visibleRoster: 'Visible roster',
      pendingReview: 'Pending review',
      attentionItems: 'Attention items',
    },
    summary: {
      total: {
        title: 'Total coaches',
        badge: '{count} visible',
        caption: 'Full coaching roster currently assigned to the sport program.',
      },
      active: {
        title: 'Active coaches',
        badge: '{rate} roster ready',
        caption: 'Available for current sessions, match preparation, and day-to-day operations.',
      },
      pending: {
        title: 'Pending approvals',
        badge: 'Needs onboarding follow-up',
        badgeClear: 'No backlog',
        caption: 'Accounts still waiting for review, confirmation, or final access activation.',
      },
      attention: {
        title: 'Needs attention',
        badge: 'Inactive or suspended',
        badgeClear: 'All clear',
        caption: 'Profiles with delivery risk that may affect training continuity or staffing.',
      },
    },
  },
}

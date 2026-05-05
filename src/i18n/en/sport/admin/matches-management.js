export default {
  sportMatchesManagement: {
    title: 'Manage Matches',
    subtitle: 'Create fixtures, update live match details, and publish results.',
    placeholder:
      'This page will manage sport match fixtures and live match data. Connect it to the `sport_matches` tables once the backend API is ready.',
    toolbarEyebrow: 'Match Management',
    toolbarSummary: 'Matches ({count})',
    visibleRange: 'Showing {shown} of {total} matches',
    noResults: 'No matches found.',
    spotlightLabel: 'Live Now',
    summary: {
      total: {
        title: 'Total Matches',
        badge: '{count} visible now',
        caption: 'All matches loaded from the current mock set.',
      },
      live: {
        title: 'Live Matches',
        badge: 'Currently active',
        caption: 'Matches marked as live in the current list.',
      },
      scheduled: {
        title: 'Scheduled',
        badge: 'Upcoming fixtures',
        caption: 'Matches waiting to be played.',
      },
      completed: {
        title: 'Completed',
        badge: 'Finished results',
        caption: 'Matches already concluded.',
      },
    },
    filters: {
      searchLabel: 'Search',
      searchPlaceholder: 'Search by team, venue, or match id',
      competitionLabel: 'Competition',
      competitionPlaceholder: 'All Competitions',
      tournamentLabel: 'Tournament',
      tournamentPlaceholder: 'All Tournaments',
      matchDateLabel: 'Match date',
      matchDatePlaceholder: '',
    },
    table: {
      id: 'ID',
      homeTeam: 'Home Team',
      score: 'Score',
      awayTeam: 'Away Team',
      schedule: 'Schedule',
      venue: 'Venue',
      status: 'Status',
      actions: 'Actions',
      empty: 'No matches found.',
    },
    actions: {
      results: 'Results',
      edit: 'Edit',
      delete: 'Delete',
    },
    status: {
      scheduled: 'Scheduled',
      live: 'Live',
      completed: 'Completed',
      postponed: 'Postponed',
      cancelled: 'Cancelled',
    },
  },
}

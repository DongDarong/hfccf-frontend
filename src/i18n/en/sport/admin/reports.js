export default {
  title: 'Sport Reports',
  subtitle: 'Generate and analyze sports data reports',

  filters: {
    title: 'Report Filters',
    dateFrom: 'From Date',
    dateTo: 'To Date',
    division: 'Division',
    team: 'Team',
    tournament: 'Tournament',
    reportType: 'Report Type',
    selectDate: 'Select date',
    selectDivision: 'Select division',
    selectTeam: 'Select team',
    selectTournament: 'Select tournament',
  },

  types: {
    overview: 'Overview Report',
    matches: 'Matches Report',
    standings: 'Standings Report',
    players: 'Player Statistics',
    attendance: 'Attendance Report',
  },

  actions: {
    generate: 'Generate Report',
    clearFilters: 'Clear Filters',
    export: 'Export',
  },

  report: {
    from: 'From',
    to: 'To',
    generatedOn: 'Generated on',
  },

  stats: {
    totalMatches: 'Total Matches',
    completedMatches: 'Completed Matches',
    upcomingMatches: 'Upcoming Matches',
    totalTeams: 'Total Teams',
    totalPlayers: 'Total Players',
    averageAttendance: 'Average Attendance',
    winRate: 'Win Rate',
    drawRate: 'Draw Rate',
    lossRate: 'Loss Rate',
  },

  tabs: {
    matches: 'Matches',
    standings: 'Standings',
    players: 'Players',
    attendance: 'Attendance',
    summary: 'Summary',
  },

  table: {
    homeTeam: 'Home Team',
    awayTeam: 'Away Team',
    score: 'Score',
    date: 'Date',
    status: 'Status',
    division: 'Division',
    tournament: 'Tournament',
    result: 'Result',
    attendees: 'Attendees',
  },

  export: {
    pdf: 'Export as PDF',
    excel: 'Export as Excel',
    print: 'Print Report',
    exporting: 'Exporting...',
    success: 'Report exported successfully',
  },

  errors: {
    loadFailed: 'Failed to load filter options',
    generateFailed: 'Failed to generate report',
    exportFailed: 'Failed to export report',
    invalidDates: 'Please select valid date range',
  },

  emptyState: 'Select filters and generate a report to view data',
  noData: 'No data available',
  loading: 'Loading...',
}

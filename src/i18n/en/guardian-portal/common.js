// Keep shared guardian portal copy in one module so read-only portal pages
// and admin invitation screens share the same fallback vocabulary.
export default {
  common: {
    guardianOption: 'Guardian Portal',
    readOnlyNotice: 'This portal is read-only. Guardian access is limited to linked children.',
    loading: 'Loading guardian portal data...',
    refresh: 'Refresh',
    viewChild: 'View Child',
    emptyValue: '—',
    emptySummary: 'No summary data is available yet.',
    emptyStudents: 'No linked children are available right now.',
    unableToLoad: 'Unable to load guardian portal data right now.',
    statusLabels: {
      active: 'Active',
      invited: 'Invited',
      revoked: 'Revoked',
      suspended: 'Suspended',
      inactive: 'Inactive',
    },
  },
  errors: {
    loadStudents: 'Unable to load linked children right now.',
    loadSummary: 'Unable to load the child summary right now.',
    loadAccounts: 'Unable to load guardian portal accounts right now.',
    inviteAccount: 'Unable to invite the guardian portal account right now.',
    revokeAccount: 'Unable to revoke the guardian portal account right now.',
  },
}

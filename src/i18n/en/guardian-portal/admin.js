// Keep portal admin copy separate so invite/revoke wording does not leak into
// the guardian read-only portal experience.
export default {
  admin: {
    accountsTitle: 'Guardian Portal Accounts',
    accountsSubtitle: 'Review invited, active, suspended, and revoked portal accounts.',
    inviteTitle: 'Invite Guardian Portal',
    inviteSubtitle: 'Issue a secure activation link for an existing Preschool guardian.',
    inviteHint: 'Enter the Preschool guardian record id and the portal email address to send an invitation.',
    guardianIdLabel: 'Guardian record id',
    guardianIdPlaceholder: 'Enter guardian id',
    guardianIdRequired: 'Please enter a guardian record id.',
    emailLabel: 'Portal email',
    emailPlaceholder: 'Enter portal email address',
    inviteAction: 'Send invitation',
    revokeAction: 'Revoke access',
    activationUrl: 'Activation URL: {url}',
    invitationSent: 'Guardian portal invitation sent.',
    accountRevoked: 'Guardian portal account {id} revoked.',
    emptyAccounts: 'No guardian portal accounts have been created yet.',
  },
}

// Keep the activation copy isolated so invitation bootstrap errors remain
// specific and do not reuse staff login text.
export default {
  activation: {
    eyebrow: 'Guardian portal activation',
    title: 'Activate your Guardian Portal account',
    subtitle: 'Use the invitation token from Preschool administration to create your portal password.',
    tokenLabel: 'Invitation token',
    tokenPlaceholder: 'Paste your invitation token',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Create a password',
    confirmLabel: 'Confirm password',
    confirmPlaceholder: 'Repeat your password',
    submit: 'Activate account',
    success: 'Your guardian portal account is active now.',
    errors: {
      unableToActivate: 'Unable to activate the guardian portal account right now.',
    },
  },
}

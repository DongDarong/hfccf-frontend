import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useLoginForm } from '@/modules/auth/composables/useLoginForm'
import { ROLES } from '@/constants/roles'

const mockLogin = vi.fn()
const mockLogout = vi.fn()
const mockPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => ({ query: {} }),
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key,
  }),
}))

vi.mock('@/store/userStore', () => ({
  useUserStore: () => ({
    loading: false,
    login: mockLogin,
    logout: mockLogout,
  }),
}))

const defaultAccessPolicy = {
  allowedRoles: [],
  recoveryRole: ROLES.SUPER_ADMIN,
  requiredPermissionsByRole: {},
  defaultRedirect: '/module/dashboard',
}

beforeEach(() => {
  vi.clearAllMocks()
  mockLogin.mockResolvedValue({ id: 1, role: ROLES.SUPER_ADMIN, permissions: [] })
})

describe('useLoginForm', () => {
  it('initialises with empty form state', () => {
    const { form } = useLoginForm({
      accessPolicy: defaultAccessPolicy,
      language: ref('EN'),
    })
    expect(form.email).toBe('')
    expect(form.password).toBe('')
    expect(form.userType).toBe('')
    expect(form.remember).toBe(false)
  })

  it('isKhmer is true when language is KH', () => {
    const { isKhmer } = useLoginForm({
      accessPolicy: defaultAccessPolicy,
      language: ref('KH'),
    })
    expect(isKhmer.value).toBe(true)
  })

  it('isKhmer is false when language is EN', () => {
    const { isKhmer } = useLoginForm({
      accessPolicy: defaultAccessPolicy,
      language: ref('EN'),
    })
    expect(isKhmer.value).toBe(false)
  })

  it('emailError is empty when email not touched', () => {
    const { emailError } = useLoginForm({
      accessPolicy: defaultAccessPolicy,
      language: ref('EN'),
    })
    expect(emailError.value).toBe('')
  })

  it('emailError shows required message when touched and empty', () => {
    const { touchField, emailError } = useLoginForm({
      accessPolicy: defaultAccessPolicy,
      language: ref('EN'),
    })
    touchField('email')
    expect(emailError.value).toBe('auth.loginForm.emailRequired')
  })

  it('emailError shows invalid message for malformed email', () => {
    const { form, touchField, emailError } = useLoginForm({
      accessPolicy: defaultAccessPolicy,
      language: ref('EN'),
    })
    form.email = 'notanemail'
    touchField('email')
    expect(emailError.value).toBe('auth.loginForm.emailInvalid')
  })

  it('emailError is empty for valid email', () => {
    const { form, touchField, emailError } = useLoginForm({
      accessPolicy: defaultAccessPolicy,
      language: ref('EN'),
    })
    form.email = 'user@example.com'
    touchField('email')
    expect(emailError.value).toBe('')
  })

  it('passwordError is empty when password not touched', () => {
    const { passwordError } = useLoginForm({
      accessPolicy: defaultAccessPolicy,
      language: ref('EN'),
    })
    expect(passwordError.value).toBe('')
  })

  it('passwordError shows required message when touched and empty', () => {
    const { touchField, passwordError } = useLoginForm({
      accessPolicy: defaultAccessPolicy,
      language: ref('EN'),
    })
    touchField('password')
    expect(passwordError.value).toBe('auth.loginForm.passwordRequired')
  })

  it('userTypeError is empty when userType not touched', () => {
    const { userTypeError } = useLoginForm({
      accessPolicy: defaultAccessPolicy,
      language: ref('EN'),
    })
    expect(userTypeError.value).toBe('')
  })

  it('userTypeError shows required message when touched and empty', () => {
    const { touchField, userTypeError } = useLoginForm({
      accessPolicy: defaultAccessPolicy,
      language: ref('EN'),
    })
    touchField('userType')
    expect(userTypeError.value).toBe('auth.loginForm.userTypeRequired')
  })

  it('isFormValid is false when fields are incomplete', () => {
    const { isFormValid } = useLoginForm({
      accessPolicy: defaultAccessPolicy,
      language: ref('EN'),
    })
    expect(isFormValid.value).toBe(false)
  })

  it('isFormValid is true when all required fields are valid', () => {
    const { form, isFormValid } = useLoginForm({
      accessPolicy: defaultAccessPolicy,
      language: ref('EN'),
    })
    form.email = 'user@example.com'
    form.password = 'password123'
    form.userType = 'admin'
    expect(isFormValid.value).toBe(true)
  })

  it('localizedSubmitLabel shows default sign in text when not submitting', () => {
    const { localizedSubmitLabel } = useLoginForm({
      accessPolicy: defaultAccessPolicy,
      language: ref('EN'),
    })
    expect(localizedSubmitLabel.value).toBe('auth.loginForm.signIn')
  })

  it('canUsePasswordRecovery is true when selected type includes recovery role', () => {
    const { form, canUsePasswordRecovery } = useLoginForm({
      accessPolicy: defaultAccessPolicy,
      language: ref('EN'),
    })
    form.userType = 'admin'
    expect(canUsePasswordRecovery.value).toBe(true)
  })

  it('canUsePasswordRecovery is false when selected type does not include recovery role', () => {
    const { form, canUsePasswordRecovery } = useLoginForm({
      accessPolicy: { ...defaultAccessPolicy, recoveryRole: ROLES.COACH },
      language: ref('EN'),
    })
    form.userType = 'admin'
    expect(canUsePasswordRecovery.value).toBe(false)
  })

  it('onSubmit marks all fields as touched', async () => {
    const { form, onSubmit } = useLoginForm({
      accessPolicy: defaultAccessPolicy,
      language: ref('EN'),
    })
    form.email = 'user@example.com'
    form.password = 'password123'
    form.userType = 'admin'
    await onSubmit()
    expect(mockLogin).toHaveBeenCalled()
  })

  it('onSubmit does not call login when form is invalid', async () => {
    const { onSubmit } = useLoginForm({
      accessPolicy: defaultAccessPolicy,
      language: ref('EN'),
    })
    await onSubmit()
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('onSubmit calls login with trimmed email in lowercase', async () => {
    const { form, onSubmit } = useLoginForm({
      accessPolicy: defaultAccessPolicy,
      language: ref('EN'),
    })
    form.email = '  USER@EXAMPLE.COM  '
    form.password = 'password123'
    form.userType = 'admin'
    await onSubmit()
    expect(mockLogin).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'user@example.com',
        password: 'password123',
      }),
    )
  })

  it('onSubmit sets showLoginSuccess when login succeeds', async () => {
    mockLogin.mockResolvedValueOnce({ id: 1, role: ROLES.SUPER_ADMIN, permissions: [] })
    const { form, showLoginSuccess, onSubmit } = useLoginForm({
      accessPolicy: defaultAccessPolicy,
      language: ref('EN'),
    })
    form.email = 'user@example.com'
    form.password = 'password123'
    form.userType = 'admin'
    await onSubmit()
    expect(showLoginSuccess.value).toBe(true)
  })

  it('onSubmit logs out and shows error when user role does not match selected type', async () => {
    mockLogin.mockResolvedValueOnce({ id: 1, role: ROLES.TEACHER_ENGLISH, permissions: [] })
    const { form, errorMessage, onSubmit } = useLoginForm({
      accessPolicy: defaultAccessPolicy,
      language: ref('EN'),
    })
    form.email = 'user@example.com'
    form.password = 'password123'
    form.userType = 'admin'
    await onSubmit()
    expect(mockLogout).toHaveBeenCalled()
    expect(errorMessage.value).toBe('auth.loginForm.accountTypeMismatch')
  })

  it('onSubmit logs out and shows error when user lacks required permissions', async () => {
    mockLogin.mockResolvedValueOnce({ id: 1, role: ROLES.SUPER_ADMIN, permissions: [] })
    const { form, errorMessage, onSubmit } = useLoginForm({
      accessPolicy: {
        ...defaultAccessPolicy,
        requiredPermissionsByRole: {
          [ROLES.SUPER_ADMIN.toLowerCase()]: ['admin:manage-users'],
        },
      },
      language: ref('EN'),
    })
    form.email = 'user@example.com'
    form.password = 'password123'
    form.userType = 'admin'
    await onSubmit()
    expect(mockLogout).toHaveBeenCalled()
    expect(errorMessage.value).toBe('auth.loginForm.missingRequiredPermissions')
  })

  it('onSubmit shows generic error message on login failure', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Network error'))
    const { form, errorMessage, onSubmit } = useLoginForm({
      accessPolicy: defaultAccessPolicy,
      language: ref('EN'),
    })
    form.email = 'user@example.com'
    form.password = 'password123'
    form.userType = 'admin'
    await onSubmit()
    expect(errorMessage.value).toBe('Network error')
  })

  it('onLoginSuccessClose closes success dialog', async () => {
    const { showLoginSuccess, onLoginSuccessClose } = useLoginForm({
      accessPolicy: defaultAccessPolicy,
      language: ref('EN'),
    })
    showLoginSuccess.value = true
    await onLoginSuccessClose()
    expect(showLoginSuccess.value).toBe(false)
  })

  it('onLoginSuccessClose redirects when shouldRedirectAfterSuccess is set', async () => {
    const { form, onSubmit, onLoginSuccessClose } = useLoginForm({
      accessPolicy: defaultAccessPolicy,
      language: ref('EN'),
    })
    form.email = 'user@example.com'
    form.password = 'password123'
    form.userType = 'admin'
    await onSubmit()
    await onLoginSuccessClose()
    expect(mockPush).toHaveBeenCalledWith('/module/dashboard')
  })
})

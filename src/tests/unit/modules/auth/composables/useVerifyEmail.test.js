import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useVerifyEmail } from '@/modules/auth/composables/useVerifyEmail'

const mockEmit = vi.fn()

const mockProps = {
  t: (key) => key,
  email: 'user@example.com',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useVerifyEmail', () => {
  it('initialises form with email from props', () => {
    const { form } = useVerifyEmail(mockProps, mockEmit)
    expect(form.email).toBe('user@example.com')
  })

  it('initialises form with empty email when prop is empty', () => {
    const { form } = useVerifyEmail({ ...mockProps, email: '' }, mockEmit)
    expect(form.email).toBe('')
  })

  it('normalizedEmail trims whitespace', () => {
    const { form, normalizedEmail } = useVerifyEmail(mockProps, mockEmit)
    form.email = '  user@example.com  '
    expect(normalizedEmail.value).toBe('user@example.com')
  })

  it('emailError is empty when email not touched', () => {
    const { emailError } = useVerifyEmail(mockProps, mockEmit)
    expect(emailError.value).toBe('')
  })

  it('emailError shows required message when touched and empty', () => {
    const { touchField, emailError } = useVerifyEmail({ ...mockProps, email: '' }, mockEmit)
    touchField('email')
    expect(emailError.value).toBe('auth.forgotPassword.verifyEmail.errors.required')
  })

  it('emailError shows invalid message for malformed email', () => {
    const { form, touchField, emailError } = useVerifyEmail(mockProps, mockEmit)
    form.email = 'notanemail'
    touchField('email')
    expect(emailError.value).toBe('auth.forgotPassword.verifyEmail.errors.invalid')
  })

  it('emailError is empty for valid email', () => {
    const { form, touchField, emailError } = useVerifyEmail(mockProps, mockEmit)
    form.email = 'user@example.com'
    touchField('email')
    expect(emailError.value).toBe('')
  })

  it('emailError validates email with spaces correctly', () => {
    const { form, touchField, emailError } = useVerifyEmail(mockProps, mockEmit)
    form.email = '  user@example.com  '
    touchField('email')
    expect(emailError.value).toBe('')
  })

  it('canSubmitCurrentStep is false when email is invalid', () => {
    const { form, canSubmitCurrentStep } = useVerifyEmail(mockProps, mockEmit)
    form.email = 'notanemail'
    expect(canSubmitCurrentStep.value).toBe(false)
  })

  it('canSubmitCurrentStep is false when email is empty', () => {
    const { form, canSubmitCurrentStep } = useVerifyEmail({ ...mockProps, email: '' }, mockEmit)
    expect(canSubmitCurrentStep.value).toBe(false)
  })

  it('canSubmitCurrentStep is true when email is valid', () => {
    const { form, canSubmitCurrentStep } = useVerifyEmail(mockProps, mockEmit)
    form.email = 'user@example.com'
    expect(canSubmitCurrentStep.value).toBe(true)
  })

  it('canSubmitCurrentStep is true when email has spaces that are trimmed', () => {
    const { form, canSubmitCurrentStep } = useVerifyEmail(mockProps, mockEmit)
    form.email = '  user@example.com  '
    expect(canSubmitCurrentStep.value).toBe(true)
  })

  it('submitEmail marks email field as touched', () => {
    const { form, touchField, submitEmail } = useVerifyEmail(mockProps, mockEmit)
    form.email = 'user@example.com'
    expect(mockEmit).not.toHaveBeenCalled()
    submitEmail()
    expect(mockEmit).toHaveBeenCalledWith('submit', {
      email: 'user@example.com',
    })
  })

  it('submitEmail does not emit when email is invalid', () => {
    const { form, submitEmail } = useVerifyEmail(mockProps, mockEmit)
    form.email = 'notanemail'
    submitEmail()
    expect(mockEmit).not.toHaveBeenCalled()
  })

  it('submitEmail emits submit with trimmed email when valid', () => {
    const { form, submitEmail } = useVerifyEmail(mockProps, mockEmit)
    form.email = '  newuser@example.com  '
    submitEmail()
    expect(mockEmit).toHaveBeenCalledWith('submit', {
      email: 'newuser@example.com',
    })
  })

  it('touchField marks email field as touched', () => {
    const { touchField, emailError } = useVerifyEmail({ ...mockProps, email: '' }, mockEmit)
    expect(emailError.value).toBe('')
    touchField('email')
    expect(emailError.value).toBe('auth.forgotPassword.verifyEmail.errors.required')
  })

  it('exposes touched.email state', () => {
    const { touched } = useVerifyEmail(mockProps, mockEmit)
    expect(touched.email).toBe(false)
  })

  it('can change email in form', () => {
    const { form } = useVerifyEmail(mockProps, mockEmit)
    form.email = 'newemail@example.com'
    expect(form.email).toBe('newemail@example.com')
  })
})

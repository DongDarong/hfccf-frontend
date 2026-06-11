import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useVerifyCode } from '@/modules/auth/composables/useVerifyCode'

const mockEmit = vi.fn()

const mockProps = {
  t: (key) => key,
  countdownSeconds: 120,
  resendLoading: false,
  email: 'user@example.com',
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useVerifyCode', () => {
  it('initialises with empty form state', () => {
    const { form } = useVerifyCode(mockProps, mockEmit)
    expect(form.code).toBe('')
  })

  it('codeError is empty when code not touched', () => {
    const { codeError } = useVerifyCode(mockProps, mockEmit)
    expect(codeError.value).toBe('')
  })

  it('codeError shows required message when touched and empty', () => {
    const { form, codeError, touchCode } = useVerifyCode(mockProps, mockEmit)
    touchCode()
    expect(codeError.value).toBe('auth.forgotPassword.verifyCode.errors.required')
  })

  it('codeError shows length error when touched and code too short', () => {
    const { codeError, touchCode, onCodeInput } = useVerifyCode(mockProps, mockEmit)
    onCodeInput('12345')
    touchCode()
    expect(codeError.value).toBe('auth.forgotPassword.verifyCode.errors.length')
  })

  it('codeError is empty when code is valid', () => {
    const { codeError, touchCode, onCodeInput } = useVerifyCode(mockProps, mockEmit)
    onCodeInput('123456')
    touchCode()
    expect(codeError.value).toBe('')
  })

  it('canVerify is false when code is not 6 digits', () => {
    const { canVerify, onCodeInput } = useVerifyCode(mockProps, mockEmit)
    onCodeInput('12345')
    expect(canVerify.value).toBe(false)
  })

  it('canVerify is true when code is exactly 6 digits', () => {
    const { canVerify, onCodeInput } = useVerifyCode(mockProps, mockEmit)
    onCodeInput('123456')
    expect(canVerify.value).toBe(true)
  })

  it('onCodeInput normalises input and removes non-numeric characters', () => {
    const { form, onCodeInput } = useVerifyCode(mockProps, mockEmit)
    onCodeInput('1a2b3c4d')
    expect(form.code).toBe('1234')
  })

  it('onCodeInput limits to 6 digits', () => {
    const { form, onCodeInput } = useVerifyCode(mockProps, mockEmit)
    onCodeInput('1234567890')
    expect(form.code).toBe('123456')
  })

  it('formattedTimer displays minutes and seconds correctly', () => {
    const { secondsLeft, formattedTimer } = useVerifyCode(mockProps, mockEmit)
    secondsLeft.value = 125
    expect(formattedTimer.value).toBe('2:05')
  })

  it('formattedTimer pads seconds with leading zero', () => {
    const { secondsLeft, formattedTimer } = useVerifyCode(mockProps, mockEmit)
    secondsLeft.value = 65
    expect(formattedTimer.value).toBe('1:05')
  })

  it('formattedTimer shows 0:00 when at zero seconds', () => {
    const { secondsLeft, formattedTimer } = useVerifyCode(mockProps, mockEmit)
    secondsLeft.value = 0
    expect(formattedTimer.value).toBe('0:00')
  })

  it('canResend is false when countdown is active', () => {
    const { secondsLeft, canResend } = useVerifyCode(mockProps, mockEmit)
    secondsLeft.value = 30
    expect(canResend.value).toBe(false)
  })

  it('canResend is true when countdown reaches zero', () => {
    const { secondsLeft, canResend } = useVerifyCode(mockProps, mockEmit)
    secondsLeft.value = 0
    expect(canResend.value).toBe(true)
  })

  it('canResend is false when resendLoading is true', () => {
    const { secondsLeft, canResend } = useVerifyCode({ ...mockProps, resendLoading: true }, mockEmit)
    secondsLeft.value = 0
    expect(canResend.value).toBe(false)
  })

  it('onSubmit emits verify with email and code when valid', () => {
    const { onCodeInput, onSubmit } = useVerifyCode(mockProps, mockEmit)
    onCodeInput('123456')
    onSubmit()
    expect(mockEmit).toHaveBeenCalledWith('verify', {
      email: 'user@example.com',
      code: '123456',
    })
  })

  it('onSubmit does not emit when code is invalid', () => {
    const { onSubmit } = useVerifyCode(mockProps, mockEmit)
    onSubmit()
    expect(mockEmit).not.toHaveBeenCalled()
  })

  it('onResend emits resend with email when countdown allows', () => {
    const { secondsLeft, onResend } = useVerifyCode(mockProps, mockEmit)
    secondsLeft.value = 0
    onResend()
    expect(mockEmit).toHaveBeenCalledWith('resend', {
      email: 'user@example.com',
    })
  })

  it('onResend does not emit when countdown is active', () => {
    const { secondsLeft, onResend } = useVerifyCode(mockProps, mockEmit)
    secondsLeft.value = 30
    onResend()
    expect(mockEmit).not.toHaveBeenCalled()
  })

  it('onResend clears form after emitting', () => {
    const { form, secondsLeft, onResend } = useVerifyCode(mockProps, mockEmit)
    form.code = '123456'
    secondsLeft.value = 0
    onResend()
    expect(form.code).toBe('')
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCreateNewPassword } from '@/modules/auth/composables/useCreateNewPassword'

const mockEmit = vi.fn()

const mockProps = {
  t: (key) => key,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useCreateNewPassword', () => {
  it('initialises with empty form state', () => {
    const { form } = useCreateNewPassword(mockProps, mockEmit)
    expect(form.password).toBe('')
    expect(form.confirmPassword).toBe('')
  })

  it('passwordError is empty when password not touched', () => {
    const { passwordError } = useCreateNewPassword(mockProps, mockEmit)
    expect(passwordError.value).toBe('')
  })

  it('passwordError shows required message when touched and empty', () => {
    const { touchField, passwordError } = useCreateNewPassword(mockProps, mockEmit)
    touchField('password')
    expect(passwordError.value).toBe('auth.forgotPassword.createPassword.errors.passwordRequired')
  })

  it('passwordError shows minPassword error when less than 8 characters', () => {
    const { form, touchField, passwordError } = useCreateNewPassword(mockProps, mockEmit)
    form.password = '1234567'
    touchField('password')
    expect(passwordError.value).toBe('auth.forgotPassword.createPassword.errors.minPassword')
  })

  it('passwordError is empty when password is 8 characters or more', () => {
    const { form, touchField, passwordError } = useCreateNewPassword(mockProps, mockEmit)
    form.password = '12345678'
    touchField('password')
    expect(passwordError.value).toBe('')
  })

  it('confirmPasswordError is empty when confirmPassword not touched', () => {
    const { confirmPasswordError } = useCreateNewPassword(mockProps, mockEmit)
    expect(confirmPasswordError.value).toBe('')
  })

  it('confirmPasswordError shows required message when touched and empty', () => {
    const { touchField, confirmPasswordError } = useCreateNewPassword(mockProps, mockEmit)
    touchField('confirmPassword')
    expect(confirmPasswordError.value).toBe('auth.forgotPassword.createPassword.errors.confirmRequired')
  })

  it('confirmPasswordError shows mismatch error when passwords do not match', () => {
    const { form, touchField, confirmPasswordError } = useCreateNewPassword(mockProps, mockEmit)
    form.password = 'password123'
    form.confirmPassword = 'password456'
    touchField('confirmPassword')
    expect(confirmPasswordError.value).toBe('auth.forgotPassword.createPassword.errors.mismatch')
  })

  it('confirmPasswordError is empty when passwords match', () => {
    const { form, touchField, confirmPasswordError } = useCreateNewPassword(mockProps, mockEmit)
    form.password = 'password123'
    form.confirmPassword = 'password123'
    touchField('confirmPassword')
    expect(confirmPasswordError.value).toBe('')
  })

  it('isFormValid is false when fields are empty', () => {
    const { isFormValid } = useCreateNewPassword(mockProps, mockEmit)
    expect(isFormValid.value).toBe(false)
  })

  it('isFormValid is false when password is less than 8 characters', () => {
    const { form, isFormValid } = useCreateNewPassword(mockProps, mockEmit)
    form.password = '1234567'
    form.confirmPassword = '1234567'
    expect(isFormValid.value).toBe(false)
  })

  it('isFormValid is false when confirmPassword is less than 8 characters', () => {
    const { form, isFormValid } = useCreateNewPassword(mockProps, mockEmit)
    form.password = 'password123'
    form.confirmPassword = '1234567'
    expect(isFormValid.value).toBe(false)
  })

  it('isFormValid is false when passwords do not match', () => {
    const { form, isFormValid } = useCreateNewPassword(mockProps, mockEmit)
    form.password = 'password123'
    form.confirmPassword = 'password456'
    expect(isFormValid.value).toBe(false)
  })

  it('isFormValid is true when passwords match and are 8+ characters', () => {
    const { form, isFormValid } = useCreateNewPassword(mockProps, mockEmit)
    form.password = 'password123'
    form.confirmPassword = 'password123'
    expect(isFormValid.value).toBe(true)
  })

  it('submitPassword marks fields as touched', () => {
    const { form, submitPassword } = useCreateNewPassword(mockProps, mockEmit)
    form.password = 'password123'
    form.confirmPassword = 'password123'
    submitPassword()
    expect(mockEmit).toHaveBeenCalledWith('submit', {
      password: 'password123',
    })
  })

  it('submitPassword does not emit when form is invalid', () => {
    const { submitPassword } = useCreateNewPassword(mockProps, mockEmit)
    submitPassword()
    expect(mockEmit).not.toHaveBeenCalled()
  })

  it('submitPassword emits submit with password when form is valid', () => {
    const { form, submitPassword } = useCreateNewPassword(mockProps, mockEmit)
    form.password = 'securePassword123'
    form.confirmPassword = 'securePassword123'
    submitPassword()
    expect(mockEmit).toHaveBeenCalledWith('submit', {
      password: 'securePassword123',
    })
  })

  it('touchField marks password field as touched', () => {
    const { form, touchField, passwordError } = useCreateNewPassword(mockProps, mockEmit)
    expect(passwordError.value).toBe('')
    touchField('password')
    expect(passwordError.value).toBe('auth.forgotPassword.createPassword.errors.passwordRequired')
  })

  it('touchField marks confirmPassword field as touched', () => {
    const { touchField, confirmPasswordError } = useCreateNewPassword(mockProps, mockEmit)
    expect(confirmPasswordError.value).toBe('')
    touchField('confirmPassword')
    expect(confirmPasswordError.value).toBe('auth.forgotPassword.createPassword.errors.confirmRequired')
  })
})

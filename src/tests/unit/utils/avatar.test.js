import { describe, expect, it } from 'vitest'
import { getAvatarInitials, isSafeAvatarSource, resolveAvatarSource } from '@/utils/avatar'

describe('avatar utils', () => {
  it('keeps relative avatar paths safe', () => {
    const src = '/storage/avatars/user.jpg'

    expect(isSafeAvatarSource(src)).toBe(true)
    expect(resolveAvatarSource(src)).toBe(src)
  })

  it('allows Cloudflare R2 public avatar URLs', () => {
    const src = 'https://pub-123abc.r2.dev/avatars/user.jpg'

    expect(isSafeAvatarSource(src)).toBe(true)
    expect(resolveAvatarSource(src)).toBe(src)
  })

  it('rejects unrelated external avatar URLs', () => {
    const src = 'https://example.com/avatar.jpg'

    expect(isSafeAvatarSource(src)).toBe(false)
    expect(resolveAvatarSource(src)).toBe('')
  })

  it('builds initials from a display name', () => {
    expect(getAvatarInitials('Jane Doe')).toBe('JD')
    expect(getAvatarInitials('Jane')).toBe('J')
  })
})
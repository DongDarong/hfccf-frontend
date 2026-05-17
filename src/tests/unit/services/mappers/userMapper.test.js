import { describe, expect, it } from 'vitest'
import { mapUser } from '@/services/mappers/userMapper'

describe('mapUser avatar normalization', () => {
  it('maps alternate avatar fields to a displayable avatar url', () => {
    const avatarUrl = 'https://pub-123abc.r2.dev/avatars/user.jpg'

    const user = mapUser({
      id: 'usr-1',
      first_name: 'Jane',
      last_name: 'Doe',
      avatar_url: avatarUrl,
      profile_photo_url: avatarUrl,
    })

    expect(user.avatar).toBe(avatarUrl)
    expect(user.avatarUrl).toBe(avatarUrl)
    expect(user.profilePhotoUrl).toBe(avatarUrl)
  })
})
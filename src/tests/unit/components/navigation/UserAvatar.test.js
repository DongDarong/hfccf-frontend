import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '@/tests/helpers/mount'
import UserAvatar from '@/components/navigation/Avatar.vue'

describe('UserAvatar', () => {
  it('renders a Cloudflare R2 avatar image source', async () => {
    const avatarUrl = 'https://pub-123abc.r2.dev/avatars/user.jpg'

    const wrapper = mountWithPlugins(UserAvatar, {
      props: {
        name: 'Jane Doe',
        username: 'jane.doe',
        avatar: avatarUrl,
        showMeta: false,
      },
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(avatarUrl)

    await img.trigger('load')

    expect(wrapper.find('.navbar-profile__avatar-image').classes()).toContain(
      'navbar-profile__avatar-image--visible',
    )
  })
})
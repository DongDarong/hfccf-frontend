import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../../helpers/mount'
import NotificationEmptyState from '@/modules/notifications/components/NotificationEmptyState.vue'

const messages = {
  en: {
    common: {
      notifications: {
        empty:            'All caught up!',
        emptyDescription: 'No notifications to show.',
      },
    },
  },
}

const componentStubs = {
  NotificationTypeIcon: { props: ['type', 'size'], template: '<span class="type-icon" />' },
  Button: { props: ['loading'], template: '<button :data-loading="loading" v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>', emits: ['click'] },
}

function mount(props = {}) {
  return mountWithPlugins(NotificationEmptyState, {
    props,
    messages,
    global: { stubs: componentStubs },
  })
}

describe('NotificationEmptyState', () => {
  it('renders the type icon', () => {
    expect(mount().find('.type-icon').exists()).toBe(true)
  })

  it('shows i18n fallback title when no title provided', () => {
    expect(mount().text()).toContain('All caught up!')
  })

  it('shows custom title when provided', () => {
    expect(mount({ title: 'Nothing here yet' }).text()).toContain('Nothing here yet')
  })

  it('shows i18n fallback description', () => {
    expect(mount().text()).toContain('No notifications to show.')
  })

  it('shows custom description when provided', () => {
    expect(mount({ description: 'Check back later.' }).text()).toContain('Check back later.')
  })

  it('does not render action button when actionLabel is empty', () => {
    expect(mount().find('button').exists()).toBe(false)
  })

  it('renders action button when actionLabel is provided', () => {
    expect(mount({ actionLabel: 'Refresh' }).find('button').text()).toContain('Refresh')
  })

  it('emits action when button is clicked', async () => {
    const wrapper = mount({ actionLabel: 'Refresh' })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('action')).toBeTruthy()
  })
})

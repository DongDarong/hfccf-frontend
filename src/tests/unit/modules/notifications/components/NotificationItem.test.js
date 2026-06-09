import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../../helpers/mount'
import NotificationItem from '@/modules/notifications/components/NotificationItem.vue'

const messages = {
  en: {
    common: {
      notifications: {
        markRead:   'Mark as read',
        dismiss:    'Dismiss',
        undismiss:  'Restore',
      },
    },
    notifications: {
      types:   { system: 'System', info: 'Info' },
      modules: { assessment: 'Assessment' },
    },
  },
}

const componentStubs = {
  NotificationTypeIcon: { props: ['type', 'size'], template: '<span class="type-icon" />' },
  Button: {
    props: ['disabled', 'loading', 'severity', 'text', 'size'],
    template: '<button :disabled="disabled" @click="$emit(\'click\', $event)"><slot /></button>',
    emits: ['click'],
  },
}

const baseNotification = {
  id: 1,
  type: 'system',
  module: 'assessment',
  title: 'Assessment submitted',
  message: 'A new assessment has been submitted.',
  createdAt: '2026-06-09T10:00:00Z',
  read: false,
  dismissed: false,
}

function mount(notifOverride = {}, propsOverride = {}) {
  return mountWithPlugins(NotificationItem, {
    props: { notification: { ...baseNotification, ...notifOverride }, ...propsOverride },
    messages,
    global: { stubs: componentStubs },
  })
}

describe('NotificationItem', () => {
  it('renders the notification title', () => {
    expect(mount().text()).toContain('Assessment submitted')
  })

  it('renders the notification message', () => {
    expect(mount().text()).toContain('A new assessment has been submitted.')
  })

  it('renders the type icon', () => {
    expect(mount().find('.type-icon').exists()).toBe(true)
  })

  it('applies read class when notification is read', () => {
    expect(mount({ read: true }).find('article').classes()).toContain('notification-item--read')
  })

  it('applies dismissed class when notification is dismissed', () => {
    expect(mount({ dismissed: true }).find('article').classes()).toContain('notification-item--dismissed')
  })

  it('applies compact class when compact prop is true', () => {
    expect(mount({}, { compact: true }).find('article').classes()).toContain('notification-item--compact')
  })

  it('emits click when article is clicked', async () => {
    const wrapper = mount()
    await wrapper.find('article').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('emits read when mark-read button is clicked (unread)', async () => {
    const wrapper = mount({ read: false })
    const readBtn = wrapper.findAll('button').find(b => b.text() === 'Mark as read')
    await readBtn.trigger('click')
    expect(wrapper.emitted('read')).toBeTruthy()
  })

  it('does not emit read when notification is already read', async () => {
    const wrapper = mount({ read: true })
    const readBtn = wrapper.findAll('button').find(b => b.text() === 'Mark as read')
    await readBtn.trigger('click')
    expect(wrapper.emitted('read')).toBeFalsy()
  })

  it('emits dismiss when dismiss button is clicked', async () => {
    const wrapper = mount({ dismissed: false })
    const dismissBtn = wrapper.findAll('button').find(b => b.text() === 'Dismiss')
    await dismissBtn.trigger('click')
    expect(wrapper.emitted('dismiss')).toBeTruthy()
  })

  it('shows undismiss button when notification is dismissed', () => {
    const wrapper = mount({ dismissed: true })
    expect(wrapper.findAll('button').find(b => b.text() === 'Restore')).toBeTruthy()
    expect(wrapper.findAll('button').find(b => b.text() === 'Dismiss')).toBeUndefined()
  })

  it('hides actions when showActions is false', () => {
    const wrapper = mount({}, { showActions: false })
    expect(wrapper.find('.notification-item__actions').exists()).toBe(false)
  })

  it('shows timeLabel when provided', () => {
    const wrapper = mount({}, { timeLabel: '2 hours ago' })
    expect(wrapper.text()).toContain('2 hours ago')
  })
})

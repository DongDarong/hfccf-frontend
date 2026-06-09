import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../../helpers/mount'
import NotificationInboxCard from '@/modules/notifications/components/NotificationInboxCard.vue'

const messages = {
  en: {
    common: {
      notifications: {
        loading:     'Loading...',
        empty:       'All caught up!',
        emptyDescription: 'No notifications.',
        markRead:    'Mark as read',
        dismiss:     'Dismiss',
        undismiss:   'Restore',
        markAllRead: 'Mark all as read',
      },
    },
  },
}

const progressSpinnerStub = {
  props: ['strokeWidth', 'fill', 'animationDuration', 'pt'],
  template: '<div class="spinner" :style="$attrs.style"></div>',
}

const componentStubs = {
  NotificationItem: {
    props: ['notification', 'readLabel', 'dismissLabel', 'undismissLabel'],
    emits: ['read', 'dismiss', 'undismiss'],
    template: '<div class="notif-item">{{ notification.title }}<button class="btn-read" @click="$emit(\'read\', notification)">Read</button><button class="btn-dismiss" @click="$emit(\'dismiss\', notification)">Dismiss</button></div>',
  },
  NotificationEmptyState: { props: ['title', 'description'], template: '<div class="empty-state">{{ title }}</div>' },
  Button: { props: ['disabled'], template: '<button :disabled="disabled" v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>', emits: ['click'] },
  ProgressSpinner: progressSpinnerStub,
}

const sampleNotifications = [
  { id: 1, type: 'system', title: 'New message',  message: 'You have a message', read: false, dismissed: false },
  { id: 2, type: 'info',   title: 'Reminder',     message: 'Check your tasks',   read: false, dismissed: false },
]

function mount(props = {}) {
  return mountWithPlugins(NotificationInboxCard, {
    props: { title: 'Inbox', ...props },
    messages,
    global: { stubs: componentStubs },
  })
}

describe('NotificationInboxCard', () => {
  it('renders the card title', () => {
    expect(mount().text()).toContain('Inbox')
  })

  it('renders subtitle when provided', () => {
    expect(mount({ subtitle: 'Recent activity' }).text()).toContain('Recent activity')
  })

  it('shows loading spinner when loading is true', () => {
    expect(mount({ loading: true }).find('.spinner').exists()).toBe(true)
  })

  it('shows empty state when notifications is empty', () => {
    expect(mount({ notifications: [] }).find('.empty-state').exists()).toBe(true)
  })

  it('shows empty state title from i18n', () => {
    expect(mount({ notifications: [] }).find('.empty-state').text()).toContain('All caught up!')
  })

  it('renders one NotificationItem per notification', () => {
    expect(mount({ notifications: sampleNotifications }).findAll('.notif-item')).toHaveLength(2)
  })

  it('renders notification titles', () => {
    const wrapper = mount({ notifications: sampleNotifications })
    expect(wrapper.text()).toContain('New message')
    expect(wrapper.text()).toContain('Reminder')
  })

  it('shows mark-all-read button by default', () => {
    const wrapper = mount({ notifications: sampleNotifications })
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('hides mark-all-read button when showMarkAll is false', () => {
    const wrapper = mount({ notifications: sampleNotifications, showMarkAll: false })
    // Only NotificationItem buttons remain
    expect(wrapper.findAll('button').every(b => b.text() !== 'Mark all as read')).toBe(true)
  })

  it('emits mark-all-read when button clicked', async () => {
    const wrapper = mount({ notifications: sampleNotifications })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('mark-all-read')).toBeTruthy()
  })

  it('emits read when a notification item emits read', async () => {
    const wrapper = mount({ notifications: sampleNotifications })
    await wrapper.find('.btn-read').trigger('click')
    expect(wrapper.emitted('read')).toBeTruthy()
  })

  it('emits dismiss when a notification item emits dismiss', async () => {
    const wrapper = mount({ notifications: sampleNotifications })
    await wrapper.find('.btn-dismiss').trigger('click')
    expect(wrapper.emitted('dismiss')).toBeTruthy()
  })
})

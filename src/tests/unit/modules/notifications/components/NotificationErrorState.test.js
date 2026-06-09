import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../../helpers/mount'
import NotificationErrorState from '@/modules/notifications/components/NotificationErrorState.vue'

const messages = {
  en: {
    common: {
      notifications: {
        error:            'Failed to load',
        errorDescription: 'Something went wrong.',
        retry:            'Try Again',
      },
    },
  },
}

const buttonStub = {
  props: ['loading'],
  template: '<button :data-loading="loading" v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
  emits: ['click'],
}

function mount(props = {}) {
  return mountWithPlugins(NotificationErrorState, {
    props,
    messages,
    global: { stubs: { Button: buttonStub } },
  })
}

describe('NotificationErrorState', () => {
  it('shows i18n fallback title', () => {
    expect(mount().text()).toContain('Failed to load')
  })

  it('shows custom title when provided', () => {
    expect(mount({ title: 'Load error' }).text()).toContain('Load error')
  })

  it('shows i18n fallback description', () => {
    expect(mount().text()).toContain('Something went wrong.')
  })

  it('shows custom description when provided', () => {
    expect(mount({ description: 'Please retry.' }).text()).toContain('Please retry.')
  })

  it('shows i18n retry button label by default', () => {
    expect(mount().find('button').text()).toContain('Try Again')
  })

  it('shows custom retryLabel when provided', () => {
    expect(mount({ retryLabel: 'Reload' }).find('button').text()).toContain('Reload')
  })

  it('emits retry when button clicked', async () => {
    const wrapper = mount()
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('retry')).toBeTruthy()
  })

  it('passes loading state to button', () => {
    expect(mount({ loading: true }).find('button').attributes('data-loading')).toBe('true')
  })
})

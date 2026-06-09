import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mountWithPlugins } from '../../../helpers/mount'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'

const messages = {
  en: {
    common: {
      success:         'Success',
      actionCompleted: 'Action completed.',
      continue:        'Continue',
    },
  },
}

const dialogStub = {
  props: ['visible', 'modal', 'closable', 'draggable', 'closeOnEscape', 'dismissableMask', 'pt'],
  template: '<div v-if="visible" class="dialog"><slot /><slot name="footer" /></div>',
}

const buttonStub = {
  template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
  emits: ['click'],
}

function mount(props = {}) {
  return mountWithPlugins(AlertSuccess, {
    props,
    messages,
    global: { stubs: { Dialog: dialogStub, Button: buttonStub } },
  })
}

beforeEach(() => { vi.useFakeTimers() })
afterEach(() => { vi.useRealTimers() })

describe('AlertSuccess', () => {
  it('renders nothing when show is false', () => {
    expect(mount({ show: false }).find('.dialog').exists()).toBe(false)
  })

  it('renders content when show is true', () => {
    expect(mount({ show: true }).find('.dialog').exists()).toBe(true)
  })

  it('shows custom title', () => {
    expect(mount({ show: true, title: 'Saved!' }).text()).toContain('Saved!')
  })

  it('falls back to i18n title when no title prop', () => {
    expect(mount({ show: true }).text()).toContain('Success')
  })

  it('shows custom message', () => {
    expect(mount({ show: true, message: 'Record updated.' }).text()).toContain('Record updated.')
  })

  it('falls back to i18n message when no message prop', () => {
    expect(mount({ show: true }).text()).toContain('Action completed.')
  })

  it('shows custom buttonText', () => {
    expect(mount({ show: true, buttonText: 'Done' }).text()).toContain('Done')
  })

  it('emits close when button is clicked', async () => {
    const wrapper = mount({ show: true })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('auto-closes after autoClose ms', async () => {
    const wrapper = mount({ show: true, autoClose: 2000 })
    vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('does not auto-close when autoClose is 0', async () => {
    const wrapper = mount({ show: true, autoClose: 0 })
    vi.advanceTimersByTime(5000)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('close')).toBeFalsy()
  })
})

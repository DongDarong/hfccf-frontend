import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../helpers/mount'
import AlertError from '@/components/alerts/AlertError.vue'

const messages = {
  en: {
    common: {
      errorOccurred: 'An Error Occurred',
      errorTryAgain: 'Please try again.',
      close:         'Close',
    },
  },
}

const dialogStub = {
  props: ['visible', 'modal', 'closable', 'draggable', 'closeOnEscape', 'dismissableMask'],
  template: '<div v-if="visible" class="dialog"><slot /><slot name="footer" /></div>',
}

const buttonStub = {
  template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
  emits: ['click'],
}

function mount(props = {}) {
  return mountWithPlugins(AlertError, {
    props,
    messages,
    global: { stubs: { Dialog: dialogStub, Button: buttonStub } },
  })
}

describe('AlertError', () => {
  it('renders nothing when show is false', () => {
    expect(mount({ show: false }).find('.dialog').exists()).toBe(false)
  })

  it('renders content when show is true', () => {
    expect(mount({ show: true }).find('.dialog').exists()).toBe(true)
  })

  it('shows custom title', () => {
    const wrapper = mount({ show: true, title: 'Custom Error' })
    expect(wrapper.text()).toContain('Custom Error')
  })

  it('falls back to i18n title when no title prop', () => {
    const wrapper = mount({ show: true })
    expect(wrapper.text()).toContain('An Error Occurred')
  })

  it('shows custom message', () => {
    const wrapper = mount({ show: true, message: 'Something went wrong' })
    expect(wrapper.text()).toContain('Something went wrong')
  })

  it('falls back to i18n message when no message prop', () => {
    const wrapper = mount({ show: true })
    expect(wrapper.text()).toContain('Please try again.')
  })

  it('shows custom buttonText', () => {
    const wrapper = mount({ show: true, buttonText: 'Dismiss' })
    expect(wrapper.text()).toContain('Dismiss')
  })

  it('falls back to i18n close text when no buttonText', () => {
    const wrapper = mount({ show: true })
    expect(wrapper.text()).toContain('Close')
  })

  it('emits close when button is clicked', async () => {
    const wrapper = mount({ show: true })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})

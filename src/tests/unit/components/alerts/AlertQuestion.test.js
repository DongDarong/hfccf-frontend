import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../helpers/mount'
import AlertQuestion from '@/components/alerts/AlertQuestion.vue'

const messages = {
  en: {
    common: {
      areYouSure:          'Are you sure?',
      actionCannotBeUndone: 'This action cannot be undone.',
      confirm:             'Confirm',
      cancel:              'Cancel',
    },
  },
}

const dialogStub = {
  props: ['visible', 'modal', 'closable', 'draggable', 'closeOnEscape', 'dismissableMask', 'pt'],
  template: '<div v-if="visible" class="dialog"><slot name="header" /><slot /><slot name="footer" /></div>',
}

const buttonStub = {
  props: ['disabled', 'loading', 'variant'],
  template: '<button :disabled="disabled" v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
  emits: ['click'],
}

function mount(props = {}) {
  return mountWithPlugins(AlertQuestion, {
    props: { show: true, ...props },
    messages,
    global: { stubs: { Dialog: dialogStub, Button: buttonStub } },
  })
}

describe('AlertQuestion', () => {
  it('renders nothing when show is false', () => {
    const wrapper = mountWithPlugins(AlertQuestion, {
      props: { show: false },
      messages,
      global: { stubs: { Dialog: dialogStub, Button: buttonStub } },
    })
    expect(wrapper.find('.dialog').exists()).toBe(false)
  })

  it('renders content when show is true', () => {
    expect(mount().find('.dialog').exists()).toBe(true)
  })

  it('shows custom title', () => {
    expect(mount({ title: 'Delete record?' }).text()).toContain('Delete record?')
  })

  it('falls back to i18n title when no title prop', () => {
    expect(mount().text()).toContain('Are you sure?')
  })

  it('shows custom message', () => {
    expect(mount({ message: 'This will remove all data.' }).text()).toContain('This will remove all data.')
  })

  it('shows custom confirmText', () => {
    expect(mount({ confirmText: 'Yes, delete' }).text()).toContain('Yes, delete')
  })

  it('shows custom cancelText', () => {
    expect(mount({ cancelText: 'No, go back' }).text()).toContain('No, go back')
  })

  it('emits confirm when confirm button is clicked', async () => {
    const wrapper = mount()
    const buttons = wrapper.findAll('button')
    const confirmBtn = buttons.find(b => b.text() === 'Confirm')
    await confirmBtn.trigger('click')
    expect(wrapper.emitted('confirm')).toBeTruthy()
  })

  it('emits cancel when cancel button is clicked', async () => {
    const wrapper = mount()
    const buttons = wrapper.findAll('button')
    const cancelBtn = buttons.find(b => b.text() === 'Cancel')
    await cancelBtn.trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('does not emit confirm when loading is true', async () => {
    const wrapper = mount({ loading: true })
    const buttons = wrapper.findAll('button')
    const confirmBtn = buttons.find(b => b.text() === 'Confirm')
    await confirmBtn.trigger('click')
    expect(wrapper.emitted('confirm')).toBeFalsy()
  })

  it('does not emit cancel when loading is true', async () => {
    const wrapper = mount({ loading: true })
    const buttons = wrapper.findAll('button')
    const cancelBtn = buttons.find(b => b.text() === 'Cancel')
    await cancelBtn.trigger('click')
    expect(wrapper.emitted('cancel')).toBeFalsy()
  })

  it('applies danger icon class by default', () => {
    const wrapper = mount({ type: 'danger' })
    expect(wrapper.find('.alert-question__icon--danger').exists()).toBe(true)
  })

  it('applies warning icon class when type is warning', () => {
    const wrapper = mount({ type: 'warning' })
    expect(wrapper.find('.alert-question__icon--warning').exists()).toBe(true)
  })

  it('applies info icon class when type is info', () => {
    const wrapper = mount({ type: 'info' })
    expect(wrapper.find('.alert-question__icon--info').exists()).toBe(true)
  })
})

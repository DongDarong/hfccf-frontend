import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../helpers/mount'
import NoInternet from '@/components/feedback/NoInternet.vue'

const buttonStub = {
  template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
  emits: ['click'],
}

function mount(props = {}) {
  return mountWithPlugins(NoInternet, {
    props,
    global: { stubs: { Button: buttonStub } },
  })
}

function setOnline(value) {
  Object.defineProperty(navigator, 'onLine', { get: () => value, configurable: true })
}

beforeEach(() => setOnline(true))
afterEach(() => setOnline(true))

describe('NoInternet', () => {
  it('is hidden when browser is online (default)', () => {
    expect(mount().find('section').exists()).toBe(false)
  })

  it('is visible when browser is offline', () => {
    setOnline(false)
    expect(mount().find('section').exists()).toBe(true)
  })

  it('shows default title and message when offline', () => {
    setOnline(false)
    const wrapper = mount()
    expect(wrapper.text()).toContain('No Internet Connection')
    expect(wrapper.text()).toContain('Please check your network and try again.')
  })

  it('shows custom title, message and buttonText when offline', () => {
    setOnline(false)
    const wrapper = mount({ title: 'Offline', message: 'Check WiFi', buttonText: 'Reload' })
    expect(wrapper.text()).toContain('Offline')
    expect(wrapper.text()).toContain('Check WiFi')
    expect(wrapper.text()).toContain('Reload')
  })

  it('emits retry when Try Again button is clicked', async () => {
    setOnline(false)
    const wrapper = mount()
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('retry')).toBeTruthy()
  })

  it('adds fullscreen classes when fullscreen prop is true', () => {
    setOnline(false)
    const wrapper = mount({ fullscreen: true })
    expect(wrapper.find('section').classes()).toContain('min-h-screen')
  })

  it('shows when showWhenOnline is true and browser is online', () => {
    expect(mount({ showWhenOnline: true }).find('section').exists()).toBe(true)
  })

  it('hides when showWhenOnline is true and browser is offline', () => {
    setOnline(false)
    expect(mount({ showWhenOnline: true }).find('section').exists()).toBe(false)
  })
})

import { describe, it, expect } from 'vitest'
import { mountWithPlugins } from '../../../../helpers/mount'
import RiskBadge from '@/modules/dsam/components/shared/RiskBadge.vue'

const messages = {
  en: {
    dsamShared: {
      riskLevels: {
        low:      'Low',
        medium:   'Medium',
        high:     'High',
        critical: 'Critical',
      },
    },
  },
}

function mount(props = {}) {
  return mountWithPlugins(RiskBadge, { props, messages })
}

describe('RiskBadge', () => {
  // fallback
  it('renders fallback dash when level is null', () => {
    const wrapper = mount({ level: null })
    expect(wrapper.text()).toBe('—')
  })

  it('renders fallback dash when level is not provided', () => {
    const wrapper = mount()
    expect(wrapper.text()).toBe('—')
  })

  it('renders fallback dash for unknown level', () => {
    const wrapper = mount({ level: 'unknown' })
    expect(wrapper.text()).toBe('—')
  })

  // label
  it('renders translated label for low', () => {
    expect(mount({ level: 'low' }).text()).toBe('Low')
  })

  it('renders translated label for medium', () => {
    expect(mount({ level: 'medium' }).text()).toBe('Medium')
  })

  it('renders translated label for high', () => {
    expect(mount({ level: 'high' }).text()).toBe('High')
  })

  it('renders translated label for critical', () => {
    expect(mount({ level: 'critical' }).text()).toBe('Critical')
  })

  // color classes
  it('applies green classes for low', () => {
    const wrapper = mount({ level: 'low' })
    expect(wrapper.classes()).toContain('bg-green-50')
    expect(wrapper.classes()).toContain('text-green-700')
  })

  it('applies amber classes for medium', () => {
    const wrapper = mount({ level: 'medium' })
    expect(wrapper.classes()).toContain('bg-amber-50')
    expect(wrapper.classes()).toContain('text-amber-700')
  })

  it('applies orange classes for high', () => {
    const wrapper = mount({ level: 'high' })
    expect(wrapper.classes()).toContain('bg-orange-50')
    expect(wrapper.classes()).toContain('text-orange-700')
  })

  it('applies red classes for critical', () => {
    const wrapper = mount({ level: 'critical' })
    expect(wrapper.classes()).toContain('bg-red-50')
    expect(wrapper.classes()).toContain('text-red-700')
  })

  // size
  it('applies text-xs for size sm', () => {
    const wrapper = mount({ level: 'low', size: 'sm' })
    expect(wrapper.classes()).toContain('text-xs')
    expect(wrapper.classes()).not.toContain('text-sm')
  })

  it('applies text-sm for size md (default)', () => {
    const wrapper = mount({ level: 'low', size: 'md' })
    expect(wrapper.classes()).toContain('text-sm')
    expect(wrapper.classes()).not.toContain('text-xs')
  })

  it('defaults to md size', () => {
    const wrapper = mount({ level: 'low' })
    expect(wrapper.classes()).toContain('text-sm')
  })
})

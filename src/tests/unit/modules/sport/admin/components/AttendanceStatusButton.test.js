import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AttendanceStatusButton from '@/modules/sport/admin/components/AttendanceStatusButton.vue'

describe('AttendanceStatusButton', () => {
  it('keeps the short label visible while exposing a full accessible label', () => {
    const wrapper = mount(AttendanceStatusButton, {
      props: {
        value: 'present',
        label: 'Present',
        short: 'P',
        activeClass: 'active',
        ringClass: 'ring',
        isActive: true,
        disabled: false,
      },
      global: {
        stubs: {
          AppButton: {
            template: '<button v-bind="$attrs"><slot /></button>',
          },
        },
      },
    })

    const button = wrapper.find('button')

    expect(button.text()).toBe('P')
    expect(button.attributes('aria-label')).toBe('Present')
    expect(button.attributes('aria-pressed')).toBe('true')
    expect(button.attributes('title')).toBe('Present')
  })
})

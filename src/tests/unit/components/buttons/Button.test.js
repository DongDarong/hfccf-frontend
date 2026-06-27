import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '@/tests/helpers/mount'
import Button from '@/components/buttons/Button.vue'

describe('Button wrapper', () => {
  it('forwards default slot text and icon slots to AppButton', () => {
    const wrapper = mountWithPlugins(Button, {
      props: {
        type: 'button',
        variant: 'secondary',
      },
      slots: {
        default: 'Health Records',
        iconLeft: '<i class="pi pi-heart" aria-hidden="true"></i>',
        iconRight: '<i class="pi pi-arrow-right" aria-hidden="true"></i>',
      },
      messages: {
        en: {
          common: { states: { loading: 'Loading' } },
        },
      },
    })

    expect(wrapper.text()).toContain('Health Records')
    expect(wrapper.html()).toContain('pi-heart')
    expect(wrapper.html()).toContain('pi-arrow-right')
  })

  it('forwards label prop text through the wrapper', () => {
    const wrapper = mountWithPlugins(Button, {
      props: {
        type: 'button',
        variant: 'ghost',
        label: 'ត្រឡប់ទៅបញ្ជីសិស្ស',
      },
      messages: {
        en: {
          common: { states: { loading: 'Loading' } },
        },
      },
    })

    expect(wrapper.text()).toContain('ត្រឡប់ទៅបញ្ជីសិស្ស')
  })
})

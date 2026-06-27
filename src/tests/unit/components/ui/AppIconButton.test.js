import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '@/tests/helpers/mount'
import AppIconButton from '@/components/ui/AppIconButton.vue'

describe('AppIconButton', () => {
  it('requires an accessible label and renders compact square sizing', () => {
    const wrapper = mountWithPlugins(AppIconButton, {
      props: {
        ariaLabel: 'Refresh dashboard',
        type: 'button',
      },
      slots: {
        icon: '<i class="pi pi-refresh" aria-hidden="true"></i>',
      },
    })

    expect(wrapper.attributes('aria-label')).toBe('Refresh dashboard')
    expect(wrapper.classes()).toContain('ui-icon-button')
  })

  it('emits clicks when enabled and stays disabled while loading', async () => {
    const wrapper = mountWithPlugins(AppIconButton, {
      props: {
        ariaLabel: 'Open calendar',
        loading: true,
        type: 'button',
      },
      slots: {
        icon: '<i class="pi pi-calendar" aria-hidden="true"></i>',
      },
    })

    expect(wrapper.attributes('aria-busy')).toBe('true')
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})

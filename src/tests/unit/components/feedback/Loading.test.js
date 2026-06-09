import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../helpers/mount'
import Loading from '@/components/feedback/Loading.vue'

const messages = {
  en: {
    common: { states: { loading: 'Loading...' } },
  },
}

const progressSpinnerStub = {
  props: ['strokeWidth', 'fill', 'animationDuration', 'pt'],
  template: '<div class="spinner" :style="$attrs.style"></div>',
}

function mount(props = {}) {
  return mountWithPlugins(Loading, {
    props,
    messages,
    global: { stubs: { ProgressSpinner: progressSpinnerStub } },
  })
}

describe('Loading', () => {
  it('renders with role="status"', () => {
    expect(mount().attributes('role')).toBe('status')
  })

  it('uses i18n fallback label when none provided', () => {
    expect(mount().text()).toContain('Loading...')
  })

  it('uses custom label when provided', () => {
    expect(mount({ label: 'Saving...' }).text()).toContain('Saving...')
  })

  it('applies primary tone class by default', () => {
    expect(mount().classes()).toContain('text-brand-500')
  })

  it('applies neutral tone class when tone is neutral', () => {
    expect(mount({ tone: 'neutral' }).classes()).toContain('text-hope-dark')
  })

  it('passes smaller style for sm size', () => {
    const spinner = mount({ size: 'sm' }).find('.spinner')
    expect(spinner.attributes('style')).toContain('1.1rem')
  })

  it('passes larger style for lg size', () => {
    const spinner = mount({ size: 'lg' }).find('.spinner')
    expect(spinner.attributes('style')).toContain('1.6rem')
  })

  it('has aria-label set to the resolved label', () => {
    expect(mount({ label: 'Please wait' }).attributes('aria-label')).toBe('Please wait')
  })
})

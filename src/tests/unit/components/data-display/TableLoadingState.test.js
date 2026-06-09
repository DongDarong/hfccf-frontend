import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../helpers/mount'
import TableLoadingState from '@/components/data-display/components/TableLoadingState.vue'

const messages = {
  en: { common: { states: { loading: 'Loading...' } } },
}

const progressSpinnerStub = {
  props: ['strokeWidth', 'fill', 'animationDuration', 'pt'],
  template: '<div class="spinner" :style="$attrs.style"></div>',
}

function mount(props = {}) {
  return mountWithPlugins(TableLoadingState, {
    props,
    messages,
    global: { stubs: { ProgressSpinner: progressSpinnerStub } },
  })
}

describe('TableLoadingState', () => {
  it('renders without errors', () => {
    expect(mount().exists()).toBe(true)
  })

  it('renders the Loading component', () => {
    expect(mount().find('.spinner').exists()).toBe(true)
  })

  it('passes label prop to Loading', () => {
    expect(mount({ label: 'Fetching data...' }).text()).toContain('Fetching data...')
  })

  it('shows default loading label when no label provided', () => {
    expect(mount().text()).toContain('Loading...')
  })
})

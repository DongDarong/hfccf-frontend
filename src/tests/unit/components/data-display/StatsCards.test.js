import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../helpers/mount'
import StatsCards from '@/components/data-display/StatsCards.vue'

const messages = {
  en: {
    common: {
      dashboardStats: {
        loading: 'Loading stats...',
        empty:   'No data available.',
      },
    },
  },
}

const progressSpinnerStub = {
  props: ['strokeWidth', 'fill', 'animationDuration', 'pt'],
  template: '<div class="spinner" :style="$attrs.style"></div>',
}

function mount(props = {}) {
  return mountWithPlugins(StatsCards, {
    props,
    messages,
    global: { stubs: { ProgressSpinner: progressSpinnerStub } },
  })
}

const sampleCards = [
  { title: 'Total Students', value: 120, label: 'enrolled', status: 'success' },
  { title: 'Pending',        value: 8,   label: 'awaiting', status: 'warning' },
]

describe('StatsCards', () => {
  it('shows loading state when loading is true', () => {
    const wrapper = mount({ loading: true })
    expect(wrapper.text()).toContain('Loading stats...')
    expect(wrapper.find('.spinner').exists()).toBe(true)
  })

  it('does not show cards when loading', () => {
    const wrapper = mount({ loading: true, cards: sampleCards })
    expect(wrapper.findAll('article')).toHaveLength(0)
  })

  it('shows error message when error prop is set', () => {
    const wrapper = mount({ error: 'Failed to load data.' })
    expect(wrapper.find('[role="alert"]').text()).toContain('Failed to load data.')
  })

  it('shows empty state when no cards are provided', () => {
    expect(mount({ cards: [] }).text()).toContain('No data available.')
  })

  it('renders one article per card', () => {
    expect(mount({ cards: sampleCards }).findAll('article')).toHaveLength(2)
  })

  it('renders card value', () => {
    const wrapper = mount({ cards: [{ title: 'Count', value: 42, label: 'items', status: 'info' }] })
    expect(wrapper.text()).toContain('42')
  })

  it('renders card title as-is when no translation key exists', () => {
    const wrapper = mount({ cards: [{ title: 'Total Students', value: 5, label: 'students', status: 'success' }] })
    expect(wrapper.text()).toContain('Total Students')
  })

  it('applies success accent border class for success status', () => {
    const wrapper = mount({ cards: [{ title: 'T', value: 1, label: 'l', status: 'success' }] })
    expect(wrapper.find('article').classes()).toContain('border-l-hope-lime')
  })

  it('applies error accent border class for error status', () => {
    const wrapper = mount({ cards: [{ title: 'T', value: 1, label: 'l', status: 'error' }] })
    expect(wrapper.find('article').classes()).toContain('border-l-hope-red')
  })

  it('applies warning accent border class for warning status', () => {
    const wrapper = mount({ cards: [{ title: 'T', value: 1, label: 'l', status: 'warning' }] })
    expect(wrapper.find('article').classes()).toContain('border-l-hope-yellow')
  })
})

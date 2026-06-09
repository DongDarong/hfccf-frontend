import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../../helpers/mount'
import MatchMinuteBadge from '@/modules/sport/match-events/components/MatchMinuteBadge.vue'

const messages = {
  en: {
    sportMatchesManagement: {
      resultsEntry: {
        events: {
          periods: {
            first_half:  '1st Half',
            second_half: '2nd Half',
            extra_time:  'Extra Time',
          },
        },
      },
    },
  },
}

function mount(event = {}) {
  return mountWithPlugins(MatchMinuteBadge, { props: { event }, messages })
}

describe('MatchMinuteBadge', () => {
  it('renders minute for a first-half event', () => {
    const wrapper = mount({ minute: 23, period: 'first_half' })
    expect(wrapper.text()).toContain("23'")
  })

  it('renders period label', () => {
    const wrapper = mount({ minute: 45, period: 'first_half' })
    expect(wrapper.text()).toContain('1st Half')
  })

  it('renders second half period label', () => {
    const wrapper = mount({ minute: 67, period: 'second_half' })
    expect(wrapper.text()).toContain('2nd Half')
  })

  it('renders extra time period label', () => {
    const wrapper = mount({ minute: 95, period: 'extra_time' })
    expect(wrapper.text()).toContain('Extra Time')
  })

  it('defaults to first_half when period is absent', () => {
    const wrapper = mount({ minute: 10 })
    expect(wrapper.text()).toContain('1st Half')
  })
})

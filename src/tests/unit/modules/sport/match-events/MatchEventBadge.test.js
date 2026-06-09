import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../../helpers/mount'
import MatchEventBadge from '@/modules/sport/match-events/components/MatchEventBadge.vue'

const messages = {
  en: {
    sportMatchesManagement: {
      resultsEntry: {
        events: {
          types: {
            goal:             'Goal',
            yellow_card:      'Yellow Card',
            red_card:         'Red Card',
            substitution_out: 'Substitution',
            foul:             'Foul',
          },
        },
      },
    },
  },
}

function mount(type = '') {
  return mountWithPlugins(MatchEventBadge, { props: { type }, messages })
}

describe('MatchEventBadge', () => {
  it('renders a Tag for goal type', () => {
    const wrapper = mount('goal')
    expect(wrapper.find('[data-status-label]').attributes('data-status-label')).toBe('Goal')
  })

  it('renders a Tag for yellow_card type', () => {
    expect(mount('yellow_card').find('[data-status-label]').attributes('data-status-label')).toBe('Yellow Card')
  })

  it('renders a Tag for red_card type', () => {
    expect(mount('red_card').find('[data-status-label]').attributes('data-status-label')).toBe('Red Card')
  })

  it('renders a Tag for substitution_out type', () => {
    expect(mount('substitution_out').find('[data-status-label]').attributes('data-status-label')).toBe('Substitution')
  })

  it('renders for foul type', () => {
    expect(mount('foul').find('[data-status-label]').attributes('data-status-label')).toBe('Foul')
  })

  it('normalizes uppercase type input', () => {
    expect(mount('GOAL').find('[data-status-label]').attributes('data-status-label')).toBe('Goal')
  })
})

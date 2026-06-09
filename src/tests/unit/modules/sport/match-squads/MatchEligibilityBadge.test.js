import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../../helpers/mount'
import MatchEligibilityBadge from '@/modules/sport/match-squads/components/MatchEligibilityBadge.vue'

// StatusBadge default stub from mountWithPlugins: data-status-label attribute
const messages = {
  en: {
    sportMatchSquad: {
      eligibility: {
        eligible:    'Eligible',
        ineligible:  'Ineligible',
        suspended:   'Suspended',
        injured:     'Injured',
      },
      common: { empty: '—' },
    },
  },
}

function mount(status = '') {
  return mountWithPlugins(MatchEligibilityBadge, { props: { status }, messages })
}

describe('MatchEligibilityBadge', () => {
  it('shows Eligible for eligible status', () => {
    expect(mount('eligible').find('[data-status-label]').attributes('data-status-label')).toBe('Eligible')
  })

  it('shows Ineligible for ineligible status', () => {
    expect(mount('ineligible').find('[data-status-label]').attributes('data-status-label')).toBe('Ineligible')
  })

  it('shows Suspended for suspended status', () => {
    expect(mount('suspended').find('[data-status-label]').attributes('data-status-label')).toBe('Suspended')
  })

  it('shows Injured for injured status', () => {
    expect(mount('injured').find('[data-status-label]').attributes('data-status-label')).toBe('Injured')
  })

  it('shows empty label for unknown status', () => {
    expect(mount('unknown').find('[data-status-label]').attributes('data-status-label')).toBe('—')
  })

  it('shows empty label when status is empty', () => {
    expect(mount('').find('[data-status-label]').attributes('data-status-label')).toBe('—')
  })

  it('normalizes uppercase input', () => {
    expect(mount('ELIGIBLE').find('[data-status-label]').attributes('data-status-label')).toBe('Eligible')
  })
})

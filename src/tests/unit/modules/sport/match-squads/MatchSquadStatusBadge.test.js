import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../../helpers/mount'
import MatchSquadStatusBadge from '@/modules/sport/match-squads/components/MatchSquadStatusBadge.vue'

const messages = {
  en: {
    sportMatchSquad: {
      statuses: {
        pending:  'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
      },
      common: { empty: '—' },
    },
  },
}

function mount(status = '') {
  return mountWithPlugins(MatchSquadStatusBadge, { props: { status }, messages })
}

describe('MatchSquadStatusBadge', () => {
  it('shows Pending for pending status', () => {
    expect(mount('pending').find('[data-status-label]').attributes('data-status-label')).toBe('Pending')
  })

  it('shows Approved for approved status', () => {
    expect(mount('approved').find('[data-status-label]').attributes('data-status-label')).toBe('Approved')
  })

  it('shows Rejected for rejected status', () => {
    expect(mount('rejected').find('[data-status-label]').attributes('data-status-label')).toBe('Rejected')
  })

  it('shows empty label for unknown status', () => {
    expect(mount('unknown').find('[data-status-label]').attributes('data-status-label')).toBe('—')
  })

  it('normalizes uppercase input', () => {
    expect(mount('APPROVED').find('[data-status-label]').attributes('data-status-label')).toBe('Approved')
  })
})

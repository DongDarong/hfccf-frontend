import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../../helpers/mount'
import TournamentStatusBadge from '@/modules/sport/tournament/components/shared/TournamentStatusBadge.vue'

const messages = {
  en: {
    sportTournament: {
      states: {
        draft:       'Draft',
        registration:'Registration',
        active:      'Active',
        completed:   'Completed',
        cancelled:   'Cancelled',
      },
    },
  },
}

function mount(props = {}) {
  return mountWithPlugins(TournamentStatusBadge, { props, messages })
}

describe('TournamentStatusBadge', () => {
  it('renders for draft state', () => {
    const wrapper = mount({ state: 'draft' })
    expect(wrapper.find('[data-status-label]').exists()).toBe(true)
  })

  it('shows translated label for known state', () => {
    expect(mount({ state: 'active' }).find('[data-status-label]').attributes('data-status-label')).toBe('Active')
  })

  it('shows translated label for completed state', () => {
    expect(mount({ state: 'completed' }).find('[data-status-label]').attributes('data-status-label')).toBe('Completed')
  })

  it('shows custom label when provided', () => {
    expect(mount({ state: 'draft', label: 'In Progress' }).find('[data-status-label]').attributes('data-status-label')).toBe('In Progress')
  })

  it('falls back to Draft label for unknown state', () => {
    expect(mount({ state: 'unknown_state' }).find('[data-status-label]').attributes('data-status-label')).toBe('Draft')
  })
})

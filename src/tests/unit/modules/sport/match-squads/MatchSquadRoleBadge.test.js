import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../../helpers/mount'
import MatchSquadRoleBadge from '@/modules/sport/match-squads/components/MatchSquadRoleBadge.vue'

const messages = {
  en: {
    sportMatchSquad: {
      roles: {
        starter:     'Starter',
        substitute:  'Substitute',
        reserve:     'Reserve',
        unavailable: 'Unavailable',
      },
    },
  },
}

function mount(role = '') {
  return mountWithPlugins(MatchSquadRoleBadge, { props: { role }, messages })
}

describe('MatchSquadRoleBadge', () => {
  it('shows Starter for starter role', () => {
    expect(mount('starter').find('[data-status-label]').attributes('data-status-label')).toBe('Starter')
  })

  it('shows Substitute for substitute role', () => {
    expect(mount('substitute').find('[data-status-label]').attributes('data-status-label')).toBe('Substitute')
  })

  it('shows Reserve for reserve role', () => {
    expect(mount('reserve').find('[data-status-label]').attributes('data-status-label')).toBe('Reserve')
  })

  it('shows Unavailable for unavailable role', () => {
    expect(mount('unavailable').find('[data-status-label]').attributes('data-status-label')).toBe('Unavailable')
  })

  it('falls back to Reserve label for unknown role', () => {
    expect(mount('unknown').find('[data-status-label]').attributes('data-status-label')).toBe('Reserve')
  })

  it('normalizes uppercase role input', () => {
    expect(mount('STARTER').find('[data-status-label]').attributes('data-status-label')).toBe('Starter')
  })
})

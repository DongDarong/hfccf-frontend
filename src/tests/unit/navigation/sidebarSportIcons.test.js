import { describe, expect, it } from 'vitest'
import sportSidebar from '@/data/sidebar/sport.json'
import { resolveSidebarIconComponent, sidebarIconByName } from '@/components/navigation/sidebarIcons'
import {
  IconCalendarCheck,
  IconClipboardCheck,
  IconLayoutDashboard,
  IconScoreboard,
  IconShirtSport,
  IconTimelineEvent,
  IconTrophy,
  IconUserCheck,
  IconUserCog,
  IconUserShare,
  IconUsersGroup,
} from '@tabler/icons-vue'

const sportSection = sportSidebar.sections[0]

const expectedItemOrder = [
  'sport-dashboard',
  'sport-attendance',
  'sport-coaches',
  'sport-teams',
  'sport-players',
  'sport-coach-team-assignments',
  'sport-matches',
  'sport-tournaments',
  'sport-pending-player-approvals',
  'sport-pending-match-approvals',
  'sport-player-lifecycle',
]

const expectedIconRefs = {
  'sport-dashboard': IconLayoutDashboard,
  'sport-attendance': IconClipboardCheck,
  'sport-coaches': IconUserCog,
  'sport-teams': IconUsersGroup,
  'sport-players': IconShirtSport,
  'sport-coach-team-assignments': IconUserShare,
  'sport-matches': IconScoreboard,
  'sport-tournaments': IconTrophy,
  'sport-pending-player-approvals': IconUserCheck,
  'sport-pending-match-approvals': IconCalendarCheck,
  'sport-player-lifecycle': IconTimelineEvent,
}

describe('sport sidebar icon family', () => {
  it('keeps the sport admin items in the expected order', () => {
    expect(sportSection.items.map((item) => item.id)).toEqual(expectedItemOrder)
  })

  it('removes redundant item-level admin badges from the sport section', () => {
    expect(sportSection.items.every((item) => !Object.prototype.hasOwnProperty.call(item, 'badgeKey'))).toBe(true)
  })

  it('resolves a concrete component for every sport sidebar icon key', () => {
    sportSection.items.forEach((item) => {
      const resolved = resolveSidebarIconComponent(item.icon)
      expect(resolved).toBe(expectedIconRefs[item.id])
      expect(sidebarIconByName[item.icon]).toBe(resolved)
      expect(resolved).not.toBeNull()
    })
  })

  it('keeps the approval and relationship icons distinct', () => {
    expect(sidebarIconByName['sport-player-approval']).not.toBe(sidebarIconByName['sport-match-approval'])
    expect(sidebarIconByName['sport-coach']).not.toBe(sidebarIconByName['sport-team'])
    expect(sidebarIconByName['sport-coach']).not.toBe(sidebarIconByName['sport-players'])
    expect(sidebarIconByName['sport-team']).not.toBe(sidebarIconByName['sport-players'])
    expect(sidebarIconByName['sport-assignment']).not.toBe(sidebarIconByName['sport-player-approval'])
  })
})

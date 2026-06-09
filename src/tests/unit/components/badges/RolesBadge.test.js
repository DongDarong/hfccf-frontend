import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../helpers/mount'
import RolesBadge from '@/components/badges/RolesBadge.vue'

// Tag default stub from mountWithPlugins renders data-status-label attribute.
const messages = {
  en: {
    common: {
      role: {
        superadmin:       'Super Admin',
        adminpreschool:   'Preschool Admin',
        teacher_preschool: 'Preschool Teacher',
      },
    },
  },
}

function mount(props = {}) {
  return mountWithPlugins(RolesBadge, { props, messages })
}

describe('RolesBadge', () => {
  it('shows "-" when role is empty', () => {
    expect(mount({ role: '' }).attributes('data-status-label')).toBe('-')
  })

  it('shows "-" when role is not provided', () => {
    expect(mount().attributes('data-status-label')).toBe('-')
  })

  it('shows translated label for known role', () => {
    expect(mount({ role: 'superadmin' }).attributes('data-status-label')).toBe('Super Admin')
  })

  it('normalizes uppercase role input', () => {
    expect(mount({ role: 'SUPERADMIN' }).attributes('data-status-label')).toBe('Super Admin')
  })

  it('falls back to humanized role when no translation exists', () => {
    // 'guardian' has no translation key in messages → humanized
    expect(mount({ role: 'guardian' }).attributes('data-status-label')).toBe('Guardian')
  })

  it('humanizes hyphenated role correctly', () => {
    // 'teacher-preschool' translation exists in messages
    expect(mount({ role: 'teacher-preschool' }).attributes('data-status-label')).toBe('Preschool Teacher')
  })

  it('renders without errors for all valid sizes', () => {
    for (const size of ['xs', 'sm', 'md', 'lg']) {
      expect(mount({ role: 'superadmin', size }).exists()).toBe(true)
    }
  })
})

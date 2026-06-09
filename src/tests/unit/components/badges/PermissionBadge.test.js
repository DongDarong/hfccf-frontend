import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../helpers/mount'
import PermissionBadge from '@/components/badges/PermissionBadge.vue'

// Tag default stub from mountWithPlugins renders data-status-label attribute.
const messages = {
  en: {
    common: {
      permission: {
        view:        'View',
        edit:        'Edit',
        manage_data: 'Manage Data',
      },
    },
  },
}

function mount(props = {}) {
  return mountWithPlugins(PermissionBadge, { props, messages })
}

describe('PermissionBadge', () => {
  it('shows "-" when permission is empty', () => {
    expect(mount({ permission: '' }).attributes('data-status-label')).toBe('-')
  })

  it('shows "-" when permission prop is not provided', () => {
    expect(mount().attributes('data-status-label')).toBe('-')
  })

  it('shows translated label when translation key exists', () => {
    expect(mount({ permission: 'view' }).attributes('data-status-label')).toBe('View')
  })

  it('translates hyphen/space separated permission to snake_case key', () => {
    expect(mount({ permission: 'manage data' }).attributes('data-status-label')).toBe('Manage Data')
  })

  it('falls back to raw normalized permission when no translation exists', () => {
    expect(mount({ permission: 'Unknown-Perm' }).attributes('data-status-label')).toBe('unknown-perm')
  })

  it('normalizes uppercase input for translation lookup', () => {
    expect(mount({ permission: 'EDIT' }).attributes('data-status-label')).toBe('Edit')
  })
})

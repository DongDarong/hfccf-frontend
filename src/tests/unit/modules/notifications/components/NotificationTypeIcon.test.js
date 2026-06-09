import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../../helpers/mount'
import NotificationTypeIcon from '@/modules/notifications/components/NotificationTypeIcon.vue'

function mount(props = {}) {
  return mountWithPlugins(NotificationTypeIcon, { props })
}

describe('NotificationTypeIcon', () => {
  it('renders a span with aria-hidden', () => {
    expect(mount().find('span[aria-hidden="true"]').exists()).toBe(true)
  })

  it('applies system tone by default', () => {
    expect(mount().find('span').classes()).toContain('notification-type-icon--system')
  })

  it('uses pi-bell icon for system type', () => {
    expect(mount({ type: 'system' }).find('i.pi-bell').exists()).toBe(true)
  })

  it('uses pi-check-circle icon for success type', () => {
    expect(mount({ type: 'success' }).find('i.pi-check-circle').exists()).toBe(true)
  })

  it('uses pi-exclamation-triangle icon for warning type', () => {
    expect(mount({ type: 'warning' }).find('i.pi-exclamation-triangle').exists()).toBe(true)
  })

  it('uses pi-times-circle icon for error type', () => {
    expect(mount({ type: 'error' }).find('i.pi-times-circle').exists()).toBe(true)
  })

  it('uses pi-info-circle icon for info type', () => {
    expect(mount({ type: 'info' }).find('i.pi-info-circle').exists()).toBe(true)
  })

  it('applies success tone class for success type', () => {
    expect(mount({ type: 'success' }).find('span').classes()).toContain('notification-type-icon--success')
  })

  it('applies warning tone class for warning type', () => {
    expect(mount({ type: 'warning' }).find('span').classes()).toContain('notification-type-icon--warning')
  })

  it('applies size class for lg', () => {
    expect(mount({ size: 'lg' }).find('span').classes()).toContain('notification-type-icon--lg')
  })

  it('applies size class for sm', () => {
    expect(mount({ size: 'sm' }).find('span').classes()).toContain('notification-type-icon--sm')
  })

  it('falls back to pi-bell for unknown type', () => {
    expect(mount({ type: 'unknown' }).find('i.pi-bell').exists()).toBe(true)
  })
})

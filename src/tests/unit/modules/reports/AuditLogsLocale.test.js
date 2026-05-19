import { describe, expect, it } from 'vitest'
import enReports from '@/i18n/en/reports'
import khReports from '@/i18n/kh/reports'

describe('reports locale parity', () => {
  it('exposes audit log keys in both locales', () => {
    expect(enReports.auditLogs.title).toBe('Audit Logs')
    expect(typeof enReports.auditLogs.actions.playerApproved).toBe('string')
    expect(typeof khReports.auditLogs.title).toBe('string')
    expect(typeof khReports.auditLogs.actions.playerApproved).toBe('string')
  })
})
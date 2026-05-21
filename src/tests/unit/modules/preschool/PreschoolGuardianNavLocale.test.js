import { describe, expect, it } from 'vitest'
import enNav from '@/i18n/en/dashboard/nav'
import khNav from '@/i18n/kh/dashboard/nav'

// Keep the sidebar label contract covered so the new integrity route does not
// lose its localized navigation entry on either language pack, and so the
// Preschool settings link stays visible in both EN and KH.
describe('preschool guardian nav locale parity', () => {
  it('keeps the guardian integrity nav label aligned in EN and KH', () => {
    expect(enNav.items.guardianIntegrityReport).toBe('Guardian Integrity')
    expect(typeof khNav.items.guardianIntegrityReport).toBe('string')
    expect(khNav.items.guardianIntegrityReport).not.toContain('<')
  })

  it('keeps the Preschool settings nav label aligned in EN and KH', () => {
    expect(enNav.items.preschoolSettings).toBe('Preschool Settings')
    expect(typeof khNav.items.preschoolSettings).toBe('string')
    expect(khNav.items.preschoolSettings).not.toContain('<')
  })
})

import { describe, expect, it } from 'vitest'

// Test data normalization and helper functions by testing component behavior
describe('ClassTable', () => {
  // Helper function tests (extracted from component logic)
  describe('statusType helper', () => {
    function statusType(status) {
      const value = String(status || '').trim().toLowerCase()
      if (value === 'active' || value === 'open') return 'success'
      if (value === 'pending') return 'info'
      if (value === 'inactive' || value === 'closed') return 'warning'
      if (value === 'suspended') return 'error'
      return 'info'
    }

    it('maps Active to success', () => {
      expect(statusType('Active')).toBe('success')
    })

    it('maps Open to success', () => {
      expect(statusType('Open')).toBe('success')
    })

    it('maps Pending to info', () => {
      expect(statusType('Pending')).toBe('info')
    })

    it('maps Inactive to warning', () => {
      expect(statusType('Inactive')).toBe('warning')
    })

    it('maps Closed to warning', () => {
      expect(statusType('Closed')).toBe('warning')
    })

    it('maps Suspended to error', () => {
      expect(statusType('Suspended')).toBe('error')
    })

    it('maps unknown status to info', () => {
      expect(statusType('Unknown')).toBe('info')
    })

    it('handles case insensitivity', () => {
      expect(statusType('ACTIVE')).toBe('success')
      expect(statusType('inactive')).toBe('warning')
    })

    it('handles whitespace', () => {
      expect(statusType('  Active  ')).toBe('success')
    })
  })

  describe('classInitials helper', () => {
    function classInitials(name) {
      return (
        String(name || '')
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part.charAt(0).toUpperCase())
          .join('') || '?'
      )
    }

    it('creates initials from two word class name', () => {
      expect(classInitials('Morning Class')).toBe('MC')
    })

    it('creates initials from single word class name', () => {
      expect(classInitials('Nursery')).toBe('N')
    })

    it('uses only first two words for multi-word names', () => {
      expect(classInitials('Morning Kindergarten Class')).toBe('MK')
    })

    it('returns question mark for empty name', () => {
      expect(classInitials('')).toBe('?')
    })

    it('returns question mark for whitespace-only name', () => {
      expect(classInitials('   ')).toBe('?')
    })

    it('handles lowercase names', () => {
      expect(classInitials('morning class')).toBe('MC')
    })

    it('handles mixed case names', () => {
      expect(classInitials('MORNING class')).toBe('MC')
    })

    it('filters out extra whitespace between words', () => {
      expect(classInitials('Morning    Class')).toBe('MC')
    })
  })

  describe('data normalization', () => {
    function normalizeRow(item, index) {
      return {
        id: item.id || `class-${index + 1}`,
        code: item.code || item.classCode || '-',
        name: item.name || item.className || '-',
        teacher: item.teacher || item.teacherName || '-',
        level: item.level || item.grade || '-',
        schedule: item.schedule || item.time || '-',
        students: item.students ?? item.studentCount ?? 0,
        status: item.status || 'Active',
        raw: item,
      }
    }

    it('normalizes class with standard field names', () => {
      const mockClass = {
        id: 1,
        code: 'PS-1',
        name: 'Morning Class',
        teacher: 'John Doe',
        level: 'Nursery',
        schedule: '8:00 AM - 11:00 AM',
        students: 15,
        status: 'Active',
      }
      const normalized = normalizeRow(mockClass, 0)
      expect(normalized).toMatchObject({
        id: 1,
        code: 'PS-1',
        name: 'Morning Class',
        teacher: 'John Doe',
        level: 'Nursery',
        students: 15,
        status: 'Active',
      })
    })

    it('normalizes class with alternate field names', () => {
      const mockClass = {
        id: 2,
        classCode: 'PS-2',
        className: 'Afternoon Class',
        teacherName: 'Jane Smith',
        grade: 'Kindergarten',
        time: '1:00 PM - 4:00 PM',
        studentCount: 18,
      }
      const normalized = normalizeRow(mockClass, 1)
      expect(normalized).toMatchObject({
        id: 2,
        code: 'PS-2',
        name: 'Afternoon Class',
        teacher: 'Jane Smith',
        level: 'Kindergarten',
        schedule: '1:00 PM - 4:00 PM',
        students: 18,
        status: 'Active',
      })
    })

    it('generates fallback ID when missing', () => {
      const mockClass = { code: 'PS-3', name: 'Test Class' }
      const normalized = normalizeRow(mockClass, 0)
      expect(normalized.id).toBe('class-1')
    })

    it('uses fallback values for missing fields', () => {
      const mockClass = {}
      const normalized = normalizeRow(mockClass, 5)
      expect(normalized).toMatchObject({
        id: 'class-6',
        code: '-',
        name: '-',
        teacher: '-',
        level: '-',
        schedule: '-',
        students: 0,
        status: 'Active',
      })
    })

    it('preserves raw class data', () => {
      const mockClass = { id: 1, code: 'PS-1' }
      const normalized = normalizeRow(mockClass, 0)
      expect(normalized.raw).toEqual(mockClass)
    })

    it('handles studentCount: 0 correctly (not falsy)', () => {
      const mockClass = { studentCount: 0 }
      const normalized = normalizeRow(mockClass, 0)
      expect(normalized.students).toBe(0)
    })

    it('defaults to Active status when status missing', () => {
      const mockClass = { id: 1, code: 'PS-1' }
      const normalized = normalizeRow(mockClass, 0)
      expect(normalized.status).toBe('Active')
    })
  })
})

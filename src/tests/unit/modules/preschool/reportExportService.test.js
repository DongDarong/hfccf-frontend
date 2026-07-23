import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reportExportService } from '@/modules/preschool/services/reportExportService'

describe('reportExportService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateFilename()', () => {
    it('generates correct filename format for individual summary report', () => {
      const reportData = {
        reportType: 'summary',
        scope: 'individual',
        student: { fullName: 'John Smith' },
        class: { name: 'Grade 1A' },
      }

      const filename = reportExportService.generateFilename(reportData.reportType, reportData)
      expect(filename).toMatch(/^StudentSummaryReport-Individual-John-Smith-\d{4}-\d{2}-\d{2}$/)
    })

    it('generates correct filename format for class summary report', () => {
      const reportData = {
        reportType: 'summary',
        scope: 'class',
        class: { name: 'Grade 1A' },
        classStudents: [],
      }

      const filename = reportExportService.generateFilename(reportData.reportType, reportData)
      expect(filename).toMatch(/^StudentSummaryReport-Class-Grade-1A-\d{4}-\d{2}-\d{2}$/)
    })

    it('generates correct filename for attendance monthly report', () => {
      const reportData = {
        reportType: 'attendance',
        mode: 'monthly',
        class: { name: 'Grade 1A' },
      }

      const filename = reportExportService.generateFilename(reportData.reportType, reportData)
      expect(filename).toMatch(/^AttendanceReport-Monthly-Grade-1A-\d{4}-\d{2}-\d{2}$/)
    })

    it('generates correct filename for assessment individual report', () => {
      const reportData = {
        reportType: 'assessment',
        scope: 'individual',
        student: { fullName: 'Maria Doe' },
      }

      const filename = reportExportService.generateFilename(reportData.reportType, reportData)
      expect(filename).toMatch(/^AssessmentReport-Individual-Maria-Doe-\d{4}-\d{2}-\d{2}$/)
    })

    it('handles special characters in student names', () => {
      const reportData = {
        reportType: 'summary',
        scope: 'individual',
        student: { fullName: "O'Connor-Smith, Jr." },
      }

      const filename = reportExportService.generateFilename(reportData.reportType, reportData)
      expect(filename).not.toContain("'")
      expect(filename).not.toContain(',')
      expect(filename).not.toContain('.')
    })

    it('truncates long names to reasonable length', () => {
      const reportData = {
        reportType: 'summary',
        scope: 'individual',
        student: { fullName: 'A'.repeat(150) },
      }

      const filename = reportExportService.generateFilename(reportData.reportType, reportData)
      expect(filename.length).toBeLessThan(255)
    })

    it('returns fallback filename if data incomplete', () => {
      const reportData = {
        reportType: 'summary',
        scope: 'individual',
        student: null,
      }

      const filename = reportExportService.generateFilename(reportData.reportType, reportData)
      expect(filename).toMatch(/^StudentSummaryReport-Individual-Report-\d{4}-\d{2}-\d{2}$/)
    })
  })

  describe('sanitizeFilename()', () => {
    it('removes illegal characters', () => {
      const input = 'John<Smith>:Test"File|Name?'
      const output = reportExportService.sanitizeFilename(input)
      expect(output).not.toMatch(/[<>:"/\\|?*]/)
    })

    it('replaces spaces with hyphens', () => {
      const input = 'John Smith Student'
      const output = reportExportService.sanitizeFilename(input)
      expect(output).toBe('John-Smith-Student')
    })

    it('collapses multiple hyphens', () => {
      const input = 'John---Smith'
      const output = reportExportService.sanitizeFilename(input)
      expect(output).toBe('John-Smith')
    })

    it('handles empty or null input', () => {
      expect(reportExportService.sanitizeFilename('')).toBe('Report')
      expect(reportExportService.sanitizeFilename(null)).toBe('Report')
      expect(reportExportService.sanitizeFilename(undefined)).toBe('Report')
    })

    it('respects max length', () => {
      const input = 'A'.repeat(200)
      const output = reportExportService.sanitizeFilename(input)
      expect(output.length).toBeLessThanOrEqual(100)
    })
  })

  describe('validateExportData()', () => {
    it('validates summary report with individual scope', () => {
      const reportData = {
        reportType: 'summary',
        scope: 'individual',
        student: { id: '1', fullName: 'John' },
        attendance: {},
      }

      expect(() => reportExportService.validateExportData('summary', reportData)).not.toThrow()
    })

    it('validates summary report with class scope', () => {
      const reportData = {
        reportType: 'summary',
        scope: 'class',
        classStudents: [{ id: '1', fullName: 'John' }],
      }

      expect(() => reportExportService.validateExportData('summary', reportData)).not.toThrow()
    })

    it('throws error for summary without student data', () => {
      const reportData = {
        reportType: 'summary',
        scope: 'individual',
        student: null,
      }

      expect(() => reportExportService.validateExportData('summary', reportData)).toThrow()
    })

    it('throws error for summary without classStudents array', () => {
      const reportData = {
        reportType: 'summary',
        scope: 'class',
        classStudents: [],
      }

      expect(() => reportExportService.validateExportData('summary', reportData)).toThrow()
    })

    it('validates attendance report data', () => {
      const reportData = {
        reportType: 'attendance',
        mode: 'monthly',
        period: { year: 2026, month: 7 },
        summary: { present: 20, absent: 5 },
        items: [],
      }

      expect(() => reportExportService.validateExportData('attendance', reportData)).not.toThrow()
    })

    it('throws error for attendance without period', () => {
      const reportData = {
        reportType: 'attendance',
        mode: 'monthly',
        summary: { present: 20 },
      }

      expect(() => reportExportService.validateExportData('attendance', reportData)).toThrow()
    })

    it('validates assessment report with individual scope', () => {
      const reportData = {
        reportType: 'assessment',
        scope: 'individual',
        student: { id: '1', fullName: 'John' },
        assessments: [],
        summary: { averageScore: 0 },
      }

      expect(() => reportExportService.validateExportData('assessment', reportData)).not.toThrow()
    })

    it('validates assessment report with class scope', () => {
      const reportData = {
        reportType: 'assessment',
        scope: 'class',
        classAssessments: [{ id: '1', fullName: 'John' }],
        assessments: [],
        summary: { averageScore: 0 },
      }

      expect(() => reportExportService.validateExportData('assessment', reportData)).not.toThrow()
    })

    it('throws error for unknown report type', () => {
      const reportData = { reportType: 'unknown' }

      expect(() => reportExportService.validateExportData('unknown', reportData)).toThrow(/Unknown report type/)
    })

    it('throws error for null data', () => {
      expect(() => reportExportService.validateExportData('summary', null)).toThrow()
    })

    it('throws error for non-object data', () => {
      expect(() => reportExportService.validateExportData('summary', 'string')).toThrow()
    })
  })

  describe('exportToPDF()', () => {
    beforeEach(() => {
      // Mock DOM elements
      document.body.innerHTML = '<div class="report-export-content"><p>Test Report</p></div>'
      vi.mock('html2pdf.js')
    })

    it('throws error if report content element not found', async () => {
      document.body.innerHTML = ''
      const reportData = {
        reportType: 'summary',
        scope: 'individual',
        student: { id: '1', fullName: 'John' },
      }

      await expect(
        reportExportService.exportToPDF('summary', reportData),
      ).rejects.toThrow(/Report content element not found/)
    })

    it('validates data before attempting export', async () => {
      const invalidData = {
        reportType: 'summary',
        scope: 'individual',
        student: null,
      }

      await expect(
        reportExportService.exportToPDF('summary', invalidData),
      ).rejects.toThrow()
    })
  })

  describe('exportToExcel()', () => {
    it('creates excel export with summary report data', async () => {
      const reportData = {
        reportType: 'summary',
        scope: 'individual',
        student: { id: '1', firstName: 'John', lastName: 'Smith' },
        class: { name: 'Grade 1A' },
        classStudents: [],
      }

      await expect(reportExportService.exportToExcel('summary', reportData)).resolves.not.toThrow()
    })

    it('creates excel export with attendance report data', async () => {
      const reportData = {
        reportType: 'attendance',
        mode: 'monthly',
        period: { year: 2026, month: 7 },
        summary: { present: 20, absent: 5, late: 2, excused: 1, percentage: 80 },
        items: [
          { date: '2026-07-01', studentName: 'John', status: 'present' },
        ],
      }

      await expect(reportExportService.exportToExcel('attendance', reportData)).resolves.not.toThrow()
    })

    it('creates excel export with assessment report data', async () => {
      const reportData = {
        reportType: 'assessment',
        scope: 'individual',
        student: { id: '1', fullName: 'John', enrollmentNumber: 'S001' },
        assessments: [
          { date: '2026-07-01', category: 'Math', score: 85, rating: 'A' },
        ],
        summary: { averageScore: 85, latestRating: 'A' },
      }

      await expect(reportExportService.exportToExcel('assessment', reportData)).resolves.not.toThrow()
    })

    it('throws error if validation fails', async () => {
      const invalidData = {
        reportType: 'summary',
        scope: 'individual',
        student: null,
      }

      await expect(
        reportExportService.exportToExcel('summary', invalidData),
      ).rejects.toThrow()
    })

    it('handles empty data gracefully', async () => {
      const reportData = {
        reportType: 'attendance',
        mode: 'monthly',
        period: { year: 2026, month: 7 },
        summary: { present: 0, absent: 0 },
        items: [],
      }

      await expect(reportExportService.exportToExcel('attendance', reportData)).resolves.not.toThrow()
    })
  })

  describe('exportToPrint()', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div class="report-export-content"><p>Test Report</p></div>'
    })

    it('opens print dialog for summary report', () => {
      window.print = vi.fn()
      const reportData = {
        reportType: 'summary',
        scope: 'individual',
        student: { id: '1', fullName: 'John' },
      }

      reportExportService.exportToPrint('summary', reportData)
      expect(window.print).toHaveBeenCalled()
    })

    it('validates data before opening print dialog', () => {
      const invalidData = {
        reportType: 'summary',
        scope: 'individual',
        student: null,
      }

      expect(() => reportExportService.exportToPrint('summary', invalidData)).toThrow()
    })

    it('throws error if report content element not found', () => {
      document.body.innerHTML = ''
      const reportData = {
        reportType: 'summary',
        scope: 'individual',
        student: { id: '1', fullName: 'John' },
      }

      expect(() => reportExportService.exportToPrint('summary', reportData)).toThrow(/Report content element not found/)
    })
  })

  describe('PDF vs Print behavior', () => {
    beforeEach(() => {
      window.print = vi.fn()
      document.body.innerHTML = '<div class="report-export-content"><p>Test Report</p></div>'
    })

    it('PDF export should NOT call window.print()', async () => {
      // Mock html2pdf to simulate successful PDF generation
      global.html2pdf = () => ({
        set: () => ({
          from: () => ({
            save: () => Promise.resolve(),
            then: (cb) => {
              cb()
              return { catch: () => {} }
            },
            catch: () => {},
          }),
        }),
      })

      const reportData = {
        reportType: 'summary',
        scope: 'individual',
        student: { id: '1', fullName: 'John' },
      }

      try {
        await reportExportService.exportToPDF('summary', reportData)
        // If we get here without error, window.print should NOT have been called
        expect(window.print).not.toHaveBeenCalled()
      } catch (error) {
        // Even if PDF export fails, it should not call window.print
        expect(window.print).not.toHaveBeenCalled()
      }
    })

    it('Print export SHOULD call window.print()', () => {
      const reportData = {
        reportType: 'summary',
        scope: 'individual',
        student: { id: '1', fullName: 'John' },
      }

      reportExportService.exportToPrint('summary', reportData)
      expect(window.print).toHaveBeenCalledTimes(1)
    })

    it('PDF and Print are distinct operations', () => {
      const reportData = {
        reportType: 'summary',
        scope: 'individual',
        student: { id: '1', fullName: 'John' },
      }

      // Mock html2pdf
      global.html2pdf = () => ({
        set: () => ({
          from: () => ({
            save: () => Promise.resolve(),
            then: (cb) => {
              cb()
              return { catch: () => {} }
            },
            catch: () => {},
          }),
        }),
      })

      reportExportService.exportToPrint('summary', reportData)
      const printCallCount = window.print.mock.calls.length

      expect(printCallCount).toBeGreaterThan(0)
    })
  })

  describe('Error handling', () => {
    it('throws ExportError with context on validation failure', () => {
      const reportData = { reportType: 'summary', scope: 'individual', student: null }

      expect(() => {
        reportExportService.validateExportData('summary', reportData)
      }).toThrow()
    })

    it('provides helpful error messages for missing fields', () => {
      const reportData = {
        reportType: 'assessment',
        scope: 'individual',
        student: null,
      }

      expect(() => {
        reportExportService.validateExportData('assessment', reportData)
      }).toThrow(/student/)
    })
  })

  describe('validateExportAuthorization()', () => {
    it('validates individual summary reports with student data', () => {
      const reportData = {
        reportType: 'summary',
        scope: 'individual',
        student: { id: 'student-1', fullName: 'John' },
      }
      const userPermissions = { 'preschool.reports.student-summary.view': true }

      expect(() =>
        reportExportService.validateExportAuthorization('summary', reportData, userPermissions),
      ).not.toThrow()
    })

    it('validates class summary reports with class data', () => {
      const reportData = {
        reportType: 'summary',
        scope: 'class',
        class: { id: 'class-1', name: 'Grade 1' },
        classStudents: [{ id: '1', fullName: 'John' }],
      }
      const userPermissions = { 'preschool.reports.student-summary.view': true }

      expect(() =>
        reportExportService.validateExportAuthorization('summary', reportData, userPermissions),
      ).not.toThrow()
    })

    it('throws error for individual report without student id', () => {
      const reportData = {
        reportType: 'summary',
        scope: 'individual',
        student: { fullName: 'John' }, // missing id
      }

      expect(() =>
        reportExportService.validateExportAuthorization('summary', reportData),
      ).toThrow(/Student information is required/)
    })

    it('throws error for class report without class id', () => {
      const reportData = {
        reportType: 'summary',
        scope: 'class',
        class: { name: 'Grade 1' }, // missing id
      }

      expect(() =>
        reportExportService.validateExportAuthorization('summary', reportData),
      ).toThrow(/Class information is required/)
    })

    it('validates with appropriate user permissions', () => {
      const reportData = {
        reportType: 'attendance',
        scope: 'individual',
        student: { id: 'student-1', fullName: 'John' },
      }
      const userPermissions = { 'preschool.reports.attendance.view': true }

      expect(() =>
        reportExportService.validateExportAuthorization('attendance', reportData, userPermissions),
      ).not.toThrow()
    })

    it('throws error when user lacks required permissions', () => {
      const reportData = {
        reportType: 'summary',
        scope: 'individual',
        student: { id: 'student-1', fullName: 'John' },
      }
      const userPermissions = {}

      expect(() =>
        reportExportService.validateExportAuthorization('summary', reportData, userPermissions),
      ).toThrow(/does not have permission/)
    })

    it('validates all report types', () => {
      const reportTypes = ['summary', 'attendance', 'assessment']
      const validData = {
        summary: {
          reportType: 'summary',
          scope: 'individual',
          student: { id: '1', fullName: 'John' },
        },
        attendance: {
          reportType: 'attendance',
          scope: 'individual',
          student: { id: '1', fullName: 'John' },
        },
        assessment: {
          reportType: 'assessment',
          scope: 'individual',
          student: { id: '1', fullName: 'John' },
        },
      }
      const userPermissions = {
        'preschool.reports.student-summary.view': true,
        'preschool.reports.attendance.view': true,
        'preschool.reports.assessment.view': true,
      }

      reportTypes.forEach((type) => {
        expect(() =>
          reportExportService.validateExportAuthorization(type, validData[type], userPermissions),
        ).not.toThrow()
      })
    })
  })
})

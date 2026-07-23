import html2pdf from 'html2pdf.js'

// Lazy load XLSX to reduce bundle size
let XLSX

async function loadXLSX() {
  if (!XLSX) {
    XLSX = await import('xlsx')
  }
  return XLSX
}

class ExportError extends Error {
  constructor(message, reportType, context = {}) {
    super(message)
    this.name = 'ExportError'
    this.reportType = reportType
    this.context = context
  }
}

class AuthorizationError extends Error {
  constructor(message, reportType, context = {}) {
    super(message)
    this.name = 'AuthorizationError'
    this.reportType = reportType
    this.context = context
  }
}

export const reportExportService = {
  /**
   * Export report to PDF using html2pdf.js
   * Captures DOM element and converts to PDF
   */
  async exportToPDF(reportType, reportData, options = {}) {
    try {
      this.validateExportData(reportType, reportData)

      const element = document.querySelector('.report-export-content')
      if (!element) {
        throw new ExportError(
          'Report content element not found. Please regenerate the report.',
          reportType,
          { elementClass: '.report-export-content' },
        )
      }

      if (!element.offsetHeight) {
        throw new ExportError(
          'Report content is not visible. Please ensure the report is fully loaded.',
          reportType,
          { elementHeight: element.offsetHeight },
        )
      }

      const filename = options.filename || this.generateFilename(reportType, reportData)
      const orientation = options.orientation || 'portrait'
      const margin = options.margin || [25.4, 25.4, 25.4, 25.4]

      // Clone element and remove unsupported CSS colors for html2pdf compatibility
      const clonedElement = element.cloneNode(true)
      this._stripUnsupportedCSSFromElement(clonedElement)

      const pdfOptions = {
        margin,
        filename: `${filename}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff',
          ignoreElements: (element) => {
            return element.classList && element.classList.contains('no-print')
          }
        },
        jsPDF: { orientation, unit: 'mm', format: 'a4' },
      }

      html2pdf()
        .set(pdfOptions)
        .from(clonedElement)
        .save()
    } catch (error) {
      if (error instanceof ExportError) {
        throw error
      }
      throw new ExportError(`Failed to export PDF: ${error.message}`, reportType, { originalError: error })
    }
  },

  /**
   * Strip unsupported CSS color functions (like oklch) from element for html2pdf compatibility
   */
  _stripUnsupportedCSSFromElement(element) {
    // Add a style tag with CSS that overrides oklch colors
    const styleTag = document.createElement('style')
    styleTag.textContent = `
      * {
        color: black !important;
        background-color: transparent !important;
        border-color: #ccc !important;
      }
      [style*="oklch"] {
        color: black !important;
      }
    `
    element.insertBefore(styleTag, element.firstChild)

    const walk = (el) => {
      if (el.style) {
        // Remove oklch colors from inline styles
        if (el.style.color && el.style.color.includes('oklch')) {
          el.style.color = '#000'
        }
        if (el.style.backgroundColor && el.style.backgroundColor.includes('oklch')) {
          el.style.backgroundColor = 'transparent'
        }
        if (el.style.borderColor && el.style.borderColor.includes('oklch')) {
          el.style.borderColor = '#ccc'
        }
      }

      // Walk through children
      for (let child of el.childNodes) {
        if (child.nodeType === 1) { // Element node
          walk(child)
        }
      }
    }

    walk(element)
  },

  /**
   * Export report to Excel using XLSX library
   * Creates multi-sheet workbook based on report type
   */
  async exportToExcel(reportType, reportData, options = {}) {
    try {
      this.validateExportData(reportType, reportData)

      const lib = await loadXLSX()
      const filename = options.filename || this.generateFilename(reportType, reportData)
      const workbook = lib.utils.book_new()

      // Generate sheets based on report type
      if (reportType === 'summary') {
        this._buildSummarySheets(workbook, reportData, lib)
      } else if (reportType === 'attendance') {
        this._buildAttendanceSheets(workbook, reportData, lib)
      } else if (reportType === 'assessment') {
        this._buildAssessmentSheets(workbook, reportData, lib)
      }

      lib.writeFile(workbook, `${filename}.xlsx`)
    } catch (error) {
      if (error instanceof ExportError) {
        throw error
      }
      throw new ExportError(`Failed to export Excel: ${error.message}`, reportType, { originalError: error })
    }
  },

  /**
   * Export report to print using browser print dialog
   * Styled by print.css media query
   */
  exportToPrint(reportType, reportData) {
    try {
      this.validateExportData(reportType, reportData)
      window.print()
    } catch (error) {
      if (error instanceof ExportError) {
        throw error
      }
      throw new ExportError(`Failed to open print dialog: ${error.message}`, reportType)
    }
  },

  /**
   * Generate filename based on report type and data
   * Format: [ReportType]-[Scope]-[StudentName]-[YYYY-MM-DD]
   */
  generateFilename(reportType, reportData) {
    try {
      let scope = 'Unknown'
      let studentName = 'Report'

      if (reportType === 'summary') {
        scope = reportData.scope === 'class' ? 'Class' : 'Individual'
        if (reportData.scope === 'individual' && reportData.student?.fullName) {
          studentName = reportData.student.fullName
        } else if (reportData.scope === 'class' && reportData.class?.name) {
          studentName = reportData.class.name
        }
      } else if (reportType === 'attendance') {
        scope = reportData.mode === 'monthly' ? 'Monthly' : 'Yearly'
        studentName = reportData.class?.name || 'Attendance'
      } else if (reportType === 'assessment') {
        scope = reportData.scope === 'class' ? 'Class' : 'Individual'
        if (reportData.scope === 'individual' && reportData.student?.fullName) {
          studentName = reportData.student.fullName
        } else if (reportData.scope === 'class' && reportData.class?.name) {
          studentName = reportData.class.name
        }
      }

      const reportTypeLabel = {
        summary: 'StudentSummaryReport',
        attendance: 'AttendanceReport',
        assessment: 'AssessmentReport',
      }[reportType] || 'Report'

      const date = new Date().toISOString().split('T')[0]
      const sanitized = this.sanitizeFilename(studentName)

      return `${reportTypeLabel}-${scope}-${sanitized}-${date}`
    } catch (error) {
      console.error('Error generating filename:', error)
      return `Report-${new Date().toISOString().split('T')[0]}`
    }
  },

  /**
   * Sanitize filename - remove illegal characters
   */
  sanitizeFilename(filename) {
    if (!filename || typeof filename !== 'string') {
      return 'Report'
    }

    return filename
      .replace(/[<>:"/\\|?*]/g, '-') // Remove illegal characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
      .slice(0, 100) // Max 100 chars for name part
  },

  /**
   * Validate export data structure based on report type
   */
  validateExportData(reportType, reportData) {
    if (!reportData || typeof reportData !== 'object') {
      throw new ExportError('Report data is required and must be an object', reportType)
    }

    if (reportType === 'summary') {
      this._validateSummaryData(reportData)
    } else if (reportType === 'attendance') {
      this._validateAttendanceData(reportData)
    } else if (reportType === 'assessment') {
      this._validateAssessmentData(reportData)
    } else {
      throw new ExportError(`Unknown report type: ${reportType}`, reportType)
    }
  },

  /**
   * Validate user has permission to export the requested report
   * Checks scope and data access restrictions
   */
  validateExportAuthorization(reportType, reportData, userPermissions = {}) {
    if (!reportData || typeof reportData !== 'object') {
      throw new AuthorizationError('Report data is required', reportType)
    }

    // For individual-scope reports, verify student data is present
    if (reportData.scope === 'individual') {
      if (!reportData.student || !reportData.student.id) {
        throw new AuthorizationError(
          'Student information is required for individual scope reports',
          reportType,
          { scope: 'individual' },
        )
      }
    }

    // For class-scope reports, verify class data is present
    if (reportData.scope === 'class') {
      if (!reportData.class || !reportData.class.id) {
        throw new AuthorizationError(
          'Class information is required for class scope reports',
          reportType,
          { scope: 'class' },
        )
      }
    }

    // Verify user has appropriate permissions based on report type
    const requiredPermissions = {
      summary: ['preschool.reports.student-summary.view'],
      attendance: ['preschool.reports.attendance.view'],
      assessment: ['preschool.reports.assessment.view'],
    }

    const required = requiredPermissions[reportType] || []
    const hasRequiredPermission = required.length === 0 || required.some((perm) => userPermissions[perm])

    if (!hasRequiredPermission) {
      throw new AuthorizationError(
        `User does not have permission to export ${reportType} reports`,
        reportType,
        { requiredPermissions: required },
      )
    }

    return true
  },

  /**
   * Build summary report sheets
   */
  _buildSummarySheets(workbook, reportData, XLSX) {
    // Sheet 1: Report Info (Metadata)
    const metaData = [['Student Summary Report'], ['Generated On', new Date().toLocaleString()]]

    if (reportData.scope === 'individual') {
      metaData.push(['Type', 'Individual'])
      if (reportData.student?.fullName) {
        metaData.push(['Student', reportData.student.fullName])
      }
    } else {
      metaData.push(['Type', 'Class'])
      if (reportData.class?.name) {
        metaData.push(['Class', reportData.class.name])
      }
    }

    const metaSheet = XLSX.utils.aoa_to_sheet(metaData)
    XLSX.utils.book_append_sheet(workbook, metaSheet, 'Report Info')

    // Sheet 2: Student Info (if individual)
    if (reportData.scope === 'individual' && reportData.student) {
      const studentInfo = [
        ['Field', 'Value'],
        ['First Name', reportData.student.firstName || ''],
        ['Last Name', reportData.student.lastName || ''],
        ['Full Name', reportData.student.fullName || ''],
        ['Enrollment Number', reportData.student.enrollmentNumber || ''],
        ['Date of Birth', reportData.student.dateOfBirth || ''],
        ['Student Code', reportData.student.studentCode || ''],
      ]
      const studentSheet = XLSX.utils.aoa_to_sheet(studentInfo)
      XLSX.utils.book_append_sheet(workbook, studentSheet, 'Student Info')
    }
    // Note: XLSX used in remaining sheets throughout this method

    // Sheet 3: Attendance Summary
    if (reportData.attendance) {
      const attendanceData = [
        ['Metric', 'Value'],
        ['Total Days', reportData.attendance.totalDays || 0],
        ['Present Days', reportData.attendance.presentDays || 0],
        ['Absent Days', reportData.attendance.absentDays || 0],
        ['Attendance Rate', `${reportData.attendance.attendanceRate || 0}%`],
      ]
      const attendanceSheet = XLSX.utils.aoa_to_sheet(attendanceData)
      XLSX.utils.book_append_sheet(workbook, attendanceSheet, 'Attendance')
    }

    // Sheet 4: Class Students (if class report)
    if (reportData.scope === 'class' && reportData.classStudents?.length > 0) {
      const studentList = [['Student Name', 'Attendance Rate', 'Assessment Score']]
      reportData.classStudents.forEach((student) => {
        studentList.push([
          student.fullName || student.name || '',
          `${student.attendancePercentage || 0}%`,
          student.assessmentScore || '',
        ])
      })
      const classSheet = XLSX.utils.aoa_to_sheet(studentList)
      XLSX.utils.book_append_sheet(workbook, classSheet, 'Class Students')
    }
  },

  /**
   * Build attendance report sheets
   */
  _buildAttendanceSheets(workbook, reportData, XLSX) {
    // Sheet 1: Summary
    const summaryData = [
      ['Attendance Summary'],
      ['Period', reportData.mode === 'monthly' ? `${reportData.period.month}/${reportData.period.year}` : reportData.period.year],
      [''],
      ['Metric', 'Count'],
      ['Present', reportData.summary?.present || 0],
      ['Absent', reportData.summary?.absent || 0],
      ['Late', reportData.summary?.late || 0],
      ['Excused', reportData.summary?.excused || 0],
      ['Attendance Percentage', `${reportData.summary?.percentage || 0}%`],
    ]
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

    // Sheet 2: Monthly Breakdown (if yearly mode and data available)
    if (reportData.monthlyBreakdown?.length > 0) {
      const monthlyData = [['Month', 'Present', 'Absent', 'Late', 'Excused']]
      reportData.monthlyBreakdown.forEach((month) => {
        monthlyData.push([
          `Month ${month.month}`,
          month.present || 0,
          month.absent || 0,
          month.late || 0,
          month.excused || 0,
        ])
      })
      const monthlySheet = XLSX.utils.aoa_to_sheet(monthlyData)
      XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Monthly')
    }

    // Sheet 3: Attendance Records
    if (reportData.items?.length > 0) {
      const recordsData = [['Date', 'Student', 'Status', 'Notes']]
      reportData.items.forEach((item) => {
        recordsData.push([item.date || '', item.studentName || '', item.status || '', item.notes || ''])
      })
      const recordsSheet = XLSX.utils.aoa_to_sheet(recordsData)
      XLSX.utils.book_append_sheet(workbook, recordsSheet, 'Records')
    }
  },

  /**
   * Build assessment report sheets
   */
  _buildAssessmentSheets(workbook, reportData, XLSX) {
    if (reportData.scope === 'individual') {
      // Sheet 1: Student Info
      if (reportData.student) {
        const studentInfo = [
          ['Field', 'Value'],
          ['Full Name', reportData.student.fullName || ''],
          ['Enrollment Number', reportData.student.enrollmentNumber || ''],
          ['Date of Birth', reportData.student.dateOfBirth || ''],
        ]
        const studentSheet = XLSX.utils.aoa_to_sheet(studentInfo)
        XLSX.utils.book_append_sheet(workbook, studentSheet, 'Student Info')
      }

      // Sheet 2: Summary Metrics
      const summaryData = [
        ['Assessment Summary'],
        [''],
        ['Metric', 'Value'],
        ['Average Score', reportData.summary?.averageScore || 0],
        ['Latest Rating', reportData.summary?.latestRating || ''],
        ['Trend', reportData.summary?.trend || ''],
      ]
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

      // Sheet 3: Assessment History
      if (reportData.assessments?.length > 0) {
        const historyData = [['Date', 'Category', 'Score', 'Rating', 'Comments']]
        reportData.assessments.forEach((assessment) => {
          historyData.push([
            assessment.date || '',
            assessment.category || '',
            assessment.score || '',
            assessment.rating || '',
            assessment.comments || '',
          ])
        })
        const historySheet = XLSX.utils.aoa_to_sheet(historyData)
        XLSX.utils.book_append_sheet(workbook, historySheet, 'History')
      }
    } else if (reportData.scope === 'class') {
      // Sheet 1: Class Summary
      const classData = [
        ['Class Assessment Summary'],
        ['Class', reportData.class?.name || ''],
        [''],
        ['Metric', 'Value'],
        ['Class Average Score', reportData.summary?.averageScore || 0],
        ['Class Average Rating', reportData.summary?.latestRating || ''],
      ]
      const classSheet = XLSX.utils.aoa_to_sheet(classData)
      XLSX.utils.book_append_sheet(workbook, classSheet, 'Class Summary')

      // Sheet 2: Student Assessment Results
      if (reportData.classAssessments?.length > 0) {
        const resultsData = [['Student Name', 'Average Score', 'Latest Rating', 'Assessment Count']]
        reportData.classAssessments.forEach((student) => {
          resultsData.push([
            student.fullName || student.name || '',
            student.averageScore || 0,
            student.latestRating || '',
            student.assessmentCount || 0,
          ])
        })
        const resultsSheet = XLSX.utils.aoa_to_sheet(resultsData)
        XLSX.utils.book_append_sheet(workbook, resultsSheet, 'Student Results')
      }
    }
  },

  /**
   * Validate summary report data
   */
  _validateSummaryData(reportData) {
    if (!reportData.scope) {
      throw new ExportError('Summary report must have scope (individual or class)', 'summary')
    }

    if (reportData.scope === 'individual') {
      if (!reportData.student) {
        throw new ExportError('Individual summary report requires student data', 'summary')
      }
      if (!reportData.student.id) {
        throw new ExportError('Student data must include id field', 'summary')
      }
    } else if (reportData.scope === 'class') {
      if (!reportData.classStudents || !Array.isArray(reportData.classStudents) || reportData.classStudents.length === 0) {
        throw new ExportError('Class summary report requires classStudents array', 'summary')
      }
    }
  },

  /**
   * Validate attendance report data
   */
  _validateAttendanceData(reportData) {
    if (!reportData.mode) {
      throw new ExportError('Attendance report must have mode (monthly or yearly)', 'attendance')
    }

    if (!reportData.period) {
      throw new ExportError('Attendance report must have period data', 'attendance')
    }

    if (!reportData.summary) {
      throw new ExportError('Attendance report must have summary data', 'attendance')
    }
  },

  /**
   * Validate assessment report data
   */
  _validateAssessmentData(reportData) {
    if (!reportData.scope) {
      throw new ExportError('Assessment report must have scope (individual or class)', 'assessment')
    }

    if (reportData.scope === 'individual') {
      if (!reportData.student) {
        throw new ExportError('Individual assessment report requires student data', 'assessment')
      }
      if (!reportData.student.id) {
        throw new ExportError('Student data must include id field', 'assessment')
      }
    } else if (reportData.scope === 'class') {
      if (!reportData.classAssessments || !Array.isArray(reportData.classAssessments)) {
        throw new ExportError('Class assessment report requires classAssessments array', 'assessment')
      }
    }

    if (!reportData.assessments || !Array.isArray(reportData.assessments)) {
      throw new ExportError('Assessment report must have assessments array', 'assessment')
    }

    if (!reportData.summary) {
      throw new ExportError('Assessment report must have summary data', 'assessment')
    }
  },
}

export { AuthorizationError, ExportError }

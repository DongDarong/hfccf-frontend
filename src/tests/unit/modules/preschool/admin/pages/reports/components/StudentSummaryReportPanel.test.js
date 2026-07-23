import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enPreschool from '@/i18n/en/preschool'
import StudentSummaryReportPanel from '@/modules/preschool/admin/pages/reports/components/StudentSummaryReportPanel.vue'
import * as preschoolApi from '@/modules/preschool/services/preschoolApi'
import * as lifecycleApi from '@/modules/preschool/services/api/preschoolAcademicLifecycleApi'
import * as reportsApi from '@/modules/preschool/services/api/preschoolReportsApi'

vi.mock('@/modules/preschool/services/preschoolApi', () => ({
  fetchPreschoolClasses: vi.fn(),
  fetchPreschoolStudents: vi.fn(),
  fetchPreschoolStudent: vi.fn(),
  fetchPreschoolAttendance: vi.fn(),
}))

vi.mock('@/modules/preschool/services/api/preschoolAcademicLifecycleApi', () => ({
  fetchAcademicLifecycle: vi.fn(),
}))

vi.mock('@/modules/preschool/services/api/preschoolReportsApi', () => ({
  downloadStudentSummaryReportPdf: vi.fn(),
}))

function createWrapper() {
  return mountWithPlugins(StudentSummaryReportPanel, {
    messages: { en: enPreschool },
    attachTo: document.body,
    global: {
      stubs: {
        Button: {
          emits: ['click'],
          template: '<button type="button" @click="$emit(\'click\')"><slot /></button>',
        },
        StudentIdentityCard: { template: '<div data-testid="student-identity-card" />' },
        StudentAttendanceSummary: { template: '<div data-testid="student-attendance-summary" />' },
        ClassSummaryTable: { template: '<div data-testid="class-summary-table" />' },
      },
    },
  })
}

async function prepareIndividualReport(wrapper) {
  wrapper.vm.scopeType = 'individual'
  wrapper.vm.academicYearId = 1
  wrapper.vm.classId = 'class-1'
  wrapper.vm.studentId = 'student-1'
  wrapper.vm.reportGenerated = true
  wrapper.vm.reportData = {
    student: {
      id: 'student-1',
      fullName: 'Sokha Chan',
      firstName: 'Sokha',
      lastName: 'Chan',
      studentCode: 'P001',
      publicId: 'P001',
      classes: [{ id: 'class-1', name: 'Preschool-A', academicYear: 'Academic Year 2026' }],
      status: 'active',
      gender: 'Female',
      dateOfBirth: '2020-01-02',
      nationality: 'Cambodian',
    },
    attendance: {
      items: [{ status: 'present' }],
      total: 1,
    },
    classStudents: [],
  }

  await wrapper.vm.$nextTick()
  await flushPromises()
}

async function prepareClassReport(wrapper) {
  wrapper.vm.scopeType = 'class'
  wrapper.vm.academicYearId = 1
  wrapper.vm.classId = 'class-1'
  wrapper.vm.studentId = 'student-1'
  wrapper.vm.reportGenerated = true
  wrapper.vm.reportData = {
    student: null,
    attendance: null,
    classStudents: [
      {
        student: {
          id: 'student-1',
          fullName: 'Sokha Chan',
          firstName: 'Sokha',
          studentCode: 'P001',
          publicId: 'P001',
          classes: [{ id: 'class-1', name: 'Preschool-A' }],
          status: 'active',
          gender: 'Female',
        },
        attendancePercentage: 100,
      },
    ],
  }

  await wrapper.vm.$nextTick()
  await flushPromises()
}

describe('StudentSummaryReportPanel PDF export', () => {
  let realCreateElement
  let createElementSpy
  let clickedDownloads
  let createObjectURLMock
  let revokeObjectURLMock

  beforeEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
    vi.useFakeTimers()
    clickedDownloads = []
    createObjectURLMock = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:student-summary-pdf')
    revokeObjectURLMock = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

    realCreateElement = document.createElement.bind(document)
    createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName, options) => {
      const element = realCreateElement(tagName, options)
      if (String(tagName).toLowerCase() === 'a') {
        vi.spyOn(element, 'click').mockImplementation(() => {
          clickedDownloads.push({
            href: element.href,
            download: element.download,
            isConnected: element.isConnected,
          })
        })
      }
      return element
    })

    lifecycleApi.fetchAcademicLifecycle.mockResolvedValue({
      academicYears: [{ id: 1, code: 'AY2026', label: 'Academic Year 2026' }],
    })
    preschoolApi.fetchPreschoolClasses.mockResolvedValue({
      items: [{ id: 'class-1', name: 'Preschool-A' }],
    })
    preschoolApi.fetchPreschoolStudents.mockResolvedValue({
      items: [{ id: 'student-1', fullName: 'Sokha Chan', studentCode: 'P001', publicId: 'P001' }],
    })
    preschoolApi.fetchPreschoolStudent.mockResolvedValue({
      id: 'student-1',
      fullName: 'Sokha Chan',
      firstName: 'Sokha',
      lastName: 'Chan',
      studentCode: 'P001',
      publicId: 'P001',
      classes: [{ id: 'class-1', name: 'Preschool-A', academicYear: 'Academic Year 2026' }],
      status: 'active',
      gender: 'Female',
      dateOfBirth: '2020-01-02',
      nationality: 'Cambodian',
    })
    preschoolApi.fetchPreschoolAttendance.mockResolvedValue({
      items: [{ status: 'present' }],
      total: 1,
    })
    reportsApi.downloadStudentSummaryReportPdf.mockResolvedValue({
      blob: new Blob(['student-summary-pdf'], { type: 'application/pdf' }),
      filename: 'StudentSummaryReport_Individual_2026-07-24.pdf',
      mimeType: 'application/pdf',
    })
    document.body.innerHTML = ''
  })

  afterEach(() => {
    createElementSpy?.mockRestore()
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('downloads the individual summary from the backend PDF endpoint without mutating the live DOM', async () => {
    window.print = vi.fn()

    const wrapper = createWrapper()
    await flushPromises()
    await prepareIndividualReport(wrapper)

    const liveRoot = document.querySelector('.preschool-student-summary-report-content')
    expect(liveRoot).not.toBeNull()
    const liveRootHtmlBefore = liveRoot.outerHTML

    const pdfButton = wrapper.findAll('button').find(button => button.text().includes('PDF'))
    await pdfButton.trigger('click')
    await flushPromises()

    expect(window.print).not.toHaveBeenCalled()
    expect(reportsApi.downloadStudentSummaryReportPdf).toHaveBeenCalledWith({
      mode: 'individual',
      academicYearId: 1,
      classId: 'class-1',
      studentId: 'student-1',
      filename: expect.stringMatching(/^StudentSummaryReport_Individual_\d{4}-\d{2}-\d{2}\.pdf$/),
    })
    expect(createObjectURLMock).toHaveBeenCalledWith(expect.any(Blob))
    expect(clickedDownloads).toEqual([
      {
        href: 'blob:student-summary-pdf',
        download: 'StudentSummaryReport_Individual_2026-07-24.pdf',
        isConnected: true,
      },
    ])
    expect(document.querySelector('a[download]')).toBeNull()
    expect(document.querySelector('iframe[aria-hidden="true"]')).toBeNull()
    vi.runOnlyPendingTimers()
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:student-summary-pdf')
    expect(liveRoot.isConnected).toBe(true)
    expect(liveRoot.outerHTML).toBe(liveRootHtmlBefore)
  })

  it('downloads the class summary without sending an individual student id', async () => {
    window.print = vi.fn()
    reportsApi.downloadStudentSummaryReportPdf.mockResolvedValueOnce({
      blob: new Blob(['student-summary-class-pdf'], { type: 'application/pdf' }),
      filename: 'StudentSummaryReport_Class_2026-07-24.pdf',
      mimeType: 'application/pdf',
    })

    const wrapper = createWrapper()
    await flushPromises()
    await prepareClassReport(wrapper)

    const pdfButton = wrapper.findAll('button').find(button => button.text().includes('PDF'))
    await pdfButton.trigger('click')
    await flushPromises()

    expect(window.print).not.toHaveBeenCalled()
    expect(reportsApi.downloadStudentSummaryReportPdf).toHaveBeenCalledWith({
      mode: 'class',
      academicYearId: 1,
      classId: 'class-1',
      studentId: 'student-1',
      filename: expect.stringMatching(/^StudentSummaryReport_Class_\d{4}-\d{2}-\d{2}\.pdf$/),
    })
    expect(clickedDownloads[0].download).toBe('StudentSummaryReport_Class_2026-07-24.pdf')
    expect(document.querySelector('iframe[aria-hidden="true"]')).toBeNull()
  })

  it('reports a controlled error when the backend returns an empty PDF blob', async () => {
    window.print = vi.fn()
    reportsApi.downloadStudentSummaryReportPdf.mockResolvedValueOnce({
      blob: new Blob([], { type: 'application/pdf' }),
      filename: 'StudentSummaryReport_Individual_2026-07-24.pdf',
      mimeType: 'application/pdf',
    })

    const wrapper = createWrapper()
    await flushPromises()
    await prepareIndividualReport(wrapper)

    const pdfButton = wrapper.findAll('button').find(button => button.text().includes('PDF'))
    await pdfButton.trigger('click')
    await flushPromises()

    expect(window.print).not.toHaveBeenCalled()
    expect(createObjectURLMock).not.toHaveBeenCalled()
    expect(clickedDownloads).toEqual([])
    expect(document.querySelector('a[download]')).toBeNull()
    expect(document.querySelector('iframe[aria-hidden="true"]')).toBeNull()
    expect(wrapper.vm.errorMessage).toBe('Failed to export report')
  })
})

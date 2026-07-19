<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Select from 'primevue/select'
import html2pdf from 'html2pdf.js'
import * as XLSX from 'xlsx'
import { useLanguage } from '@/composables/useLanguage'
import {
  fetchPreschoolClasses,
  fetchPreschoolStudents,
  fetchPreschoolStudent,
} from '@/modules/preschool/services/preschoolApi'
import { fetchStudentAssessments } from '@/modules/preschool/services/api/preschoolAssessmentApi'
import { fetchAcademicLifecycle } from '@/modules/preschool/services/api/preschoolAcademicLifecycleApi'
import { fetchAllPages } from './reportPaginationHelper'
import StudentAssessmentDetails from './components/StudentAssessmentDetails.vue'
import ClassAssessmentTable from './components/ClassAssessmentTable.vue'
import ReportSwitcher from './components/ReportSwitcher.vue'

defineOptions({
  name: 'AssessmentReportPage',
})

const { t } = useLanguage()
const router = useRouter()

const loading = ref(false)
const reportGenerated = ref(false)
const errorMessage = ref('')
const exportLoading = ref(false)
const scopeType = ref('individual')
const academicYearId = ref('')
const classId = ref('')
const studentId = ref('')
const categoryId = ref('')
const assessmentStatus = ref('')

const filterOptions = ref({
  academicYears: [],
  classes: [],
  students: [],
  categories: [],
  statuses: [],
})

const reportData = ref({
  student: null,
  assessments: [],
  classStudents: [],
})

const assessmentStatuses = computed(() => [
  { label: t('preschoolAssessmentReportPage.statuses.all') || 'All', value: '' },
  { label: t('preschoolAssessmentReportPage.statuses.draft') || 'Draft', value: 'draft' },
  { label: t('preschoolAssessmentReportPage.statuses.finalized') || 'Finalized', value: 'finalized' },
  { label: t('preschoolAssessmentReportPage.statuses.archived') || 'Archived', value: 'archived' },
])

const canGenerate = computed(() => {
  return academicYearId.value && classId.value && (
    scopeType.value === 'class' ? true : studentId.value
  )
})

async function loadFilterOptions() {
  try {
    const [lifecycle, classes] = await Promise.all([
      fetchAcademicLifecycle(),
      fetchPreschoolClasses(),
    ])

    filterOptions.value.academicYears = (lifecycle.academicYears || []).map(ay => ({
      label: ay.label || ay.code,
      value: ay.id,
    }))

    if (filterOptions.value.academicYears.length > 0) {
      academicYearId.value = filterOptions.value.academicYears[0].value
    }

    filterOptions.value.classes = (classes.items || []).map(c => ({
      label: c.name,
      value: c.id,
    }))

    if (filterOptions.value.classes.length > 0) {
      classId.value = filterOptions.value.classes[0].value
      await loadStudents()
      await loadCategories()
    }

    // Load assessment statuses from i18n
    filterOptions.value.statuses = assessmentStatuses.value
  } catch {
    errorMessage.value = t('preschoolAssessmentReportPage.messages.loadFailed') || 'Failed to load filters'
  }
}

async function loadStudents() {
  if (!classId.value) {
    filterOptions.value.students = []
    return
  }

  try {
    const students = await fetchPreschoolStudents({ classId: classId.value, perPage: 100 })
    filterOptions.value.students = (students.items || []).map(s => ({
      label: `${s.fullName} (${s.studentCode || s.publicId})`,
      value: s.id,
    }))

    if (filterOptions.value.students.length > 0 && !studentId.value) {
      studentId.value = filterOptions.value.students[0].value
    }
  } catch {
    filterOptions.value.students = []
  }
}

async function loadCategories() {
  try {
    // Load categories - using a placeholder for now
    // In future, could fetch from assessment categories API
    filterOptions.value.categories = [
      { label: t('preschoolAssessmentReportPage.categories.all') || 'All Categories', value: '' },
      { label: 'Mathematics', value: 'math' },
      { label: 'Language', value: 'language' },
      { label: 'Science', value: 'science' },
      { label: 'Social Studies', value: 'social' },
    ]

    if (categoryId.value === '') {
      categoryId.value = ''
    }
  } catch {
    filterOptions.value.categories = []
  }
}

async function generateIndividualReport() {
  if (!studentId.value || !classId.value) {
    errorMessage.value = 'Please select both student and class'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const [studentData, assessmentsData] = await Promise.all([
      fetchPreschoolStudent(studentId.value),
      fetchAllPages(fetchStudentAssessments, {
        studentId: studentId.value,
      }),
    ])

    let assessments = assessmentsData.items || []

    // Filter by category if selected
    if (categoryId.value) {
      assessments = assessments.filter(a =>
        (a.category?.id === categoryId.value || a.categoryId === categoryId.value)
      )
    }

    // Filter by status if selected
    if (assessmentStatus.value) {
      assessments = assessments.filter(a => a.status === assessmentStatus.value)
    }

    reportData.value = {
      student: studentData,
      assessments: assessments.sort((a, b) =>
        new Date(b.assessment_date || b.assessmentDate) - new Date(a.assessment_date || a.assessmentDate)
      ),
      classStudents: [],
    }

    reportGenerated.value = true
  } catch (error) {
    errorMessage.value = error?.message || 'Failed to generate report'
  } finally {
    loading.value = false
  }
}

async function generateClassReport() {
  if (!classId.value) {
    errorMessage.value = 'Please select a class'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const studentsData = await fetchPreschoolStudents({ classId: classId.value, perPage: 1000 })

    const classStudents = []
    for (const student of (studentsData.items || [])) {
      const assessmentsData = await fetchAllPages(fetchStudentAssessments, {
        studentId: student.id,
      })

      let assessments = assessmentsData.items || []

      // Filter by category if selected
      if (categoryId.value) {
        assessments = assessments.filter(a =>
          (a.category?.id === categoryId.value || a.categoryId === categoryId.value)
        )
      }

      // Filter by status if selected
      if (assessmentStatus.value) {
        assessments = assessments.filter(a => a.status === assessmentStatus.value)
      }

      classStudents.push({
        student,
        assessments: assessments.sort((a, b) =>
          new Date(b.assessment_date || b.assessmentDate) - new Date(a.assessment_date || a.assessmentDate)
        ),
      })
    }

    reportData.value = {
      student: null,
      assessments: [],
      classStudents,
    }

    reportGenerated.value = true
  } catch (error) {
    errorMessage.value = error?.message || 'Failed to generate class report'
  } finally {
    loading.value = false
  }
}

function generateReport() {
  if (scopeType.value === 'individual') {
    generateIndividualReport()
  } else {
    generateClassReport()
  }
}

function resetFilters() {
  scopeType.value = 'individual'
  studentId.value = filterOptions.value.students[0]?.value || ''
  categoryId.value = ''
  assessmentStatus.value = ''
  reportGenerated.value = false
  reportData.value = {
    student: null,
    assessments: [],
    classStudents: [],
  }
}

function backToReports() {
  router.push({ name: 'dashboard-preschool-admin-reports' })
}

async function exportReport(format) {
  try {
    exportLoading.value = true

    const timestamp = new Date().toISOString().split('T')[0]
    const reportTypeLabel = scopeType.value === 'individual' ? 'Individual' : 'Class'
    const filename = `AssessmentReport_${reportTypeLabel}_${timestamp}`

    if (format === 'pdf') {
      await exportToPdf(filename)
    } else if (format === 'excel') {
      exportToExcel(filename)
    } else if (format === 'print') {
      window.print()
    }
  } catch (error) {
    errorMessage.value = 'Failed to export report'
    console.error('Error exporting report:', error)
  } finally {
    exportLoading.value = false
  }
}

async function exportToPdf(filename) {
  const element = document.querySelector('.preschool-assessment-report-content')
  if (!element) {
    throw new Error('Report content not found')
  }

  const options = {
    margin: 10,
    filename: `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
  }

  await html2pdf().set(options).from(element).save()
}

function exportToExcel(filename) {
  const workbook = XLSX.utils.book_new()

  // Metadata
  const metaData = [
    ['Assessment Report'],
    ['Type', scopeType.value === 'individual' ? 'Individual' : 'Class'],
    ['Generated On', new Date().toLocaleString()],
    ['Academic Year', filterOptions.value.academicYears.find(y => y.value === academicYearId.value)?.label || 'All'],
  ]

  if (scopeType.value === 'individual') {
    metaData.push(['Student', reportData.value.student?.firstName + ' ' + reportData.value.student?.lastName || 'N/A'])
  } else {
    metaData.push(['Class', filterOptions.value.classes.find(c => c.value === classId.value)?.label || 'All Classes'])
  }

  const metaSheet = XLSX.utils.aoa_to_sheet(metaData)
  XLSX.utils.book_append_sheet(workbook, metaSheet, 'Report Info')

  // Assessments
  if (reportData.value.assessments.length > 0) {
    const assessmentData = reportData.value.assessments.map(a => [
      a.title || '',
      a.category || '',
      a.status || '',
      a.date || '',
      a.score !== undefined ? a.score : '',
    ])
    assessmentData.unshift(['Title', 'Category', 'Status', 'Date', 'Score'])
    const assessmentSheet = XLSX.utils.aoa_to_sheet(assessmentData)
    XLSX.utils.book_append_sheet(workbook, assessmentSheet, 'Assessments')
  }

  // Class students (if class-level report)
  if (scopeType.value === 'class' && reportData.value.classStudents.length > 0) {
    const studentData = reportData.value.classStudents.map(s => [
      s.firstName || '',
      s.lastName || '',
      s.enrollmentNumber || '',
    ])
    studentData.unshift(['First Name', 'Last Name', 'Enrollment Number'])
    const studentSheet = XLSX.utils.aoa_to_sheet(studentData)
    XLSX.utils.book_append_sheet(workbook, studentSheet, 'Students')
  }

  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

onMounted(() => {
  loadFilterOptions()
})
</script>

<template>
  <MainLayout>
    <section class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <HeaderSection
          :title="t('preschoolAssessmentReportPage.title') || 'Assessment Report'"
          :subtitle="t('preschoolAssessmentReportPage.subtitle') || 'Individual and class assessment reports'"
        />
        <Button
          type="button"
          variant="ghost"
          size="md"
          rounded="lg"
          @click="backToReports"
          class="flex items-center gap-2"
        >
          <i class="pi pi-chevron-left" />
          {{ t('preschoolReportsPage.backToReports') || 'Back to Reports' }}
        </Button>
      </div>

      <!-- Report Switcher -->
      <ReportSwitcher />

      <!-- Filters -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          {{ t('preschoolAssessmentReportPage.filters') || 'Filters' }}
        </h3>

        <div class="grid gap-4 md:grid-cols-3">
          <!-- Academic Year -->
          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolReportsCenterPage.filters.academicYear') || 'Academic Year' }}
            </span>
            <Select
              v-model="academicYearId"
              :options="filterOptions.academicYears"
              option-label="label"
              option-value="value"
              class="w-full"
              :placeholder="t('preschoolReportsCenterPage.filters.academicYear')"
            />
          </label>

          <!-- Class -->
          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolReportsCenterPage.filters.class') || 'Class' }}
            </span>
            <Select
              v-model="classId"
              :options="filterOptions.classes"
              option-label="label"
              option-value="value"
              class="w-full"
              :placeholder="t('preschoolReportsCenterPage.filters.class')"
              @update:model-value="loadStudents"
            />
          </label>

          <!-- Student (Individual Mode Only) -->
          <label v-show="scopeType === 'individual'" class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolReportsCenterPage.filters.student') || 'Student' }}
            </span>
            <Select
              v-model="studentId"
              :options="filterOptions.students"
              option-label="label"
              option-value="value"
              class="w-full"
              :placeholder="t('preschoolReportsCenterPage.filters.student')"
            />
          </label>
        </div>

        <!-- Additional Filters -->
        <div class="mt-4 grid gap-4 md:grid-cols-3">
          <!-- Category -->
          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolAssessmentReportPage.category') || 'Category' }}
            </span>
            <Select
              v-model="categoryId"
              :options="filterOptions.categories"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </label>

          <!-- Status -->
          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolAssessmentReportPage.status') || 'Status' }}
            </span>
            <Select
              v-model="assessmentStatus"
              :options="assessmentStatuses"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </label>

          <!-- Scope -->
          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolAssessmentReportPage.scope') || 'Report Scope' }}
            </span>
            <Select
              v-model="scopeType"
              :options="[
                { label: t('preschoolAssessmentReportPage.individual') || 'Individual Student', value: 'individual' },
                { label: t('preschoolAssessmentReportPage.class') || 'Entire Class', value: 'class' },
              ]"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </label>
        </div>
      </div>

      <!-- Generate & Reset Buttons -->
      <div class="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="primary"
          size="lg"
          rounded="xl"
          :loading="loading"
          :disabled="!canGenerate"
          @click="generateReport"
          class="px-8"
        >
          {{ t('preschoolAssessmentReportPage.generateReport') || 'Generate Report' }}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          rounded="xl"
          @click="resetFilters"
        >
          {{ t('preschoolAssessmentReportPage.reset') || 'Reset' }}
        </Button>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ errorMessage }}
      </div>

      <!-- Individual Student Report -->
      <template v-if="reportGenerated && scopeType === 'individual' && reportData.student">
        <div class="preschool-assessment-report-content">
          <StudentAssessmentDetails
            :student="reportData.student"
            :assessments="reportData.assessments"
          />
        </div>

        <!-- Export Toolbar -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            {{ t('preschoolReportsCenterPage.exports.title') || 'Export' }}
          </h2>
          <div class="flex flex-wrap items-center gap-3">
            <Button type="button" variant="secondary" size="md" rounded="lg" :loading="exportLoading" @click="exportReport('pdf')">
              <i class="pi pi-file-pdf mr-2" /> PDF
            </Button>
            <Button type="button" variant="secondary" size="md" rounded="lg" :loading="exportLoading" @click="exportReport('excel')">
              <i class="pi pi-file-excel mr-2" /> Excel
            </Button>
            <Button type="button" variant="secondary" size="md" rounded="lg" :loading="exportLoading" @click="exportReport('print')">
              <i class="pi pi-print mr-2" /> Print
            </Button>
          </div>
        </div>
      </template>

      <!-- Class Report -->
      <template v-if="reportGenerated && scopeType === 'class' && reportData.classStudents.length > 0">
        <div class="preschool-assessment-report-content">
          <ClassAssessmentTable :students="reportData.classStudents" />
        </div>

        <!-- Export Toolbar -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            {{ t('preschoolReportsCenterPage.exports.title') || 'Export' }}
          </h2>
          <div class="flex flex-wrap items-center gap-3">
            <Button type="button" variant="secondary" size="md" rounded="lg" :loading="exportLoading" @click="exportReport('pdf')">
              <i class="pi pi-file-pdf mr-2" /> PDF
            </Button>
            <Button type="button" variant="secondary" size="md" rounded="lg" :loading="exportLoading" @click="exportReport('excel')">
              <i class="pi pi-file-excel mr-2" /> Excel
            </Button>
            <Button type="button" variant="secondary" size="md" rounded="lg" :loading="exportLoading" @click="exportReport('print')">
              <i class="pi pi-print mr-2" /> Print
            </Button>
          </div>
        </div>
      </template>

      <!-- Class Report Empty State -->
      <div v-if="reportGenerated && scopeType === 'class' && reportData.classStudents.length === 0" class="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
        <i class="pi pi-inbox text-4xl text-slate-300" />
        <p class="mt-4 text-slate-600">{{ t('preschoolAssessmentReportPage.messages.noStudents') || 'No students found in this class' }}</p>
      </div>

      <!-- Initial Empty State -->
      <div v-if="!reportGenerated" class="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
        <i class="pi pi-inbox text-4xl text-slate-300" />
        <p class="mt-4 text-slate-600">
          {{ t('preschoolAssessmentReportPage.emptyState') || 'Select filters and click Generate Report to view assessment data' }}
        </p>
      </div>
    </section>
  </MainLayout>
</template>

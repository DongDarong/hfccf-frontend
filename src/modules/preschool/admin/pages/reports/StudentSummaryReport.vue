<script setup>
import { onMounted, ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Select from 'primevue/select'
import { useLanguage } from '@/composables/useLanguage'
import {
  fetchPreschoolClasses,
  fetchPreschoolStudents,
  fetchPreschoolStudent,
  fetchPreschoolAttendance,
} from '@/modules/preschool/services/preschoolApi'
import { fetchStudentAssessments } from '@/modules/preschool/services/api/preschoolAssessmentApi'
import { fetchAcademicLifecycle } from '@/modules/preschool/services/api/preschoolAcademicLifecycleApi'
import StudentIdentityCard from './components/StudentIdentityCard.vue'
import StudentAttendanceSummary from './components/StudentAttendanceSummary.vue'
import StudentAssessmentSummary from './components/StudentAssessmentSummary.vue'
import ClassSummaryTable from './components/ClassSummaryTable.vue'

defineOptions({
  name: 'StudentSummaryReportPage',
})

const { t } = useLanguage()

const loading = ref(false)
const reportGenerated = ref(false)
const errorMessage = ref('')
const scopeType = ref('individual')
const academicYearId = ref('')
const classId = ref('')
const studentId = ref('')

const filterOptions = ref({
  academicYears: [],
  classes: [],
  students: [],
})

const reportData = ref({
  student: null,
  attendance: null,
  assessments: [],
  classStudents: [],
})

async function loadFilterOptions() {
  try {
    const lifecycle = await fetchAcademicLifecycle()
    filterOptions.value.academicYears = (lifecycle.academicYears || []).map(ay => ({
      label: ay.label || ay.code,
      value: ay.id,
    }))

    if (filterOptions.value.academicYears.length > 0) {
      academicYearId.value = filterOptions.value.academicYears[0].value
    }

    const classes = await fetchPreschoolClasses()
    filterOptions.value.classes = (classes.items || []).map(c => ({
      label: c.name,
      value: c.id,
    }))

    if (filterOptions.value.classes.length > 0) {
      classId.value = filterOptions.value.classes[0].value
      await loadStudents()
    }
  } catch {
    errorMessage.value = t('preschoolReportsPage.messages.loadFailed') || 'Failed to load filter options'
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

async function generateIndividualReport() {
  if (!studentId.value || !classId.value) {
    errorMessage.value = 'Please select both student and class'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const studentData = await fetchPreschoolStudent(studentId.value)

    const attendanceData = await fetchPreschoolAttendance({
      studentId: studentId.value,
      classId: classId.value,
      perPage: 1000,
    })

    const assessmentsData = await fetchStudentAssessments(studentId.value, {
      perPage: 1000,
    })

    reportData.value = {
      student: studentData,
      attendance: attendanceData,
      assessments: assessmentsData.items || [],
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
      const attendance = await fetchPreschoolAttendance({
        studentId: student.id,
        classId: classId.value,
        perPage: 1000,
      })

      const assessments = await fetchStudentAssessments(student.id, { perPage: 10 })

      const attendancePercentage = calculateAttendancePercentage(attendance)
      const latestAssessment = assessments.items && assessments.items.length > 0
        ? assessments.items[0]
        : null

      classStudents.push({
        student,
        attendancePercentage,
        latestAssessment,
      })
    }

    reportData.value = {
      classStudents,
    }

    reportGenerated.value = true
  } catch (error) {
    errorMessage.value = error?.message || 'Failed to generate class report'
  } finally {
    loading.value = false
  }
}

function calculateAttendancePercentage(attendanceData) {
  if (!attendanceData || attendanceData.total === 0) return 0
  return Math.round((attendanceData.items?.filter(a => a.status === 'present').length || 0) / attendanceData.total * 100)
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
  reportGenerated.value = false
  reportData.value = {
    student: null,
    attendance: null,
    assessments: [],
    classStudents: [],
  }
}

onMounted(() => {
  loadFilterOptions()
})
</script>

<template>
  <MainLayout>
    <section class="space-y-6">
      <!-- Header -->
      <HeaderSection
        :title="t('preschoolReportsPage.reportTypes.student-summary')"
        :subtitle="t('preschoolReportsPage.reportTypeDesc.student-summary')"
      />

      <!-- Filters -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          {{ t('preschoolReportsPage.filters') }}
        </h3>

        <div class="grid gap-4 md:grid-cols-2">
          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolReportsCenterPage.filters.academicYear') }}
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

          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolReportsCenterPage.filters.class') }}
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

          <label v-show="scopeType === 'individual'" class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolReportsCenterPage.filters.student') }}
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

          <label class="space-y-2 md:col-span-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolReportsPage.scope') }}
            </span>
            <div class="flex items-center gap-6 pt-2">
              <label class="flex items-center gap-2">
                <input
                  v-model="scopeType"
                  type="radio"
                  value="individual"
                  class="rounded"
                />
                <span class="text-sm text-slate-700">{{ t('preschoolReportsPage.individual') }}</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  v-model="scopeType"
                  type="radio"
                  value="class"
                  class="rounded"
                />
                <span class="text-sm text-slate-700">{{ t('preschoolReportsPage.entireClass') }}</span>
              </label>
            </div>
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
          @click="generateReport"
          class="px-8"
        >
          {{ t('preschoolReportsPage.generateReport') }}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          rounded="xl"
          @click="resetFilters"
        >
          {{ t('preschoolReportsPage.reset') }}
        </Button>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ errorMessage }}
      </div>

      <!-- Individual Student Report -->
      <template v-if="reportGenerated && scopeType === 'individual' && reportData.student">
        <StudentIdentityCard :student="reportData.student" />
        <StudentAttendanceSummary :attendance="reportData.attendance" />
        <StudentAssessmentSummary :assessments="reportData.assessments" />

        <!-- Export Toolbar (Placeholder) -->
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="flex flex-wrap items-center gap-3">
            <span class="text-sm font-semibold text-slate-700">{{ t('preschoolReportsCenterPage.exports.title') }}:</span>
            <Button type="button" variant="secondary" size="md" rounded="lg" disabled class="opacity-50">
              <i class="pi pi-file-pdf mr-2" /> PDF
            </Button>
            <Button type="button" variant="secondary" size="md" rounded="lg" disabled class="opacity-50">
              <i class="pi pi-file-excel mr-2" /> Excel
            </Button>
            <Button type="button" variant="secondary" size="md" rounded="lg" disabled class="opacity-50">
              <i class="pi pi-print mr-2" /> Print
            </Button>
          </div>
        </div>
      </template>

      <!-- Class Report -->
      <template v-if="reportGenerated && scopeType === 'class' && reportData.classStudents.length > 0">
        <ClassSummaryTable :students="reportData.classStudents" />

        <!-- Export Toolbar (Placeholder) -->
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="flex flex-wrap items-center gap-3">
            <span class="text-sm font-semibold text-slate-700">{{ t('preschoolReportsCenterPage.exports.title') }}:</span>
            <Button type="button" variant="secondary" size="md" rounded="lg" disabled class="opacity-50">
              <i class="pi pi-file-pdf mr-2" /> PDF
            </Button>
            <Button type="button" variant="secondary" size="md" rounded="lg" disabled class="opacity-50">
              <i class="pi pi-file-excel mr-2" /> Excel
            </Button>
            <Button type="button" variant="secondary" size="md" rounded="lg" disabled class="opacity-50">
              <i class="pi pi-print mr-2" /> Print
            </Button>
          </div>
        </div>
      </template>

      <!-- Empty State -->
      <div v-if="!reportGenerated" class="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
        <i class="pi pi-inbox text-4xl text-slate-300" />
        <p class="mt-4 text-slate-600">
          {{ t('preschoolReportsPage.emptyState') }}
        </p>
      </div>
    </section>
  </MainLayout>
</template>

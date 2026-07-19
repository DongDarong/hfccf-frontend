<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Select from 'primevue/select'
import Dialog from 'primevue/dialog'
import html2pdf from 'html2pdf.js'
import * as XLSX from 'xlsx'
import { useLanguage } from '@/composables/useLanguage'
import {
  fetchPreschoolClasses,
  fetchPreschoolStudents,
  fetchAcademicLifecycle,
} from '@/modules/preschool/services/preschoolApi'
import { useGradeData } from '@/modules/preschool/composables/useGradeData'
import { useGradeMutations } from '@/modules/preschool/composables/useGradeMutations'

defineOptions({
  name: 'PreschoolGradeEntryPage',
})

const { t } = useLanguage()
const router = useRouter()
const toast = useToast()

const { gradeOptions, errorMessage, loadGradeScale, loadMonthlyEntry } = useGradeData()
const { isSubmitting, saveBatchGrades } = useGradeMutations()

const academicYearId = ref('')
const classId = ref('')
const month = ref(new Date().getMonth() + 1)
const year = ref(new Date().getFullYear())
const filterOptions = ref({
  academicYears: [],
  classes: [],
})
const students = ref([])
const gradesMap = ref({})
const isDetailDialogOpen = ref(false)
const selectedStudent = ref(null)
const editingGrade = reactive({ grade: '', notes: '' })
const exportLoading = ref(false)

const monthOptions = computed(() =>
  Array.from({ length: 12 }, (_, i) => ({
    label: t(`common.months.${i + 1}`, `Month ${i + 1}`),
    value: i + 1,
  })),
)

const yearOptions = computed(() =>
  Array.from({ length: 5 }, (_, i) => {
    const y = new Date().getFullYear() - 2 + i
    return { label: String(y), value: y }
  }),
)

async function loadFilterOptions() {
  try {
    const [lifecycleRes, classesRes] = await Promise.all([
      fetchAcademicLifecycle(),
      fetchPreschoolClasses(),
    ])

    filterOptions.value.academicYears = (lifecycleRes.academicYears || []).map(ay => ({
      label: ay.label || ay.code,
      value: ay.id,
    }))

    filterOptions.value.classes = (classesRes.items || []).map(c => ({
      label: c.name,
      value: c.id,
    }))

    if (filterOptions.value.academicYears.length > 0) {
      academicYearId.value = filterOptions.value.academicYears[0].value
    }

    if (filterOptions.value.classes.length > 0) {
      classId.value = filterOptions.value.classes[0].value
      await loadStudents()
    }
  } catch (error) {
    console.error('Failed to load filter options:', error)
  }
}

async function loadStudents() {
  if (!classId.value) {
    students.value = []
    return
  }

  try {
    const response = await fetchPreschoolStudents({ classId: classId.value, perPage: 500 })
    students.value = (response.items || []).map(s => ({
      id: s.id,
      name: s.fullName || s.firstName + ' ' + s.lastName,
      code: s.studentCode || s.publicId,
    }))

    await loadMonthlyEntry(classId.value, month.value, year.value)
  } catch (error) {
    console.error('Failed to load students:', error)
    students.value = []
  }
}

async function refreshGrades() {
  if (!classId.value) return
  await loadMonthlyEntry(classId.value, month.value, year.value)
}

function getStudentGrade(studentId) {
  return gradesMap.value[studentId] || { grade: '', notes: '' }
}

function updateStudentGrade(studentId, grade, notes = '') {
  gradesMap.value[studentId] = { grade, notes, studentId }
}

function openStudentGradeDialog(student) {
  selectedStudent.value = student
  const existing = getStudentGrade(student.id)
  editingGrade.grade = existing.grade || ''
  editingGrade.notes = existing.notes || ''
  isDetailDialogOpen.value = true
}

function closeStudentGradeDialog() {
  isDetailDialogOpen.value = false
  selectedStudent.value = null
  editingGrade.grade = ''
  editingGrade.notes = ''
}

function saveStudentGrade() {
  if (!selectedStudent.value) return
  updateStudentGrade(selectedStudent.value.id, editingGrade.grade, editingGrade.notes)
  closeStudentGradeDialog()
}

async function submitAllGrades() {
  const gradesToSubmit = students.value
    .filter(s => gradesMap.value[s.id]?.grade)
    .map(s => ({
      studentId: s.id,
      classId: classId.value,
      academicYearId: academicYearId.value,
      month: month.value,
      year: year.value,
      grade: gradesMap.value[s.id].grade,
      notes: gradesMap.value[s.id].notes || '',
    }))

  if (gradesToSubmit.length === 0) {
    toast.add({
      severity: 'warn',
      summary: t('common.warning'),
      detail: t('preschoolGradeEntry.messages.noGradesToSubmit', 'Please enter at least one grade'),
      life: 3000,
    })
    return
  }

  try {
    await saveBatchGrades(gradesToSubmit, async () => {
      toast.add({
        severity: 'success',
        summary: t('common.success'),
        detail: t('preschoolGradeEntry.messages.gradesSaved', 'Grades saved successfully'),
        life: 3000,
      })
      await refreshGrades()
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: error?.message || t('preschoolGradeEntry.messages.saveFailed', 'Failed to save grades'),
      life: 3000,
    })
  }
}

async function exportToPdf() {
  try {
    exportLoading.value = true
    const element = document.querySelector('.grade-entry-content')
    if (!element) throw new Error('Grade entry content not found')

    const options = {
      margin: 10,
      filename: `GradeEntry_${month.value}_${year.value}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' },
    }

    await html2pdf().set(options).from(element).save()
  } catch {
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: t('preschoolGradeEntry.messages.exportFailed', 'Failed to export PDF'),
      life: 3000,
    })
  } finally {
    exportLoading.value = false
  }
}

function exportToExcel() {
  try {
    exportLoading.value = true
    const workbook = XLSX.utils.book_new()

    const metadata = [
      ['Grade Entry Report'],
      ['Month', t(`common.months.${month.value}`)],
      ['Year', year.value],
      ['Class', filterOptions.value.classes.find(c => c.value === classId.value)?.label || 'All'],
      [],
      ['Student Name', 'Student Code', 'Grade', 'Notes'],
    ]

    const data = students.value.map(s => {
      const studentGrade = getStudentGrade(s.id)
      return [s.name, s.code, studentGrade.grade || '', studentGrade.notes || '']
    })

    const sheet = XLSX.utils.aoa_to_sheet([...metadata, ...data])
    XLSX.utils.book_append_sheet(workbook, sheet, 'Grades')
    XLSX.writeFile(workbook, `GradeEntry_${month.value}_${year.value}.xlsx`)
  } catch {
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: t('preschoolGradeEntry.messages.exportFailed', 'Failed to export Excel'),
      life: 3000,
    })
  } finally {
    exportLoading.value = false
  }
}

watch([classId, month, year], async () => {
  await refreshGrades()
})

onMounted(async () => {
  await loadFilterOptions()
  await loadGradeScale()
})
</script>

<template>
  <MainLayout>
    <section class="space-y-6">
      <!-- Header -->
      <HeaderSection
        :title="t('preschoolGradeEntry.title', 'Grade Entry')"
        :subtitle="t('preschoolGradeEntry.subtitle', 'Enter and manage student grades')"
      />

      <!-- Filters -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          {{ t('preschoolGradeEntry.filters') }}
        </h3>

        <div class="grid gap-4 md:grid-cols-4">
          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolGradeEntry.academicYear') }}
            </span>
            <Select
              v-model="academicYearId"
              :options="filterOptions.academicYears"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolGradeEntry.class') }}
            </span>
            <Select
              v-model="classId"
              :options="filterOptions.classes"
              option-label="label"
              option-value="value"
              class="w-full"
              @update:model-value="loadStudents"
            />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolGradeEntry.month') }}
            </span>
            <Select
              v-model="month"
              :options="monthOptions"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">
              {{ t('preschoolGradeEntry.year') }}
            </span>
            <Select
              v-model="year"
              :options="yearOptions"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </label>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ errorMessage }}
      </div>

      <!-- Grade Entry Table -->
      <div class="grade-entry-content rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200 text-sm">
            <thead class="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th class="px-4 py-3">{{ t('preschoolGradeEntry.studentName') }}</th>
                <th class="px-4 py-3">{{ t('preschoolGradeEntry.studentCode') }}</th>
                <th class="px-4 py-3 text-center">{{ t('preschoolGradeEntry.grade') }}</th>
                <th class="px-4 py-3">{{ t('preschoolGradeEntry.notes') }}</th>
                <th class="px-4 py-3">{{ t('common.actions') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-for="student in students" :key="student.id">
                <td class="px-4 py-3 font-medium text-slate-900">{{ student.name }}</td>
                <td class="px-4 py-3 text-slate-600">{{ student.code }}</td>
                <td class="px-4 py-3 text-center">
                  <span
                    v-if="getStudentGrade(student.id).grade"
                    class="inline-flex items-center justify-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800"
                  >
                    {{ getStudentGrade(student.id).grade }}
                  </span>
                  <span v-else class="text-slate-400">—</span>
                </td>
                <td class="px-4 py-3 text-xs text-slate-500">
                  {{ getStudentGrade(student.id).notes || '—' }}
                </td>
                <td class="px-4 py-3">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    rounded="md"
                    @click="openStudentGradeDialog(student)"
                  >
                    {{ getStudentGrade(student.id).grade ? t('common.edit') : t('common.add') }}
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="students.length === 0" class="px-4 py-8 text-center text-sm text-slate-500">
          {{ t('preschoolGradeEntry.noStudents', 'No students found for this class') }}
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="primary"
          size="lg"
          rounded="xl"
          :loading="isSubmitting"
          @click="submitAllGrades"
          class="px-8"
        >
          {{ t('preschoolGradeEntry.saveGrades') }}
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          rounded="xl"
          :loading="exportLoading"
          @click="exportToPdf"
        >
          <i class="pi pi-file-pdf mr-2" /> PDF
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          rounded="xl"
          :loading="exportLoading"
          @click="exportToExcel"
        >
          <i class="pi pi-file-excel mr-2" /> Excel
        </Button>

        <Button type="button" variant="ghost" size="lg" rounded="xl" @click="() => router.back()">
          {{ t('common.cancel') }}
        </Button>
      </div>

      <!-- Student Grade Dialog -->
      <Dialog
        v-model:visible="isDetailDialogOpen"
        modal
        :header="`${t('preschoolGradeEntry.gradeFor')} ${selectedStudent?.name}`"
        class="grade-entry-dialog"
      >
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700">{{ t('preschoolGradeEntry.grade') }}</label>
            <Select
              v-model="editingGrade.grade"
              :options="gradeOptions"
              option-label="label"
              option-value="value"
              class="w-full"
              :placeholder="t('preschoolGradeEntry.selectGrade')"
            >
              <template #option="slotProps">
                <div class="flex flex-col gap-1">
                  <div class="font-medium">{{ slotProps.option.label }}</div>
                  <div v-if="slotProps.option.description" class="text-xs text-slate-500">
                    {{ slotProps.option.description }}
                  </div>
                </div>
              </template>
            </Select>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700">{{ t('preschoolGradeEntry.notes') }}</label>
            <textarea
              v-model="editingGrade.notes"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows="3"
              :placeholder="t('preschoolGradeEntry.notesPlaceholder', 'Add any notes about this grade')"
            />
          </div>
        </div>

        <template #footer>
          <Button type="button" severity="secondary" outlined @click="closeStudentGradeDialog">
            {{ t('common.cancel') }}
          </Button>
          <Button type="button" @click="saveStudentGrade">
            {{ t('common.save') }}
          </Button>
        </template>
      </Dialog>
    </section>
  </MainLayout>
</template>

<style scoped>
.grade-entry-content {
  display: flex;
  flex-direction: column;
}

.grade-entry-dialog {
  min-width: 400px;
}

@media (max-width: 768px) {
  .grade-entry-dialog {
    min-width: 100%;
  }
}
</style>

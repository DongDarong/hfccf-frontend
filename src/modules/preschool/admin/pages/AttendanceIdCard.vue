<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Select from 'primevue/select'
import { useLanguage } from '@/composables/useLanguage'
import { fetchPreschoolStudents, fetchPreschoolClasses } from '@/modules/preschool/services/preschoolApi'

defineOptions({ name: 'PreschoolAdminAttendanceIdCardPage' })

const { t } = useLanguage()
const router = useRouter()

const classOptions = ref([])
const students = ref([])
const selectedClassId = ref('')
const selectedStudentIds = ref([])
const loadingClasses = ref(false)
const loadingStudents = ref(false)
const generating = ref(false)

const allSelected = computed(() =>
  students.value.length > 0 && selectedStudentIds.value.length === students.value.length,
)

function toggleSelectAll() {
  if (allSelected.value) {
    selectedStudentIds.value = []
  } else {
    selectedStudentIds.value = students.value.map((s) => s.id)
  }
}

function toggleStudent(id) {
  const idx = selectedStudentIds.value.indexOf(id)
  if (idx === -1) selectedStudentIds.value.push(id)
  else selectedStudentIds.value.splice(idx, 1)
}

async function loadClasses() {
  loadingClasses.value = true
  try {
    const res = await fetchPreschoolClasses({ page: 1, perPage: 100 })
    classOptions.value = (res.items || []).map((c) => ({ label: c.name || c.code || String(c.id), value: c.id }))
  } catch {
    classOptions.value = []
  } finally {
    loadingClasses.value = false
  }
}

async function loadStudents() {
  if (!selectedClassId.value) { students.value = []; return }
  loadingStudents.value = true
  selectedStudentIds.value = []
  try {
    const res = await fetchPreschoolStudents({ page: 1, perPage: 200, classId: selectedClassId.value })
    students.value = res.items || []
  } catch {
    students.value = []
  } finally {
    loadingStudents.value = false
  }
}

function getStudentInitials(student) {
  const name = student.displayName || student.name || student.fullName || ''
  return name.split(' ').slice(0, 2).map((w) => w[0] || '').join('').toUpperCase() || '?'
}

async function generatePdf() {
  if (!selectedStudentIds.value.length) return
  generating.value = true
  try {
    const chosen = students.value.filter((s) => selectedStudentIds.value.includes(s.id))
    const className = classOptions.value.find((c) => c.value === selectedClassId.value)?.label || ''

    // Dynamic import so jsPDF is only loaded when needed
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    const cardW = 85.6
    const cardH = 54
    const marginX = 10
    const marginY = 10
    const gapX = 7
    const gapY = 7
    const cols = 2
    const pageW = 210
    const pageH = 297

    chosen.forEach((student, i) => {
      const col = i % cols
      const row = Math.floor(i / cols) % Math.floor((pageH - marginY * 2) / (cardH + gapY))
      const absRow = Math.floor(i / cols)
      const cardsPerPage = cols * Math.floor((pageH - marginY * 2) / (cardH + gapY))
      if (i > 0 && i % cardsPerPage === 0) doc.addPage()

      const x = marginX + col * (cardW + gapX)
      const y = marginY + row * (cardH + gapY)

      // Card border
      doc.setDrawColor(180, 180, 200)
      doc.setFillColor(250, 250, 255)
      doc.roundedRect(x, y, cardW, cardH, 3, 3, 'FD')

      // Header strip
      doc.setFillColor(109, 40, 217)
      doc.roundedRect(x, y, cardW, 14, 3, 3, 'F')
      doc.setFillColor(109, 40, 217)
      doc.rect(x, y + 8, cardW, 6, 'F')

      // School label
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('STUDENT ID CARD', x + cardW / 2, y + 6, { align: 'center' })
      doc.setFontSize(6)
      doc.setFont('helvetica', 'normal')
      doc.text(className, x + cardW / 2, y + 11, { align: 'center' })

      // Avatar circle
      doc.setFillColor(230, 220, 255)
      doc.circle(x + 15, y + 30, 9, 'F')
      doc.setTextColor(109, 40, 217)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text(getStudentInitials(student), x + 15, y + 33, { align: 'center' })

      // Student info
      const name = student.displayName || student.name || student.fullName || '—'
      doc.setTextColor(15, 23, 42)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text(name, x + 28, y + 24, { maxWidth: cardW - 30 })

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.setTextColor(100, 116, 139)
      if (student.studentCode || student.code) {
        doc.text(`ID: ${student.studentCode || student.code}`, x + 28, y + 30)
      }
      if (student.dateOfBirth || student.dob) {
        doc.text(`DOB: ${student.dateOfBirth || student.dob}`, x + 28, y + 36)
      }

      // Bottom strip
      doc.setFillColor(237, 233, 254)
      doc.rect(x, y + cardH - 8, cardW, 8, 'F')
      doc.setTextColor(109, 40, 217)
      doc.setFontSize(6)
      doc.setFont('helvetica', 'normal')
      doc.text('HFCCF Preschool', x + cardW / 2, y + cardH - 3, { align: 'center' })
    })

    doc.save(`id-cards-${className || 'students'}.pdf`)
  } catch (e) {
    console.error('PDF generation failed', e)
    alert('PDF generation failed. Make sure jspdf is installed.')
  } finally {
    generating.value = false
  }
}

onMounted(loadClasses)
</script>

<template>
  <MainLayout>
    <section class="space-y-4">
      <HeaderSection
        :title="t('preschoolAttendanceHubPage.cards.idCard.title')"
        :subtitle="t('preschoolAttendanceHubPage.cards.idCard.description')"
      />

      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex flex-wrap items-end gap-3">
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Class</span>
            <Select
              v-model="selectedClassId"
              :options="classOptions"
              option-label="label"
              option-value="value"
              class="min-w-[200px]"
              placeholder="Select a class"
              :loading="loadingClasses"
              @change="loadStudents"
            />
          </label>
          <Button type="button" variant="ghost" size="md" rounded="xl" @click="router.push({ name: 'dashboard-preschool-admin-attendance' })">
            Back
          </Button>
        </div>
      </div>

      <div v-if="loadingStudents" class="rounded-2xl border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-400">
        Loading students...
      </div>

      <div v-else-if="selectedClassId && !students.length" class="rounded-2xl border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-400">
        No students found in this class.
      </div>

      <div v-else-if="students.length" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div class="flex items-center gap-3">
            <label class="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" :checked="allSelected" class="h-4 w-4 rounded" @change="toggleSelectAll">
              Select all ({{ students.length }})
            </label>
            <span class="text-xs text-slate-400">{{ selectedStudentIds.length }} selected</span>
          </div>
          <Button
            type="button"
            variant="primary"
            size="md"
            rounded="xl"
            :loading="generating"
            :disabled="generating || !selectedStudentIds.length"
            @click="generatePdf"
          >
            <i class="pi pi-file-pdf mr-1.5" />
            Generate PDF
          </Button>
        </div>

        <div class="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <label
            v-for="student in students"
            :key="student.id"
            class="flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors"
            :class="selectedStudentIds.includes(student.id)
              ? 'border-violet-300 bg-violet-50'
              : 'border-slate-200 bg-white hover:border-slate-300'"
          >
            <input
              type="checkbox"
              :checked="selectedStudentIds.includes(student.id)"
              class="h-4 w-4 rounded"
              @change="toggleStudent(student.id)"
            >
            <div class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
              {{ getStudentInitials(student) }}
            </div>
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-slate-900">{{ student.displayName || student.name || student.fullName }}</p>
              <p v-if="student.studentCode || student.code" class="text-xs text-slate-400">#{{ student.studentCode || student.code }}</p>
            </div>
          </label>
        </div>
      </div>

      <div v-else class="rounded-2xl border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-400">
        Select a class above to load students.
      </div>
    </section>
  </MainLayout>
</template>

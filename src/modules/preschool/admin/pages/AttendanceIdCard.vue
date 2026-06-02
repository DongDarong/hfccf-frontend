<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Select from 'primevue/select'
import { useLanguage } from '@/composables/useLanguage'
import { fetchPreschoolStudents, fetchPreschoolClasses } from '@/modules/preschool/services/preschoolApi'
import logoUrl from '@/assets/images/logo.jpg'

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
  if (allSelected.value) selectedStudentIds.value = []
  else selectedStudentIds.value = students.value.map((s) => s.id)
}

function toggleStudent(id) {
  const idx = selectedStudentIds.value.indexOf(id)
  if (idx === -1) selectedStudentIds.value.push(id)
  else selectedStudentIds.value.splice(idx, 1)
}

function getInitials(student) {
  const name = student.fullName || student.name || ''
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0] || '').join('').toUpperCase() || '?'
}

function getAcademicYear() {
  const now = new Date()
  const y = now.getFullYear()
  return now.getMonth() >= 8 ? `${y}-${y + 1}` : `${y - 1}-${y}`
}

async function loadImageToDataUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth || 200
      canvas.height = img.naturalHeight || 200
      canvas.getContext('2d').drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = () => reject(new Error('load failed'))
    img.src = url
  })
}

function drawCard(doc, x, y, student, className, academicYear, logoData) {
  const W = 85.6, H = 54

  // ── Outer card ──────────────────────────────────────────────────────
  doc.setFillColor(255, 255, 255)
  doc.setDrawColor(203, 213, 225)
  doc.setLineWidth(0.25)
  doc.roundedRect(x, y, W, H, 2.5, 2.5, 'FD')

  // ── Header band (navy) ─────────────────────────────────────────────
  const HEADER_H = 14.5
  doc.setFillColor(10, 36, 80)        // deep navy #0a2450
  doc.roundedRect(x, y, W, HEADER_H, 2.5, 2.5, 'F')
  doc.setFillColor(10, 36, 80)
  doc.rect(x, y + HEADER_H - 3, W, 3, 'F') // flatten bottom corners

  // Logo
  if (logoData) {
    doc.addImage(logoData, 'JPEG', x + 2.5, y + 2, 10.5, 10.5)
  }

  // School name + subtitle
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'bold')
  doc.text('HFCCF PRESCHOOL', x + 15, y + 6.5)

  doc.setFontSize(5.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(147, 197, 253)   // sky-300 #93c5fd
  doc.text('Hope for Cambodian Children', x + 15, y + 10.5)

  // "STUDENT ID CARD" badge top-right
  doc.setFillColor(255, 255, 255, 0.15)
  doc.setDrawColor(255, 255, 255)
  doc.setLineWidth(0.3)
  doc.roundedRect(x + W - 24, y + 3.5, 22, 7, 1.2, 1.2, 'S')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(5)
  doc.setFont('helvetica', 'bold')
  doc.text('STUDENT ID CARD', x + W - 13, y + 8, { align: 'center' })

  // ── Colour accent bar (4 segments — hope logo colours) ─────────────
  const BAR_Y = y + HEADER_H
  const BAR_H = 1.8
  const SEG_W = W / 4
  const COLOURS = [[34, 197, 94], [249, 115, 22], [239, 68, 68], [59, 130, 246]]
  COLOURS.forEach(([r, g, b], i) => {
    doc.setFillColor(r, g, b)
    doc.rect(x + i * SEG_W, BAR_Y, SEG_W, BAR_H, 'F')
  })

  // ── Body ───────────────────────────────────────────────────────────
  const BODY_Y = BAR_Y + BAR_H    // ≈ y + 16.3
  const FOOTER_Y = y + H - 8.5

  // --- Avatar column (left, 0–29mm) ---
  const CX = x + 14.8
  const CY = BODY_Y + (FOOTER_Y - BODY_Y) / 2   // vertically centred

  // outer ring
  doc.setFillColor(219, 234, 254)   // blue-100
  doc.setDrawColor(59, 130, 246)    // blue-500
  doc.setLineWidth(0.6)
  doc.circle(CX, CY, 11.5, 'FD')

  // inner lighter circle
  doc.setFillColor(239, 246, 255)   // blue-50
  doc.setDrawColor(191, 219, 254)   // blue-200
  doc.setLineWidth(0.3)
  doc.circle(CX, CY, 10, 'FD')

  // Initials
  const initials = getInitials(student)
  doc.setTextColor(30, 64, 175)     // blue-800
  doc.setFontSize(initials.length > 2 ? 8.5 : 11)
  doc.setFont('helvetica', 'bold')
  doc.text(initials, CX, CY + (initials.length > 2 ? 3 : 4), { align: 'center' })

  // Gender tag below avatar
  if (student.gender) {
    const isMale = student.gender.toLowerCase().startsWith('m')
    doc.setFillColor(isMale ? 219 : 252, isMale ? 234 : 231, isMale ? 254 : 243)
    doc.roundedRect(CX - 6, CY + 13, 12, 4.5, 1, 1, 'F')
    doc.setTextColor(isMale ? 109 : 190, isMale ? 40 : 24, isMale ? 217 : 93)
    doc.setFontSize(5)
    doc.setFont('helvetica', 'bold')
    doc.text(isMale ? 'MALE' : 'FEMALE', CX, CY + 16.4, { align: 'center' })
  }

  // Vertical separator
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.25)
  doc.line(x + 29.5, BODY_Y + 2, x + 29.5, FOOTER_Y - 1)

  // --- Info column (right, 31–83mm) ---
  const IX = x + 32                 // info x start
  let IY = BODY_Y + 5.5             // info y cursor

  // Full Name
  const name = student.fullName || student.name || '—'
  const nameLines = doc.splitTextToSize(name, W - 35)
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text(nameLines.slice(0, 2), IX, IY)
  IY += nameLines.length > 1 ? 9.5 : 5.5

  // Divider
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.25)
  doc.line(IX, IY, x + W - 3, IY)
  IY += 4

  // Helper for label + value rows
  function infoRow(label, value) {
    doc.setFontSize(4.8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(148, 163, 184)   // slate-400
    doc.text(label, IX, IY)
    IY += 3.5
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 64, 175)     // blue-800
    doc.text(String(value || '—'), IX, IY)
    IY += 5
  }

  infoRow('STUDENT ID', student.studentCode || student.id || '—')
  infoRow('CLASS', className || '—')
  if (student.dateOfBirth) infoRow('DATE OF BIRTH', student.dateOfBirth)

  // ── Footer band ────────────────────────────────────────────────────
  doc.setFillColor(239, 246, 255)   // blue-50
  doc.rect(x, FOOTER_Y, W, H - (FOOTER_Y - y), 'F')
  // re-clip bottom rounded corners
  doc.setFillColor(255, 255, 255)
  doc.rect(x, FOOTER_Y, 2.5, 2.5, 'F')
  doc.rect(x + W - 2.5, FOOTER_Y, 2.5, 2.5, 'F')

  doc.setDrawColor(191, 219, 254)   // blue-200
  doc.setLineWidth(0.25)
  doc.line(x, FOOTER_Y, x + W, FOOTER_Y)

  doc.setTextColor(30, 64, 175)
  doc.setFontSize(6)
  doc.setFont('helvetica', 'bold')
  doc.text(`Academic Year  ${academicYear}`, x + W / 2, FOOTER_Y + 5.2, { align: 'center' })
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

async function generatePdf() {
  if (!selectedStudentIds.value.length) return
  generating.value = true
  try {
    const chosen = students.value.filter((s) => selectedStudentIds.value.includes(s.id))
    const className = classOptions.value.find((c) => c.value === selectedClassId.value)?.label || ''
    const academicYear = getAcademicYear()

    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    // Load HFCCF logo once
    let logoData = null
    try { logoData = await loadImageToDataUrl(logoUrl) } catch {}

    // A4 layout: 2 cols × 4 rows = 8 cards/page
    // marginX = (210 - 2×85.6) / 3 = 12.93mm for equal left/gap/right
    const MARGIN_X = 12.9
    const GAP_X = 12.9
    const MARGIN_Y = 15
    const GAP_Y = 8
    const CARD_W = 85.6
    const CARD_H = 54
    const COLS = 2
    const ROWS = Math.floor((297 - MARGIN_Y * 2 + GAP_Y) / (CARD_H + GAP_Y))  // 4
    const PER_PAGE = COLS * ROWS

    for (let i = 0; i < chosen.length; i++) {
      if (i > 0 && i % PER_PAGE === 0) doc.addPage()
      const col = i % COLS
      const row = Math.floor((i % PER_PAGE) / COLS)
      const x = MARGIN_X + col * (CARD_W + GAP_X)
      const y = MARGIN_Y + row * (CARD_H + GAP_Y)
      drawCard(doc, x, y, chosen[i], className, academicYear, logoData)
    }

    const safeName = className.replace(/[^a-z0-9]/gi, '-').toLowerCase()
    doc.save(`id-cards-${safeName || 'students'}-${academicYear}.pdf`)
  } catch (e) {
    console.error('PDF generation failed', e)
    alert('PDF generation failed: ' + (e?.message || e))
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

      <!-- Filters -->
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex flex-wrap items-end gap-3">
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {{ t('preschoolAdminAttendancePage.filters.class') }}
            </span>
            <Select
              v-model="selectedClassId"
              :options="classOptions"
              option-label="label"
              option-value="value"
              class="min-w-[200px]"
              :placeholder="t('preschoolAdminAttendancePage.placeholders.class')"
              :loading="loadingClasses"
              @change="loadStudents"
            />
          </label>
          <Button
            type="button"
            variant="ghost"
            size="md"
            rounded="xl"
            @click="router.push({ name: 'dashboard-preschool-admin-attendance' })"
          >
            {{ t('preschoolAdminAttendancePage.actions.back') }}
          </Button>
        </div>
      </div>

      <!-- Loading -->
      <div
        v-if="loadingStudents"
        class="rounded-2xl border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-400"
      >
        {{ t('preschoolReportsShared.loading') }}
      </div>

      <!-- No students -->
      <div
        v-else-if="selectedClassId && !students.length"
        class="rounded-2xl border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-400"
      >
        No students found in this class.
      </div>

      <!-- Student list -->
      <div v-else-if="students.length" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <!-- Toolbar -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div class="flex items-center gap-3">
            <label class="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                :checked="allSelected"
                class="h-4 w-4 rounded accent-violet-600"
                @change="toggleSelectAll"
              >
              <span>Select all <span class="text-slate-400">({{ students.length }})</span></span>
            </label>
            <span v-if="selectedStudentIds.length" class="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">
              {{ selectedStudentIds.length }} selected
            </span>
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
            {{ generating ? 'Generating…' : 'Generate PDF' }}
          </Button>
        </div>

        <!-- Card grid -->
        <div class="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
              class="h-4 w-4 flex-shrink-0 rounded accent-violet-600"
              @change="toggleStudent(student.id)"
            >
            <!-- Mini ID card preview -->
            <div class="flex min-w-0 flex-1 items-center gap-2.5">
              <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800 ring-2 ring-blue-200">
                {{ getInitials(student) }}
              </div>
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-slate-900">
                  {{ student.fullName || student.name || '—' }}
                </p>
                <p class="text-xs text-slate-400">
                  <span v-if="student.studentCode">#{{ student.studentCode }}</span>
                  <span v-if="student.studentCode && student.gender"> · </span>
                  <span v-if="student.gender" class="capitalize">{{ student.gender }}</span>
                </p>
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else
        class="rounded-2xl border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-400"
      >
        Select a class above to load students.
      </div>
    </section>
  </MainLayout>
</template>

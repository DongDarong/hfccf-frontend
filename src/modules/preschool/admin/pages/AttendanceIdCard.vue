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

const classOptions  = ref([])
const students      = ref([])
const selectedClassId   = ref('')
const selectedStudentIds = ref([])
const selectedFormat    = ref('pdf')
const loadingClasses    = ref(false)
const loadingStudents   = ref(false)
const generating        = ref(false)

const FORMAT_OPTIONS = [
  { value: 'pdf', label: 'PDF',  icon: 'pi-file-pdf',   desc: 'Print-ready A4 sheet' },
  { value: 'png', label: 'PNG',  icon: 'pi-image',       desc: 'Transparent background' },
  { value: 'jpg', label: 'JPG',  icon: 'pi-image',       desc: 'Smaller file size' },
]

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
  return (student.fullName || student.name || '')
    .split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?'
}
function getAcademicYear() {
  const now = new Date(), y = now.getFullYear()
  return now.getMonth() >= 8 ? `${y}-${y + 1}` : `${y - 1}-${y}`
}

// ── Image loader ─────────────────────────────────────────────────────────────
function loadImg(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload  = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load: ' + url))
    img.src = url
  })
}
function imgToDataUrl(img) {
  const c = document.createElement('canvas')
  c.width = img.naturalWidth || 200
  c.height = img.naturalHeight || 200
  c.getContext('2d').drawImage(img, 0, 0)
  return c.toDataURL('image/jpeg', 0.85)
}

// ── Shared card spec (mm) ────────────────────────────────────────────────────
const CARD = { W: 85.6, H: 54, HEADER_H: 14.5, BAR_H: 1.8, FOOTER_H: 8.5, RADIUS: 2.5 }
const ACCENT = [[34,197,94],[249,115,22],[239,68,68],[59,130,246]]

// ─────────────────────────────────────────────────────────────────────────────
// jsPDF card renderer
// ─────────────────────────────────────────────────────────────────────────────
function drawCardPdf(doc, x, y, student, className, academicYear, logoData) {
  const { W, H, HEADER_H, BAR_H, FOOTER_H, RADIUS } = CARD
  const BODY_Y   = y + HEADER_H + BAR_H
  const FOOTER_Y = y + H - FOOTER_H
  const CX = x + 14.8
  const CY = BODY_Y + (FOOTER_Y - BODY_Y) / 2

  // card bg
  doc.setFillColor(255,255,255); doc.setDrawColor(203,213,225); doc.setLineWidth(0.25)
  doc.roundedRect(x, y, W, H, RADIUS, RADIUS, 'FD')

  // header
  doc.setFillColor(10,36,80)
  doc.roundedRect(x, y, W, HEADER_H, RADIUS, RADIUS, 'F')
  doc.rect(x, y + HEADER_H - 3, W, 3, 'F')

  if (logoData) doc.addImage(logoData, 'JPEG', x + 2.5, y + 2, 10.5, 10.5)

  doc.setTextColor(255,255,255); doc.setFontSize(7.5); doc.setFont('helvetica','bold')
  doc.text('HFCCF PRESCHOOL', x + 15, y + 6.5)
  doc.setFontSize(5.5); doc.setFont('helvetica','normal'); doc.setTextColor(147,197,253)
  doc.text('Hope for Cambodian Children', x + 15, y + 10.5)

  // badge top-right
  doc.setDrawColor(255,255,255); doc.setLineWidth(0.3)
  doc.roundedRect(x + W - 24, y + 3.5, 22, 7, 1.2, 1.2, 'S')
  doc.setTextColor(255,255,255); doc.setFontSize(5); doc.setFont('helvetica','bold')
  doc.text('STUDENT ID CARD', x + W - 13, y + 8, { align: 'center' })

  // accent bar
  ACCENT.forEach(([r,g,b], i) => {
    doc.setFillColor(r,g,b); doc.rect(x + i * (W/4), y + HEADER_H, W/4, BAR_H, 'F')
  })

  // avatar
  doc.setFillColor(219,234,254); doc.setDrawColor(59,130,246); doc.setLineWidth(0.6)
  doc.circle(CX, CY, 11.5, 'FD')
  doc.setFillColor(239,246,255); doc.setDrawColor(191,219,254); doc.setLineWidth(0.3)
  doc.circle(CX, CY, 10, 'FD')
  const ini = getInitials(student)
  doc.setTextColor(30,64,175); doc.setFontSize(ini.length > 2 ? 8.5 : 11); doc.setFont('helvetica','bold')
  doc.text(ini, CX, CY + (ini.length > 2 ? 3 : 4), { align: 'center' })

  if (student.gender) {
    const isMale = student.gender.toLowerCase().startsWith('m')
    doc.setFillColor(isMale?219:252, isMale?234:231, isMale?254:243)
    doc.roundedRect(CX-6, CY+13, 12, 4.5, 1, 1, 'F')
    doc.setFontSize(5); doc.setFont('helvetica','bold')
    doc.setTextColor(isMale?109:190, isMale?40:24, isMale?217:93)
    doc.text(isMale ? 'MALE' : 'FEMALE', CX, CY + 16.4, { align: 'center' })
  }

  // separator
  doc.setDrawColor(226,232,240); doc.setLineWidth(0.25)
  doc.line(x + 29.5, BODY_Y + 2, x + 29.5, FOOTER_Y - 1)

  // info rows
  const IX = x + 32
  let IY = BODY_Y + 5.5
  const name = student.fullName || student.name || '—'
  doc.setFontSize(8.5); doc.setFont('helvetica','bold'); doc.setTextColor(15,23,42)
  const nameLines = doc.splitTextToSize(name, W - 35)
  doc.text(nameLines.slice(0, 2), IX, IY)
  IY += nameLines.length > 1 ? 9.5 : 5.5
  doc.setDrawColor(226,232,240); doc.setLineWidth(0.25); doc.line(IX, IY, x + W - 3, IY); IY += 4

  const infoRow = (label, value) => {
    doc.setFontSize(4.8); doc.setFont('helvetica','normal'); doc.setTextColor(148,163,184)
    doc.text(label, IX, IY); IY += 3.5
    doc.setFontSize(7); doc.setFont('helvetica','bold'); doc.setTextColor(30,64,175)
    doc.text(String(value || '—'), IX, IY); IY += 5
  }
  infoRow('STUDENT ID', student.studentCode || student.id || '—')
  infoRow('CLASS', className || '—')
  if (student.dateOfBirth) infoRow('DATE OF BIRTH', student.dateOfBirth)

  // footer
  doc.setFillColor(239,246,255); doc.rect(x, FOOTER_Y, W, FOOTER_H, 'F')
  doc.setFillColor(255,255,255); doc.rect(x, FOOTER_Y, 2.5, 2.5, 'F'); doc.rect(x+W-2.5, FOOTER_Y, 2.5, 2.5, 'F')
  doc.setDrawColor(191,219,254); doc.setLineWidth(0.25); doc.line(x, FOOTER_Y, x+W, FOOTER_Y)
  doc.setTextColor(30,64,175); doc.setFontSize(6); doc.setFont('helvetica','bold')
  doc.text(`Academic Year  ${academicYear}`, x + W/2, FOOTER_Y + 5.2, { align: 'center' })
}

// ─────────────────────────────────────────────────────────────────────────────
// Canvas card renderer (for PNG / JPG)
// ─────────────────────────────────────────────────────────────────────────────
function drawCardCanvas(ctx, xMm, yMm, student, className, academicYear, logoImg, SC) {
  const { W, H, HEADER_H, BAR_H, FOOTER_H, RADIUS } = CARD
  const p = (v) => v * SC           // mm → px
  const BODY_Y   = yMm + HEADER_H + BAR_H
  const FOOTER_Y = yMm + H - FOOTER_H
  const CX = xMm + 14.8
  const CY = BODY_Y + (FOOTER_Y - BODY_Y) / 2

  // helpers
  const setFill   = (r,g,b,a=1)  => { ctx.fillStyle   = `rgba(${r},${g},${b},${a})` }
  const setStroke = (r,g,b,a=1)  => { ctx.strokeStyle = `rgba(${r},${g},${b},${a})` }
  const setLW     = (mm)          => { ctx.lineWidth   = p(mm) }
  const setFont   = (pt, w='normal') => { ctx.font = `${w} ${p(pt * 0.352778)}px Arial, sans-serif` }
  const fillRect  = (x,y,w,h)    => ctx.fillRect(p(x),p(y),p(w),p(h))
  const fillText  = (txt,x,y,align='left',color=[15,23,42]) => {
    setFill(...color); ctx.textAlign = align; ctx.textBaseline = 'alphabetic'
    ctx.fillText(String(txt), p(x), p(y))
  }
  function rrect(x,y,w,h,r) {
    ctx.beginPath()
    ctx.moveTo(p(x+r),p(y)); ctx.lineTo(p(x+w-r),p(y))
    ctx.arcTo(p(x+w),p(y),   p(x+w),p(y+r),   p(r))
    ctx.lineTo(p(x+w),p(y+h-r))
    ctx.arcTo(p(x+w),p(y+h), p(x+w-r),p(y+h), p(r))
    ctx.lineTo(p(x+r),p(y+h))
    ctx.arcTo(p(x),p(y+h),   p(x),p(y+h-r),   p(r))
    ctx.lineTo(p(x),p(y+r))
    ctx.arcTo(p(x),p(y),     p(x+r),p(y),     p(r))
    ctx.closePath()
  }
  function arc(cx,cy,r) { ctx.beginPath(); ctx.arc(p(cx),p(cy),p(r),0,Math.PI*2); ctx.closePath() }
  function hline(x1,y1,x2,y2) { ctx.beginPath(); ctx.moveTo(p(x1),p(y1)); ctx.lineTo(p(x2),p(y2)); ctx.stroke() }

  // card bg
  setFill(255,255,255); setStroke(203,213,225); setLW(0.25)
  rrect(xMm,yMm,W,H,RADIUS); ctx.fill(); ctx.stroke()

  // header
  setFill(10,36,80)
  rrect(xMm,yMm,W,HEADER_H,RADIUS); ctx.fill()
  fillRect(xMm, yMm+HEADER_H-3, W, 3)

  if (logoImg) ctx.drawImage(logoImg, p(xMm+2.5), p(yMm+2), p(10.5), p(10.5))

  setFont(7.5,'bold'); fillText('HFCCF PRESCHOOL', xMm+15, yMm+6.5,'left',[255,255,255])
  setFont(5.5,'normal'); fillText('Hope for Cambodian Children', xMm+15, yMm+10.5,'left',[147,197,253])

  // badge
  setStroke(255,255,255,0.8); setLW(0.3)
  ctx.strokeRect(p(xMm+W-24), p(yMm+3.5), p(22), p(7))
  setFont(5,'bold'); fillText('STUDENT ID CARD', xMm+W-13, yMm+8,'center',[255,255,255])

  // accent bar
  ACCENT.forEach(([r,g,b], i) => { setFill(r,g,b); fillRect(xMm+i*(W/4), yMm+HEADER_H, W/4, BAR_H) })

  // avatar outer ring
  setFill(219,234,254); setStroke(59,130,246); setLW(0.6)
  arc(CX,CY,11.5); ctx.fill(); ctx.stroke()
  setFill(239,246,255); setStroke(191,219,254); setLW(0.3)
  arc(CX,CY,10); ctx.fill(); ctx.stroke()

  // initials
  const ini = getInitials(student)
  setFont(ini.length>2?8.5:11,'bold')
  setFill(30,64,175); ctx.textAlign='center'; ctx.textBaseline='middle'
  ctx.fillText(ini, p(CX), p(CY)); ctx.textBaseline='alphabetic'

  // gender badge
  if (student.gender) {
    const isMale = student.gender.toLowerCase().startsWith('m')
    setFill(isMale?219:252, isMale?234:231, isMale?254:243)
    ctx.beginPath(); ctx.roundRect(p(CX-6),p(CY+13),p(12),p(4.5),p(1)); ctx.fill()
    setFont(5,'bold'); fillText(isMale?'MALE':'FEMALE',CX,CY+16.4,'center',[isMale?109:190,isMale?40:24,isMale?217:93])
  }

  // separator
  setStroke(226,232,240); setLW(0.25); hline(xMm+29.5,BODY_Y+2,xMm+29.5,FOOTER_Y-1)

  // info
  const IX = xMm+32
  let IY = BODY_Y+5.5
  const name = student.fullName||student.name||'—'
  setFont(8.5,'bold'); ctx.textAlign='left'
  // simple word-wrap
  const words = name.split(' '), maxW = p(W-35)
  let l1='', l2=''
  for (const w of words) {
    const test = l1 ? l1+' '+w : w
    if (ctx.measureText(test).width <= maxW) l1=test
    else l2 = l2 ? l2+' '+w : w
  }
  setFill(15,23,42); ctx.fillText(l1, p(IX), p(IY))
  if (l2) { ctx.fillText(l2, p(IX), p(IY+4.5)); IY+=9.5 } else IY+=5.5
  setStroke(226,232,240); setLW(0.25); hline(IX,IY,xMm+W-3,IY); IY+=4

  const infoRow = (label, value) => {
    setFont(4.8,'normal'); setFill(148,163,184); ctx.textAlign='left'; ctx.fillText(label, p(IX), p(IY)); IY+=3.5
    setFont(7,'bold');     setFill(30,64,175);  ctx.fillText(String(value||'—'), p(IX), p(IY)); IY+=5
  }
  infoRow('STUDENT ID', student.studentCode||student.id||'—')
  infoRow('CLASS', className||'—')
  if (student.dateOfBirth) infoRow('DATE OF BIRTH', student.dateOfBirth)

  // footer
  setFill(239,246,255); fillRect(xMm,FOOTER_Y,W,FOOTER_H)
  setFill(255,255,255); fillRect(xMm,FOOTER_Y,2.5,2.5); fillRect(xMm+W-2.5,FOOTER_Y,2.5,2.5)
  setStroke(191,219,254); setLW(0.25); hline(xMm,FOOTER_Y,xMm+W,FOOTER_Y)
  setFont(6,'bold'); fillText(`Academic Year  ${academicYear}`, xMm+W/2, FOOTER_Y+5.2,'center',[30,64,175])
}

// ─────────────────────────────────────────────────────────────────────────────
// Data loaders
// ─────────────────────────────────────────────────────────────────────────────
async function loadClasses() {
  loadingClasses.value = true
  try {
    const res = await fetchPreschoolClasses({ page: 1, perPage: 100 })
    classOptions.value = (res.items || []).map((c) => ({ label: c.name || c.code || String(c.id), value: c.id }))
  } catch { classOptions.value = [] }
  finally { loadingClasses.value = false }
}

async function loadStudents() {
  if (!selectedClassId.value) { students.value = []; return }
  loadingStudents.value = true
  selectedStudentIds.value = []
  try {
    const res = await fetchPreschoolStudents({ page: 1, perPage: 200, classId: selectedClassId.value })
    students.value = res.items || []
  } catch { students.value = [] }
  finally { loadingStudents.value = false }
}

// ─────────────────────────────────────────────────────────────────────────────
// Generate file
// ─────────────────────────────────────────────────────────────────────────────
async function generateFile() {
  if (!selectedStudentIds.value.length) return
  generating.value = true
  try {
    const chosen    = students.value.filter((s) => selectedStudentIds.value.includes(s.id))
    const className = classOptions.value.find((c) => c.value === selectedClassId.value)?.label || ''
    const year      = getAcademicYear()
    const safeName  = className.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'students'
    const fmt       = selectedFormat.value

    // Layout constants (mm)
    const MARGIN_X = 12.9, GAP_X = 12.9
    const MARGIN_Y = 15,   GAP_Y = 8
    const { W: CW, H: CH } = CARD
    const COLS = 2
    const ROWS = Math.floor((297 - MARGIN_Y * 2 + GAP_Y) / (CH + GAP_Y))  // 4
    const PER_PAGE = COLS * ROWS

    // ── PDF ───────────────────────────────────────────────────────────
    if (fmt === 'pdf') {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      let logoData = null
      try { const img = await loadImg(logoUrl); logoData = imgToDataUrl(img) } catch {}

      for (let i = 0; i < chosen.length; i++) {
        if (i > 0 && i % PER_PAGE === 0) doc.addPage()
        const col = i % COLS
        const row = Math.floor((i % PER_PAGE) / COLS)
        const x = MARGIN_X + col * (CW + GAP_X)
        const y = MARGIN_Y + row * (CH + GAP_Y)
        drawCardPdf(doc, x, y, chosen[i], className, year, logoData)
      }
      doc.save(`id-cards-${safeName}-${year}.pdf`)
      return
    }

    // ── PNG / JPG ─────────────────────────────────────────────────────
    const SC  = 150 / 25.4          // 150 DPI  ≈ 5.906 px/mm
    const pages = Math.ceil(chosen.length / PER_PAGE)
    const totalH = MARGIN_Y * 2 + pages * (ROWS * CH + (ROWS-1) * GAP_Y) + (pages-1) * GAP_Y
    const canvas = document.createElement('canvas')
    canvas.width  = Math.round(210 * SC)
    canvas.height = Math.round(totalH * SC)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    let logoImg = null
    try { logoImg = await loadImg(logoUrl) } catch {}

    // Page label helper
    for (let p = 0; p < pages; p++) {
      const pageOffsetY = p * (MARGIN_Y + ROWS * CH + (ROWS-1) * GAP_Y + GAP_Y)
      for (let i = 0; i < PER_PAGE; i++) {
        const idx = p * PER_PAGE + i
        if (idx >= chosen.length) break
        const col = i % COLS
        const row = Math.floor(i / COLS)
        const xMm = MARGIN_X + col * (CW + GAP_X)
        const yMm = MARGIN_Y + pageOffsetY + row * (CH + GAP_Y)
        drawCardCanvas(ctx, xMm, yMm, chosen[idx], className, year, logoImg, SC)
      }
    }

    const mimeType = fmt === 'jpg' ? 'image/jpeg' : 'image/png'
    const quality  = fmt === 'jpg' ? 0.92 : undefined
    const dataUrl  = quality ? canvas.toDataURL(mimeType, quality) : canvas.toDataURL(mimeType)
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `id-cards-${safeName}-${year}.${fmt}`
    a.click()
  } catch (e) {
    console.error('Generation failed', e)
    alert('Generation failed: ' + (e?.message || e))
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

      <!-- Controls -->
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex flex-wrap items-end gap-3">
          <!-- Class picker -->
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

          <!-- Format selector -->
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">
              File Format
            </span>
            <div class="flex gap-1">
              <button
                v-for="fmt in FORMAT_OPTIONS"
                :key="fmt.value"
                type="button"
                class="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors"
                :class="selectedFormat === fmt.value
                  ? 'border-violet-400 bg-violet-50 text-violet-700'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700'"
                @click="selectedFormat = fmt.value"
              >
                <i :class="['pi text-base', fmt.icon]" />
                {{ fmt.label }}
              </button>
            </div>
          </label>

          <!-- Format description -->
          <p class="self-end pb-2 text-xs text-slate-400">
            {{ FORMAT_OPTIONS.find((f) => f.value === selectedFormat)?.desc }}
          </p>

          <div class="ml-auto self-end">
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
            <span
              v-if="selectedStudentIds.length"
              class="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700"
            >
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
            @click="generateFile"
          >
            <i :class="['pi mr-1.5', selectedFormat === 'pdf' ? 'pi-file-pdf' : 'pi-image']" />
            {{ generating ? 'Generating…' : `Generate ${selectedFormat.toUpperCase()}` }}
          </Button>
        </div>

        <!-- Student grid -->
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

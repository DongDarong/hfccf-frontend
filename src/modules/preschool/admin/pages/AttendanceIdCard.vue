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
import IdCardPreview from '@/modules/preschool/admin/components/IdCardPreview.vue'

defineOptions({ name: 'PreschoolAdminAttendanceIdCardPage' })

const { t } = useLanguage()
const router = useRouter()

const classOptions        = ref([])
const students            = ref([])
const selectedClassId     = ref('')
const selectedStudentIds  = ref([])
const selectedFormat      = ref('pdf')
const selectedOrientation = ref('landscape')
const selectedSize        = ref('standard')
const selectedLang        = ref('en')
const loadingClasses      = ref(false)
const loadingStudents     = ref(false)
const generating          = ref(false)

const LANG_OPTIONS = [
  { value: 'en', label: 'EN', desc: 'English' },
  { value: 'kh', label: 'ខ្មែរ', desc: 'Khmer' },
]

const CARD_TEXT = {
  en: {
    school:      'HFCCF PRESCHOOL',
    tagline:     'Hope for Cambodian Children',
    badge:       'STUDENT ID CARD',
    studentId:   'STUDENT ID',
    class:       'CLASS',
    grade:       'GRADE',
    dob:         'DATE OF BIRTH',
    male:        'MALE',
    female:      'FEMALE',
    academicYear: 'Academic Year',
  },
  kh: {
    school:      'សាលាមត្តេយ្យ HFCCF',
    tagline:     'សង្ឃឹមសម្រាប់កុមារកម្ពុជា',
    badge:       'អត្តសញ្ញាណបណ្ណ',
    studentId:   'លេខសម្គាល់',
    class:       'ថ្នាក់',
    grade:       'ថ្នាក់ទី',
    dob:         'ថ្ងៃកំណើត',
    male:        'ប្រុស',
    female:      'ស្រី',
    academicYear: 'ឆ្នាំសិក្សា',
  },
}

const FORMAT_OPTIONS = [
  { value: 'pdf', label: 'PDF', icon: 'pi-file-pdf', desc: 'Print-ready A4 sheet' },
  { value: 'png', label: 'PNG', icon: 'pi-image',    desc: 'Transparent background' },
  { value: 'jpg', label: 'JPG', icon: 'pi-image',    desc: 'Smaller file size' },
]
const ORIENT_OPTIONS = [
  { value: 'landscape', label: 'Landscape', icon: 'pi-stop',        desc: 'Wider than tall' },
  { value: 'portrait',  label: 'Portrait',  icon: 'pi-tablet-phone', desc: 'Taller than wide' },
]

// Card size configs — just the card dimensions (mm), no A4 grid needed
const CARD_SIZES = [
  {
    value: 'small',    label: 'Small',    icon: 'pi-minus-circle',
    landscape: { W: 70,   H: 44   },
    portrait:  { W: 44,   H: 70   },
  },
  {
    value: 'standard', label: 'Standard', icon: 'pi-id-card',
    landscape: { W: 85.6, H: 54   },
    portrait:  { W: 54,   H: 85.6 },
  },
  {
    value: 'large',    label: 'Large',    icon: 'pi-plus-circle',
    landscape: { W: 100,  H: 63   },
    portrait:  { W: 63,   H: 100  },
  },
]

const currentSizeConfig = computed(() => {
  const s = CARD_SIZES.find((s) => s.value === selectedSize.value) || CARD_SIZES[1]
  return s[selectedOrientation.value]
})

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

// ── Image helpers ─────────────────────────────────────────────────────────────

// Load a plain asset (no auth, no CORS issues expected — e.g. bundled logo)
function loadImg(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload  = () => resolve(img)
    img.onerror = () => reject(new Error('load failed'))
    img.src = url
  })
}

// Resolve a possibly-relative backend URL to an absolute one
function resolveBackendUrl(url) {
  if (!url) return ''
  if (/^https?:\/\//.test(url) || url.startsWith('//')) return url
  const base = String(import.meta.env.VITE_API_BASE_URL || window.location.origin)
  try { return new URL(url, base).href } catch { return url }
}

// Load a student photo via fetch (sends auth header, returns a same-origin blob
// URL so the canvas never gets tainted regardless of CORS headers on the server)
async function loadStudentPhotoAsImg(avatarUrl) {
  const url = resolveBackendUrl(avatarUrl)
  if (!url) throw new Error('empty url')

  const token =
    window.localStorage.getItem('hfccf-auth-token') ||
    window.sessionStorage.getItem('hfccf-auth-token') || ''

  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const blob      = await res.blob()
  const objectUrl = URL.createObjectURL(blob)

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload  = () => resolve({ img, objectUrl })
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('img load')) }
    img.src = objectUrl
  })
}

// Pre-crop an HTMLImageElement to a circle; returns a JPEG data URL for jsPDF.
// Safe to call because blob-URL images never taint the canvas.
function circularCrop(img, size = 240) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  ctx.clip()
  const nw = img.naturalWidth || size, nh = img.naturalHeight || size
  const scale = Math.max(size / nw, size / nh)
  const w = nw * scale, h = nh * scale
  ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h)
  return c.toDataURL('image/jpeg', 0.88)
}
function imgToDataUrl(img) {
  const c = document.createElement('canvas')
  c.width = img.naturalWidth || 200; c.height = img.naturalHeight || 200
  c.getContext('2d').drawImage(img, 0, 0)
  return c.toDataURL('image/jpeg', 0.85)
}

// ── Shared constants ──────────────────────────────────────────────────────────
const ACCENT = [[34,197,94],[249,115,22],[239,68,68],[59,130,246]]

function doc_splitFirst(ctx, text, maxPx) {
  const words = text.split(' '); let line = ''
  for (const w of words) {
    const test = line ? line + ' ' + w : w
    if (ctx.measureText(test).width <= maxPx) line = test; else break
  }
  return line || text
}

// ═════════════════════════════════════════════════════════════════════════════
//  jsPDF renderers  (W, H = actual card dimensions in mm)
// ═════════════════════════════════════════════════════════════════════════════
function drawCardPdf(doc, x, y, student, className, classLevel, academicYear, logoData, orientation, W, H, photoData, lang = 'en') {
  if (orientation === 'portrait') return _pdfPortrait(doc, x, y, student, className, classLevel, academicYear, logoData, W, H, photoData, lang)
  _pdfLandscape(doc, x, y, student, className, classLevel, academicYear, logoData, W, H, photoData, lang)
}

function _pdfLandscape(doc, x, y, student, className, classLevel, academicYear, logoData, W, H, photoData, lang) {
  const T = CARD_TEXT[lang] || CARD_TEXT.en
  const SW = W / 85.6, SH = H / 54, FS = Math.sqrt(SW * SH), RS = Math.min(SW, SH)
  const HEADER_H = 14.5 * SH, BAR_H = 1.8 * SH, FOOTER_H = 8.5 * SH
  const BODY_Y   = y + HEADER_H + BAR_H
  const FOOTER_Y = y + H - FOOTER_H
  const CX = x + 14.8 * SW
  const CY = BODY_Y + (FOOTER_Y - BODY_Y) / 2

  doc.setFillColor(255,255,255); doc.setDrawColor(203,213,225); doc.setLineWidth(0.25)
  doc.roundedRect(x, y, W, H, 2.5*RS, 2.5*RS, 'FD')

  doc.setFillColor(10,36,80)
  doc.roundedRect(x, y, W, HEADER_H, 2.5*RS, 2.5*RS, 'F')
  doc.rect(x, y+HEADER_H-3*SH, W, 3*SH, 'F')
  if (logoData) doc.addImage(logoData, 'JPEG', x+2.5*SW, y+2*SH, 10.5*SW, 10.5*SH)
  doc.setTextColor(255,255,255); doc.setFontSize(7.5*FS); doc.setFont('helvetica','bold')
  doc.text(T.school, x+15*SW, y+6.5*SH)
  doc.setFontSize(5.5*FS); doc.setFont('helvetica','normal'); doc.setTextColor(147,197,253)
  doc.text(T.tagline, x+15*SW, y+10.5*SH)
  doc.setDrawColor(255,255,255); doc.setLineWidth(0.3)
  doc.roundedRect(x+W-24*SW, y+3.5*SH, 22*SW, 7*SH, 1.2*RS, 1.2*RS, 'S')
  doc.setTextColor(255,255,255); doc.setFontSize(5*FS); doc.setFont('helvetica','bold')
  doc.text(T.badge, x+W-13*SW, y+8*SH, { align: 'center' })

  ACCENT.forEach(([r,g,b],i) => { doc.setFillColor(r,g,b); doc.rect(x+i*(W/4), y+HEADER_H, W/4, BAR_H, 'F') })

  // Avatar
  doc.setFillColor(219,234,254); doc.setDrawColor(59,130,246); doc.setLineWidth(0.6)
  doc.circle(CX, CY, 11.5*RS, 'F')
  if (photoData) {
    const r = 11.5*RS
    doc.addImage(photoData, 'JPEG', CX-r, CY-r, r*2, r*2)
  } else {
    doc.setFillColor(239,246,255); doc.setDrawColor(191,219,254); doc.setLineWidth(0.3)
    doc.circle(CX, CY, 10*RS, 'FD')
    const ini = getInitials(student)
    doc.setTextColor(30,64,175); doc.setFontSize((ini.length>2?8.5:11)*FS); doc.setFont('helvetica','bold')
    doc.text(ini, CX, CY+(ini.length>2?3:4)*RS, { align: 'center' })
  }
  doc.setDrawColor(59,130,246); doc.setLineWidth(0.6); doc.circle(CX, CY, 11.5*RS, 'S')
  if (student.gender) {
    const m = student.gender.toLowerCase().startsWith('m')
    doc.setFillColor(m?219:252, m?234:231, m?254:243)
    doc.roundedRect(CX-6*SW, CY+13*RS, 12*SW, 4.5*SH, RS, RS, 'F')
    doc.setFontSize(5*FS); doc.setFont('helvetica','bold')
    doc.setTextColor(m?109:190, m?40:24, m?217:93)
    doc.text(m ? T.male : T.female, CX, CY+16.4*RS, { align: 'center' })
  }

  doc.setDrawColor(226,232,240); doc.setLineWidth(0.25)
  doc.line(x+29.5*SW, BODY_Y+2*SH, x+29.5*SW, FOOTER_Y-SH)

  const IX = x+32*SW; let IY = BODY_Y+5*SH
  doc.setFontSize(8.5*FS); doc.setFont('helvetica','bold'); doc.setTextColor(15,23,42)
  doc.text(doc.splitTextToSize(student.fullName||student.name||'—', W-35*SW)[0], IX, IY); IY += 5*SH
  doc.setDrawColor(226,232,240); doc.setLineWidth(0.25); doc.line(IX, IY, x+W-3*SW, IY); IY += 3.5*SH
  doc.setFontSize(4.8*FS); doc.setFont('helvetica','normal'); doc.setTextColor(148,163,184)
  doc.text(T.studentId, IX, IY); IY += 3.5*SH
  doc.setFontSize(7*FS); doc.setFont('helvetica','bold'); doc.setTextColor(30,64,175)
  doc.text(String(student.studentCode||student.id||'—'), IX, IY); IY += 5*SH
  const GX = x+58*SW
  doc.setFontSize(4.8*FS); doc.setFont('helvetica','normal'); doc.setTextColor(148,163,184)
  doc.text(T.class, IX, IY); if (classLevel) doc.text(T.grade, GX, IY); IY += 3.5*SH
  doc.setFontSize(7*FS); doc.setFont('helvetica','bold'); doc.setTextColor(30,64,175)
  doc.text(className||'—', IX, IY); if (classLevel) doc.text(classLevel, GX, IY)

  doc.setFillColor(239,246,255); doc.rect(x, FOOTER_Y, W, FOOTER_H, 'F')
  doc.setFillColor(255,255,255); doc.rect(x,FOOTER_Y,2.5*SW,2.5*SH,'F'); doc.rect(x+W-2.5*SW,FOOTER_Y,2.5*SW,2.5*SH,'F')
  doc.setDrawColor(191,219,254); doc.setLineWidth(0.25); doc.line(x,FOOTER_Y,x+W,FOOTER_Y)
  doc.setTextColor(30,64,175); doc.setFontSize(6*FS); doc.setFont('helvetica','bold')
  doc.text(`${T.academicYear}  ${academicYear}`, x+W/2, FOOTER_Y+5.2*SH, { align: 'center' })
}

function _pdfPortrait(doc, x, y, student, className, classLevel, academicYear, logoData, W, H, photoData, lang) {
  const T = CARD_TEXT[lang] || CARD_TEXT.en
  const SW = W / 54, SH = H / 85.6, FS = Math.sqrt(SW * SH), RS = Math.min(SW, SH)
  const HEADER_H = 20*SH, BAR_H = 1.8*SH, FOOTER_H = 8.5*SH
  const BODY_Y   = y + HEADER_H + BAR_H
  const FOOTER_Y = y + H - FOOTER_H
  const CX = x + W/2

  doc.setFillColor(255,255,255); doc.setDrawColor(203,213,225); doc.setLineWidth(0.25)
  doc.roundedRect(x, y, W, H, 2.5*RS, 2.5*RS, 'FD')
  doc.setFillColor(10,36,80)
  doc.roundedRect(x, y, W, HEADER_H, 2.5*RS, 2.5*RS, 'F')
  doc.rect(x, y+HEADER_H-3*SH, W, 3*SH, 'F')
  if (logoData) doc.addImage(logoData, 'JPEG', CX-5*SW, y+2*SH, 10*SW, 10*SH)
  doc.setTextColor(255,255,255); doc.setFontSize(7.5*FS); doc.setFont('helvetica','bold')
  doc.text(T.school, CX, y+14.5*SH, { align: 'center' })
  doc.setFontSize(5*FS); doc.setFont('helvetica','normal'); doc.setTextColor(147,197,253)
  doc.text(T.tagline, CX, y+18*SH, { align: 'center' })
  ACCENT.forEach(([r,g,b],i) => { doc.setFillColor(r,g,b); doc.rect(x+i*(W/4), y+HEADER_H, W/4, BAR_H, 'F') })

  const CY_AV = BODY_Y + 12*SH
  // Avatar
  doc.setFillColor(219,234,254); doc.setDrawColor(59,130,246); doc.setLineWidth(0.6)
  doc.circle(CX, CY_AV, 10*RS, 'F')
  if (photoData) {
    const r = 10*RS
    doc.addImage(photoData, 'JPEG', CX-r, CY_AV-r, r*2, r*2)
  } else {
    doc.setFillColor(239,246,255); doc.setDrawColor(191,219,254); doc.setLineWidth(0.3)
    doc.circle(CX, CY_AV, 8.4*RS, 'FD')
    const ini = getInitials(student)
    doc.setTextColor(30,64,175); doc.setFontSize((ini.length>2?7.5:9.5)*FS); doc.setFont('helvetica','bold')
    doc.text(ini, CX, CY_AV+(ini.length>2?2.6:3.2)*RS, { align: 'center' })
  }
  doc.setDrawColor(59,130,246); doc.setLineWidth(0.6); doc.circle(CX, CY_AV, 10*RS, 'S')
  if (student.gender) {
    const m = student.gender.toLowerCase().startsWith('m')
    doc.setFillColor(m?219:252, m?234:231, m?254:243)
    doc.roundedRect(CX-6.5*SW, CY_AV+11.5*RS, 13*SW, 4*SH, RS, RS, 'F')
    doc.setFontSize(5*FS); doc.setFont('helvetica','bold')
    doc.setTextColor(m?109:190, m?40:24, m?217:93)
    doc.text(m ? T.male : T.female, CX, CY_AV+14.5*RS, { align: 'center' })
  }

  const nameY = CY_AV + 19*SH
  doc.setFontSize(8*FS); doc.setFont('helvetica','bold'); doc.setTextColor(15,23,42)
  doc.text(doc.splitTextToSize(student.fullName||student.name||'—', W-8*SW)[0], CX, nameY, { align: 'center' })
  const divY = nameY + 3.5*SH
  doc.setDrawColor(226,232,240); doc.setLineWidth(0.25); doc.line(x+4*SW, divY, x+W-4*SW, divY)

  const IY0 = divY + 3.5*SH, C1 = x+5*SW, C2 = x+W/2+1.5*SW
  doc.setFontSize(4.5*FS); doc.setFont('helvetica','normal'); doc.setTextColor(148,163,184)
  doc.text(T.studentId, C1, IY0); if (classLevel) doc.text(T.grade, C2, IY0)
  doc.setFontSize(6.5*FS); doc.setFont('helvetica','bold'); doc.setTextColor(30,64,175)
  doc.text(String(student.studentCode||student.id||'—'), C1, IY0+3.5*SH)
  if (classLevel) doc.text(classLevel, C2, IY0+3.5*SH)
  const R2Y = IY0+8.5*SH
  doc.setFontSize(4.5*FS); doc.setFont('helvetica','normal'); doc.setTextColor(148,163,184)
  doc.text(T.class, C1, R2Y); if (student.dateOfBirth) doc.text(T.dob, C2, R2Y)
  doc.setFontSize(6.5*FS); doc.setFont('helvetica','bold'); doc.setTextColor(30,64,175)
  doc.text(className||'—', C1, R2Y+3.5*SH)
  if (student.dateOfBirth) doc.text(student.dateOfBirth, C2, R2Y+3.5*SH)

  doc.setFillColor(239,246,255); doc.rect(x, FOOTER_Y, W, FOOTER_H, 'F')
  doc.setFillColor(255,255,255); doc.rect(x,FOOTER_Y,2.5*SW,2.5*SH,'F'); doc.rect(x+W-2.5*SW,FOOTER_Y,2.5*SW,2.5*SH,'F')
  doc.setDrawColor(191,219,254); doc.setLineWidth(0.25); doc.line(x,FOOTER_Y,x+W,FOOTER_Y)
  doc.setTextColor(30,64,175); doc.setFontSize(5.5*FS); doc.setFont('helvetica','bold')
  doc.text(`${T.academicYear}  ${academicYear}`, CX, FOOTER_Y+5.2*SH, { align: 'center' })
}

// ═════════════════════════════════════════════════════════════════════════════
//  Canvas renderers
// ═════════════════════════════════════════════════════════════════════════════
function drawCardCanvas(ctx, xMm, yMm, student, className, classLevel, academicYear, logoImg, SC, orientation, W, H, photoImg, lang = 'en') {
  if (orientation === 'portrait') return _canvasPortrait(ctx, xMm, yMm, student, className, classLevel, academicYear, logoImg, SC, W, H, photoImg, lang)
  _canvasLandscape(ctx, xMm, yMm, student, className, classLevel, academicYear, logoImg, SC, W, H, photoImg, lang)
}

function _makeCanvasHelpers(ctx, SC, lang = 'en') {
  const fontFamily = lang === 'kh'
    ? '"Khmer OS", Hanuman, Battambang, "Noto Sans Khmer", sans-serif'
    : 'Arial, sans-serif'
  const p   = (v) => v * SC
  const sf  = (r,g,b,a=1)  => { ctx.fillStyle   = `rgba(${r},${g},${b},${a})` }
  const ss  = (r,g,b,a=1)  => { ctx.strokeStyle = `rgba(${r},${g},${b},${a})` }
  const slw = (mm)          => { ctx.lineWidth   = p(mm) }
  const fnt = (pt, w='normal') => { ctx.font = `${w} ${p(pt*0.352778)}px ${fontFamily}` }
  const fr  = (x,y,w,h)    => ctx.fillRect(p(x),p(y),p(w),p(h))
  const txt = (t,x,y,al='left',col=[15,23,42]) => {
    sf(...col); ctx.textAlign=al; ctx.textBaseline='alphabetic'; ctx.fillText(String(t),p(x),p(y))
  }
  function rr(x,y,w,h,r,mode='F') {
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
    if (mode==='F'||mode==='FD') ctx.fill()
    if (mode==='S'||mode==='FD') ctx.stroke()
  }
  function arc(cx,cy,r,mode='F') {
    ctx.beginPath(); ctx.arc(p(cx),p(cy),p(r),0,Math.PI*2); ctx.closePath()
    if (mode==='F'||mode==='FD') ctx.fill()
    if (mode==='S'||mode==='FD') ctx.stroke()
  }
  const ln = (x1,y1,x2,y2) => { ctx.beginPath(); ctx.moveTo(p(x1),p(y1)); ctx.lineTo(p(x2),p(y2)); ctx.stroke() }
  return { p, sf, ss, slw, fnt, fr, txt, rr, arc, ln }
}

function _canvasLandscape(ctx, xMm, yMm, student, className, classLevel, academicYear, logoImg, SC, W, H, photoImg, lang) {
  const T = CARD_TEXT[lang] || CARD_TEXT.en
  const { p, sf, ss, slw, fnt, fr, txt, rr, arc, ln } = _makeCanvasHelpers(ctx, SC, lang)
  const SW = W/85.6, SH = H/54, FS = Math.sqrt(SW*SH), RS = Math.min(SW, SH)
  const HEADER_H = 14.5*SH, BAR_H = 1.8*SH, FOOTER_H = 8.5*SH
  const BODY_Y   = yMm+HEADER_H+BAR_H
  const FOOTER_Y = yMm+H-FOOTER_H
  const CX = xMm+14.8*SW
  const CY = BODY_Y+(FOOTER_Y-BODY_Y)/2

  sf(255,255,255); ss(203,213,225); slw(0.25); rr(xMm,yMm,W,H,2.5*RS,'FD')
  sf(10,36,80); rr(xMm,yMm,W,HEADER_H,2.5*RS,'F'); fr(xMm,yMm+HEADER_H-3*SH,W,3*SH)
  if (logoImg) ctx.drawImage(logoImg,p(xMm+2.5*SW),p(yMm+2*SH),p(10.5*SW),p(10.5*SH))
  fnt(7.5*FS,'bold'); txt(T.school,xMm+15*SW,yMm+6.5*SH,'left',[255,255,255])
  fnt(5.5*FS,'normal'); txt(T.tagline,xMm+15*SW,yMm+10.5*SH,'left',[147,197,253])
  ss(255,255,255,0.8); slw(0.3); ctx.strokeRect(p(xMm+W-24*SW),p(yMm+3.5*SH),p(22*SW),p(7*SH))
  fnt(5*FS,'bold'); txt(T.badge,xMm+W-13*SW,yMm+8*SH,'center',[255,255,255])
  ACCENT.forEach(([r,g,b],i) => { sf(r,g,b); fr(xMm+i*(W/4),yMm+HEADER_H,W/4,BAR_H) })

  // Avatar
  sf(219,234,254); arc(CX,CY,11.5*RS,'F')
  if (photoImg) {
    const r=p(11.5*RS), nw=photoImg.naturalWidth||100, nh=photoImg.naturalHeight||100
    const scale=Math.max((r*2)/nw,(r*2)/nh), dw=nw*scale, dh=nh*scale
    ctx.save(); ctx.beginPath(); ctx.arc(p(CX),p(CY),r,0,Math.PI*2); ctx.clip()
    ctx.drawImage(photoImg,p(CX)-dw/2,p(CY)-dh/2,dw,dh)
    ctx.restore()
  } else {
    sf(239,246,255); ss(191,219,254); slw(0.3); arc(CX,CY,10*RS,'FD')
    const ini=getInitials(student)
    fnt((ini.length>2?8.5:11)*FS,'bold'); sf(30,64,175); ctx.textAlign='center'; ctx.textBaseline='middle'
    ctx.fillText(ini,p(CX),p(CY)); ctx.textBaseline='alphabetic'
  }
  ss(59,130,246); slw(0.6); arc(CX,CY,11.5*RS,'S')
  if (student.gender) {
    const m=student.gender.toLowerCase().startsWith('m')
    sf(m?219:252,m?234:231,m?254:243)
    ctx.beginPath(); ctx.roundRect(p(CX-6*SW),p(CY+13*RS),p(12*SW),p(4.5*SH),p(RS)); ctx.fill()
    fnt(5*FS,'bold'); txt(m ? T.male : T.female,CX,CY+16.4*RS,'center',[m?109:190,m?40:24,m?217:93])
  }
  ss(226,232,240); slw(0.25); ln(xMm+29.5*SW,BODY_Y+2*SH,xMm+29.5*SW,FOOTER_Y-SH)

  const IX=xMm+32*SW, GX=xMm+58*SW; let IY=BODY_Y+5*SH
  fnt(8.5*FS,'bold'); sf(15,23,42); ctx.textAlign='left'
  ctx.fillText(doc_splitFirst(ctx,student.fullName||student.name||'—',p(W-35*SW)),p(IX),p(IY)); IY+=5*SH
  ss(226,232,240); slw(0.25); ln(IX,IY,xMm+W-3*SW,IY); IY+=3.5*SH
  fnt(4.8*FS,'normal'); sf(148,163,184); ctx.fillText(T.studentId,p(IX),p(IY)); IY+=3.5*SH
  fnt(7*FS,'bold'); sf(30,64,175); ctx.fillText(String(student.studentCode||student.id||'—'),p(IX),p(IY)); IY+=5*SH
  fnt(4.8*FS,'normal'); sf(148,163,184)
  ctx.fillText(T.class,p(IX),p(IY)); if(classLevel) ctx.fillText(T.grade,p(GX),p(IY)); IY+=3.5*SH
  fnt(7*FS,'bold'); sf(30,64,175)
  ctx.fillText(className||'—',p(IX),p(IY)); if(classLevel) ctx.fillText(classLevel,p(GX),p(IY))

  sf(239,246,255); fr(xMm,FOOTER_Y,W,FOOTER_H)
  sf(255,255,255); fr(xMm,FOOTER_Y,2.5*SW,2.5*SH); fr(xMm+W-2.5*SW,FOOTER_Y,2.5*SW,2.5*SH)
  ss(191,219,254); slw(0.25); ln(xMm,FOOTER_Y,xMm+W,FOOTER_Y)
  fnt(6*FS,'bold'); txt(`${T.academicYear}  ${academicYear}`,xMm+W/2,FOOTER_Y+5.2*SH,'center',[30,64,175])
}

function _canvasPortrait(ctx, xMm, yMm, student, className, classLevel, academicYear, logoImg, SC, W, H, photoImg, lang) {
  const T = CARD_TEXT[lang] || CARD_TEXT.en
  const { p, sf, ss, slw, fnt, fr, txt, rr, arc, ln } = _makeCanvasHelpers(ctx, SC, lang)
  const SW = W/54, SH = H/85.6, FS = Math.sqrt(SW*SH), RS = Math.min(SW, SH)
  const HEADER_H = 20*SH, BAR_H = 1.8*SH, FOOTER_H = 8.5*SH
  const BODY_Y   = yMm+HEADER_H+BAR_H
  const FOOTER_Y = yMm+H-FOOTER_H
  const CX = xMm+W/2

  sf(255,255,255); ss(203,213,225); slw(0.25); rr(xMm,yMm,W,H,2.5*RS,'FD')
  sf(10,36,80); rr(xMm,yMm,W,HEADER_H,2.5*RS,'F'); fr(xMm,yMm+HEADER_H-3*SH,W,3*SH)
  if (logoImg) ctx.drawImage(logoImg,p(CX-5*SW),p(yMm+2*SH),p(10*SW),p(10*SH))
  fnt(7.5*FS,'bold'); txt(T.school,CX,yMm+14.5*SH,'center',[255,255,255])
  fnt(5*FS,'normal'); txt(T.tagline,CX,yMm+18*SH,'center',[147,197,253])
  ACCENT.forEach(([r,g,b],i) => { sf(r,g,b); fr(xMm+i*(W/4),yMm+HEADER_H,W/4,BAR_H) })

  const CY_AV=BODY_Y+12*SH
  // Avatar
  sf(219,234,254); arc(CX,CY_AV,10*RS,'F')
  if (photoImg) {
    const r=p(10*RS), nw=photoImg.naturalWidth||100, nh=photoImg.naturalHeight||100
    const scale=Math.max((r*2)/nw,(r*2)/nh), dw=nw*scale, dh=nh*scale
    ctx.save(); ctx.beginPath(); ctx.arc(p(CX),p(CY_AV),r,0,Math.PI*2); ctx.clip()
    ctx.drawImage(photoImg,p(CX)-dw/2,p(CY_AV)-dh/2,dw,dh)
    ctx.restore()
  } else {
    sf(239,246,255); ss(191,219,254); slw(0.3); arc(CX,CY_AV,8.4*RS,'FD')
    const ini=getInitials(student)
    fnt((ini.length>2?7.5:9.5)*FS,'bold'); sf(30,64,175); ctx.textAlign='center'; ctx.textBaseline='middle'
    ctx.fillText(ini,p(CX),p(CY_AV)); ctx.textBaseline='alphabetic'
  }
  ss(59,130,246); slw(0.6); arc(CX,CY_AV,10*RS,'S')
  if (student.gender) {
    const m=student.gender.toLowerCase().startsWith('m')
    sf(m?219:252,m?234:231,m?254:243)
    ctx.beginPath(); ctx.roundRect(p(CX-6.5*SW),p(CY_AV+11.5*RS),p(13*SW),p(4*SH),p(RS)); ctx.fill()
    fnt(5*FS,'bold'); txt(m ? T.male : T.female,CX,CY_AV+14.5*RS,'center',[m?109:190,m?40:24,m?217:93])
  }

  const nameY=CY_AV+19*SH
  fnt(8*FS,'bold'); sf(15,23,42); ctx.textAlign='center'
  ctx.fillText(doc_splitFirst(ctx,student.fullName||student.name||'—',p(W-8*SW)),p(CX),p(nameY))
  const divY=nameY+3.5*SH; ss(226,232,240); slw(0.25); ln(xMm+4*SW,divY,xMm+W-4*SW,divY)

  const IY0=divY+3.5*SH, C1=xMm+5*SW, C2=xMm+W/2+1.5*SW
  fnt(4.5*FS,'normal'); sf(148,163,184); ctx.textAlign='left'
  ctx.fillText(T.studentId,p(C1),p(IY0)); if(classLevel) ctx.fillText(T.grade,p(C2),p(IY0))
  fnt(6.5*FS,'bold'); sf(30,64,175)
  ctx.fillText(String(student.studentCode||student.id||'—'),p(C1),p(IY0+3.5*SH))
  if(classLevel) ctx.fillText(classLevel,p(C2),p(IY0+3.5*SH))
  const R2Y=IY0+8.5*SH
  fnt(4.5*FS,'normal'); sf(148,163,184)
  ctx.fillText(T.class,p(C1),p(R2Y)); if(student.dateOfBirth) ctx.fillText(T.dob,p(C2),p(R2Y))
  fnt(6.5*FS,'bold'); sf(30,64,175)
  ctx.fillText(className||'—',p(C1),p(R2Y+3.5*SH))
  if(student.dateOfBirth) ctx.fillText(student.dateOfBirth,p(C2),p(R2Y+3.5*SH))

  sf(239,246,255); fr(xMm,FOOTER_Y,W,FOOTER_H)
  sf(255,255,255); fr(xMm,FOOTER_Y,2.5*SW,2.5*SH); fr(xMm+W-2.5*SW,FOOTER_Y,2.5*SW,2.5*SH)
  ss(191,219,254); slw(0.25); ln(xMm,FOOTER_Y,xMm+W,FOOTER_Y)
  fnt(5.5*FS,'bold'); txt(`${T.academicYear}  ${academicYear}`,CX,FOOTER_Y+5.2*SH,'center',[30,64,175])
}

// ─────────────────────────────────────────────────────────────────────────────
//  Data loaders
// ─────────────────────────────────────────────────────────────────────────────
async function loadClasses() {
  loadingClasses.value = true
  try {
    const res = await fetchPreschoolClasses({ page: 1, perPage: 100 })
    classOptions.value = (res.items||[]).map((c) => ({
      label: c.name||c.code||String(c.id), value: c.id, level: c.level||'',
    }))
  } catch { classOptions.value = [] }
  finally { loadingClasses.value = false }
}
async function loadStudents() {
  if (!selectedClassId.value) { students.value=[]; return }
  loadingStudents.value = true; selectedStudentIds.value = []
  try {
    const res = await fetchPreschoolStudents({ page:1, perPage:200, classId: selectedClassId.value })
    students.value = res.items || []
  } catch { students.value = [] }
  finally { loadingStudents.value = false }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Generate
// ─────────────────────────────────────────────────────────────────────────────
async function generateFile() {
  if (!selectedStudentIds.value.length) return
  generating.value = true
  const blobUrls = []   // declared here so finally can revoke them
  try {
    const chosen     = students.value.filter((s) => selectedStudentIds.value.includes(s.id))
    const classObj   = classOptions.value.find((c) => c.value === selectedClassId.value)
    const className  = classObj?.label || ''
    const classLevel = classObj?.level || ''
    const year       = getAcademicYear()
    const safeName   = className.replace(/[^a-z0-9]/gi,'-').toLowerCase() || 'students'
    const fmt        = selectedFormat.value
    const orient     = selectedOrientation.value
    const lang       = selectedLang.value

    const { W: CARD_W, H: CARD_H } =
      (CARD_SIZES.find((s) => s.value === selectedSize.value) || CARD_SIZES[1])[orient]

    // Diagnostic: log raw API data for the first student so the developer
    // can check which field name the backend uses for the photo.
    if (chosen.length > 0) {
      console.groupCollapsed('[ID Card] Photo diagnostic')
      console.log('First student raw API payload:', chosen[0].raw)
      console.log('Resolved avatarUrl:', chosen[0].avatarUrl || '(empty — no photo field found)')
      console.groupEnd()
    }

    // Pre-load student photos via fetch+blob so canvas is never tainted.
    const photoImgCache = new Map()
    await Promise.allSettled(chosen.map(async (s) => {
      if (!s.avatarUrl) {
        console.warn(`[ID Card] No avatarUrl for "${s.fullName || s.id}" — showing initials`)
        return
      }
      try {
        const { img, objectUrl } = await loadStudentPhotoAsImg(s.avatarUrl)
        photoImgCache.set(s.id, img)
        blobUrls.push(objectUrl)
        console.log(`[ID Card] Photo loaded for "${s.fullName || s.id}"`)
      } catch (e) {
        console.warn(`[ID Card] Photo failed for "${s.fullName || s.id}" (${s.avatarUrl}):`, e.message)
      }
    }))

    // ── PDF: one card per page, page = card dimensions ────────────────
    if (fmt === 'pdf') {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ orientation: orient, unit: 'mm', format: [CARD_W, CARD_H] })

      if (lang === 'kh') {
        // jsPDF has no Khmer font — render each card via canvas then embed as image
        const SC2 = 300 / 25.4
        let logoImg2 = null; try { logoImg2 = await loadImg(logoUrl) } catch {}
        for (let i = 0; i < chosen.length; i++) {
          if (i > 0) doc.addPage([CARD_W, CARD_H])
          const cv = document.createElement('canvas')
          cv.width = Math.round(CARD_W * SC2); cv.height = Math.round(CARD_H * SC2)
          drawCardCanvas(cv.getContext('2d'), 0, 0, chosen[i], className, classLevel, year, logoImg2, SC2, orient, CARD_W, CARD_H, photoImgCache.get(chosen[i].id) || null, 'kh')
          doc.addImage(cv.toDataURL('image/jpeg', 0.93), 'JPEG', 0, 0, CARD_W, CARD_H)
        }
      } else {
        let logoData = null
        try { logoData = imgToDataUrl(await loadImg(logoUrl)) } catch {}
        for (let i = 0; i < chosen.length; i++) {
          if (i > 0) doc.addPage([CARD_W, CARD_H])
          const photoImg  = photoImgCache.get(chosen[i].id) || null
          const photoData = photoImg ? circularCrop(photoImg) : null
          drawCardPdf(doc, 0, 0, chosen[i], className, classLevel, year, logoData, orient, CARD_W, CARD_H, photoData, 'en')
        }
      }
      doc.save(`id-cards-${safeName}-${year}.pdf`)
      return
    }

    // ── PNG / JPG: card-width image, cards stacked vertically ─────────
    const SC      = 300 / 25.4   // 300 DPI
    const cardPxW = Math.round(CARD_W * SC)
    const cardPxH = Math.round(CARD_H * SC)
    const canvas  = document.createElement('canvas')
    canvas.width  = cardPxW
    canvas.height = cardPxH * chosen.length
    const ctx = canvas.getContext('2d')
    if (fmt === 'jpg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height) }
    let logoImg = null; try { logoImg = await loadImg(logoUrl) } catch {}
    for (let i = 0; i < chosen.length; i++) {
      drawCardCanvas(ctx, 0, CARD_H * i, chosen[i], className, classLevel, year, logoImg, SC, orient, CARD_W, CARD_H, photoImgCache.get(chosen[i].id) || null, lang)
    }
    const mime    = fmt === 'jpg' ? 'image/jpeg' : 'image/png'
    const dataUrl = fmt === 'jpg' ? canvas.toDataURL(mime, 0.92) : canvas.toDataURL(mime)
    const a = document.createElement('a')
    a.href = dataUrl; a.download = `id-cards-${safeName}-${year}.${fmt}`; a.click()
  } catch (e) {
    console.error('Generation failed', e); alert('Generation failed: '+(e?.message||e))
  } finally {
    blobUrls.forEach((u) => URL.revokeObjectURL(u))
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
        <div class="flex flex-wrap items-start gap-4">

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

          <!-- Card Size -->
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Card Size</span>
            <div class="flex gap-1">
              <button
                v-for="sz in CARD_SIZES"
                :key="sz.value"
                type="button"
                class="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors"
                :class="selectedSize === sz.value
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700'"
                @click="selectedSize = sz.value"
              >
                <i :class="['pi text-base', sz.icon]" />
                {{ sz.label }}
              </button>
            </div>
            <span class="text-xs text-slate-400">
              {{ currentSizeConfig.W }} × {{ currentSizeConfig.H }} mm
            </span>
          </label>

          <!-- Language -->
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Language</span>
            <div class="flex gap-1">
              <button
                v-for="lo in LANG_OPTIONS"
                :key="lo.value"
                type="button"
                class="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors"
                :class="selectedLang === lo.value
                  ? 'border-amber-400 bg-amber-50 text-amber-700'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700'"
                :title="lo.desc"
                @click="selectedLang = lo.value"
              >
                {{ lo.label }}
              </button>
            </div>
            <span v-if="selectedLang === 'kh' && selectedFormat === 'pdf'" class="text-xs text-amber-600">
              PDF in KH renders via canvas image
            </span>
          </label>

          <!-- Orientation -->
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Orientation</span>
            <div class="flex gap-1">
              <button
                v-for="opt in ORIENT_OPTIONS"
                :key="opt.value"
                type="button"
                class="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors"
                :class="selectedOrientation === opt.value
                  ? 'border-teal-400 bg-teal-50 text-teal-700'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700'"
                @click="selectedOrientation = opt.value"
              >
                <i :class="['pi text-base', opt.icon]" />
                {{ opt.label }}
              </button>
            </div>
          </label>

          <!-- Format -->
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">File Format</span>
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
            <span class="text-xs text-slate-400">{{ FORMAT_OPTIONS.find((f) => f.value === selectedFormat)?.desc }}</span>
          </label>

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
      <div v-if="loadingStudents" class="rounded-2xl border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-400">
        {{ t('preschoolReportsShared.loading') }}
      </div>

      <div v-else-if="selectedClassId && !students.length" class="rounded-2xl border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-400">
        No students found in this class.
      </div>

      <!-- Student list -->
      <div v-else-if="students.length" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div class="flex items-center gap-3">
            <label class="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" :checked="allSelected" class="h-4 w-4 rounded accent-violet-600" @change="toggleSelectAll">
              <span>Select all <span class="text-slate-400">({{ students.length }})</span></span>
            </label>
            <span v-if="selectedStudentIds.length" class="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">
              {{ selectedStudentIds.length }} selected
            </span>
          </div>
          <Button
            type="button" variant="primary" size="md" rounded="xl"
            :loading="generating" :disabled="generating || !selectedStudentIds.length"
            @click="generateFile"
          >
            <i :class="['pi mr-1.5', selectedFormat==='pdf' ? 'pi-file-pdf' : 'pi-image']" />
            {{ generating ? 'Generating…' : `Generate ${selectedFormat.toUpperCase()}` }}
          </Button>
        </div>

        <div class="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <label
            v-for="student in students" :key="student.id"
            class="flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors"
            :class="selectedStudentIds.includes(student.id)
              ? 'border-violet-300 bg-violet-50'
              : 'border-slate-200 bg-white hover:border-slate-300'"
          >
            <input type="checkbox" :checked="selectedStudentIds.includes(student.id)"
              class="h-4 w-4 flex-shrink-0 rounded accent-violet-600" @change="toggleStudent(student.id)">
            <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800 ring-2 ring-blue-200">
              {{ getInitials(student) }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-slate-900">{{ student.fullName||student.name||'—' }}</p>
              <p class="text-xs text-slate-400">
                <span v-if="student.studentCode">#{{ student.studentCode }}</span>
                <span v-if="student.studentCode && student.gender"> · </span>
                <span v-if="student.gender" class="capitalize">{{ student.gender }}</span>
              </p>
            </div>
            <span
              :title="student.avatarUrl ? 'Has photo' : 'No photo'"
              class="shrink-0 text-xs"
              :class="student.avatarUrl ? 'text-emerald-500' : 'text-slate-300'"
            >
              <i class="pi pi-image" />
            </span>
          </label>
        </div>
      </div>

      <div v-else class="rounded-2xl border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-400">
        Select a class above to load students.
      </div>

      <!-- ── Card Preview ──────────────────────────────────────────────────── -->
      <div v-if="students.length" class="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <span class="text-sm font-semibold text-slate-700">Card Preview</span>
          <span class="text-xs text-slate-400">
            {{ selectedStudentIds.length || students.length }} card{{ (selectedStudentIds.length || students.length) !== 1 ? 's' : '' }}
            · {{ selectedOrientation }} · {{ CARD_SIZES.find(s => s.value === selectedSize)?.label }}
            · {{ currentSizeConfig.W }}×{{ currentSizeConfig.H }} mm
          </span>
        </div>

        <div
          class="flex flex-wrap gap-4 p-4"
          :class="selectedOrientation === 'portrait' ? 'items-start' : 'items-center'"
        >
          <IdCardPreview
            v-for="student in (selectedStudentIds.length ? students.filter(s => selectedStudentIds.includes(s.id)) : students)"
            :key="student.id"
            :student="student"
            :class-name="classOptions.find(c => c.value === selectedClassId)?.label || ''"
            :class-level="classOptions.find(c => c.value === selectedClassId)?.level || ''"
            :academic-year="new Date().getMonth() >= 8
              ? `${new Date().getFullYear()}-${new Date().getFullYear()+1}`
              : `${new Date().getFullYear()-1}-${new Date().getFullYear()}`"
            :orientation="selectedOrientation"
            :lang="selectedLang"
            :width="selectedOrientation === 'portrait' ? 160 : 260"
          />
        </div>
      </div>

    </section>
  </MainLayout>
</template>

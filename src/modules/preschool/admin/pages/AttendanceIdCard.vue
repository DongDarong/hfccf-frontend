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

const classOptions       = ref([])
const students           = ref([])
const selectedClassId    = ref('')
const selectedStudentIds = ref([])
const selectedFormat     = ref('pdf')
const selectedOrientation = ref('landscape')
const loadingClasses     = ref(false)
const loadingStudents    = ref(false)
const generating         = ref(false)

const FORMAT_OPTIONS = [
  { value: 'pdf', label: 'PDF', icon: 'pi-file-pdf',  desc: 'Print-ready A4 sheet' },
  { value: 'png', label: 'PNG', icon: 'pi-image',      desc: 'Transparent background' },
  { value: 'jpg', label: 'JPG', icon: 'pi-image',      desc: 'Smaller file size' },
]
const ORIENT_OPTIONS = [
  { value: 'landscape', label: 'Landscape', icon: 'pi-stop',          desc: '85.6 × 54 mm  ·  2 × 4 / page' },
  { value: 'portrait',  label: 'Portrait',  icon: 'pi-tablet-phone',  desc: '54 × 85.6 mm  ·  3 × 3 / page' },
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

// ── Image helpers ─────────────────────────────────────────────────────────────
function loadImg(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload  = () => resolve(img)
    img.onerror = () => reject(new Error('load failed'))
    img.src = url
  })
}
function imgToDataUrl(img) {
  const c = document.createElement('canvas')
  c.width = img.naturalWidth || 200; c.height = img.naturalHeight || 200
  c.getContext('2d').drawImage(img, 0, 0)
  return c.toDataURL('image/jpeg', 0.85)
}

// ── Shared constants ──────────────────────────────────────────────────────────
const ACCENT = [[34,197,94],[249,115,22],[239,68,68],[59,130,246]]

// ═════════════════════════════════════════════════════════════════════════════
//  jsPDF renderers
// ═════════════════════════════════════════════════════════════════════════════
function drawCardPdf(doc, x, y, student, className, academicYear, logoData, orientation) {
  if (orientation === 'portrait') return _pdfPortrait(doc, x, y, student, className, academicYear, logoData)
  _pdfLandscape(doc, x, y, student, className, academicYear, logoData)
}

function _pdfLandscape(doc, x, y, student, className, academicYear, logoData) {
  const W = 85.6, H = 54, R = 2.5, HEADER_H = 14.5, BAR_H = 1.8, FOOTER_H = 8.5
  const BODY_Y   = y + HEADER_H + BAR_H
  const FOOTER_Y = y + H - FOOTER_H
  const CX = x + 14.8, CY = BODY_Y + (FOOTER_Y - BODY_Y) / 2

  doc.setFillColor(255,255,255); doc.setDrawColor(203,213,225); doc.setLineWidth(0.25)
  doc.roundedRect(x, y, W, H, R, R, 'FD')

  doc.setFillColor(10,36,80)
  doc.roundedRect(x, y, W, HEADER_H, R, R, 'F')
  doc.rect(x, y + HEADER_H - 3, W, 3, 'F')
  if (logoData) doc.addImage(logoData, 'JPEG', x + 2.5, y + 2, 10.5, 10.5)
  doc.setTextColor(255,255,255); doc.setFontSize(7.5); doc.setFont('helvetica','bold')
  doc.text('HFCCF PRESCHOOL', x + 15, y + 6.5)
  doc.setFontSize(5.5); doc.setFont('helvetica','normal'); doc.setTextColor(147,197,253)
  doc.text('Hope for Cambodian Children', x + 15, y + 10.5)
  doc.setDrawColor(255,255,255); doc.setLineWidth(0.3)
  doc.roundedRect(x + W - 24, y + 3.5, 22, 7, 1.2, 1.2, 'S')
  doc.setTextColor(255,255,255); doc.setFontSize(5); doc.setFont('helvetica','bold')
  doc.text('STUDENT ID CARD', x + W - 13, y + 8, { align: 'center' })

  ACCENT.forEach(([r,g,b], i) => { doc.setFillColor(r,g,b); doc.rect(x + i*(W/4), y + HEADER_H, W/4, BAR_H, 'F') })

  doc.setFillColor(219,234,254); doc.setDrawColor(59,130,246); doc.setLineWidth(0.6)
  doc.circle(CX, CY, 11.5, 'FD')
  doc.setFillColor(239,246,255); doc.setDrawColor(191,219,254); doc.setLineWidth(0.3)
  doc.circle(CX, CY, 10, 'FD')
  const ini = getInitials(student)
  doc.setTextColor(30,64,175); doc.setFontSize(ini.length>2?8.5:11); doc.setFont('helvetica','bold')
  doc.text(ini, CX, CY + (ini.length>2?3:4), { align: 'center' })
  if (student.gender) {
    const m = student.gender.toLowerCase().startsWith('m')
    doc.setFillColor(m?219:252, m?234:231, m?254:243)
    doc.roundedRect(CX-6, CY+13, 12, 4.5, 1, 1, 'F')
    doc.setFontSize(5); doc.setFont('helvetica','bold')
    doc.setTextColor(m?109:190, m?40:24, m?217:93)
    doc.text(m?'MALE':'FEMALE', CX, CY+16.4, { align: 'center' })
  }

  doc.setDrawColor(226,232,240); doc.setLineWidth(0.25)
  doc.line(x+29.5, BODY_Y+2, x+29.5, FOOTER_Y-1)

  const IX = x+32; let IY = BODY_Y+5.5
  const name = student.fullName||student.name||'—'
  doc.setFontSize(8.5); doc.setFont('helvetica','bold'); doc.setTextColor(15,23,42)
  const nl = doc.splitTextToSize(name, W-35)
  doc.text(nl.slice(0,2), IX, IY); IY += nl.length>1 ? 9.5 : 5.5
  doc.setDrawColor(226,232,240); doc.setLineWidth(0.25); doc.line(IX, IY, x+W-3, IY); IY += 4
  const row = (lbl, val) => {
    doc.setFontSize(4.8); doc.setFont('helvetica','normal'); doc.setTextColor(148,163,184)
    doc.text(lbl, IX, IY); IY += 3.5
    doc.setFontSize(7); doc.setFont('helvetica','bold'); doc.setTextColor(30,64,175)
    doc.text(String(val||'—'), IX, IY); IY += 5
  }
  row('STUDENT ID', student.studentCode||student.id||'—')
  row('CLASS', className||'—')
  if (student.dateOfBirth) row('DATE OF BIRTH', student.dateOfBirth)

  doc.setFillColor(239,246,255); doc.rect(x, FOOTER_Y, W, FOOTER_H, 'F')
  doc.setFillColor(255,255,255); doc.rect(x,FOOTER_Y,2.5,2.5,'F'); doc.rect(x+W-2.5,FOOTER_Y,2.5,2.5,'F')
  doc.setDrawColor(191,219,254); doc.setLineWidth(0.25); doc.line(x,FOOTER_Y,x+W,FOOTER_Y)
  doc.setTextColor(30,64,175); doc.setFontSize(6); doc.setFont('helvetica','bold')
  doc.text(`Academic Year  ${academicYear}`, x+W/2, FOOTER_Y+5.2, { align: 'center' })
}

function _pdfPortrait(doc, x, y, student, className, academicYear, logoData) {
  const W = 54, H = 85.6, R = 2.5, HEADER_H = 20, BAR_H = 1.8, FOOTER_H = 8.5
  const BODY_Y   = y + HEADER_H + BAR_H
  const FOOTER_Y = y + H - FOOTER_H
  const CX = x + W / 2   // 27mm from left edge

  doc.setFillColor(255,255,255); doc.setDrawColor(203,213,225); doc.setLineWidth(0.25)
  doc.roundedRect(x, y, W, H, R, R, 'FD')

  // Header
  doc.setFillColor(10,36,80)
  doc.roundedRect(x, y, W, HEADER_H, R, R, 'F')
  doc.rect(x, y+HEADER_H-3, W, 3, 'F')
  if (logoData) doc.addImage(logoData, 'JPEG', CX-5, y+2, 10, 10)
  doc.setTextColor(255,255,255); doc.setFontSize(7.5); doc.setFont('helvetica','bold')
  doc.text('HFCCF PRESCHOOL', CX, y+14.5, { align: 'center' })
  doc.setFontSize(5); doc.setFont('helvetica','normal'); doc.setTextColor(147,197,253)
  doc.text('Hope for Cambodian Children', CX, y+18, { align: 'center' })

  // Accent bar
  ACCENT.forEach(([r,g,b], i) => { doc.setFillColor(r,g,b); doc.rect(x+i*(W/4), y+HEADER_H, W/4, BAR_H, 'F') })

  // Avatar
  const CY_AV = BODY_Y + 13
  doc.setFillColor(219,234,254); doc.setDrawColor(59,130,246); doc.setLineWidth(0.6)
  doc.circle(CX, CY_AV, 11, 'FD')
  doc.setFillColor(239,246,255); doc.setDrawColor(191,219,254); doc.setLineWidth(0.3)
  doc.circle(CX, CY_AV, 9.2, 'FD')
  const ini = getInitials(student)
  doc.setTextColor(30,64,175); doc.setFontSize(ini.length>2?8:10); doc.setFont('helvetica','bold')
  doc.text(ini, CX, CY_AV+(ini.length>2?2.8:3.5), { align: 'center' })

  // Gender badge
  if (student.gender) {
    const m = student.gender.toLowerCase().startsWith('m')
    doc.setFillColor(m?219:252, m?234:231, m?254:243)
    doc.roundedRect(CX-6.5, CY_AV+12.5, 13, 4.2, 1, 1, 'F')
    doc.setFontSize(5); doc.setFont('helvetica','bold')
    doc.setTextColor(m?109:190, m?40:24, m?217:93)
    doc.text(m?'MALE':'FEMALE', CX, CY_AV+15.6, { align: 'center' })
  }

  // Name (single line, centred)
  const nameY = CY_AV + 20.5
  const name = student.fullName||student.name||'—'
  doc.setFontSize(8); doc.setFont('helvetica','bold'); doc.setTextColor(15,23,42)
  const nl = doc.splitTextToSize(name, W-8)
  doc.text(nl[0], CX, nameY, { align: 'center' })

  // Divider
  const divY = nameY + 3.5
  doc.setDrawColor(226,232,240); doc.setLineWidth(0.25)
  doc.line(x+4, divY, x+W-4, divY)

  // 2-column info grid
  const IY0 = divY + 4.5
  const C1 = x+5, C2 = x+W/2+1.5

  doc.setFontSize(4.5); doc.setFont('helvetica','normal'); doc.setTextColor(148,163,184)
  doc.text('STUDENT ID', C1, IY0); doc.text('CLASS', C2, IY0)
  doc.setFontSize(6.5); doc.setFont('helvetica','bold'); doc.setTextColor(30,64,175)
  doc.text(String(student.studentCode||student.id||'—'), C1, IY0+4)
  doc.text(className||'—', C2, IY0+4)

  if (student.dateOfBirth) {
    doc.setFontSize(4.5); doc.setFont('helvetica','normal'); doc.setTextColor(148,163,184)
    doc.text('DATE OF BIRTH', C1, IY0+9)
    doc.setFontSize(6.5); doc.setFont('helvetica','bold'); doc.setTextColor(30,64,175)
    doc.text(student.dateOfBirth, C1, IY0+13)
  }

  // Footer
  doc.setFillColor(239,246,255); doc.rect(x, FOOTER_Y, W, FOOTER_H, 'F')
  doc.setFillColor(255,255,255); doc.rect(x,FOOTER_Y,2.5,2.5,'F'); doc.rect(x+W-2.5,FOOTER_Y,2.5,2.5,'F')
  doc.setDrawColor(191,219,254); doc.setLineWidth(0.25); doc.line(x,FOOTER_Y,x+W,FOOTER_Y)
  doc.setTextColor(30,64,175); doc.setFontSize(5.5); doc.setFont('helvetica','bold')
  doc.text(`Academic Year  ${academicYear}`, CX, FOOTER_Y+5.2, { align: 'center' })
}

// ═════════════════════════════════════════════════════════════════════════════
//  Canvas renderers
// ═════════════════════════════════════════════════════════════════════════════
function drawCardCanvas(ctx, xMm, yMm, student, className, academicYear, logoImg, SC, orientation) {
  if (orientation === 'portrait') return _canvasPortrait(ctx, xMm, yMm, student, className, academicYear, logoImg, SC)
  _canvasLandscape(ctx, xMm, yMm, student, className, academicYear, logoImg, SC)
}

function _makeCanvasHelpers(ctx, SC) {
  const p   = (v) => v * SC
  const sf  = (r,g,b,a=1)  => { ctx.fillStyle   = `rgba(${r},${g},${b},${a})` }
  const ss  = (r,g,b,a=1)  => { ctx.strokeStyle = `rgba(${r},${g},${b},${a})` }
  const slw = (mm)          => { ctx.lineWidth   = p(mm) }
  const fnt = (pt, w='normal') => { ctx.font = `${w} ${p(pt*0.352778)}px Arial,sans-serif` }
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

function _canvasLandscape(ctx, xMm, yMm, student, className, academicYear, logoImg, SC) {
  const { p, sf, ss, slw, fnt, fr, txt, rr, arc, ln } = _makeCanvasHelpers(ctx, SC)
  const W=85.6, H=54, R=2.5, HEADER_H=14.5, BAR_H=1.8, FOOTER_H=8.5
  const BODY_Y   = yMm+HEADER_H+BAR_H
  const FOOTER_Y = yMm+H-FOOTER_H
  const CX=xMm+14.8, CY=BODY_Y+(FOOTER_Y-BODY_Y)/2

  sf(255,255,255); ss(203,213,225); slw(0.25); rr(xMm,yMm,W,H,R,'FD')
  sf(10,36,80); rr(xMm,yMm,W,HEADER_H,R,'F'); fr(xMm,yMm+HEADER_H-3,W,3)
  if (logoImg) ctx.drawImage(logoImg,p(xMm+2.5),p(yMm+2),p(10.5),p(10.5))
  fnt(7.5,'bold'); txt('HFCCF PRESCHOOL',xMm+15,yMm+6.5,'left',[255,255,255])
  fnt(5.5,'normal'); txt('Hope for Cambodian Children',xMm+15,yMm+10.5,'left',[147,197,253])
  ss(255,255,255,0.8); slw(0.3); ctx.strokeRect(p(xMm+W-24),p(yMm+3.5),p(22),p(7))
  fnt(5,'bold'); txt('STUDENT ID CARD',xMm+W-13,yMm+8,'center',[255,255,255])
  ACCENT.forEach(([r,g,b],i) => { sf(r,g,b); fr(xMm+i*(W/4),yMm+HEADER_H,W/4,BAR_H) })

  sf(219,234,254); ss(59,130,246); slw(0.6); arc(CX,CY,11.5,'FD')
  sf(239,246,255); ss(191,219,254); slw(0.3); arc(CX,CY,10,'FD')
  const ini=getInitials(student)
  fnt(ini.length>2?8.5:11,'bold'); sf(30,64,175); ctx.textAlign='center'; ctx.textBaseline='middle'
  ctx.fillText(ini,p(CX),p(CY)); ctx.textBaseline='alphabetic'
  if (student.gender) {
    const m=student.gender.toLowerCase().startsWith('m')
    sf(m?219:252,m?234:231,m?254:243)
    ctx.beginPath(); ctx.roundRect(p(CX-6),p(CY+13),p(12),p(4.5),p(1)); ctx.fill()
    fnt(5,'bold'); txt(m?'MALE':'FEMALE',CX,CY+16.4,'center',[m?109:190,m?40:24,m?217:93])
  }
  ss(226,232,240); slw(0.25); ln(xMm+29.5,BODY_Y+2,xMm+29.5,FOOTER_Y-1)
  const IX=xMm+32; let IY=BODY_Y+5.5
  const name=student.fullName||student.name||'—'
  fnt(8.5,'bold'); sf(15,23,42); ctx.textAlign='left'
  const maxW=p(W-35), words=name.split(' '); let l1='',l2=''
  for (const w of words) { const t=l1?l1+' '+w:w; if (ctx.measureText(t).width<=maxW) l1=t; else l2=l2?l2+' '+w:w }
  ctx.fillText(l1,p(IX),p(IY)); if(l2){ctx.fillText(l2,p(IX),p(IY+4.5));IY+=9.5}else IY+=5.5
  ss(226,232,240); slw(0.25); ln(IX,IY,xMm+W-3,IY); IY+=4
  const irow=(lbl,val)=>{fnt(4.8,'normal');sf(148,163,184);ctx.textAlign='left';ctx.fillText(lbl,p(IX),p(IY));IY+=3.5;fnt(7,'bold');sf(30,64,175);ctx.fillText(String(val||'—'),p(IX),p(IY));IY+=5}
  irow('STUDENT ID',student.studentCode||student.id||'—')
  irow('CLASS',className||'—')
  if(student.dateOfBirth) irow('DATE OF BIRTH',student.dateOfBirth)
  sf(239,246,255); fr(xMm,FOOTER_Y,W,FOOTER_H)
  sf(255,255,255); fr(xMm,FOOTER_Y,2.5,2.5); fr(xMm+W-2.5,FOOTER_Y,2.5,2.5)
  ss(191,219,254); slw(0.25); ln(xMm,FOOTER_Y,xMm+W,FOOTER_Y)
  fnt(6,'bold'); txt(`Academic Year  ${academicYear}`,xMm+W/2,FOOTER_Y+5.2,'center',[30,64,175])
}

function _canvasPortrait(ctx, xMm, yMm, student, className, academicYear, logoImg, SC) {
  const { p, sf, ss, slw, fnt, fr, txt, rr, arc, ln } = _makeCanvasHelpers(ctx, SC)
  const W=54, H=85.6, R=2.5, HEADER_H=20, BAR_H=1.8, FOOTER_H=8.5
  const BODY_Y   = yMm+HEADER_H+BAR_H
  const FOOTER_Y = yMm+H-FOOTER_H
  const CX=xMm+W/2

  sf(255,255,255); ss(203,213,225); slw(0.25); rr(xMm,yMm,W,H,R,'FD')
  sf(10,36,80); rr(xMm,yMm,W,HEADER_H,R,'F'); fr(xMm,yMm+HEADER_H-3,W,3)
  if (logoImg) ctx.drawImage(logoImg,p(CX-5),p(yMm+2),p(10),p(10))
  fnt(7.5,'bold'); txt('HFCCF PRESCHOOL',CX,yMm+14.5,'center',[255,255,255])
  fnt(5,'normal'); txt('Hope for Cambodian Children',CX,yMm+18,'center',[147,197,253])
  ACCENT.forEach(([r,g,b],i) => { sf(r,g,b); fr(xMm+i*(W/4),yMm+HEADER_H,W/4,BAR_H) })

  const CY_AV=BODY_Y+13
  sf(219,234,254); ss(59,130,246); slw(0.6); arc(CX,CY_AV,11,'FD')
  sf(239,246,255); ss(191,219,254); slw(0.3); arc(CX,CY_AV,9.2,'FD')
  const ini=getInitials(student)
  fnt(ini.length>2?8:10,'bold'); sf(30,64,175); ctx.textAlign='center'; ctx.textBaseline='middle'
  ctx.fillText(ini,p(CX),p(CY_AV)); ctx.textBaseline='alphabetic'
  if (student.gender) {
    const m=student.gender.toLowerCase().startsWith('m')
    sf(m?219:252,m?234:231,m?254:243)
    ctx.beginPath(); ctx.roundRect(p(CX-6.5),p(CY_AV+12.5),p(13),p(4.2),p(1)); ctx.fill()
    fnt(5,'bold'); txt(m?'MALE':'FEMALE',CX,CY_AV+15.6,'center',[m?109:190,m?40:24,m?217:93])
  }
  const nameY=CY_AV+20.5
  const name=student.fullName||student.name||'—'
  fnt(8,'bold'); sf(15,23,42)
  const measW=p(W-8); ctx.textAlign='center'
  // first line only for portrait
  const words=name.split(' '); let l1=''
  for(const w of words){const t=l1?l1+' '+w:w; if(ctx.measureText(t).width<=measW) l1=t; else break}
  ctx.fillText(l1||name,p(CX),p(nameY))
  const divY=nameY+3.5; ss(226,232,240); slw(0.25); ln(xMm+4,divY,xMm+W-4,divY)
  const IY0=divY+4.5
  const C1=xMm+5, C2=xMm+W/2+1.5
  fnt(4.5,'normal'); sf(148,163,184)
  ctx.textAlign='left'; ctx.fillText('STUDENT ID',p(C1),p(IY0)); ctx.fillText('CLASS',p(C2),p(IY0))
  fnt(6.5,'bold'); sf(30,64,175)
  ctx.fillText(String(student.studentCode||student.id||'—'),p(C1),p(IY0+4))
  ctx.fillText(className||'—',p(C2),p(IY0+4))
  if (student.dateOfBirth) {
    fnt(4.5,'normal'); sf(148,163,184); ctx.fillText('DATE OF BIRTH',p(C1),p(IY0+9))
    fnt(6.5,'bold'); sf(30,64,175); ctx.fillText(student.dateOfBirth,p(C1),p(IY0+13))
  }
  sf(239,246,255); fr(xMm,FOOTER_Y,W,FOOTER_H)
  sf(255,255,255); fr(xMm,FOOTER_Y,2.5,2.5); fr(xMm+W-2.5,FOOTER_Y,2.5,2.5)
  ss(191,219,254); slw(0.25); ln(xMm,FOOTER_Y,xMm+W,FOOTER_Y)
  fnt(5.5,'bold'); txt(`Academic Year  ${academicYear}`,CX,FOOTER_Y+5.2,'center',[30,64,175])
}

// ─────────────────────────────────────────────────────────────────────────────
//  Data loaders
// ─────────────────────────────────────────────────────────────────────────────
async function loadClasses() {
  loadingClasses.value = true
  try {
    const res = await fetchPreschoolClasses({ page: 1, perPage: 100 })
    classOptions.value = (res.items||[]).map((c) => ({ label: c.name||c.code||String(c.id), value: c.id }))
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
  try {
    const chosen    = students.value.filter((s) => selectedStudentIds.value.includes(s.id))
    const className = classOptions.value.find((c) => c.value === selectedClassId.value)?.label || ''
    const year      = getAcademicYear()
    const safeName  = className.replace(/[^a-z0-9]/gi,'-').toLowerCase() || 'students'
    const fmt       = selectedFormat.value
    const orient    = selectedOrientation.value
    const isPort    = orient === 'portrait'

    // Layout constants (mm)
    const CARD_W   = isPort ? 54   : 85.6
    const CARD_H   = isPort ? 85.6 : 54
    const MARGIN_X = isPort ? 18   : 12.9
    const GAP_X    = isPort ? 6    : 12.9
    const MARGIN_Y = isPort ? 15   : 15
    const GAP_Y    = isPort ? 5    : 8
    const COLS     = isPort ? 3    : 2
    const ROWS     = isPort ? 3    : 4
    const PER_PAGE = COLS * ROWS

    // ── PDF ───────────────────────────────────────────────────────────
    if (fmt === 'pdf') {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      let logoData = null
      try { logoData = imgToDataUrl(await loadImg(logoUrl)) } catch {}
      for (let i = 0; i < chosen.length; i++) {
        if (i > 0 && i % PER_PAGE === 0) doc.addPage()
        const col = i % COLS
        const row = Math.floor((i % PER_PAGE) / COLS)
        const x = MARGIN_X + col * (CARD_W + GAP_X)
        const y = MARGIN_Y + row * (CARD_H + GAP_Y)
        drawCardPdf(doc, x, y, chosen[i], className, year, logoData, orient)
      }
      doc.save(`id-cards-${safeName}-${year}-${orient}.pdf`)
      return
    }

    // ── PNG / JPG ─────────────────────────────────────────────────────
    const SC    = 150 / 25.4
    const pages = Math.ceil(chosen.length / PER_PAGE)
    const totalPageH = ROWS * CARD_H + (ROWS - 1) * GAP_Y
    const canvasH = MARGIN_Y * 2 + pages * totalPageH + (pages - 1) * GAP_Y
    const canvas  = document.createElement('canvas')
    canvas.width  = Math.round(210 * SC)
    canvas.height = Math.round(canvasH * SC)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, canvas.width, canvas.height)
    let logoImg = null; try { logoImg = await loadImg(logoUrl) } catch {}
    for (let pg = 0; pg < pages; pg++) {
      const pageOffsetY = pg * (totalPageH + GAP_Y)
      for (let i = 0; i < PER_PAGE; i++) {
        const idx = pg * PER_PAGE + i; if (idx >= chosen.length) break
        const col = i % COLS
        const row = Math.floor(i / COLS)
        const xMm = MARGIN_X + col * (CARD_W + GAP_X)
        const yMm = MARGIN_Y + pageOffsetY + row * (CARD_H + GAP_Y)
        drawCardCanvas(ctx, xMm, yMm, chosen[idx], className, year, logoImg, SC, orient)
      }
    }
    const mime = fmt === 'jpg' ? 'image/jpeg' : 'image/png'
    const dataUrl = fmt === 'jpg' ? canvas.toDataURL(mime, 0.92) : canvas.toDataURL(mime)
    const a = document.createElement('a')
    a.href = dataUrl; a.download = `id-cards-${safeName}-${year}-${orient}.${fmt}`; a.click()
  } catch (e) {
    console.error('Generation failed', e); alert('Generation failed: ' + (e?.message || e))
  } finally { generating.value = false }
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
        <div class="flex flex-wrap items-end gap-4">

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
                :title="opt.desc"
                @click="selectedOrientation = opt.value"
              >
                <i :class="['pi text-base', opt.icon]" />
                {{ opt.label }}
              </button>
            </div>
            <span class="text-xs text-slate-400">
              {{ ORIENT_OPTIONS.find((o) => o.value === selectedOrientation)?.desc }}
            </span>
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
                :title="fmt.desc"
                @click="selectedFormat = fmt.value"
              >
                <i :class="['pi text-base', fmt.icon]" />
                {{ fmt.label }}
              </button>
            </div>
            <span class="text-xs text-slate-400">
              {{ FORMAT_OPTIONS.find((f) => f.value === selectedFormat)?.desc }}
            </span>
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

      <!-- No students -->
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
              <p class="truncate text-sm font-semibold text-slate-900">{{ student.fullName||student.name||'—' }}</p>
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
      <div v-else class="rounded-2xl border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-400">
        Select a class above to load students.
      </div>
    </section>
  </MainLayout>
</template>

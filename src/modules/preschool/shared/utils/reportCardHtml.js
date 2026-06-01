import { formatDate, formatDatetimeShort } from '@/utils/date'

function scoreBar(pct) {
  return `<div class="score-bar"><div class="score-fill" style="width:${pct}%"></div></div>`
}

/**
 * Generates a self-contained HTML document for the student report card.
 * Opens in a new window and auto-prints after load.
 *
 * @param {{ student, period, classInfo, report, labels }} options
 * @returns {string} Complete HTML document string
 */
export function buildReportCardHtml({ student, period, classInfo, report, labels }) {
  const studentName = student?.fullName || student?.name || labels.notAvailable
  const studentCode = student?.studentCode || ''
  const gender = student?.gender || labels.notAvailable
  const dob = student?.dateOfBirth ? formatDate(student.dateOfBirth) : labels.notAvailable
  const className = classInfo?.name || labels.notAvailable
  const teacherName = classInfo?.teacherDisplayName || labels.notAvailable
  const periodLabel = period?.label || labels.notAvailable
  const academicYear = period?.academicYear || period?.academicYearCode || labels.notAvailable
  const termLabel = period?.termLabel || period?.termCode || ''
  const fromDate = period?.fromDate ? formatDate(period.fromDate) : ''
  const toDate = period?.toDate ? formatDate(period.toDate) : ''
  const dateRange = fromDate && toDate ? `${fromDate} – ${toDate}` : fromDate || toDate || labels.notAvailable

  const attendance = report?.attendanceSummary || {}
  const categories = report?.categorySummaries || []
  const observations = (report?.observations || []).filter((o) => o.observation || o.teacherComment).slice(0, 12)
  const isSnapshot = report?.frozen || report?.source === 'snapshot'
  const generatedAt = report?.generatedAt ? formatDatetimeShort(report.generatedAt) : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })

  const attRows = [
    { label: labels.attendance.total, value: attendance.attendanceCount ?? 0, color: '#4338ca' },
    { label: labels.attendance.present, value: attendance.presentCount ?? 0, color: '#059669' },
    { label: labels.attendance.late, value: attendance.lateCount ?? 0, color: '#d97706' },
    { label: labels.attendance.absent, value: attendance.absentCount ?? 0, color: '#dc2626' },
    { label: labels.attendance.excused, value: attendance.excusedCount ?? 0, color: '#7c3aed' },
  ]

  const catRows = categories.map((cat) => {
    const score = cat.averageScore != null ? Number(cat.averageScore).toFixed(1) : '—'
    const pct = cat.averageScore != null ? Math.min(100, (Number(cat.averageScore) / 10) * 100) : 0
    return { name: cat.category?.name || labels.labels.categoryFallback, count: cat.count || 0, score, pct }
  })

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${labels.title} — ${studentName}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:#1e293b;background:#fff;padding:28px 32px;max-width:820px;margin:0 auto}
.rc-header{display:flex;align-items:center;gap:14px;border-bottom:3px solid #4338ca;padding-bottom:14px;margin-bottom:14px}
.rc-logo{width:50px;height:50px;border-radius:50%;background:#4338ca;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:18px;flex-shrink:0}
.rc-header h1{font-size:17px;font-weight:700;color:#4338ca}
.rc-header p{font-size:11px;color:#64748b;margin-top:2px}
.rc-source{display:flex;align-items:center;gap:6px;padding:7px 12px;border-radius:8px;font-size:10px;margin-bottom:14px}
.rc-source.live{background:#f0fdf4;border:1px solid #bbf7d0;color:#166534}
.rc-source.frozen{background:#fffbeb;border:1px solid #fde68a;color:#92400e}
.rc-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.rc-meta{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px 20px;border:1px solid #e2e8f0;border-radius:10px;padding:13px 16px;background:#f8fafc;margin-bottom:14px}
.rc-meta label{font-size:9px;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;display:block;margin-bottom:2px}
.rc-meta span{font-size:12px;font-weight:600;color:#0f172a}
.rc-section{margin-bottom:14px}
.rc-section-title{font-size:9px;text-transform:uppercase;letter-spacing:.1em;font-weight:700;color:#6366f1;border-bottom:1px solid #e2e8f0;padding-bottom:5px;margin-bottom:10px}
.rc-att-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
.rc-att-card{border:1px solid #e2e8f0;border-radius:8px;padding:10px 6px;text-align:center;background:#fff}
.rc-att-val{font-size:22px;font-weight:800}
.rc-att-lbl{font-size:9px;color:#64748b;margin-top:2px;text-transform:uppercase;letter-spacing:.04em}
table{width:100%;border-collapse:collapse;font-size:11px}
thead tr{background:#f8fafc}
th{padding:6px 10px;text-align:left;font-size:9px;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;border-bottom:1px solid #e2e8f0;font-weight:600}
td{padding:8px 10px;border-bottom:1px solid #f1f5f9}
tbody tr:last-child td{border-bottom:none}
.score-bar-wrap{display:flex;align-items:center;gap:6px}
.score-bar{width:64px;height:6px;background:#f1f5f9;border-radius:99px;overflow:hidden}
.score-fill{height:100%;background:#6366f1;border-radius:99px}
.score-num{font-weight:700;color:#4338ca;width:28px}
.rc-obs-item{border-left:3px solid #c7d2fe;padding:7px 10px;margin-bottom:8px;background:#f8fafc;border-radius:0 6px 6px 0}
.rc-obs-text{font-style:italic;color:#475569;line-height:1.4}
.rc-obs-meta{font-size:10px;color:#94a3b8;margin-top:4px}
.rc-empty{font-size:11px;color:#94a3b8;font-style:italic;padding:4px 0}
.rc-footer{border-top:1px solid #e2e8f0;padding-top:10px;margin-top:16px;display:flex;justify-content:space-between;align-items:flex-end;font-size:10px;color:#94a3b8}
.rc-sig{border-top:1px solid #94a3b8;width:140px;text-align:center;padding-top:4px;font-size:10px;color:#94a3b8}
@media print{body{padding:0}@page{margin:18mm 20mm;size:A4}}
</style>
</head>
<body>

<div class="rc-header">
  <div class="rc-logo">H</div>
  <div>
    <h1>${labels.institutionName}</h1>
    <p>${labels.title}</p>
  </div>
</div>

<div class="rc-source ${isSnapshot ? 'frozen' : 'live'}">
  <span class="rc-dot" style="background:${isSnapshot ? '#d97706' : '#16a34a'}"></span>
  <span>${isSnapshot ? labels.dataSource.snapshotNote : labels.dataSource.liveNote}</span>
</div>

<div class="rc-meta">
  <div><label>${labels.student}</label><span>${studentName}${studentCode ? ` (${studentCode})` : ''}</span></div>
  <div><label>${labels.gender}</label><span>${gender}</span></div>
  <div><label>${labels.dateOfBirth}</label><span>${dob}</span></div>
  <div><label>${labels.class}</label><span>${className}</span></div>
  <div><label>${labels.teacher}</label><span>${teacherName}</span></div>
  <div><label>${labels.academicYear}</label><span>${academicYear}${termLabel ? ` / ${termLabel}` : ''}</span></div>
  <div><label>${labels.period}</label><span>${periodLabel}</span></div>
  <div style="grid-column:span 2"><label>${labels.dateRange}</label><span>${dateRange}</span></div>
</div>

<div class="rc-section">
  <p class="rc-section-title">${labels.attendanceTitle}</p>
  <div class="rc-att-grid">
    ${attRows.map((r) => `<div class="rc-att-card"><div class="rc-att-val" style="color:${r.color}">${r.value}</div><div class="rc-att-lbl">${r.label}</div></div>`).join('')}
  </div>
</div>

<div class="rc-section">
  <p class="rc-section-title">${labels.categoryTitle}</p>
  ${catRows.length === 0
    ? `<p class="rc-empty">${labels.emptyCategories}</p>`
    : `<table>
    <thead><tr>
      <th>${labels.columns.category}</th>
      <th style="text-align:center">${labels.columns.assessments}</th>
      <th>${labels.columns.avgScore}</th>
    </tr></thead>
    <tbody>
      ${catRows.map((r) => `<tr>
        <td>${r.name}</td>
        <td style="text-align:center">${r.count}</td>
        <td><div class="score-bar-wrap">${scoreBar(r.pct)}<span class="score-num">${r.score}</span></div></td>
      </tr>`).join('')}
    </tbody>
  </table>`}
</div>

<div class="rc-section">
  <p class="rc-section-title">${labels.observationsTitle}</p>
  ${observations.length === 0
    ? `<p class="rc-empty">${labels.emptyObservations}</p>`
    : observations.map((obs) => {
        const text = obs.observation || obs.teacherComment || ''
        const meta = [obs.category?.name, obs.assessedByName ? `${labels.assessedBy} ${obs.assessedByName}` : '', obs.assessmentDate ? formatDate(obs.assessmentDate) : ''].filter(Boolean).join(' · ')
        return `<div class="rc-obs-item"><p class="rc-obs-text">"${text}"</p>${meta ? `<p class="rc-obs-meta">${meta}</p>` : ''}</div>`
      }).join('')}
</div>

<div class="rc-footer">
  <div>
    <div>${labels.generatedAt}: ${generatedAt}</div>
    <div style="margin-top:3px">${labels.officialRecord}</div>
  </div>
  <div class="rc-sig">${labels.authorizedSignature}</div>
</div>

<script>window.addEventListener('load',function(){setTimeout(function(){window.print()},400)})<\/script>
</body>
</html>`
}

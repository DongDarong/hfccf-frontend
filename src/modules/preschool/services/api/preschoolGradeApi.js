import http from '@/services/http'
import { buildQueryParams } from '@/services/api'

export async function fetchPreschoolGrades(filters = {}) {
  const params = buildQueryParams({
    academic_year_id: filters.academicYearId,
    class_id: filters.classId,
    month: filters.month,
    year: filters.year,
    student_id: filters.studentId,
    teacher_id: filters.teacherId,
    per_page: filters.perPage,
    page: filters.page,
  })

  const response = await http.get(`/preschool/grades${params}`)
  return response.data
}

export async function fetchGradeMonthlyEntry(classId, month, year) {
  const response = await http.get('/preschool/grades/monthly-entry', {
    params: { class_id: classId, month, year },
  })
  return response.data
}

export async function fetchStudentGrades(studentId) {
  const response = await http.get(`/preschool/students/${studentId}/grades`)
  return response.data
}

export async function createPreschoolGrade(gradeData) {
  const response = await http.post('/preschool/grades', gradeData)
  return response.data
}

export async function updatePreschoolGrade(gradeId, gradeData) {
  const response = await http.put(`/preschool/grades/${gradeId}`, gradeData)
  return response.data
}

export async function deletePreschoolGrade(gradeId) {
  const response = await http.delete(`/preschool/grades/${gradeId}`)
  return response.data
}

export async function batchUpdateGrades(grades) {
  const response = await http.post('/preschool/grades/batch', { grades })
  return response.data
}

export async function fetchGradeScale() {
  const response = await http.get('/preschool/grade-scales')
  return response.data
}

export function normalizeGrade(row = {}) {
  return {
    id: row.id ?? '',
    studentId: row.studentId ?? row.student_id ?? '',
    studentName: row.studentName || row.student_name || '',
    studentCode: row.studentCode || row.student_code || '',
    classId: row.classId ?? row.class_id ?? '',
    className: row.className || row.class_name || '',
    academicYearId: row.academicYearId ?? row.academic_year_id ?? '',
    month: row.month ?? '',
    year: row.year ?? '',
    grade: row.grade ?? '',
    score: row.score ?? null,
    notes: row.notes || '',
    enteredByUserId: row.enteredByUserId ?? row.entered_by_user_id ?? '',
    enteredByName: row.enteredByName || row.entered_by_name || '',
    enteredAt: row.enteredAt || row.entered_at || '',
    updatedAt: row.updatedAt || row.updated_at || '',
    raw: row,
  }
}

export function normalizeGradeScale(row = {}) {
  return {
    id: row.id ?? '',
    code: row.code ?? '',
    label: row.label ?? '',
    description: row.description || '',
    minScore: row.minScore ?? row.min_score ?? 0,
    maxScore: row.maxScore ?? row.max_score ?? 100,
    displayOrder: row.displayOrder ?? row.display_order ?? 0,
    isActive: row.isActive ?? row.is_active ?? true,
    raw: row,
  }
}

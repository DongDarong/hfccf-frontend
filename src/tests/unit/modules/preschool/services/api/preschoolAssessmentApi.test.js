// Keep the Preschool assessment API contract under test so page code cannot
// silently regress into over-sized requests or broken response mapping.
import { beforeEach, describe, expect, it, vi } from 'vitest'
import http from '@/services/http'
import {
  archiveAssessment,
  buildFormTemplatePayload,
  createStudentAssessment,
  fetchAssessmentCategories,
  fetchProgressSummary,
  fetchStudentAssessments,
  finalizeAssessment,
  isPersistedId,
  stripTemporaryIdsForPayload,
  updateAssessment,
} from '@/modules/preschool/services/api/preschoolAssessmentApi'

vi.mock('@/services/http', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}))

function stubResponse(data) {
  return { data: { success: true, message: 'ok', data } }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('preschool assessment api', () => {
  it('strips temporary ids and normalizes persisted ids in form template payloads', () => {
    expect(isPersistedId(12)).toBe(true)
    expect(isPersistedId('12')).toBe(true)
    expect(isPersistedId('question-temp')).toBe(false)

    const payload = buildFormTemplatePayload(
      {
        id: '21',
        name: 'Sample Form',
      },
      [
        {
          id: 'section-temp',
          code: 'studentProfile',
          title: 'Student Profile',
          questions: [
            {
              id: 'question-temp',
              code: 'student_name',
              title: 'Student name',
              answerType: 'shortText',
              options: [
                { id: 'option-temp', label: 'Draft option', value: 'draft_option' },
                { id: '42', label: 'Saved option', value: 'saved_option' },
              ],
            },
          ],
        },
        {
          id: '34',
          code: 'family',
          title: 'Family Information',
          questions: [
            {
              id: 35,
              code: 'guardian_name',
              title: 'Guardian name',
              answerType: 'shortText',
              options: 'First, Second',
            },
          ],
        },
      ],
    )

    expect(payload.id).toBe(21)
    expect(payload.sections[0].id).toBeUndefined()
    expect(payload.sections[1].id).toBe(34)
    expect(payload.sections[0].questions[0].id).toBeUndefined()
    expect(payload.sections[1].questions[0].id).toBe(35)
    expect(payload.sections[0].questions[0].options[0]).toMatchObject({
      label: 'Draft option',
      value: 'draft_option',
    })
    expect(payload.sections[0].questions[0].options[0]).not.toHaveProperty('id')
    expect(payload.sections[0].questions[0].options[1].id).toBe(42)
    expect(payload.sections[1].questions[0].options).toMatchObject([
      { label: 'First', value: 'first' },
      { label: 'Second', value: 'second' },
    ])

    const cleaned = stripTemporaryIdsForPayload({
      id: 'not-persisted',
      sections: [
        {
          id: '19',
          questions: [
            {
              id: 'question-temp',
              options: [
                { id: 'option-temp', label: 'Temp' },
              ],
            },
          ],
        },
      ],
    })

    expect(cleaned).not.toHaveProperty('id')
    expect(cleaned.sections[0].id).toBe(19)
    expect(cleaned.sections[0].questions[0]).not.toHaveProperty('id')
    expect(cleaned.sections[0].questions[0].options[0]).not.toHaveProperty('id')
  })

  it('loads categories and clamps oversized assessment pages safely', async () => {
    http.get.mockResolvedValueOnce(
      stubResponse([
        { id: 1, code: 'learning_progress', name: 'Learning Progress', sort_order: 1, is_active: true },
      ]),
    )

    await expect(fetchAssessmentCategories()).resolves.toMatchObject([
      {
        id: 1,
        code: 'learning_progress',
        name: 'Learning Progress',
        isActive: true,
      },
    ])
    expect(http.get).toHaveBeenCalledWith('/preschool/assessment-categories', { signal: undefined })

    http.get.mockResolvedValueOnce(
      stubResponse({
        items: [
          {
            id: 11,
            student_id: 5,
            category: { id: 1, code: 'behavior', name: 'Behavior' },
            rating: 'developing',
            assessment_date: '2026-05-19',
          },
        ],
        pagination: { page: 2, per_page: 100, total: 1, last_page: 1 },
      }),
    )

    await expect(
      fetchStudentAssessments(5, {
        page: 2,
        perPage: 200,
        status: 'draft',
        categoryId: 1,
        periodLabel: 'Term 1',
        search: 'behavior',
        sortBy: 'assessment_date',
        sortDirection: 'asc',
        classId: 7,
      }),
    ).resolves.toMatchObject({
      items: [
        {
          id: 11,
          studentId: 5,
          categoryCode: 'behavior',
          rating: 'developing',
        },
      ],
      pagination: {
        page: 2,
        perPage: 100,
        total: 1,
      },
    })

    expect(http.get).toHaveBeenCalledWith('/preschool/students/5/assessments', {
      params: {
        page: 2,
        per_page: 100,
        status: 'draft',
        category_id: 1,
        period_label: 'Term 1',
        search: 'behavior',
        sort_by: 'assessment_date',
        sort_direction: 'asc',
        class_id: 7,
      },
      signal: undefined,
    })
  })

  it('creates, updates, finalizes, archives, and loads progress summaries', async () => {
    http.post.mockResolvedValueOnce(
      stubResponse({
        assessment: {
          id: 21,
          student_id: 6,
          category_id: 2,
          status: 'draft',
        },
      }),
    )

    await expect(createStudentAssessment(6, { category_id: 2 })).resolves.toMatchObject({
      id: 21,
      studentId: 6,
      categoryId: 2,
      status: 'draft',
    })

    http.put.mockResolvedValueOnce(
      stubResponse({
        assessment: {
          id: 21,
          student_id: 6,
          category_id: 2,
          status: 'draft',
        },
      }),
    )

    await expect(updateAssessment(21, { teacher_comment: 'Updated' })).resolves.toMatchObject({
      id: 21,
      studentId: 6,
    })

    http.post.mockResolvedValueOnce(
      stubResponse({
        assessment: {
          id: 21,
          student_id: 6,
          category_id: 2,
          status: 'finalized',
        },
      }),
    )

    await expect(finalizeAssessment(21)).resolves.toMatchObject({
      id: 21,
      status: 'finalized',
    })

    http.post.mockResolvedValueOnce(
      stubResponse({
        assessment: {
          id: 21,
          student_id: 6,
          category_id: 2,
          status: 'archived',
        },
      }),
    )

    await expect(archiveAssessment(21)).resolves.toMatchObject({
      id: 21,
      status: 'archived',
    })

    http.get.mockResolvedValueOnce(
      stubResponse({
        summary: {
          total_assessments: 4,
          draft_assessments: 1,
          finalized_assessments: 2,
          archived_assessments: 1,
          average_score: 86.5,
          latest_assessment_date: '2026-05-19',
        },
        categories: [
          {
            category: { id: 1, code: 'learning_progress', name: 'Learning Progress' },
            count: 2,
            average_score: 90,
          },
        ],
        recentAssessments: [
          {
            id: 31,
            student_id: 6,
            category: { id: 1, code: 'learning_progress', name: 'Learning Progress' },
            status: 'finalized',
          },
        ],
      }),
    )

    await expect(fetchProgressSummary(6)).resolves.toMatchObject({
      summary: {
        totalAssessments: 4,
        draftAssessments: 1,
        finalizedAssessments: 2,
        archivedAssessments: 1,
        averageScore: 86.5,
      },
      categories: [
        {
          category: {
            code: 'learning_progress',
          },
        },
      ],
      recentAssessments: [
        {
          id: 31,
          studentId: 6,
        },
      ],
    })
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import api from '@/services/api'
import { assessmentSubmissionApi } from '@/modules/assessment/services/assessmentSubmissionApi'

vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

function ok(data) {
  return { data: { success: true, data } }
}

beforeEach(() => vi.clearAllMocks())

describe('assessmentSubmissionApi', () => {
  it('list passes status filter param', async () => {
    api.get.mockResolvedValueOnce(ok([]))
    await assessmentSubmissionApi.list({ status: 'submitted' })
    expect(api.get).toHaveBeenCalledWith('/assessment/submissions', { params: { status: 'submitted' } })
  })

  it('create posts submission payload', async () => {
    api.post.mockResolvedValueOnce(ok({ id: 1 }))
    await assessmentSubmissionApi.create({ form_template_id: 1, student_id: 2, status: 'draft' })
    expect(api.post).toHaveBeenCalledWith('/assessment/submissions', {
      form_template_id: 1,
      student_id: 2,
      status: 'draft',
    })
  })

  it('submit posts to the submit endpoint', async () => {
    api.post.mockResolvedValueOnce(ok({ id: 1, status: 'submitted' }))
    await assessmentSubmissionApi.submit(1)
    expect(api.post).toHaveBeenCalledWith('/assessment/submissions/1/submit')
  })

  it('review posts action and note', async () => {
    api.post.mockResolvedValueOnce(ok({ id: 1, status: 'approved' }))
    await assessmentSubmissionApi.review(1, { action: 'approve', note: 'Good' })
    expect(api.post).toHaveBeenCalledWith('/assessment/submissions/1/review', {
      action: 'approve',
      note: 'Good',
    })
  })

  it('delete calls delete on submission endpoint', async () => {
    api.delete.mockResolvedValueOnce(ok(null))
    await assessmentSubmissionApi.delete(1)
    expect(api.delete).toHaveBeenCalledWith('/assessment/submissions/1')
  })
})

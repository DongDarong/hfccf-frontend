import { beforeEach, describe, expect, it, vi } from 'vitest'
import http from '@/services/http'
import { dsamSubmissionApi } from '@/modules/dsam/services/dsamSubmissionApi'

vi.mock('@/services/http', () => ({
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

describe('dsamSubmissionApi', () => {
  it('list passes params to GET /dsam/submissions', async () => {
    http.get.mockResolvedValueOnce(ok([]))
    await dsamSubmissionApi.list({ status: 'draft', student_id: 5 })
    expect(http.get).toHaveBeenCalledWith('/dsam/submissions', {
      params: { status: 'draft', student_id: 5 },
    })
  })

  it('get fetches single submission by id', async () => {
    http.get.mockResolvedValueOnce(ok({ id: 'uuid-1' }))
    await dsamSubmissionApi.get('uuid-1')
    expect(http.get).toHaveBeenCalledWith('/dsam/submissions/uuid-1')
  })

  it('create posts submission data', async () => {
    http.post.mockResolvedValueOnce(ok({ id: 'uuid-2' }))
    await dsamSubmissionApi.create({ form_template_id: 1, student_id: 5 })
    expect(http.post).toHaveBeenCalledWith('/dsam/submissions', {
      form_template_id: 1,
      student_id: 5,
    })
  })

  it('save puts answers and draft data', async () => {
    const payload = { answers: [], draft_data: { current_step: 1 } }
    http.put.mockResolvedValueOnce(ok({ id: 'uuid-1' }))
    await dsamSubmissionApi.save('uuid-1', payload)
    expect(http.put).toHaveBeenCalledWith('/dsam/submissions/uuid-1', payload)
  })

  it('submit posts to submit endpoint', async () => {
    http.post.mockResolvedValueOnce(ok({ id: 'uuid-1', status: 'submitted' }))
    await dsamSubmissionApi.submit('uuid-1')
    expect(http.post).toHaveBeenCalledWith('/dsam/submissions/uuid-1/submit')
  })

  it('approve posts with review data', async () => {
    http.post.mockResolvedValueOnce(ok({ id: 'uuid-1', status: 'approved' }))
    await dsamSubmissionApi.approve('uuid-1', { notes: 'Looks good' })
    expect(http.post).toHaveBeenCalledWith('/dsam/submissions/uuid-1/approve', { notes: 'Looks good' })
  })

  it('reject posts with rejection data', async () => {
    http.post.mockResolvedValueOnce(ok({ id: 'uuid-1', status: 'rejected' }))
    await dsamSubmissionApi.reject('uuid-1', { reason: 'Incomplete' })
    expect(http.post).toHaveBeenCalledWith('/dsam/submissions/uuid-1/reject', { reason: 'Incomplete' })
  })

  it('delete calls DELETE on submission endpoint', async () => {
    http.delete.mockResolvedValueOnce(ok(null))
    await dsamSubmissionApi.delete('uuid-1')
    expect(http.delete).toHaveBeenCalledWith('/dsam/submissions/uuid-1')
  })
})

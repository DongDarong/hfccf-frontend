import { beforeEach, describe, expect, it, vi } from 'vitest'
import http from '@/services/http'
import { assessmentPrintApi } from '@/modules/assessment/services/assessmentPrintApi'

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

describe('assessmentPrintApi', () => {
  it('list passes params to GET /assessment/print-templates', async () => {
    http.get.mockResolvedValueOnce(ok([]))
    await assessmentPrintApi.list({ module: 'preschool' })
    expect(http.get).toHaveBeenCalledWith('/assessment/print-templates', {
      params: { module: 'preschool' },
    })
  })

  it('get fetches single print template by id', async () => {
    http.get.mockResolvedValueOnce(ok({ id: 1 }))
    await assessmentPrintApi.get(1)
    expect(http.get).toHaveBeenCalledWith('/assessment/print-templates/1')
  })

  it('create posts template data', async () => {
    http.post.mockResolvedValueOnce(ok({ id: 1, name: 'My Template' }))
    await assessmentPrintApi.create({ name: 'My Template' })
    expect(http.post).toHaveBeenCalledWith('/assessment/print-templates', { name: 'My Template' })
  })

  it('update puts template data', async () => {
    http.put.mockResolvedValueOnce(ok({ id: 1, name: 'Updated' }))
    await assessmentPrintApi.update(1, { name: 'Updated' })
    expect(http.put).toHaveBeenCalledWith('/assessment/print-templates/1', { name: 'Updated' })
  })

  it('delete calls DELETE on template endpoint', async () => {
    http.delete.mockResolvedValueOnce(ok(null))
    await assessmentPrintApi.delete(1)
    expect(http.delete).toHaveBeenCalledWith('/assessment/print-templates/1')
  })

  it('preview posts template config', async () => {
    http.post.mockResolvedValueOnce(ok({ html: '<p>preview</p>' }))
    await assessmentPrintApi.preview({ layout: 'portrait' })
    expect(http.post).toHaveBeenCalledWith('/assessment/print-templates/preview', { layout: 'portrait' })
  })

  it('print posts to submission print endpoint with blob response type', async () => {
    http.post.mockResolvedValueOnce(new Blob())
    await assessmentPrintApi.print(42, 7)
    expect(http.post).toHaveBeenCalledWith(
      '/assessment/submissions/42/print',
      { template_id: 7 },
      { responseType: 'blob' },
    )
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import http from '@/services/http'
import { assessmentQuestionTypeApi } from '@/modules/assessment/services/assessmentQuestionTypeApi'

vi.mock('@/services/http', () => ({
  default: {
    get: vi.fn(),
  },
}))

function ok(data) {
  return { data: { success: true, data } }
}

beforeEach(() => vi.clearAllMocks())

describe('assessmentQuestionTypeApi', () => {
  it('list fetches from /assessment/question-types', async () => {
    http.get.mockResolvedValueOnce(ok([{ id: 1, key: 'short_text', label: 'Short Text' }]))
    const res = await assessmentQuestionTypeApi.list()
    expect(http.get).toHaveBeenCalledWith('/assessment/question-types')
    expect(res.data.data).toHaveLength(1)
  })
})

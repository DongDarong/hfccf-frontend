import { beforeEach, describe, expect, it, vi } from 'vitest'
import http from '@/services/http'
import { dsamFormApi } from '@/modules/dsam/services/dsamFormApi'

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

describe('dsamFormApi', () => {
  // Templates
  it('list passes params to GET /dsam/forms', async () => {
    http.get.mockResolvedValueOnce(ok([]))
    await dsamFormApi.list({ status: 'published', search: 'test' })
    expect(http.get).toHaveBeenCalledWith('/dsam/forms', {
      params: { status: 'published', search: 'test' },
    })
  })

  it('get fetches single form by id', async () => {
    http.get.mockResolvedValueOnce(ok({ id: 1 }))
    await dsamFormApi.get(1)
    expect(http.get).toHaveBeenCalledWith('/dsam/forms/1')
  })

  it('create posts form data', async () => {
    http.post.mockResolvedValueOnce(ok({ id: 1, name: 'New DSAM Form' }))
    await dsamFormApi.create({ name: 'New DSAM Form' })
    expect(http.post).toHaveBeenCalledWith('/dsam/forms', { name: 'New DSAM Form' })
  })

  it('update puts form data', async () => {
    http.put.mockResolvedValueOnce(ok({ id: 1, name: 'Updated' }))
    await dsamFormApi.update(1, { name: 'Updated' })
    expect(http.put).toHaveBeenCalledWith('/dsam/forms/1', { name: 'Updated' })
  })

  it('delete calls DELETE on form endpoint', async () => {
    http.delete.mockResolvedValueOnce(ok(null))
    await dsamFormApi.delete(1)
    expect(http.delete).toHaveBeenCalledWith('/dsam/forms/1')
  })

  it('publish posts to publish endpoint', async () => {
    http.post.mockResolvedValueOnce(ok({ id: 1, status: 'published' }))
    await dsamFormApi.publish(1)
    expect(http.post).toHaveBeenCalledWith('/dsam/forms/1/publish')
  })

  it('archive posts to archive endpoint', async () => {
    http.post.mockResolvedValueOnce(ok({ id: 1, status: 'archived' }))
    await dsamFormApi.archive(1)
    expect(http.post).toHaveBeenCalledWith('/dsam/forms/1/archive')
  })

  it('duplicate posts to duplicate endpoint', async () => {
    http.post.mockResolvedValueOnce(ok({ id: 2 }))
    await dsamFormApi.duplicate(1)
    expect(http.post).toHaveBeenCalledWith('/dsam/forms/1/duplicate')
  })

  it('newVersion posts to new-version endpoint with data', async () => {
    http.post.mockResolvedValueOnce(ok({ id: 3, version: 2 }))
    await dsamFormApi.newVersion(1, { notes: 'v2' })
    expect(http.post).toHaveBeenCalledWith('/dsam/forms/1/new-version', { notes: 'v2' })
  })

  it('versions fetches version list', async () => {
    http.get.mockResolvedValueOnce(ok([]))
    await dsamFormApi.versions(1)
    expect(http.get).toHaveBeenCalledWith('/dsam/forms/1/versions')
  })

  // Sections
  it('listSections fetches sections for a form', async () => {
    http.get.mockResolvedValueOnce(ok([]))
    await dsamFormApi.listSections(5)
    expect(http.get).toHaveBeenCalledWith('/dsam/forms/5/sections')
  })

  it('createSection posts to sections endpoint', async () => {
    http.post.mockResolvedValueOnce(ok({ id: 10, title: 'Intro' }))
    await dsamFormApi.createSection(5, { title: 'Intro', order: 1 })
    expect(http.post).toHaveBeenCalledWith('/dsam/forms/5/sections', { title: 'Intro', order: 1 })
  })

  it('updateSection puts section data', async () => {
    http.put.mockResolvedValueOnce(ok({ id: 10, title: 'Updated' }))
    await dsamFormApi.updateSection(5, 10, { title: 'Updated' })
    expect(http.put).toHaveBeenCalledWith('/dsam/forms/5/sections/10', { title: 'Updated' })
  })

  it('deleteSection deletes the section', async () => {
    http.delete.mockResolvedValueOnce(ok(null))
    await dsamFormApi.deleteSection(5, 10)
    expect(http.delete).toHaveBeenCalledWith('/dsam/forms/5/sections/10')
  })

  it('reorderSections posts ordered ids wrapped in object', async () => {
    http.post.mockResolvedValueOnce(ok(null))
    await dsamFormApi.reorderSections(5, [3, 1, 2])
    expect(http.post).toHaveBeenCalledWith('/dsam/forms/5/sections/reorder', { order: [3, 1, 2] })
  })

  // Questions
  it('listQuestions fetches questions for a section', async () => {
    http.get.mockResolvedValueOnce(ok([]))
    await dsamFormApi.listQuestions(10)
    expect(http.get).toHaveBeenCalledWith('/dsam/sections/10/questions')
  })

  it('createQuestion posts to questions endpoint', async () => {
    http.post.mockResolvedValueOnce(ok({ id: 20 }))
    await dsamFormApi.createQuestion(10, { question_text: 'Q1' })
    expect(http.post).toHaveBeenCalledWith('/dsam/sections/10/questions', { question_text: 'Q1' })
  })

  it('updateQuestion puts question data', async () => {
    http.put.mockResolvedValueOnce(ok({ id: 20, question_text: 'Updated Q' }))
    await dsamFormApi.updateQuestion(10, 20, { question_text: 'Updated Q' })
    expect(http.put).toHaveBeenCalledWith('/dsam/sections/10/questions/20', { question_text: 'Updated Q' })
  })

  it('deleteQuestion deletes the question', async () => {
    http.delete.mockResolvedValueOnce(ok(null))
    await dsamFormApi.deleteQuestion(10, 20)
    expect(http.delete).toHaveBeenCalledWith('/dsam/sections/10/questions/20')
  })

  it('reorderQuestions posts ordered ids', async () => {
    http.post.mockResolvedValueOnce(ok(null))
    await dsamFormApi.reorderQuestions(10, [2, 1])
    expect(http.post).toHaveBeenCalledWith('/dsam/sections/10/questions/reorder', { order: [2, 1] })
  })

  // Options
  it('listOptions fetches options for a question', async () => {
    http.get.mockResolvedValueOnce(ok([]))
    await dsamFormApi.listOptions(20)
    expect(http.get).toHaveBeenCalledWith('/dsam/questions/20/options')
  })

  it('createOption posts option data', async () => {
    http.post.mockResolvedValueOnce(ok({ id: 30, label: 'Yes' }))
    await dsamFormApi.createOption(20, { label: 'Yes' })
    expect(http.post).toHaveBeenCalledWith('/dsam/questions/20/options', { label: 'Yes' })
  })

  it('updateOption puts option data', async () => {
    http.put.mockResolvedValueOnce(ok({ id: 30, label: 'No' }))
    await dsamFormApi.updateOption(20, 30, { label: 'No' })
    expect(http.put).toHaveBeenCalledWith('/dsam/questions/20/options/30', { label: 'No' })
  })

  it('deleteOption deletes the option', async () => {
    http.delete.mockResolvedValueOnce(ok(null))
    await dsamFormApi.deleteOption(20, 30)
    expect(http.delete).toHaveBeenCalledWith('/dsam/questions/20/options/30')
  })

  it('reorderOptions posts ordered ids', async () => {
    http.post.mockResolvedValueOnce(ok(null))
    await dsamFormApi.reorderOptions(20, [2, 1])
    expect(http.post).toHaveBeenCalledWith('/dsam/questions/20/options/reorder', { order: [2, 1] })
  })

  it('questionTypes fetches from lookup endpoint', async () => {
    http.get.mockResolvedValueOnce(ok([{ id: 1, key: 'short_text' }]))
    await dsamFormApi.questionTypes()
    expect(http.get).toHaveBeenCalledWith('/dsam/question-types')
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDsamFormBuilderStore } from '@/modules/dsam/stores/useDsamFormBuilderStore'

const mockGet           = vi.fn()
const mockCreate        = vi.fn()
const mockUpdate        = vi.fn()
const mockPublish       = vi.fn()
const mockArchive       = vi.fn()
const mockNewVersion    = vi.fn()
const mockVersions      = vi.fn()
const mockCreateSection = vi.fn()
const mockUpdateSection = vi.fn()
const mockDeleteSection = vi.fn()
const mockReorderSections = vi.fn()
const mockCreateQuestion  = vi.fn()
const mockUpdateQuestion  = vi.fn()
const mockDeleteQuestion  = vi.fn()
const mockReorderQuestions = vi.fn()
const mockCreateOption  = vi.fn()
const mockUpdateOption  = vi.fn()
const mockDeleteOption  = vi.fn()
const mockQuestionTypes = vi.fn()

vi.mock('@/modules/dsam/services/dsamFormApi', () => ({
  dsamFormApi: {
    get:              (...a) => mockGet(...a),
    create:           (...a) => mockCreate(...a),
    update:           (...a) => mockUpdate(...a),
    publish:          (...a) => mockPublish(...a),
    archive:          (...a) => mockArchive(...a),
    newVersion:       (...a) => mockNewVersion(...a),
    versions:         (...a) => mockVersions(...a),
    createSection:    (...a) => mockCreateSection(...a),
    updateSection:    (...a) => mockUpdateSection(...a),
    deleteSection:    (...a) => mockDeleteSection(...a),
    reorderSections:  (...a) => mockReorderSections(...a),
    createQuestion:   (...a) => mockCreateQuestion(...a),
    updateQuestion:   (...a) => mockUpdateQuestion(...a),
    deleteQuestion:   (...a) => mockDeleteQuestion(...a),
    reorderQuestions: (...a) => mockReorderQuestions(...a),
    createOption:     (...a) => mockCreateOption(...a),
    updateOption:     (...a) => mockUpdateOption(...a),
    deleteOption:     (...a) => mockDeleteOption(...a),
    questionTypes:    (...a) => mockQuestionTypes(...a),
  },
}))

function okData(data) {
  return { data: { data } }
}

function makeForm(overrides = {}) {
  return { id: 1, name: 'Test Form', status: 'draft', sections: [], ...overrides }
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('useDsamFormBuilderStore', () => {
  it('initialises with empty state', () => {
    const store = useDsamFormBuilderStore()
    expect(store.template).toBeNull()
    expect(store.sections).toEqual([])
    expect(store.activeSectionId).toBeNull()
    expect(store.activeQuestionId).toBeNull()
    expect(store.isLoading).toBe(false)
  })

  it('load fetches form and question types in parallel', async () => {
    const form = makeForm({ sections: [{ id: 10, title: 'Sec 1', order: 1, questions: [] }] })
    mockGet.mockResolvedValueOnce(okData(form))
    mockQuestionTypes.mockResolvedValueOnce(okData([{ id: 1, key: 'short_text' }]))
    const store = useDsamFormBuilderStore()
    await store.load(1)
    expect(store.template?.id).toBe(1)
    expect(store.sections).toHaveLength(1)
    expect(store.questionTypes).toHaveLength(1)
    expect(store.isLoading).toBe(false)
  })

  it('load sets activeSectionId to first section', async () => {
    const form = makeForm({ sections: [{ id: 10, title: 'First', order: 1, questions: [] }] })
    mockGet.mockResolvedValueOnce(okData(form))
    mockQuestionTypes.mockResolvedValueOnce(okData([]))
    const store = useDsamFormBuilderStore()
    await store.load(1)
    expect(store.activeSectionId).toBe(10)
  })

  it('load skips question types fetch when already loaded', async () => {
    const form = makeForm({ sections: [] })
    mockGet.mockResolvedValue(okData(form))
    mockQuestionTypes.mockResolvedValueOnce(okData([{ id: 1, key: 'radio' }]))
    const store = useDsamFormBuilderStore()
    await store.load(1)
    await store.load(1)
    expect(mockQuestionTypes).toHaveBeenCalledTimes(1)
  })

  it('load sets error on failure', async () => {
    const err = new Error('Network error')
    mockGet.mockRejectedValueOnce(err)
    mockQuestionTypes.mockResolvedValueOnce(okData([]))
    const store = useDsamFormBuilderStore()
    await store.load(1)
    expect(store.error).toBe(err)
    expect(store.isLoading).toBe(false)
  })

  it('saveTemplate creates when no id', async () => {
    mockCreate.mockResolvedValueOnce(okData({ id: 5, name: 'New', status: 'draft' }))
    const store = useDsamFormBuilderStore()
    await store.saveTemplate({ name: 'New' })
    expect(mockCreate).toHaveBeenCalled()
    expect(store.template?.id).toBe(5)
    expect(store.isSaving).toBe(false)
  })

  it('saveTemplate updates when id exists', async () => {
    const form = makeForm()
    mockGet.mockResolvedValueOnce(okData(form))
    mockQuestionTypes.mockResolvedValueOnce(okData([]))
    mockUpdate.mockResolvedValueOnce(okData({ ...form, name: 'Updated' }))
    const store = useDsamFormBuilderStore()
    await store.load(1)
    await store.saveTemplate({ name: 'Updated' })
    expect(mockUpdate).toHaveBeenCalledWith(1, { name: 'Updated' })
    expect(store.template?.name).toBe('Updated')
  })

  it('publish updates template status', async () => {
    const form = makeForm()
    mockGet.mockResolvedValueOnce(okData(form))
    mockQuestionTypes.mockResolvedValueOnce(okData([]))
    mockPublish.mockResolvedValueOnce(okData({ ...form, status: 'published' }))
    const store = useDsamFormBuilderStore()
    await store.load(1)
    await store.publish()
    expect(mockPublish).toHaveBeenCalledWith(1)
    expect(store.template?.status).toBe('published')
    expect(store.isPublished).toBe(true)
  })

  it('archive updates template status', async () => {
    const form = makeForm()
    mockGet.mockResolvedValueOnce(okData(form))
    mockQuestionTypes.mockResolvedValueOnce(okData([]))
    mockArchive.mockResolvedValueOnce(okData({ ...form, status: 'archived' }))
    const store = useDsamFormBuilderStore()
    await store.load(1)
    await store.archive()
    expect(store.template?.status).toBe('archived')
    expect(store.isArchived).toBe(true)
  })

  it('createNewVersion returns new form data', async () => {
    const form = makeForm()
    mockGet.mockResolvedValueOnce(okData(form))
    mockQuestionTypes.mockResolvedValueOnce(okData([]))
    mockNewVersion.mockResolvedValueOnce(okData({ id: 2, version: 2 }))
    const store = useDsamFormBuilderStore()
    await store.load(1)
    const result = await store.createNewVersion({ notes: 'v2' })
    expect(result.id).toBe(2)
  })

  it('isEditable is true for draft, false for published', async () => {
    const store = useDsamFormBuilderStore()
    mockGet.mockResolvedValueOnce(okData(makeForm({ status: 'draft' })))
    mockQuestionTypes.mockResolvedValueOnce(okData([]))
    await store.load(1)
    expect(store.isEditable).toBe(true)
    store.template.status = 'published'
    expect(store.isEditable).toBe(false)
  })

  // Sections
  it('addSection pushes new section and sets it active', async () => {
    mockGet.mockResolvedValueOnce(okData(makeForm()))
    mockQuestionTypes.mockResolvedValueOnce(okData([]))
    mockCreateSection.mockResolvedValueOnce(okData({ id: 20, title: 'New Sec', order: 1, questions: [] }))
    const store = useDsamFormBuilderStore()
    await store.load(1)
    await store.addSection({ title: 'New Sec', order: 1 })
    expect(store.sections).toHaveLength(1)
    expect(store.sections[0].id).toBe(20)
    expect(store.activeSectionId).toBe(20)
  })

  it('updateSection updates section in list', async () => {
    const form = makeForm({ sections: [{ id: 10, title: 'Old', order: 1, questions: [] }] })
    mockGet.mockResolvedValueOnce(okData(form))
    mockQuestionTypes.mockResolvedValueOnce(okData([]))
    mockUpdateSection.mockResolvedValueOnce(okData({ id: 10, title: 'New' }))
    const store = useDsamFormBuilderStore()
    await store.load(1)
    await store.updateSection(10, { title: 'New' })
    expect(store.sections[0].title).toBe('New')
  })

  it('deleteSection removes section from list', async () => {
    const form = makeForm({ sections: [{ id: 10, title: 'Sec', order: 1, questions: [] }] })
    mockGet.mockResolvedValueOnce(okData(form))
    mockQuestionTypes.mockResolvedValueOnce(okData([]))
    mockDeleteSection.mockResolvedValueOnce(okData(null))
    const store = useDsamFormBuilderStore()
    await store.load(1)
    await store.deleteSection(10)
    expect(store.sections).toHaveLength(0)
    expect(store.activeSectionId).toBeNull()
  })

  it('deleteSection selects next section when active deleted', async () => {
    const form = makeForm({
      sections: [
        { id: 10, title: 'First', order: 1, questions: [] },
        { id: 11, title: 'Second', order: 2, questions: [] },
      ],
    })
    mockGet.mockResolvedValueOnce(okData(form))
    mockQuestionTypes.mockResolvedValueOnce(okData([]))
    mockDeleteSection.mockResolvedValueOnce(okData(null))
    const store = useDsamFormBuilderStore()
    await store.load(1)
    expect(store.activeSectionId).toBe(10)
    await store.deleteSection(10)
    expect(store.activeSectionId).toBe(11)
  })

  it('reorderSections reorders in-place before API call', async () => {
    const form = makeForm({
      sections: [
        { id: 1, title: 'A', order: 1, questions: [] },
        { id: 2, title: 'B', order: 2, questions: [] },
      ],
    })
    mockGet.mockResolvedValueOnce(okData(form))
    mockQuestionTypes.mockResolvedValueOnce(okData([]))
    mockReorderSections.mockResolvedValueOnce(okData(null))
    const store = useDsamFormBuilderStore()
    await store.load(1)
    await store.reorderSections([2, 1])
    expect(store.sections[0].id).toBe(2)
    expect(store.sections[1].id).toBe(1)
  })

  // Questions
  it('addQuestion appends question to section', async () => {
    const form = makeForm({ sections: [{ id: 10, title: 'Sec', order: 1, questions: [] }] })
    mockGet.mockResolvedValueOnce(okData(form))
    mockQuestionTypes.mockResolvedValueOnce(okData([]))
    mockCreateQuestion.mockResolvedValueOnce(okData({ id: 50, question_text: 'Q?' }))
    const store = useDsamFormBuilderStore()
    await store.load(1)
    const q = await store.addQuestion(10, { question_text: 'Q?' })
    expect(store.sections[0].questions).toHaveLength(1)
    expect(q.id).toBe(50)
    expect(store.activeQuestionId).toBe(50)
  })

  it('updateQuestion updates question in section', async () => {
    const form = makeForm({
      sections: [{ id: 10, title: 'Sec', order: 1, questions: [{ id: 50, question_text: 'Q?' }] }],
    })
    mockGet.mockResolvedValueOnce(okData(form))
    mockQuestionTypes.mockResolvedValueOnce(okData([]))
    mockUpdateQuestion.mockResolvedValueOnce(okData({ id: 50, question_text: 'Updated Q?' }))
    const store = useDsamFormBuilderStore()
    await store.load(1)
    await store.updateQuestion(10, 50, { question_text: 'Updated Q?' })
    expect(store.sections[0].questions[0].question_text).toBe('Updated Q?')
  })

  it('deleteQuestion removes question from section', async () => {
    const form = makeForm({
      sections: [{ id: 10, title: 'Sec', order: 1, questions: [{ id: 50, question_text: 'Q?' }] }],
    })
    mockGet.mockResolvedValueOnce(okData(form))
    mockQuestionTypes.mockResolvedValueOnce(okData([]))
    mockDeleteQuestion.mockResolvedValueOnce(okData(null))
    const store = useDsamFormBuilderStore()
    await store.load(1)
    store.setActiveQuestion(50)
    await store.deleteQuestion(10, 50)
    expect(store.sections[0].questions).toHaveLength(0)
    expect(store.activeQuestionId).toBeNull()
  })

  // Options
  it('addOption appends option to question', async () => {
    const form = makeForm({
      sections: [{ id: 10, title: 'S', order: 1, questions: [{ id: 50, options: [] }] }],
    })
    mockGet.mockResolvedValueOnce(okData(form))
    mockQuestionTypes.mockResolvedValueOnce(okData([]))
    mockCreateOption.mockResolvedValueOnce(okData({ id: 100, label: 'Yes' }))
    const store = useDsamFormBuilderStore()
    await store.load(1)
    await store.addOption(10, 50, { label: 'Yes' })
    expect(store.sections[0].questions[0].options).toHaveLength(1)
  })

  it('deleteOption removes option from question', async () => {
    const form = makeForm({
      sections: [{ id: 10, title: 'S', order: 1, questions: [{ id: 50, options: [{ id: 100, label: 'Yes' }] }] }],
    })
    mockGet.mockResolvedValueOnce(okData(form))
    mockQuestionTypes.mockResolvedValueOnce(okData([]))
    mockDeleteOption.mockResolvedValueOnce(okData(null))
    const store = useDsamFormBuilderStore()
    await store.load(1)
    await store.deleteOption(10, 50, 100)
    expect(store.sections[0].questions[0].options).toHaveLength(0)
  })

  // Computed helpers
  it('activeSection returns the active section object', async () => {
    const form = makeForm({ sections: [{ id: 10, title: 'First', order: 1, questions: [] }] })
    mockGet.mockResolvedValueOnce(okData(form))
    mockQuestionTypes.mockResolvedValueOnce(okData([]))
    const store = useDsamFormBuilderStore()
    await store.load(1)
    store.setActiveSection(10)
    expect(store.activeSection?.id).toBe(10)
  })

  it('activeQuestion returns the active question across sections', async () => {
    const form = makeForm({
      sections: [{ id: 10, title: 'S', order: 1, questions: [{ id: 50, question_text: 'Q' }] }],
    })
    mockGet.mockResolvedValueOnce(okData(form))
    mockQuestionTypes.mockResolvedValueOnce(okData([]))
    const store = useDsamFormBuilderStore()
    await store.load(1)
    store.setActiveQuestion(50)
    expect(store.activeQuestion?.id).toBe(50)
  })

  it('clearActiveQuestion sets activeQuestionId to null', () => {
    const store = useDsamFormBuilderStore()
    store.setActiveQuestion(50)
    store.clearActiveQuestion()
    expect(store.activeQuestionId).toBeNull()
  })

  it('reset clears all state', async () => {
    mockGet.mockResolvedValueOnce(okData(makeForm()))
    mockQuestionTypes.mockResolvedValueOnce(okData([]))
    const store = useDsamFormBuilderStore()
    await store.load(1)
    store.reset()
    expect(store.template).toBeNull()
    expect(store.sections).toEqual([])
    expect(store.activeSectionId).toBeNull()
    expect(store.error).toBeNull()
  })
})
